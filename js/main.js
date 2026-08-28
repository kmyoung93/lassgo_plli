document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 요소 참조 ---------- */
  const page1 = document.getElementById('page1');
  const quizStage = document.getElementById('quizStage');
  const page8 = document.getElementById('page8');
  const enterBtn = document.getElementById('enterBtn');
  const backBtn = document.getElementById('backBtn');
  const progressEl = document.getElementById('progress');
  const quizIcon = document.getElementById('quizIcon');

  // 1페이지 레이어 요소
  const p1Logo = document.getElementById('p1Logo');
  const p1Hearts = document.getElementById('p1Hearts');
  const p1TitleSmall = document.getElementById('p1TitleSmall');
  const p1TitleBig = document.getElementById('p1TitleBig');
  const p1Characters = document.getElementById('p1Characters');

  // 8페이지 레이어 요소
  const p8Animals = document.getElementById('p8Animals');
  const p8TitleSmall = document.getElementById('p8TitleSmall');
  const p8TitleBig = document.getElementById('p8TitleBig');
  const p8Subtitle = document.getElementById('p8Subtitle');
  const p8Characters = document.getElementById('p8Characters');

  const quizCard = document.getElementById('quizCard');
  const answerInput = document.getElementById('answerInput');
  const checkBtn = document.getElementById('checkBtn');

  const popupOverlay = document.getElementById('popupOverlay');
  const popupBox = document.getElementById('popupBox');
  const popupAnswerText = document.getElementById('popupAnswerText');
  const popupNextHit = document.getElementById('popupNextHit');

  const resultScoreEl = document.getElementById('resultScore');
  const restartBtn = document.getElementById('restartBtn');

  const bgm = document.getElementById('bgm');
  const bgmToggle = document.getElementById('bgmToggle');

  /* ---------- 초기 설정 (data.js 값 반영) ---------- */
  const p1 = QUIZ_DATA.page1;
  p1Logo.src = p1.logo;
  p1Hearts.src = p1.hearts;
  p1TitleSmall.textContent = p1.titleSmall;
  p1TitleBig.textContent = p1.titleBig;
  p1Characters.src = p1.characters;

  const p8 = QUIZ_DATA.page8;
  p8Animals.src = p8.animals;
  p8TitleSmall.textContent = p8.titleSmall;
  p8TitleBig.textContent = p8.titleBig;
  p8Subtitle.textContent = p8.subtitle;
  p8Characters.src = p8.characters;

  checkBtn.style.backgroundImage = `url('${QUIZ_DATA.checkButtonImage}')`;

  /* ---------- 모달 이미지 미리 로딩 (팝업 열릴 때 이미지가 늦게 뜨는 현상 방지) ---------- */
const modalImageLoaded = {};
QUIZ_DATA.questions.forEach((q) => {
  if(q.modalImage){
    modalImageLoaded[q.modalImage] = false;
    const preload = new Image();
    preload.onload = () => { modalImageLoaded[q.modalImage] = true; };
    preload.onerror = () => { modalImageLoaded[q.modalImage] = true; }; // 로드 실패해도 대기가 무한히 걸리지 않도록
    preload.src = q.modalImage;
  }
});

  bgm.src = QUIZ_DATA.bgmSrc;
  bgm.volume = QUIZ_DATA.bgmVolume ?? 0.3;
  bgm.loop = true;
  bgmToggle.textContent = 'MUSIC OFF';

  /* ---------- 상태 ---------- */
  let currentIndex = 0; // 0~5 (questions 배열 인덱스)
  const userAnswers = new Array(QUIZ_DATA.questions.length).fill(null);

  /* ---------- 페이지 전환 유틸 ---------- */
  function switchPage(hideEl, showEl){
    hideEl.classList.remove('active');
    setTimeout(() => {
      showEl.classList.add('active');
    }, 400);
  }

  function activeScreen(){
    if(page1.classList.contains('active')) return 'intro';
    if(quizStage.classList.contains('active')) return 'quiz';
    return 'result';
  }

  function goToIntro(push){
    const from = activeScreen();
    const fromEl = from === 'quiz' ? quizStage : (from === 'result' ? page8 : page1);
    if(fromEl !== page1) switchPage(fromEl, page1);
    backBtn.style.display = 'none';
    if(push) history.pushState({ screen: 'intro' }, '', '#intro');
  }

  function goToQuiz(index, push){
    const from = activeScreen();
    currentIndex = index;
    renderQuestion(index);
    if(from === 'intro') switchPage(page1, quizStage);
    else if(from === 'result') switchPage(page8, quizStage);
    else quizStage.classList.add('active'); // 이미 quiz 화면 안에서 문항만 이동
    if(push) history.pushState({ screen: 'quiz', q: index }, '', `#q${index + 1}`);
  }

  function goToResult(push){
    renderResult();
    switchPage(quizStage, page8);
    backBtn.style.display = 'none';
    if(push) history.pushState({ screen: 'result' }, '', '#result');
  }

  /* ---------- 문제 렌더링 (template 안의 {{blank}} → 빈칸 박스로 치환) ---------- */
  function renderQuestion(index){
    const q = QUIZ_DATA.questions[index];

    const html = q.template.split('{{blank}}').join('<span class="blank-box"></span>');
    quizCard.innerHTML = `<p>${html}</p>`;

    quizIcon.src = q.icon || '';
    quizIcon.style.visibility = q.icon ? 'visible' : 'hidden';

    answerInput.value = '';
    progressEl.textContent = `${index + 1} / ${QUIZ_DATA.questions.length}`;
    backBtn.style.display = index === 0 ? 'none' : 'inline-flex';
  }

  /* ---------- 정답 비교 (HTML 태그 제거 + 대소문자 무시 + 모든 공백 무시) ---------- */
  function normalize(str){
    return String(str ?? '')
      .replace(/<[^>]*>/g, '')   // <br> 같은 HTML 태그는 정답 비교에서 제외
      .toLowerCase()
      .replace(/\s+/g, '');
  }
  function isCorrect(index){
    return normalize(userAnswers[index]) === normalize(QUIZ_DATA.questions[index].correctAnswer);
  }

  /* ---------- 이벤트: 접속 버튼 (첫 진입 + BGM 재생) ---------- */
  enterBtn.addEventListener('click', () => {
    // 사용자 클릭 이벤트 안이므로 자동재생 정책에 걸리지 않음
    bgm.play().then(() => {
      bgmToggle.dataset.on = 'true';
      bgmToggle.textContent = 'MUSIC ON';
    }).catch(() => {
      // 재생 실패 시(파일 미업로드 등) 무시하고 화면 전환은 계속 진행
    });

    currentIndex = 0;
    goToQuiz(0, true);
  });

  /* ---------- 이벤트: 뒤로가기 ---------- */
  backBtn.addEventListener('click', () => {
    if(currentIndex === 0){
      goToIntro(true);
      return;
    }
    goToQuiz(currentIndex - 1, true);
  });

  /* ---------- 이벤트: 정답 확인 → 모달 팝업 (문항별 이미지 적용) ---------- */
  function openAnswerPopup(){
  const q = QUIZ_DATA.questions[currentIndex];
  popupBox.style.backgroundImage = `url('${q.modalImage}')`;
  popupAnswerText.innerHTML = q.correctAnswer;
  popupOverlay.classList.add('show');
}

