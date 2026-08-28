/* ============================================
   퀴즈 데이터 설정 파일
   ============================================ */

const QUIZ_DATA = {
  // 전체 페이지 공용 배경 (부드러운 그라데이션)
  commonBackground: "assets/background/background_img.png",

  // 1페이지 (인트로) — 레이어별 실제 에셋 + 실제 텍스트
  page1: {
    logo: "assets/background/page1_logo.png",         // "2026 PLAVE WORLD TOUR / KEEP IT MANIC"
    hearts: "assets/background/page1_top.png",         // 하트 5개
    button: "assets/button/button_LASSGO.png",         // LASSGO 버튼 (화살표 포함, 텍스트는 코드에서 얹음)
    characters: "assets/background/page1_plave.png",   // 인물 5인
    titleSmall: "제 1회 플리고사",
    titleBig: "응원법 영역"
  },

  // 8페이지 (결과) — 레이어별 실제 에셋 + 실제 텍스트
  page8: {
    animals: "assets/background/page8_top.png",        // 픽셀 동물 5마리
    scoreBoard: "assets/background/page8_score.png",   // 점수판 틀
    characters: "assets/background/page8_plave.png",   // 인물 5인
    titleSmall: "제 1회 플리고사",
    titleBig: "응원법 영역",
    subtitle: "응원법 열심히 연습해서 문학 찢고 오자 플리야!"
  },

  // 배경음악 파일 경로 (audio 폴더에 올려주세요)
  bgmSrc: "audio/bgm.mp3",
  bgmVolume: 0.3, // 0.0 ~ 1.0 사이 값. 기본 30%

  // 문제 1개당 배점 (8페이지 결과 계산에 사용, 소수 첫째자리 반올림)
  pointsPerQuestion: 16.6,

  // 정답 확인 버튼 이미지 (문항 페이지 공용)
  checkButtonImage: "assets/button/button_anser.png",

  // 2~7페이지: 문제 6개
  questions: [
    {
      id: 1,
      icon: "assets/icon/icon_Q1.png",
      template:
        "사랑해 말하지 못한 날 이젠 안녕 이렇게 전할래 내 맘<br>그 곳에 기다려준 너에게 나 말할게 영원히<br>{{blank}}<br>" +
        "숨이 차 말하지 못한 난 이젠 안녕 이렇게 전할래 내 맘<br>그 곳에 너를 향해 달려갈게<br>(진심이야)",
      correctAnswer: "언제나 기다릴게 바로 여기 테라에서",
      modalImage: "assets/modal/modal_Q1.png"
    },
    {
      id: 2,
      icon: "assets/icon/icon_Q2.png",
      template:
        "그칠까 그칠까 찬란히<br>반짝이던 눈물의 기적 빛나줘<br>{{blank}}<br>" +
        "반복되는 계절의 중간에 있어<br>그토록 바랬던 어둠 속의 빛을 찾고 말았어",
      correctAnswer: "남예준 한노아 채밤비 도은호 유하민<br>플레이브 영원하자",
      modalImage: "assets/modal/modal_Q2.png"
    },
    {
      id: 3,
      icon: "assets/icon/icon_Q3.png",
      template:
        "아름답던 {{blank}}<br>" +
        "영원처럼 {{blank}}<br><br>" +
        "아득히 펼쳐진 꿈<br> Time is freakin' running out",
      correctAnswer: "플레이브 영원하자",
      modalImage: "assets/modal/modal_Q3.png"
    },
    {
      id: 4,
      icon: "assets/icon/icon_Q4.png",
      template:
        "Way 4 Luv, Way 4 your Luv {{blank}}<br>" +
        "Way 4 Luv, Way 4 your Luv {{blank}}<br>" +
        "거짓말이라도 믿을게 {{blank}}<br><br>" +
        "영화같은 스토리의 끝에",
      correctAnswer: "way 4 luv way 4 luv 믿을게",
      modalImage: "assets/modal/modal_Q4.png"
    },
    {
      id: 5,
      icon: "assets/icon/icon_Q5.png",
      template:
        "조금은 헷갈려 할지도 몰라 너도 그런걸까<br>나도 그래왔었으니까 {{blank}}<br><br>" +
        "네가 나를 찾아왔던 그 순간 너의 흔적들을 따라가 봤어<br>마치 미로같은 수수께끼인 걸까?<br>" +
        "그런 기분이 들 때 {{blank}}",
      correctAnswer: "플레이브 숨바꼭질",
      modalImage: "assets/modal/modal_Q5.png"
    },
    {
      id: 6,
      icon: "assets/icon/icon_Q6.png",
      template:
        "기다릴게, 너의 그 곳에 내가 닿을 수 있게<br>" +
        "기다릴게, 너의 곁에 내가 숨 쉴 수 있길<br>" +
        "매일 이렇게 난 늘 혼잣말을 해, Always<br>" +
        "{{blank}}<br>" +
        "매일 이렇게 난 늘 혼잣말을 해, Always<br>기다릴게",
      correctAnswer: "얘들아 안녕 나는 플리야<br>너네가 너무 보고싶었어<br>잠깐 기다리니 돌아왔구나<br>그게 바로 너구나 플레이브",
      modalImage: "assets/modal/modal_Q6.png"
    }
  ]
};
