// app/game/data/dialogues.ts
import { Dialogue, Choice } from '../types';

// ===== 작별 인사 =====
const farewells: Dialogue[] = [
  {
    id: 'farewell_casual',
    text: 'ㅇㅋ 나중에 또 얘기하자~',
    isFarewell: true,
    choices: []
  },
  {
    id: 'farewell_tired',
    text: '알았어 ㅋㅋ 나도 좀 쉴게. 나중에 봐!',
    isFarewell: true,
    choices: []
  },
  {
    id: 'farewell_busy',
    text: '어 그래! 일 집중해야겠다. 담에 톡해~',
    isFarewell: true,
    choices: []
  },
  {
    id: 'farewell_night',
    text: '그래 푹 쉬어! 굿밤~',
    isFarewell: true,
    choices: []
  },
];

// ===== 대화 세션 1: 출근길 지옥철 =====
const session_morning_subway: Dialogue[] = [
  {
    id: 'morning_subway_1',
    time: 'morning',
    text: '출근길 지하철 진짜 미친듯이 밀리더라... 사람들한테 치이다가 폰 떨어뜨릴 뻔했어',
    choices: [
      { id: 'c1', text: '괜찮아? 다치진 않았어?', stat: 'affection', nextDialogueId: 'morning_subway_2a' },
      { id: 'c2', text: '나도... 오늘 진짜 최악이었어', stat: 'empathy', nextDialogueId: 'morning_subway_2b' },
      { id: 'c3', text: '왜 재택 안 되는 거야 진짜', stat: 'rebellion', nextDialogueId: 'morning_subway_2c' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'morning_subway_2a',
    text: '응... 다행히 안 다쳤어. 너 같은 사람 있어서 위로된다',
    choices: [
      { id: 'c4', text: '힘들 땐 언제든 말해', stat: 'affection', nextDialogueId: 'morning_subway_3a' },
      { id: 'c5', text: '커피라도 한잔 사줄게', stat: 'affection', nextDialogueId: 'morning_subway_3a' },
      { id: 'c6', text: '오늘 회사는 어때?', stat: 'empathy', nextDialogueId: 'morning_subway_3a' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'morning_subway_2b',
    text: '헐 너도? 뭔 일 있었어?',
    choices: [
      { id: 'c7', text: '아저씨가 발 밟고도 사과 안 해', stat: 'empathy', nextDialogueId: 'morning_subway_3b' },
      { id: 'c8', text: '가방 끈 끊어져서 물건 쏟아짐', stat: 'empathy', nextDialogueId: 'morning_subway_3b' },
      { id: 'c9', text: '그냥... 사람 보기 싫어', stat: 'rebellion', nextDialogueId: 'morning_subway_3c' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'morning_subway_2c',
    text: '팀장이 "출근해야 팀워크가 산다"고... 개소리지',
    choices: [
      { id: 'c10', text: '완전 꼰대 마인드네', stat: 'rebellion', nextDialogueId: 'morning_subway_3c' },
      { id: 'c11', text: '요즘 시대에 무슨...', stat: 'empathy', nextDialogueId: 'morning_subway_3c' },
      { id: 'c12', text: '그래도 참아야지 뭐', stat: 'affection', nextDialogueId: 'morning_subway_3a' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'morning_subway_3a',
    text: '그래... 오늘도 버텨보자. 너 덕분에 조금 나아진 것 같아',
    isEnding: true,
    choices: [
      { id: 'c13', text: '응 우리 파이팅!', stat: 'affection' },
      { id: 'c14', text: '점심 때 또 얘기하자', stat: 'affection' },
      { id: 'c15', text: '힘내 비버야', stat: 'affection' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'morning_subway_3b',
    text: 'ㅋㅋㅋㅋ 아 진짜 우리 둘 다 재수없네. 그래도 얘기하니까 웃기다',
    isEnding: true,
    choices: [
      { id: 'c16', text: '이게 직장인의 삶이지 뭐', stat: 'empathy' },
      { id: 'c17', text: '내일은 좀 나을 거야', stat: 'affection' },
      { id: 'c18', text: '주말만 기다린다', stat: 'empathy' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'morning_subway_3c',
    text: '진짜 이딴 식으로 평생 살 순 없잖아... 뭔가 바꿔야 하는데',
    isEnding: true,
    choices: [
      { id: 'c19', text: '이력서 쓰고 있어?', stat: 'rebellion' },
      { id: 'c20', text: '나도 매일 고민해', stat: 'rebellion' },
      { id: 'c21', text: '일단은 버티는 수밖에', stat: 'empathy' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
];

// ===== 대화 세션 2: 점심시간 =====
const session_lunch: Dialogue[] = [
  {
    id: 'lunch_1',
    time: 'afternoon',
    text: '점심 먹었어? 나 회의 끝나고 막 먹으려고 하는데... 벌써 2시야',
    choices: [
      { id: 'c22', text: '뭐 먹을 건데?', stat: 'affection', nextDialogueId: 'lunch_2a' },
      { id: 'c23', text: '나도 이제 먹으려던 참', stat: 'empathy', nextDialogueId: 'lunch_2b' },
      { id: 'c24', text: '점심시간도 없냐 진짜', stat: 'rebellion', nextDialogueId: 'lunch_2c' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'lunch_2a',
    text: '편의점 도시락... 요즘 매일 이것만 먹는 것 같아',
    choices: [
      { id: 'c25', text: '가끔은 맛있는 거 먹어', stat: 'affection', nextDialogueId: 'lunch_3a' },
      { id: 'c26', text: '나도 도시락파 ㅋㅋ', stat: 'empathy', nextDialogueId: 'lunch_3b' },
      { id: 'c27', text: '회사에서 밥값이라도 줘야지', stat: 'rebellion', nextDialogueId: 'lunch_3c' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'lunch_2b',
    text: '우리 뭔가 점심 타이밍이 비슷한 것 같아 ㅋㅋ 둘 다 바쁜가봐',
    choices: [
      { id: 'c28', text: '직장인의 숙명이지', stat: 'empathy', nextDialogueId: 'lunch_3b' },
      { id: 'c29', text: '너 요즘 많이 바빠?', stat: 'affection', nextDialogueId: 'lunch_3a' },
      { id: 'c30', text: '일 분배가 잘못됐어', stat: 'rebellion', nextDialogueId: 'lunch_3c' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'lunch_2c',
    text: '그니까... 아침 회의가 11시까지 가고, 바로 오후 회의 들어가면 언제 먹으래',
    choices: [
      { id: 'c31', text: '회의가 너무 많은 거 아냐?', stat: 'empathy', nextDialogueId: 'lunch_3c' },
      { id: 'c32', text: '진짜 비효율적이다', stat: 'rebellion', nextDialogueId: 'lunch_3c' },
      { id: 'c33', text: '오후에라도 푹 쉬어', stat: 'affection', nextDialogueId: 'lunch_3a' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'lunch_3a',
    text: '고마워... 너 얘기 들으니까 마음이 좀 편해지네. 오늘 오후도 화이팅!',
    isEnding: true,
    choices: [
      { id: 'c34', text: '응 너도 파이팅!', stat: 'affection' },
      { id: 'c35', text: '우리 이번 주 버티자', stat: 'affection' },
      { id: 'c36', text: '맛있는 거 먹고 힘내', stat: 'affection' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'lunch_3b',
    text: '그러게... 점심도 제대로 못 먹고 커피로 버티는 인생 ㅋㅋㅋ 우린 뭐하는 걸까',
    isEnding: true,
    choices: [
      { id: 'c37', text: '다들 이렇게 살잖아', stat: 'empathy' },
      { id: 'c38', text: '주말엔 잘 먹자', stat: 'affection' },
      { id: 'c39', text: '언젠간 바뀌겠지...', stat: 'empathy' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'lunch_3c',
    text: '회의 줄이자는 얘기 나온 지가 언젠데... 오히려 늘어났어. 진짜 답 없다',
    isEnding: true,
    choices: [
      { id: 'c40', text: '윗분들은 모르지', stat: 'rebellion' },
      { id: 'c41', text: '회의록 공유로 대체 안 돼?', stat: 'rebellion' },
      { id: 'c42', text: '그래도 일단 버텨', stat: 'empathy' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
];

// ===== 대화 세션 3: 오후 슬럼프 =====
const session_afternoon_slump: Dialogue[] = [
  {
    id: 'afternoon_1',
    time: 'afternoon',
    text: '오후 3시... 하루 중에 제일 힘든 시간이야. 졸리고 일은 안 되고',
    choices: [
      { id: 'c43', text: '커피 한잔 하러 가', stat: 'affection', nextDialogueId: 'afternoon_2a' },
      { id: 'c44', text: '나도 지금 똑같아', stat: 'empathy', nextDialogueId: 'afternoon_2b' },
      { id: 'c45', text: '낮잠 시간 필요해', stat: 'rebellion', nextDialogueId: 'afternoon_2c' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'afternoon_2a',
    text: '응... 커피 마시러 갈까. 너도 마시고 있어?',
    choices: [
      { id: 'c46', text: '오늘 벌써 3잔째 ㅋㅋ', stat: 'empathy', nextDialogueId: 'afternoon_3b' },
      { id: 'c47', text: '나는 산책하고 올게', stat: 'affection', nextDialogueId: 'afternoon_3a' },
      { id: 'c48', text: '커피값도 월급에서 나가', stat: 'rebellion', nextDialogueId: 'afternoon_3c' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'afternoon_2b',
    text: '하... 우리 진짜 비슷한 리듬으로 사는 것 같아. 지금 집중 1도 안 돼',
    choices: [
      { id: 'c49', text: '조금만 버티면 퇴근이야', stat: 'affection', nextDialogueId: 'afternoon_3a' },
      { id: 'c50', text: '나도 멍때리는 중', stat: 'empathy', nextDialogueId: 'afternoon_3b' },
      { id: 'c51', text: '생산성 제로인데 왜 있어야 해', stat: 'rebellion', nextDialogueId: 'afternoon_3c' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'afternoon_2c',
    text: '진짜 외국처럼 낮잠 시간 있으면 훨씬 효율적일 것 같은데... 우리나라는 언제쯤',
    choices: [
      { id: 'c52', text: '스페인 부럽다', stat: 'empathy', nextDialogueId: 'afternoon_3b' },
      { id: 'c53', text: '제안해볼까?', stat: 'rebellion', nextDialogueId: 'afternoon_3c' },
      { id: 'c54', text: '일단 스트레칭이라도 해', stat: 'affection', nextDialogueId: 'afternoon_3a' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'afternoon_3a',
    text: '그래... 조금만 더 힘내면 되겠지. 오늘 퇴근하면 뭐 할 거야?',
    isEnding: true,
    choices: [
      { id: 'c55', text: '집가서 쓰러질 듯', stat: 'empathy' },
      { id: 'c56', text: '넷플릭스 정주행', stat: 'affection' },
      { id: 'c57', text: '너는?', stat: 'affection' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'afternoon_3b',
    text: '우리 이러다 카페인 중독 되는 거 아냐 ㅋㅋㅋ 그래도 얘기하니까 좀 깨는 것 같아',
    isEnding: true,
    choices: [
      { id: 'c58', text: '대화가 최고의 각성제', stat: 'affection' },
      { id: 'c59', text: '건강 챙겨야 하는데', stat: 'empathy' },
      { id: 'c60', text: '이것도 회사 때문이야', stat: 'rebellion' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'afternoon_3c',
    text: '제안하면... 뭐라고 하겠어. "그럴 시간에 일이나 해"ㅋㅋ 상상만 해도 빡쳐',
    isEnding: true,
    choices: [
      { id: 'c61', text: '선진국이랑 차이가 너무 나', stat: 'rebellion' },
      { id: 'c62', text: '언젠간 바뀌겠지', stat: 'empathy' },
      { id: 'c63', text: '일단 오늘만 버티자', stat: 'affection' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
];

// ===== 대화 세션 4: 퇴근 시간 =====
const session_leaving: Dialogue[] = [
  {
    id: 'leaving_1',
    time: 'evening',
    text: '겨우 퇴근... 집 가는 길이 제일 행복한 시간이야',
    choices: [
      { id: 'c64', text: '오늘 고생했어!', stat: 'affection', nextDialogueId: 'leaving_2a' },
      { id: 'c65', text: '나도 막 나왔어', stat: 'empathy', nextDialogueId: 'leaving_2b' },
      { id: 'c66', text: '매일 이러면 몸 망가져', stat: 'rebellion', nextDialogueId: 'leaving_2c' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'leaving_2a',
    text: '고마워... 너도 오늘 고생했어. 집 가서 뭐 할 거야?',
    choices: [
      { id: 'c67', text: '씻고 바로 잘 듯', stat: 'empathy', nextDialogueId: 'leaving_3b' },
      { id: 'c68', text: '맥주나 한잔 해야지', stat: 'affection', nextDialogueId: 'leaving_3a' },
      { id: 'c69', text: '이력서 수정...', stat: 'rebellion', nextDialogueId: 'leaving_3c' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'leaving_2b',
    text: '오 타이밍 딱이네 ㅋㅋ 지하철 타는 중? 나도 지금 플랫폼',
    choices: [
      { id: 'c70', text: '응 사람 개많아', stat: 'empathy', nextDialogueId: 'leaving_3b' },
      { id: 'c71', text: '버스 탈까 고민 중', stat: 'affection', nextDialogueId: 'leaving_3a' },
      { id: 'c72', text: '퇴근길도 지옥이네', stat: 'rebellion', nextDialogueId: 'leaving_3c' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'leaving_2c',
    text: '그니까... 요즘 계속 피곤하고 어깨 너무 아파. 병원 가야 하나',
    choices: [
      { id: 'c73', text: '꼭 가봐 건강이 최우선', stat: 'affection', nextDialogueId: 'leaving_3a' },
      { id: 'c74', text: '나도 목이랑 허리가...', stat: 'empathy', nextDialogueId: 'leaving_3b' },
      { id: 'c75', text: '산재 처리 안 돼?', stat: 'rebellion', nextDialogueId: 'leaving_3c' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'leaving_3a',
    text: '그래... 일단 오늘은 푹 쉬어야겠어. 너 덕분에 기분 좀 나아졌어',
    isEnding: true,
    choices: [
      { id: 'c76', text: '편히 쉬어!', stat: 'affection' },
      { id: 'c77', text: '내일 또 얘기하자', stat: 'affection' },
      { id: 'c78', text: '굿밤~', stat: 'affection' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'leaving_3b',
    text: '하... 직장인 건강 진짜 개판이야 ㅋㅋ 그래도 주말이면 조금 나아지겠지',
    isEnding: true,
    choices: [
      { id: 'c79', text: '주말엔 푹 자자', stat: 'empathy' },
      { id: 'c80', text: '운동이라도 해야 하나', stat: 'empathy' },
      { id: 'c81', text: '월요일 생각하기 싫어', stat: 'empathy' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'leaving_3c',
    text: '산재ㅋㅋㅋ 인정 안 해주겠지. 이 나라에서 직장인은 그냥 소모품이야',
    isEnding: true,
    choices: [
      { id: 'c82', text: '진짜 바뀌어야 해', stat: 'rebellion' },
      { id: 'c83', text: '우리라도 챙기자', stat: 'affection' },
      { id: 'c84', text: '탈출 계획 세워야겠어', stat: 'rebellion' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
];

// ===== 대화 세션 5: 밤 시간 =====
const session_night: Dialogue[] = [
  {
    id: 'night_1',
    time: 'night',
    text: '아직 안 자? 나 침대에 누웠는데 잠이 안 와... 내일 생각하면 벌써 우울해',
    choices: [
      { id: 'c85', text: '나도 못 자고 있어', stat: 'empathy', nextDialogueId: 'night_2b' },
      { id: 'c86', text: '푹 쉬어야 할 텐데', stat: 'affection', nextDialogueId: 'night_2a' },
      { id: 'c87', text: '일요일 밤 증후군?', stat: 'empathy', nextDialogueId: 'night_2b' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'night_2a',
    text: '알아... 근데 자려고 하면 이것저것 생각나더라. 너는 잠 잘 와?',
    choices: [
      { id: 'c88', text: '나도 불면증 있어', stat: 'empathy', nextDialogueId: 'night_3b' },
      { id: 'c89', text: '폰 끄고 자봐', stat: 'affection', nextDialogueId: 'night_3a' },
      { id: 'c90', text: '회사 스트레스 때문이야', stat: 'rebellion', nextDialogueId: 'night_3c' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'night_2b',
    text: '맞아... 특히 일요일 밤이 제일 심해. 월요일이 다가오는 게 느껴져',
    choices: [
      { id: 'c91', text: '완전 공감이야', stat: 'empathy', nextDialogueId: 'night_3b' },
      { id: 'c92', text: '주말을 즐기지도 못하겠어', stat: 'empathy', nextDialogueId: 'night_3b' },
      { id: 'c93', text: '주 4일제 해야 돼', stat: 'rebellion', nextDialogueId: 'night_3c' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'night_3a',
    text: '그래... 일단 폰 내려놓고 자볼게. 얘기해줘서 고마워',
    isEnding: true,
    choices: [
      { id: 'c94', text: '굿나잇!', stat: 'affection' },
      { id: 'c95', text: '좋은 꿈 꿔', stat: 'affection' },
      { id: 'c96', text: '내일도 파이팅', stat: 'affection' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'night_3b',
    text: '하... 우리 언제까지 이렇게 살아야 할까. 주말이 끝나면 또 똑같은 일주일',
    isEnding: true,
    choices: [
      { id: 'c97', text: '다들 그렇게 사는 거겠지', stat: 'empathy' },
      { id: 'c98', text: '작은 행복 찾아보자', stat: 'affection' },
      { id: 'c99', text: '뭔가 바꿔야 해', stat: 'rebellion' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'night_3c',
    text: '진짜... 5일 내내 갈아 넣고 2일 쉬는 게 정상이야? 회복도 안 되는데',
    isEnding: true,
    choices: [
      { id: 'c100', text: '시스템 자체가 잘못됐어', stat: 'rebellion' },
      { id: 'c101', text: '그래도 버텨야지...', stat: 'empathy' },
      { id: 'c102', text: '자기 관리라도 하자', stat: 'affection' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
];

// ===== 대화 세션 6: 야근 =====
const session_overtime: Dialogue[] = [
  {
    id: 'overtime_1',
    text: '야근 확정이래... 오늘 친구랑 약속 있었는데 취소해야겠어',
    choices: [
      { id: 'c103', text: '너무하네... 힘내', stat: 'affection', nextDialogueId: 'overtime_2a' },
      { id: 'c104', text: '나도 오늘 취소했어', stat: 'empathy', nextDialogueId: 'overtime_2b' },
      { id: 'c105', text: '거절 못 해?', stat: 'rebellion', nextDialogueId: 'overtime_2c' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'overtime_2a',
    text: '고마워... 친구한테 미안하다. 이번 달만 벌써 3번째야',
    choices: [
      { id: 'c106', text: '친구도 이해할 거야', stat: 'affection', nextDialogueId: 'overtime_3a' },
      { id: 'c107', text: '나중에 맛있는 거 사줘', stat: 'affection', nextDialogueId: 'overtime_3a' },
      { id: 'c108', text: '야근이 너무 잦은 거 아냐?', stat: 'empathy', nextDialogueId: 'overtime_3b' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'overtime_2b',
    text: '헐 너도? 무슨 일이야... 우리 둘 다 불쌍하네',
    choices: [
      { id: 'c109', text: '직장인의 숙명이지 뭐', stat: 'empathy', nextDialogueId: 'overtime_3b' },
      { id: 'c110', text: '주말에 보상받자', stat: 'affection', nextDialogueId: 'overtime_3a' },
      { id: 'c111', text: '이게 정상은 아니잖아', stat: 'rebellion', nextDialogueId: 'overtime_3c' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'overtime_2c',
    text: '못 해... 팀장이 "다음 주 발표"래. 안 하면 팀 전체가 욕먹어',
    choices: [
      { id: 'c112', text: '그건... 너무하다', stat: 'empathy', nextDialogueId: 'overtime_3b' },
      { id: 'c113', text: '팀장이 미리 관리를 해야지', stat: 'rebellion', nextDialogueId: 'overtime_3c' },
      { id: 'c114', text: '오늘만 버텨', stat: 'affection', nextDialogueId: 'overtime_3a' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'overtime_3a',
    text: '그래... 끝나고 치킨이라도 시켜먹어야겠어. 얘기 들어줘서 고마워',
    isEnding: true,
    choices: [
      { id: 'c115', text: '맥주 한 캔!', stat: 'affection' },
      { id: 'c116', text: '조심히 들어가', stat: 'affection' },
      { id: 'c117', text: '힘내!', stat: 'affection' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'overtime_3b',
    text: '이번 달만 야근 6번째... 몸도 마음도 지친다. 이러다 번아웃 오는 거 아냐',
    isEnding: true,
    choices: [
      { id: 'c118', text: '진짜 쉬어야 할 것 같아', stat: 'empathy' },
      { id: 'c119', text: '연차라도 써', stat: 'affection' },
      { id: 'c120', text: '인력 충원 요청해봐', stat: 'rebellion' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'overtime_3c',
    text: '팀장은 6시에 퇴근하고... 우리만 야근. 관리 능력 없으면 팀장 하지 말든가',
    isEnding: true,
    choices: [
      { id: 'c121', text: '완전 공감해', stat: 'rebellion' },
      { id: 'c122', text: '윗선에 얘기 안 돼?', stat: 'rebellion' },
      { id: 'c123', text: '참기 힘들겠다...', stat: 'empathy' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
];

// ===== 특별 이벤트 =====
const special_events: Dialogue[] = [
  {
    id: 'event_payday',
    text: '오늘 월급날이다! ...근데 통장 스쳐 지나가겠지 ㅋㅋ',
    choices: [
      { id: 'c124', text: '뭐라도 사서 자축하자', stat: 'affection', nextDialogueId: 'payday_2a', points: 50 },
      { id: 'c125', text: '나도 카드값 나가면 끝', stat: 'empathy', nextDialogueId: 'payday_2b' },
      { id: 'c126', text: '월급 대비 업무량 말이 돼?', stat: 'rebellion', nextDialogueId: 'payday_2c' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'payday_2a',
    text: '그래! 오늘 저녁은 좀 비싼 거 먹어야지. 한 달 열심히 일했으니까',
    isEnding: true,
    choices: [
      { id: 'c127', text: '응 당연해!', stat: 'affection' },
      { id: 'c128', text: '맛있는 거 먹고 와', stat: 'affection' },
      { id: 'c129', text: '사진 찍어줘', stat: 'affection' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'payday_2b',
    text: '대출 이자, 카드값, 월세... 진짜 남는 게 없어. 모으고 싶은데',
    isEnding: true,
    choices: [
      { id: 'c130', text: '다들 비슷해', stat: 'empathy' },
      { id: 'c131', text: '재테크라도 해야 하나', stat: 'empathy' },
      { id: 'c132', text: '월급이 너무 적어', stat: 'rebellion' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'payday_2c',
    text: '인상률 2%래... 물가는 몇 퍼센트 올랐는데. 실질적으론 삭감이잖아',
    isEnding: true,
    choices: [
      { id: 'c133', text: '회사들 다 똑같아', stat: 'rebellion' },
      { id: 'c134', text: '이직 고려해봐', stat: 'rebellion' },
      { id: 'c135', text: '참기 힘들겠다', stat: 'empathy' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'event_friday',
    text: '불금이다!!! ...야근만 안 하면',
    choices: [
      { id: 'c136', text: '오늘은 칼퇴하자!', stat: 'affection', nextDialogueId: 'friday_2a' },
      { id: 'c137', text: '우리 팀은 야근 확정', stat: 'empathy', nextDialogueId: 'friday_2b' },
      { id: 'c138', text: '금요일 야근은 범죄야', stat: 'rebellion', nextDialogueId: 'friday_2c' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'friday_2a',
    text: '진짜? 오 좋겠다! 나도 오늘은 6시에 나갈 수 있을 것 같아',
    isEnding: true,
    choices: [
      { id: 'c139', text: '주말 계획 있어?', stat: 'affection' },
      { id: 'c140', text: '푹 쉬어!', stat: 'affection' },
      { id: 'c141', text: '맥주 한 잔?', stat: 'affection' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'friday_2b',
    text: '아... 진짜 안됐다. 야근수당이라도 나와?',
    isEnding: true,
    choices: [
      { id: 'c142', text: '포괄임금제라...', stat: 'empathy' },
      { id: 'c143', text: '힘내 주말이 기다려', stat: 'affection' },
      { id: 'c144', text: '주말에 보상받아', stat: 'empathy' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'friday_2c',
    text: '팀장이 "오늘 끝내고 월요일 편하게 시작하자"래... 개소리',
    isEnding: true,
    choices: [
      { id: 'c145', text: '월요일에 해도 되는 거 아냐?', stat: 'rebellion' },
      { id: 'c146', text: '팀장은 퇴근할 거잖아', stat: 'rebellion' },
      { id: 'c147', text: '정말 힘들겠다...', stat: 'empathy' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'event_monday',
    text: '월요일... 다시 시작이네. 주말이 너무 빨리 지나갔어',
    choices: [
      { id: 'c148', text: '이번 주도 화이팅!', stat: 'affection', nextDialogueId: 'monday_2a' },
      { id: 'c149', text: '주말 48시간이 너무 짧아', stat: 'empathy', nextDialogueId: 'monday_2b' },
      { id: 'c150', text: '주 4일제 도입해야 해', stat: 'rebellion', nextDialogueId: 'monday_2c' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'monday_2a',
    text: '고마워... 너 같은 사람 있어서 월요일도 견딜 만해',
    isEnding: true,
    choices: [
      { id: 'c151', text: '우리 같이 힘내자', stat: 'affection' },
      { id: 'c152', text: '점심 때 또 얘기하자', stat: 'affection' },
      { id: 'c153', text: '금요일까지 버티자', stat: 'affection' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'monday_2b',
    text: '진짜... 금요일 저녁부터 일요일 밤까지 체감 10시간? 너무 빨라',
    isEnding: true,
    choices: [
      { id: 'c154', text: '일요일 밤은 우울해', stat: 'empathy' },
      { id: 'c155', text: '주말을 제대로 못 쉬어', stat: 'empathy' },
      { id: 'c156', text: '다음 주말까지 또 5일', stat: 'empathy' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
  {
    id: 'monday_2c',
    text: '외국은 이미 실험 중이래... 우리나라는 언제쯤? 꼰대들 물러나야 하나',
    isEnding: true,
    choices: [
      { id: 'c157', text: '생산성도 올라간대', stat: 'rebellion' },
      { id: 'c158', text: '우리 세대가 바꿔야지', stat: 'rebellion' },
      { id: 'c159', text: '당장은 힘들겠지...', stat: 'empathy' },
      { id: 'end', text: '👋 대화 마치기', stat: 'affection', isFarewell: true },
    ],
  },
];

// ===== 모든 대화 통합 =====
const allDialogues = [
  ...farewells,
  ...session_morning_subway,
  ...session_lunch,
  ...session_afternoon_slump,
  ...session_leaving,
  ...session_night,
  ...session_overtime,
  ...special_events,
];

// ===== 인사말 (시간대별 시작점) =====
export const greetings: Dialogue[] = [
  session_morning_subway[0],
  session_lunch[0],
  session_afternoon_slump[0],
  session_leaving[0],
  session_night[0],
];

// ===== ID로 대화 찾기 =====
export const getDialogueById = (id: string): Dialogue | null => {
  return allDialogues.find(d => d.id === id) || null;
};

// ===== 시간대별 대사 가져오기 =====
export const getGreetingByTime = (): Dialogue => {
  const hour = new Date().getHours();
  let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  
  if (hour >= 6 && hour < 12) timeOfDay = 'morning';
  else if (hour >= 12 && hour < 18) timeOfDay = 'afternoon';
  else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
  else timeOfDay = 'night';
  
  const filtered = greetings.filter(g => g.time === timeOfDay);
  return filtered[Math.floor(Math.random() * filtered.length)];
};

// ===== 랜덤 대사 가져오기 (폴백용) =====
export const getRandomDialogue = (type: 'affection' | 'empathy' | 'rebellion'): Dialogue => {
  const nonEnding = allDialogues.filter(d => !d.isEnding && !d.isFarewell);
  return nonEnding[Math.floor(Math.random() * nonEnding.length)];
};

// ===== 작별 인사 랜덤 선택 =====
export const getRandomFarewell = (): Dialogue => {
  return farewells[Math.floor(Math.random() * farewells.length)];
};

// ===== 특별 이벤트 체크 =====
export const checkSpecialEvent = (): Dialogue | null => {
  const day = new Date().getDay();
  const date = new Date().getDate();
  
  if (day === 5) {
    return special_events.find(e => e.id === 'event_friday') || null;
  }
  
  if (day === 1) {
    return special_events.find(e => e.id === 'event_monday') || null;
  }
  
  if (date === 25) {
    return special_events.find(e => e.id === 'event_payday') || null;
  }
  
  if (Math.random() < 0.15) {
    return session_overtime[0];
  }
  
  return null;
};