checkBtn.addEventListener('click', () => {
  const q = QUIZ_DATA.questions[currentIndex];
  userAnswers[currentIndex] = answerInput.value;

  if(q.modalImage && !modalImageLoaded[q.modalImage]){
    const start = Date.now();
    const waitLoop = setInterval(() => {
      if(modalImageLoaded[q.modalImage] || Date.now() - start > 1500){
        clearInterval(waitLoop);
        openAnswerPopup();
      }
    }, 30);
  } else {
    openAnswerPopup();
  }
});

  /* ---------- 팝업 안의 "다음 문제" 클릭 영역 ---------- */
  popupNextHit.addEventListener('click', () => {
    popupOverlay.classList.remove('show');

    if(currentIndex < QUIZ_DATA.questions.length - 1){
      goToQuiz(currentIndex + 1, true);
    } else {
      goToResult(true);
    }
  });

  // 팝업 바깥(반투명 배경) 클릭 시 닫기만 (다음 문제로는 안 넘어감 — 다시 확인 가능하게)
  popupOverlay.addEventListener('click', (e) => {
    if(e.target === popupOverlay) popupOverlay.classList.remove('show');
  });

  /* ---------- 결과 페이지 점수 계산 ---------- */
  function renderResult(){
    let correctCount = 0;
    QUIZ_DATA.questions.forEach((q, i) => {
      if(isCorrect(i)) correctCount += 1;
    });

    const rawScore = correctCount * (QUIZ_DATA.pointsPerQuestion ?? 16.6);
    const finalScore = Math.round(rawScore); // 소수 첫째자리에서 반올림

    resultScoreEl.textContent = finalScore;
  }

  /* ---------- 처음부터 다시 ---------- */
  restartBtn.addEventListener('click', () => {
    currentIndex = 0;
    userAnswers.fill(null);
    goToIntro(true);
  });

  /* ---------- 브라우저/모바일 자체 뒤로가기·앞으로가기 버튼 지원 ---------- */
  history.replaceState({ screen: 'intro' }, '', '#intro');
  window.addEventListener('popstate', (e) => {
    const state = e.state || { screen: 'intro' };
    if(state.screen === 'quiz'){
      goToQuiz(state.q ?? 0, false);
    } else if(state.screen === 'result'){
      goToResult(false);
    } else {
      goToIntro(false);
    }
  });

  /* ---------- BGM on/off 토글 ---------- */
  bgmToggle.addEventListener('click', () => {
    const isOn = bgmToggle.dataset.on === 'true';
    if(isOn){
      bgm.pause();
      bgmToggle.dataset.on = 'false';
      bgmToggle.textContent = 'MUSIC OFF';
    } else {
      bgm.play().catch(() => {});
      bgmToggle.dataset.on = 'true';
      bgmToggle.textContent = 'MUSIC ON';
    }
  });

});
