'use client';

import { useState } from 'react';

// 확장된 비버 유형 (8가지)
type BeaverType = 
  | 'peaceful'      // 고요한 비버 - 내향적, 평화로운
  | 'creative'      // 창의적인 비버 - 예술적, 감성적
  | 'organized'     // 정돈된 비버 - 체계적, 계획적
  | 'adventurous'   // 활동적인 비버 - 외향적, 에너지 넘치는
  | 'social'        // 사교적인 비버 - 사람 중심, 관계 지향
  | 'ambitious'     // 열정적인 비버 - 목표 지향, 성취 중심
  | 'healing'       // 치유하는 비버 - 공감형, 위로형
  | 'curious';      // 탐구하는 비버 - 지적 호기심, 학습형

type TestVersion = 'highschool' | 'college' | 'jobseeker' | 'worker' | null;

interface BeaverResult {
  name: string;
  emoji: string;
  description: string;
  traits: string[];
  restStyle: string;
  recommendation: string;
  celebrities: string[];  // 비슷한 유형의 유명인
}

const beaverResults: Record<BeaverType, BeaverResult> = {
  peaceful: {
    name: '고요한 비버',
    emoji: '🌙',
    description: '당신은 고요함 속에서 진정한 휴식을 찾는 비버입니다. 아무것도 하지 않는 시간의 소중함을 아는 당신은, 번잡함에서 벗어나 나만의 공간에서 깊은 평온을 느낍니다. 혼자만의 시간을 통해 내면의 에너지를 충전하는 내향형 힐링 전문가입니다.',
    traits: [
      '조용한 환경에서 에너지를 충전합니다',
      '혼자만의 시간을 소중히 여깁니다',
      '미니멀한 라이프스타일을 선호합니다',
      '느린 템포의 일상을 즐깁니다',
      '깊은 사색과 명상을 좋아합니다'
    ],
    restStyle: '완전한 정적 속에서 아무 생각 없이 누워있거나, 창밖을 바라보며 멍때리는 시간. 명상 음악이나 백색소음과 함께하는 깊은 휴식.',
    recommendation: '조용한 카페 한 켠, 집 안의 가장 편안한 소파, 혹은 자연의 소리만 들리는 공원이 당신의 쉼터가 되어줄 거예요.',
    celebrities: ['IU', '공유', '수지']
  },
  creative: {
    name: '창의적인 비버',
    emoji: '🎨',
    description: '당신은 영감과 자극 속에서 쉬는 독특한 비버입니다. 새로운 콘텐츠를 접하고, 아름다운 것을 감상하며, 상상력을 자유롭게 펼칠 때 진정으로 재충전됩니다. 예술적 감수성이 풍부하고 감성적인 경험을 통해 위안을 얻습니다.',
    traits: [
      '영화, 음악, 예술에서 위로를 받습니다',
      '새로운 아이디어에 호기심이 많습니다',
      '감각적이고 미적인 경험을 즐깁니다',
      '영감을 주는 공간과 분위기를 좋아합니다',
      '상상력과 창의성을 발휘하는 활동을 선호합니다'
    ],
    restStyle: '좋아하는 영화나 시리즈를 정주행하거나, 전시회를 둘러보고, 새로운 음악을 발견하는 시간. 그림 그리기, 글쓰기 같은 창작 활동.',
    recommendation: '북카페, 미술관, 감각적인 인테리어의 공간들이 당신에게 휴식과 동시에 영감을 선물할 거예요.',
    celebrities: ['BTS RM', '아이유', '박보검']
  },
  organized: {
    name: '정돈된 비버',
    emoji: '📋',
    description: '당신은 질서와 계획 속에서 마음의 평화를 얻는 비버입니다. 할 일을 정리하고, 공간을 깔끔하게 만들고, 내일을 준비할 때 비로소 진정한 안정감을 느낍니다. 체계적이고 효율적인 삶을 추구하며, 명확한 구조 안에서 편안함을 느낍니다.',
    traits: [
      '정리정돈된 환경을 선호합니다',
      '계획을 세우면 마음이 편안해집니다',
      '생산적인 휴식을 추구합니다',
      '루틴과 규칙성을 중요하게 여깁니다',
      '체크리스트를 완료하면 성취감을 느낍니다'
    ],
    restStyle: '다이어리를 정리하고, 방을 깔끔하게 청소하며, 다음 주 계획을 차분히 세우는 시간. 버킷리스트 작성이나 목표 재정비.',
    recommendation: '잘 정돈된 서재, 조용한 스터디 카페, 혹은 체계적으로 정리된 나만의 작업 공간이 당신의 안식처가 될 거예요.',
    celebrities: ['송중기', '김연아', '유재석']
  },
  adventurous: {
    name: '활동적인 비버',
    emoji: '⛰️',
    description: '당신은 움직임과 변화 속에서 활력을 찾는 비버입니다. 가만히 있는 것보다 가벼운 산책, 새로운 장소 탐험, 몸을 움직이는 활동을 통해 진정한 재충전을 경험합니다. 에너지 넘치고 외향적이며, 새로운 경험을 통해 삶의 활기를 되찾습니다.',
    traits: [
      '실외 활동으로 스트레스를 해소합니다',
      '새로운 장소를 탐험하는 것을 좋아합니다',
      '신체 활동 후 상쾌함을 느낍니다',
      '정적인 휴식보다 동적인 재충전을 선호합니다',
      '즉흥적이고 자유로운 활동을 즐깁니다'
    ],
    restStyle: '동네를 산책하거나, 자전거를 타고, 가까운 카페나 공원을 찾아 나서는 시간. 등산, 러닝, 요가 같은 신체 활동.',
    recommendation: '산책로, 강변 공원, 작은 동네 골목길, 혹은 처음 가보는 카페들이 당신에게 새로운 에너지를 줄 거예요.',
    celebrities: ['박나래', '전현무', '이효리']
  },
  social: {
    name: '사교적인 비버',
    emoji: '🤝',
    description: '당신은 사람들과의 교류 속에서 에너지를 얻는 비버입니다. 혼자 있는 것보다 친구들과 대화하고, 웃고, 함께 시간을 보낼 때 진정한 휴식을 느낍니다. 관계 지향적이고 공감 능력이 뛰어나며, 따뜻한 인간관계를 통해 삶의 의미를 찾습니다.',
    traits: [
      '사람들과 함께 있을 때 에너지를 얻습니다',
      '대화와 소통을 통해 스트레스를 해소합니다',
      '친구들의 고민을 들어주는 것을 좋아합니다',
      '혼자보다는 함께하는 활동을 선호합니다',
      '새로운 사람을 만나는 것에 부담이 없습니다'
    ],
    restStyle: '친구들과 카페에서 수다 떨거나, 함께 맛있는 음식을 먹으며 이야기 나누는 시간. 소모임이나 가벼운 모임 참여.',
    recommendation: '친구들과 갈 수 있는 브런치 카페, 분위기 좋은 레스토랑, 혹은 편하게 이야기 나눌 수 있는 바가 당신의 쉼터예요.',
    celebrities: ['유재석', '박나래', '김숙']
  },
  ambitious: {
    name: '열정적인 비버',
    emoji: '🔥',
    description: '당신은 목표를 향해 달려가는 과정에서 살아있음을 느끼는 비버입니다. 휴식조차 생산적이고 의미 있어야 하며, 자기계발과 성장을 통해 재충전됩니다. 성취 지향적이고 야심차며, 끊임없이 발전하고자 하는 열정이 있습니다.',
    traits: [
      '자기계발 활동을 통해 에너지를 얻습니다',
      '목표 달성 시 큰 만족감을 느낍니다',
      '생산적인 활동을 선호합니다',
      '새로운 도전을 즐깁니다',
      '성장과 발전을 중요하게 여깁니다'
    ],
    restStyle: '자격증 공부, 온라인 강의 수강, 독서, 운동 같은 자기계발 활동. 새로운 스킬을 배우거나 목표를 설정하는 시간.',
    recommendation: '북카페, 스터디 카페, 피트니스 센터, 혹은 세미나나 워크샵 같은 배움의 공간이 당신에게 힘을 줄 거예요.',
    celebrities: ['손흥민', 'BTS RM', '김연아']
  },
  healing: {
    name: '치유하는 비버',
    emoji: '🌿',
    description: '당신은 자연과 따뜻함 속에서 치유되는 비버입니다. 공감 능력이 뛰어나고 감정적으로 섬세하며, 평온하고 안정적인 환경에서 마음의 상처를 치유합니다. 자신과 타인의 감정을 소중히 여기고, 정서적 안정을 최우선으로 생각합니다.',
    traits: [
      '자연 속에서 마음의 평화를 찾습니다',
      '감정을 충분히 느끼고 표현합니다',
      '따뜻하고 포근한 분위기를 좋아합니다',
      '명상, 요가 같은 힐링 활동을 즐깁니다',
      '자신과 타인에게 공감하고 위로합니다'
    ],
    restStyle: '공원 산책, 반려동물과 시간 보내기, 따뜻한 차 마시기, 명상이나 요가. 감정 일기 쓰기나 힐링 음악 듣기.',
    recommendation: '숲길, 한적한 공원, 템플스테이, 힐링 카페, 혹은 따뜻한 햇살이 드는 창가가 당신의 안식처가 될 거예요.',
    celebrities: ['이효리', '정유미', '공유']
  },
  curious: {
    name: '탐구하는 비버',
    emoji: '🔍',
    description: '당신은 지적 호기심을 충족시키며 쉬는 비버입니다. 새로운 지식을 배우고, 흥미로운 주제를 탐구하며, 깊이 있는 사고를 할 때 진정한 재충전을 경험합니다. 분석적이고 사색적이며, 배움 자체에서 즐거움을 느낍니다.',
    traits: [
      '새로운 지식 습득에 흥미를 느낍니다',
      '깊이 있는 대화와 토론을 즐깁니다',
      '다큐멘터리나 교양 콘텐츠를 선호합니다',
      '복잡한 문제를 해결하는 것을 좋아합니다',
      '책 읽기와 글쓰기로 생각을 정리합니다'
    ],
    restStyle: '흥미로운 책 읽기, 다큐멘터리 시청, 팟캐스트 듣기, 새로운 분야 공부하기. 철학적 사색이나 글쓰기.',
    recommendation: '서점, 도서관, 박물관, 과학관, 혹은 조용히 사색할 수 있는 북카페가 당신의 영감의 공간이 될 거예요.',
    celebrities: ['유시민', '알베르트 아인슈타인', '빌 게이츠']
  }
};

// 개선된 질문 세트 - 더 정교한 점수 매핑
const questionsByVersion = {
  highschool: [
    {
      id: 1,
      question: '시험 기간이 끝난 주말, 가장 먼저 하고 싶은 일은?',
      options: [
        { 
          text: '아무 생각 없이 침대에 누워서 쉬기', 
          scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 2, curious: 0 } 
        },
        { 
          text: '밀린 드라마나 영화 정주행하기', 
          scores: { peaceful: 1, creative: 4, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 1, curious: 2 } 
        },
        { 
          text: '친구들이랑 놀러 나가기', 
          scores: { peaceful: 0, creative: 0, organized: 0, adventurous: 4, social: 5, ambitious: 0, healing: 0, curious: 0 } 
        },
        { 
          text: '밀린 공부 하거나 자격증 준비하기', 
          scores: { peaceful: 0, creative: 0, organized: 4, adventurous: 0, social: 0, ambitious: 5, healing: 0, curious: 2 } 
        },
      ]
    },
    {
      id: 2,
      question: '혼자 있는 시간이 생겼을 때 주로 무엇을 하나요?',
      options: [
        { 
          text: '그냥 멍 때리거나 잠자기', 
          scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 0 } 
        },
        { 
          text: '그림 그리기, 음악 듣기 같은 취미 활동', 
          scores: { peaceful: 2, creative: 5, organized: 0, adventurous: 0, social: 0, ambitious: 1, healing: 2, curious: 1 } 
        },
        { 
          text: '플래너 정리하거나 방 청소하기', 
          scores: { peaceful: 1, creative: 0, organized: 5, adventurous: 0, social: 0, ambitious: 3, healing: 0, curious: 0 } 
        },
        { 
          text: '유튜브나 블로그에서 새로운 정보 찾아보기', 
          scores: { peaceful: 0, creative: 2, organized: 0, adventurous: 1, social: 0, ambitious: 2, healing: 0, curious: 5 } 
        },
      ]
    },
    {
      id: 3,
      question: '친구들과의 관계에서 당신의 모습은?',
      options: [
        { 
          text: '소수의 친한 친구들과 깊은 대화 나누는 편', 
          scores: { peaceful: 3, creative: 2, organized: 1, adventurous: 0, social: 2, ambitious: 0, healing: 4, curious: 2 } 
        },
        { 
          text: '많은 사람들과 어울리며 에너지를 얻는 편', 
          scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 4, social: 5, ambitious: 2, healing: 0, curious: 0 } 
        },
        { 
          text: '친구들의 고민을 들어주는 상담역할', 
          scores: { peaceful: 2, creative: 1, organized: 0, adventurous: 0, social: 3, ambitious: 0, healing: 5, curious: 1 } 
        },
        { 
          text: '혼자 있는 시간이 더 편하고 좋은 편', 
          scores: { peaceful: 5, creative: 3, organized: 2, adventurous: 0, social: 0, ambitious: 1, healing: 2, curious: 3 } 
        },
      ]
    },
    {
      id: 4,
      question: '스트레스를 받을 때 어떻게 해소하나요?',
      options: [
        { 
          text: '조용히 혼자 쉬면서 회복하기', 
          scores: { peaceful: 5, creative: 1, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 1 } 
        },
        { 
          text: '운동하거나 밖에 나가서 움직이기', 
          scores: { peaceful: 0, creative: 0, organized: 1, adventurous: 5, social: 1, ambitious: 3, healing: 2, curious: 0 } 
        },
        { 
          text: '친구들한테 이야기하고 공감받기', 
          scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 1, social: 5, ambitious: 0, healing: 3, curious: 0 } 
        },
        { 
          text: '할 일을 정리하고 하나씩 해결하기', 
          scores: { peaceful: 1, creative: 0, organized: 5, adventurous: 0, social: 0, ambitious: 4, healing: 0, curious: 2 } 
        },
      ]
    },
    {
      id: 5,
      question: '주말에 가장 만족스러운 순간은?',
      options: [
        { 
          text: '아무 계획 없이 느긋하게 쉬었을 때', 
          scores: { peaceful: 5, creative: 1, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 0 } 
        },
        { 
          text: '새로운 경험이나 활동을 했을 때', 
          scores: { peaceful: 0, creative: 3, organized: 0, adventurous: 5, social: 2, ambitious: 3, healing: 0, curious: 3 } 
        },
        { 
          text: '좋아하는 사람들과 시간 보냈을 때', 
          scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 2, social: 5, ambitious: 0, healing: 3, curious: 0 } 
        },
        { 
          text: '계획한 일을 모두 완료했을 때', 
          scores: { peaceful: 0, creative: 0, organized: 5, adventurous: 1, social: 0, ambitious: 5, healing: 0, curious: 1 } 
        },
      ]
    },
    {
      id: 6,
      question: '만약 하루 자유시간이 주어진다면?',
      options: [
        { 
          text: '집에서 편하게 쉬면서 보내기', 
          scores: { peaceful: 5, creative: 2, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 2, curious: 1 } 
        },
        { 
          text: '전시회, 공연 같은 문화생활 즐기기', 
          scores: { peaceful: 1, creative: 5, organized: 0, adventurous: 2, social: 1, ambitious: 1, healing: 1, curious: 3 } 
        },
        { 
          text: '친구들이랑 맛집 투어나 놀러가기', 
          scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 4, social: 5, ambitious: 0, healing: 0, curious: 0 } 
        },
        { 
          text: '흥미로운 책 읽거나 다큐 보기', 
          scores: { peaceful: 3, creative: 2, organized: 1, adventurous: 0, social: 0, ambitious: 2, healing: 1, curious: 5 } 
        },
      ]
    },
    {
      id: 7,
      question: '이상적인 방학은 어떤 모습인가요?',
      options: [
        { 
          text: '아무 걱정 없이 푹 쉬는 방학', 
          scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 4, curious: 0 } 
        },
        { 
          text: '여행하고 새로운 곳 가보는 방학', 
          scores: { peaceful: 0, creative: 3, organized: 0, adventurous: 5, social: 3, ambitious: 2, healing: 1, curious: 2 } 
        },
        { 
          text: '자격증이나 공부하며 보내는 방학', 
          scores: { peaceful: 0, creative: 0, organized: 4, adventurous: 0, social: 0, ambitious: 5, healing: 0, curious: 3 } 
        },
        { 
          text: '취미나 관심사에 푹 빠지는 방학', 
          scores: { peaceful: 2, creative: 5, organized: 0, adventurous: 1, social: 0, ambitious: 1, healing: 2, curious: 4 } 
        },
      ]
    },
    {
      id: 8,
      question: '나에게 "잘 쉰 하루"란?',
      options: [
        { 
          text: '아무것도 하지 않아도 괜찮았던 날', 
          scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 4, curious: 0 } 
        },
        { 
          text: '의미 있는 성취를 이룬 날', 
          scores: { peaceful: 0, creative: 1, organized: 4, adventurous: 2, social: 0, ambitious: 5, healing: 0, curious: 2 } 
        },
        { 
          text: '좋은 사람들과 행복한 시간을 보낸 날', 
          scores: { peaceful: 0, creative: 2, organized: 0, adventurous: 2, social: 5, ambitious: 0, healing: 3, curious: 0 } 
        },
        { 
          text: '새로운 것을 배우고 느낀 날', 
          scores: { peaceful: 1, creative: 4, organized: 1, adventurous: 2, social: 0, ambitious: 3, healing: 1, curious: 5 } 
        },
      ]
    }
  ],
  college: [
    {
      id: 1,
      question: '시험이 끝난 후, 가장 먼저 하고 싶은 일은?',
      options: [
        { 
          text: '기숙사/자취방에서 푹 쉬기', 
          scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 0 } 
        },
        { 
          text: '밀린 넷플릭스나 예능 정주행', 
          scores: { peaceful: 2, creative: 4, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 1, curious: 2 } 
        },
        { 
          text: '친구들이랑 술자리나 모임 가기', 
          scores: { peaceful: 0, creative: 0, organized: 0, adventurous: 3, social: 5, ambitious: 0, healing: 0, curious: 0 } 
        },
        { 
          text: '자격증이나 어학 공부 시작하기', 
          scores: { peaceful: 0, creative: 0, organized: 4, adventurous: 0, social: 0, ambitious: 5, healing: 0, curious: 3 } 
        },
      ]
    },
    {
      id: 2,
      question: '과제와 팀플로 지칠 때 어떻게 회복하나요?',
      options: [
        { 
          text: '혼자 조용히 있으면서 마음 정리하기', 
          scores: { peaceful: 5, creative: 1, organized: 1, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 1 } 
        },
        { 
          text: '운동하거나 밖에 나가서 활동하기', 
          scores: { peaceful: 0, creative: 0, organized: 0, adventurous: 5, social: 1, ambitious: 3, healing: 2, curious: 0 } 
        },
        { 
          text: '친구들한테 푸념하고 공감받기', 
          scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 0, social: 5, ambitious: 0, healing: 2, curious: 0 } 
        },
        { 
          text: '할 일 목록 만들고 체계적으로 정리', 
          scores: { peaceful: 1, creative: 0, organized: 5, adventurous: 0, social: 0, ambitious: 4, healing: 0, curious: 2 } 
        },
      ]
    },
    {
      id: 3,
      question: '동아리/모임 활동에서 당신은?',
      options: [
        { 
          text: '참여는 하지만 깊게 관여하지 않는 편', 
          scores: { peaceful: 4, creative: 2, organized: 1, adventurous: 0, social: 1, ambitious: 0, healing: 2, curious: 2 } 
        },
        { 
          text: '적극적으로 참여하고 사람들과 어울림', 
          scores: { peaceful: 0, creative: 1, organized: 1, adventurous: 4, social: 5, ambitious: 2, healing: 1, curious: 0 } 
        },
        { 
          text: '기획하고 운영하는 역할을 맡는 편', 
          scores: { peaceful: 0, creative: 2, organized: 5, adventurous: 2, social: 2, ambitious: 5, healing: 0, curious: 1 } 
        },
        { 
          text: '관심 분야 중심으로 선택적 참여', 
          scores: { peaceful: 2, creative: 3, organized: 2, adventurous: 1, social: 1, ambitious: 2, healing: 1, curious: 5 } 
        },
      ]
    },
    {
      id: 4,
      question: '수업 없는 날, 어떻게 보내나요?',
      options: [
        { 
          text: '늦잠 자고 느긋하게 일어나기', 
          scores: { peaceful: 5, creative: 1, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 0 } 
        },
        { 
          text: '카페 가서 공부하거나 작업하기', 
          scores: { peaceful: 1, creative: 2, organized: 3, adventurous: 0, social: 1, ambitious: 4, healing: 0, curious: 3 } 
        },
        { 
          text: '친구들 만나거나 캠퍼스 돌아다니기', 
          scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 4, social: 5, ambitious: 0, healing: 1, curious: 1 } 
        },
        { 
          text: '관심 있는 주제 공부하거나 책 읽기', 
          scores: { peaceful: 3, creative: 3, organized: 2, adventurous: 0, social: 0, ambitious: 3, healing: 1, curious: 5 } 
        },
      ]
    },
    {
      id: 5,
      question: '방학 계획을 세운다면?',
      options: [
        { 
          text: '특별한 계획 없이 쉬면서 보내기', 
          scores: { peaceful: 5, creative: 1, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 4, curious: 0 } 
        },
        { 
          text: '여행이나 새로운 경험 많이 하기', 
          scores: { peaceful: 0, creative: 3, organized: 0, adventurous: 5, social: 3, ambitious: 2, healing: 1, curious: 2 } 
        },
        { 
          text: '자격증, 인턴 등 스펙 쌓기', 
          scores: { peaceful: 0, creative: 0, organized: 5, adventurous: 1, social: 0, ambitious: 5, healing: 0, curious: 2 } 
        },
        { 
          text: '취미나 관심사에 몰두하기', 
          scores: { peaceful: 2, creative: 5, organized: 0, adventurous: 1, social: 0, ambitious: 2, healing: 2, curious: 4 } 
        },
      ]
    },
    {
      id: 6,
      question: '이상적인 주말은?',
      options: [
        { 
          text: '집/자취방에서 혼자 보내기', 
          scores: { peaceful: 5, creative: 2, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 2, curious: 2 } 
        },
        { 
          text: '친구들과 약속 잡고 나가기', 
          scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 4, social: 5, ambitious: 0, healing: 1, curious: 0 } 
        },
        { 
          text: '생산적인 활동 하면서 보내기', 
          scores: { peaceful: 0, creative: 1, organized: 5, adventurous: 1, social: 0, ambitious: 5, healing: 0, curious: 3 } 
        },
        { 
          text: '전시회, 공연 등 문화생활 즐기기', 
          scores: { peaceful: 1, creative: 5, organized: 0, adventurous: 2, social: 2, ambitious: 1, healing: 2, curious: 4 } 
        },
      ]
    },
    {
      id: 7,
      question: '미래에 대해 생각할 때 당신은?',
      options: [
        { 
          text: '너무 멀리 생각하지 않고 현재에 집중', 
          scores: { peaceful: 4, creative: 2, organized: 0, adventurous: 1, social: 1, ambitious: 0, healing: 4, curious: 1 } 
        },
        { 
          text: '명확한 목표를 세우고 계획 수립', 
          scores: { peaceful: 0, creative: 0, organized: 5, adventurous: 1, social: 0, ambitious: 5, healing: 0, curious: 2 } 
        },
        { 
          text: '다양한 가능성을 열어두고 탐색', 
          scores: { peaceful: 1, creative: 4, organized: 0, adventurous: 3, social: 1, ambitious: 2, healing: 1, curious: 5 } 
        },
        { 
          text: '막연하지만 좋은 일이 있을 거라 믿음', 
          scores: { peaceful: 3, creative: 3, organized: 0, adventurous: 2, social: 2, ambitious: 1, healing: 5, curious: 1 } 
        },
      ]
    },
    {
      id: 8,
      question: '나에게 "잘 쉰 하루"란?',
      options: [
        { 
          text: '과제 걱정 없이 완전히 쉰 날', 
          scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 4, curious: 0 } 
        },
        { 
          text: '의미 있는 무언가를 성취한 날', 
          scores: { peaceful: 0, creative: 2, organized: 4, adventurous: 2, social: 0, ambitious: 5, healing: 0, curious: 3 } 
        },
        { 
          text: '좋은 사람들과 즐거웠던 날', 
          scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 3, social: 5, ambitious: 0, healing: 2, curious: 0 } 
        },
        { 
          text: '새로운 영감이나 배움이 있었던 날', 
          scores: { peaceful: 1, creative: 4, organized: 1, adventurous: 1, social: 0, ambitious: 3, healing: 1, curious: 5 } 
        },
      ]
    }
  ],
  jobseeker: [
    {
      id: 1,
      question: '서류 마감이 끝난 저녁, 가장 하고 싶은 건?',
      options: [
        { 
          text: '아무 생각 없이 누워서 쉬기', 
          scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 0 } 
        },
        { 
          text: '드라마나 영화 보면서 마음 달래기', 
          scores: { peaceful: 2, creative: 4, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 1 } 
        },
        { 
          text: '친구들 만나서 스트레스 풀기', 
          scores: { peaceful: 0, creative: 0, organized: 0, adventurous: 3, social: 5, ambitious: 0, healing: 2, curious: 0 } 
        },
        { 
          text: '다음 지원 일정 정리하기', 
          scores: { peaceful: 0, creative: 0, organized: 5, adventurous: 0, social: 0, ambitious: 4, healing: 0, curious: 1 } 
        },
      ]
    },
    {
      id: 2,
      question: '면접 준비로 지칠 때?',
      options: [
        { 
          text: '혼자 조용히 마음 추스르기', 
          scores: { peaceful: 5, creative: 1, organized: 1, adventurous: 0, social: 0, ambitious: 0, healing: 4, curious: 0 } 
        },
        { 
          text: '산책하거나 운동으로 기분 전환', 
          scores: { peaceful: 1, creative: 0, organized: 0, adventurous: 5, social: 0, ambitious: 2, healing: 3, curious: 0 } 
        },
        { 
          text: '같이 준비하는 사람들과 이야기', 
          scores: { peaceful: 0, creative: 0, organized: 0, adventurous: 1, social: 5, ambitious: 1, healing: 2, curious: 0 } 
        },
        { 
          text: '준비 과정 점검하고 계획 재정비', 
          scores: { peaceful: 0, creative: 0, organized: 5, adventurous: 0, social: 0, ambitious: 5, healing: 0, curious: 2 } 
        },
      ]
    },
    {
      id: 3,
      question: '긴 공백기에 당신은?',
      options: [
        { 
          text: '최대한 쉬면서 에너지 회복에 집중', 
          scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 5, curious: 0 } 
        },
        { 
          text: '부족한 스펙 보완하며 보내기', 
          scores: { peaceful: 0, creative: 0, organized: 4, adventurous: 0, social: 0, ambitious: 5, healing: 0, curious: 3 } 
        },
        { 
          text: '여행이나 새로운 경험 하기', 
          scores: { peaceful: 0, creative: 3, organized: 0, adventurous: 5, social: 2, ambitious: 1, healing: 2, curious: 2 } 
        },
        { 
          text: '관심 분야 공부하거나 취미 활동', 
          scores: { peaceful: 2, creative: 5, organized: 1, adventurous: 1, social: 0, ambitious: 2, healing: 2, curious: 5 } 
        },
      ]
    },
    {
      id: 4,
      question: '일정 없는 오전, 어떻게 보내나요?',
      options: [
        { 
          text: '푹 자고 천천히 일어나기', 
          scores: { peaceful: 5, creative: 1, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 0 } 
        },
        { 
          text: '카페 가서 공부하거나 준비하기', 
          scores: { peaceful: 1, creative: 1, organized: 4, adventurous: 0, social: 1, ambitious: 5, healing: 0, curious: 2 } 
        },
        { 
          text: '운동이나 산책으로 시작하기', 
          scores: { peaceful: 1, creative: 0, organized: 1, adventurous: 5, social: 0, ambitious: 3, healing: 4, curious: 0 } 
        },
        { 
          text: '관심 있는 책이나 강의 듣기', 
          scores: { peaceful: 2, creative: 3, organized: 2, adventurous: 0, social: 0, ambitious: 3, healing: 1, curious: 5 } 
        },
      ]
    },
    {
      id: 5,
      question: '취준 과정에서 가장 위로가 되는 건?',
      options: [
        { 
          text: '혼자만의 조용한 휴식 시간', 
          scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 4, curious: 0 } 
        },
        { 
          text: '좋아하는 취미나 콘텐츠', 
          scores: { peaceful: 2, creative: 5, organized: 0, adventurous: 1, social: 0, ambitious: 0, healing: 3, curious: 3 } 
        },
        { 
          text: '응원해주는 사람들과의 대화', 
          scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 1, social: 5, ambitious: 0, healing: 4, curious: 0 } 
        },
        { 
          text: '작은 성취라도 이루는 것', 
          scores: { peaceful: 0, creative: 1, organized: 4, adventurous: 2, social: 0, ambitious: 5, healing: 1, curious: 2 } 
        },
      ]
    },
    {
      id: 6,
      question: '만약 하루 완전히 쉴 수 있다면?',
      options: [
        { 
          text: '집에서 아무것도 안 하고 쉬기', 
          scores: { peaceful: 5, creative: 1, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 4, curious: 0 } 
        },
        { 
          text: '미뤘던 문화생활 즐기기', 
          scores: { peaceful: 1, creative: 5, organized: 0, adventurous: 2, social: 2, ambitious: 0, healing: 2, curious: 3 } 
        },
        { 
          text: '친구들 만나서 수다 떨기', 
          scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 3, social: 5, ambitious: 0, healing: 2, curious: 0 } 
        },
        { 
          text: '평소 궁금했던 것 공부하기', 
          scores: { peaceful: 2, creative: 2, organized: 2, adventurous: 0, social: 0, ambitious: 3, healing: 0, curious: 5 } 
        },
      ]
    },
    {
      id: 7,
      question: '불합격 통보를 받았을 때?',
      options: [
        { 
          text: '혼자 충분히 슬퍼하고 회복하기', 
          scores: { peaceful: 4, creative: 1, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 5, curious: 0 } 
        },
        { 
          text: '빠르게 다음 준비 시작하기', 
          scores: { peaceful: 0, creative: 0, organized: 4, adventurous: 2, social: 0, ambitious: 5, healing: 0, curious: 1 } 
        },
        { 
          text: '친구들에게 털어놓고 위로받기', 
          scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 1, social: 5, ambitious: 0, healing: 4, curious: 0 } 
        },
        { 
          text: '원인 분석하고 개선점 찾기', 
          scores: { peaceful: 1, creative: 1, organized: 5, adventurous: 0, social: 0, ambitious: 4, healing: 0, curious: 4 } 
        },
      ]
    },
    {
      id: 8,
      question: '나에게 "잘 쉰 하루"란?',
      options: [
        { 
          text: '취준 생각 안 하고 완전히 쉰 날', 
          scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 5, curious: 0 } 
        },
        { 
          text: '계획한 준비를 잘 마친 날', 
          scores: { peaceful: 0, creative: 0, organized: 5, adventurous: 1, social: 0, ambitious: 5, healing: 0, curious: 2 } 
        },
        { 
          text: '좋은 사람들과 행복했던 날', 
          scores: { peaceful: 0, creative: 2, organized: 0, adventurous: 2, social: 5, ambitious: 0, healing: 3, curious: 0 } 
        },
        { 
          text: '새로운 배움이나 영감을 얻은 날', 
          scores: { peaceful: 1, creative: 4, organized: 1, adventurous: 1, social: 0, ambitious: 3, healing: 1, curious: 5 } 
        },
      ]
    }
  ],
  worker: [
    {
      id: 1,
      question: '퇴근 후 집에 도착하면?',
      options: [
        { 
          text: '씻고 바로 침대에 쓰러지기', 
          scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 0 } 
        },
        { 
          text: '넷플릭스나 유튜브 켜기', 
          scores: { peaceful: 2, creative: 4, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 2, curious: 2 } 
        },
        { 
          text: '약속 나가거나 모임 참석', 
          scores: { peaceful: 0, creative: 0, organized: 0, adventurous: 3, social: 5, ambitious: 1, healing: 0, curious: 0 } 
        },
        { 
          text: '운동하거나 자기계발 활동', 
          scores: { peaceful: 0, creative: 0, organized: 3, adventurous: 4, social: 0, ambitious: 5, healing: 1, curious: 2 } 
        },
      ]
    },
    {
      id: 2,
      question: '업무 스트레스가 심할 때?',
      options: [
        { 
          text: '혼자 조용히 쉬면서 회복', 
          scores: { peaceful: 5, creative: 1, organized: 1, adventurous: 0, social: 0, ambitious: 0, healing: 4, curious: 0 } 
        },
        { 
          text: '운동하거나 몸 움직이기', 
          scores: { peaceful: 0, creative: 0, organized: 1, adventurous: 5, social: 0, ambitious: 3, healing: 3, curious: 0 } 
        },
        { 
          text: '동료나 친구들에게 푸념하기', 
          scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 1, social: 5, ambitious: 0, healing: 2, curious: 0 } 
        },
        { 
          text: '업무 정리하고 해결방안 찾기', 
          scores: { peaceful: 1, creative: 0, organized: 5, adventurous: 0, social: 0, ambitious: 4, healing: 0, curious: 3 } 
        },
      ]
    },
    {
      id: 3,
      question: '회사에서 당신의 모습은?',
      options: [
        { 
          text: '조용히 업무에만 집중하는 편', 
          scores: { peaceful: 4, creative: 2, organized: 3, adventurous: 0, social: 0, ambitious: 2, healing: 1, curious: 3 } 
        },
        { 
          text: '동료들과 적극적으로 소통', 
          scores: { peaceful: 0, creative: 1, organized: 1, adventurous: 2, social: 5, ambitious: 2, healing: 3, curious: 0 } 
        },
        { 
          text: '목표 달성을 위해 열심히 일함', 
          scores: { peaceful: 0, creative: 0, organized: 4, adventurous: 2, social: 1, ambitious: 5, healing: 0, curious: 2 } 
        },
        { 
          text: '새로운 방법을 시도하고 제안', 
          scores: { peaceful: 0, creative: 4, organized: 2, adventurous: 3, social: 1, ambitious: 3, healing: 0, curious: 5 } 
        },
      ]
    },
    {
      id: 4,
      question: '주말 오전, 어떻게 시작하나요?',
      options: [
        { 
          text: '알람 없이 늦잠 자기', 
          scores: { peaceful: 5, creative: 1, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 0 } 
        },
        { 
          text: '브런치 카페에서 여유롭게', 
          scores: { peaceful: 2, creative: 3, organized: 0, adventurous: 2, social: 3, ambitious: 0, healing: 2, curious: 1 } 
        },
        { 
          text: '운동이나 취미 활동으로 시작', 
          scores: { peaceful: 0, creative: 2, organized: 2, adventurous: 5, social: 1, ambitious: 4, healing: 2, curious: 1 } 
        },
        { 
          text: '주말 계획 점검하고 일정 소화', 
          scores: { peaceful: 0, creative: 0, organized: 5, adventurous: 1, social: 0, ambitious: 5, healing: 0, curious: 2 } 
        },
      ]
    },
    {
      id: 5,
      question: '연차를 쓴다면?',
      options: [
        { 
          text: '집에서 완전히 쉬기', 
          scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 5, curious: 0 } 
        },
        { 
          text: '여행이나 새로운 경험하기', 
          scores: { peaceful: 0, creative: 3, organized: 0, adventurous: 5, social: 2, ambitious: 1, healing: 2, curious: 3 } 
        },
        { 
          text: '밀린 개인 업무나 정리하기', 
          scores: { peaceful: 1, creative: 0, organized: 5, adventurous: 0, social: 0, ambitious: 4, healing: 0, curious: 1 } 
        },
        { 
          text: '관심 분야 배우거나 취미 즐기기', 
          scores: { peaceful: 2, creative: 5, organized: 1, adventurous: 1, social: 0, ambitious: 2, healing: 2, curious: 5 } 
        },
      ]
    },
    {
      id: 6,
      question: '이상적인 휴가 계획은?',
      options: [
        { 
          text: '조용한 곳에서 아무것도 안 하기', 
          scores: { peaceful: 5, creative: 1, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 5, curious: 0 } 
        },
        { 
          text: '액티비티나 새로운 경험 가득', 
          scores: { peaceful: 0, creative: 2, organized: 0, adventurous: 5, social: 3, ambitious: 3, healing: 0, curious: 3 } 
        },
        { 
          text: '효율적으로 명소 다 돌아보기', 
          scores: { peaceful: 0, creative: 0, organized: 5, adventurous: 2, social: 1, ambitious: 4, healing: 0, curious: 2 } 
        },
        { 
          text: '문화예술 중심의 감성 여행', 
          scores: { peaceful: 2, creative: 5, organized: 0, adventurous: 1, social: 1, ambitious: 1, healing: 3, curious: 4 } 
        },
      ]
    },
    {
      id: 7,
      question: '일과 삶의 균형에 대한 생각은?',
      options: [
        { 
          text: '퇴근 후엔 완전히 쉬는 게 중요', 
          scores: { peaceful: 5, creative: 1, organized: 0, adventurous: 0, social: 1, ambitious: 0, healing: 5, curious: 0 } 
        },
        { 
          text: '일도 중요하지만 성장도 중요', 
          scores: { peaceful: 0, creative: 2, organized: 3, adventurous: 2, social: 0, ambitious: 5, healing: 0, curious: 4 } 
        },
        { 
          text: '사람들과의 관계가 가장 중요', 
          scores: { peaceful: 1, creative: 1, organized: 0, adventurous: 2, social: 5, ambitious: 0, healing: 4, curious: 0 } 
        },
        { 
          text: '일과 취미를 조화롭게', 
          scores: { peaceful: 2, creative: 4, organized: 2, adventurous: 3, social: 1, ambitious: 2, healing: 2, curious: 3 } 
        },
      ]
    },
    {
      id: 8,
      question: '나에게 "잘 쉰 하루"란?',
      options: [
        { 
          text: '회사 생각 한 번도 안 하고 쉰 날', 
          scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 5, curious: 0 } 
        },
        { 
          text: '의미 있는 무언가를 이룬 날', 
          scores: { peaceful: 0, creative: 2, organized: 4, adventurous: 2, social: 0, ambitious: 5, healing: 0, curious: 3 } 
        },
        { 
          text: '소중한 사람들과 행복한 시간', 
          scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 2, social: 5, ambitious: 0, healing: 4, curious: 0 } 
        },
        { 
          text: '새로운 영감이나 배움이 있던 날', 
          scores: { peaceful: 1, creative: 5, organized: 1, adventurous: 1, social: 0, ambitious: 3, healing: 2, curious: 5 } 
        },
      ]
    }
  ]
};

const versionLabels = {
  highschool: '고등학생',
  college: '대학생',
  jobseeker: '취준생',
  worker: '직장인'
};

export default function EventTestPage() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'select' | 'quiz' | 'result' | 'submit'>('intro');
  const [selectedVersion, setSelectedVersion] = useState<TestVersion>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<BeaverType, number>>({
    peaceful: 0,
    creative: 0,
    organized: 0,
    adventurous: 0,
    social: 0,
    ambitious: 0,
    healing: 0,
    curious: 0
  });
  const [answersHistory, setAnswersHistory] = useState<Array<Record<BeaverType, number>>>([]);
  const [result, setResult] = useState<BeaverType | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>('forward');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = () => {
    setCurrentStep('select');
  };

  const handleVersionSelect = (version: TestVersion) => {
    setSelectedVersion(version);
    setCurrentStep('quiz');
  };

  const handleAnswer = (optionScores: Record<BeaverType, number>) => {
    setIsAnimating(true);
    setAnimationDirection('forward');

    setTimeout(() => {
      const newScores = { ...scores };
      Object.keys(optionScores).forEach((key) => {
        newScores[key as BeaverType] += optionScores[key as BeaverType];
      });
      
      setAnswersHistory([...answersHistory, optionScores]);
      setScores(newScores);

      const questions = questionsByVersion[selectedVersion!];
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // 결과 계산 - 최고 점수 유형 찾기
        const maxScore = Math.max(...Object.values(newScores));
        const resultType = (Object.keys(newScores) as BeaverType[]).find(
          (key) => newScores[key] === maxScore
        ) || 'peaceful';
        
        setResult(resultType);
        setCurrentStep('result');
      }

      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 300);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setIsAnimating(true);
      setAnimationDirection('backward');

      setTimeout(() => {
        const newHistory = [...answersHistory];
        const lastAnswer = newHistory.pop();
        
        if (lastAnswer) {
          const newScores = { ...scores };
          Object.keys(lastAnswer).forEach((key) => {
            newScores[key as BeaverType] -= lastAnswer[key as BeaverType];
          });
          
          setScores(newScores);
          setAnswersHistory(newHistory);
        }
        
        setCurrentQuestion(currentQuestion - 1);

        setTimeout(() => {
          setIsAnimating(false);
        }, 50);
      }, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = {
        name: formData.name,
        phone: formData.phone,
        testVersion: versionLabels[selectedVersion!],
        result: result ? beaverResults[result].name : '',
        resultType: result,
        timestamp: new Date().toISOString(),
        scores: scores
      };

      const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbxUcjD8m_y0MdVTNv3eAuKjnM9a0b7R2LD1_0wNPRy1lbaDa88BKFbHOY17sMUxR08hxA/exec';
      
      if (GOOGLE_SCRIPT_URL) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData)
        });
      }
      setCurrentStep('submit');
    } catch (error) {
      alert('제출 중 오류가 발생했습니다. 콘솔을 확인해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = () => {
    setCurrentStep('intro');
    setSelectedVersion(null);
    setCurrentQuestion(0);
    setScores({ peaceful: 0, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 0, curious: 0 });
    setAnswersHistory([]);
    setResult(null);
    setFormData({ name: '', phone: '' });
  };

  // 인트로 화면
  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="mb-6 inline-block bg-amber-50 border-2 border-amber-400 px-6 py-3 rounded-lg">
            <p className="text-amber-800 font-bold text-sm">
              이벤트 참여자 중 추첨하여 5,000원 상당 기프티콘 증정!
            </p>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            당신은 어떤 비버인가요?
          </h1>
          <p className="text-gray-600 leading-relaxed mb-4">
            비버하우스는 '쉼'에 대해 생각합니다.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            바쁘게 살아가는 하루 속에서, 우리는 각자 다른 방식으로 쉬고 있죠.
            <br />8가지 질문을 통해 지금의 당신과 가장 닮은 비버를 찾아보세요.
          </p>
          <button
            onClick={handleStart}
            className="bg-black text-white px-10 py-4 text-base font-medium hover:bg-gray-800 transition-colors rounded-lg"
          >
            시작하기
          </button>
        </div>
      </div>
    );
  }

  // 버전 선택 화면
  if (currentStep === 'select') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            현재 당신의 상황을 선택해주세요
          </h2>
          <p className="text-gray-600 text-center mb-10">
            상황에 맞는 질문으로 더 정확한 결과를 알려드려요
          </p>
          
          <div className="space-y-3">
            {Object.entries(versionLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => handleVersionSelect(key as TestVersion)}
                className="w-full px-8 py-6 border-2 border-gray-200 hover:border-black hover:bg-gray-50 transition-all text-lg font-medium rounded-lg"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 퀴즈 화면
  if (currentStep === 'quiz' && selectedVersion) {
    const questions = questionsByVersion[selectedVersion];
    const question = questions[currentQuestion];
    
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
        <div className="max-w-xl w-full">
          {/* 선택한 버전 표시 */}
          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              {versionLabels[selectedVersion]} 버전
            </span>
          </div>

          {/* 진행 바 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                {currentQuestion + 1} / {questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-300 ease-out"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* 질문 - 애니메이션 적용 */}
          <div
            className={`transition-all duration-300 ease-out ${
              isAnimating
                ? animationDirection === 'forward'
                  ? 'opacity-0 translate-x-10'
                  : 'opacity-0 -translate-x-10'
                : 'opacity-100 translate-x-0'
            }`}
          >
            <h2 className="text-xl md:text-2xl font-bold mb-8 leading-relaxed">
              {question.question}
            </h2>

            {/* 선택지 */}
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.scores)}
                  disabled={isAnimating}
                  className="w-full text-left px-6 py-5 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>

          {/* 뒤로가기 버튼 */}
          {currentQuestion > 0 && (
            <div className="mt-6">
              <button
                onClick={handlePrevious}
                disabled={isAnimating}
                className="text-gray-600 hover:text-black transition-colors text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>←</span>
                <span>이전 질문으로</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 결과 화면
  if (currentStep === 'result' && result && selectedVersion) {
    const beaverData = beaverResults[result];
    
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
          {/* 버전 표시 */}
          <div className="text-center mb-4">
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              {versionLabels[selectedVersion]} 버전
            </span>
          </div>

          {/* 결과 헤더 */}
          <div className="text-center mb-12 opacity-0 animate-fadeIn">
            <div className="text-6xl mb-4">{beaverData.emoji}</div>
            <div className="inline-block px-4 py-2 bg-black text-white text-sm font-medium mb-4 rounded-lg">
              당신의 비버 유형
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {beaverData.name}
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              {beaverData.description}
            </p>
            <div className="text-sm text-gray-500">
              비슷한 유형: {beaverData.celebrities.join(', ')}
            </div>
          </div>

          {/* 특성 */}
          <div className="mb-10">
            <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-black">
              주요 특성
            </h3>
            <ul className="space-y-3">
              {beaverData.traits.map((trait, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-black mr-3 mt-1">•</span>
                  <span className="text-gray-700">{trait}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 휴식 스타일 */}
          <div className="mb-10">
            <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-black">
              나만의 휴식 방법
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {beaverData.restStyle}
            </p>
          </div>

          {/* 추천 공간 */}
          <div className="mb-12">
            <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-black">
              추천 공간
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {beaverData.recommendation}
            </p>
          </div>

          {/* 이벤트 안내 */}
          <div className="mb-6 bg-amber-50 border-2 border-amber-400 p-4 rounded-lg">
            <p className="text-amber-800 text-sm text-center">
              <span className="font-bold">이벤트 참여 안내</span>
              <br />
              아래 정보를 입력하시면 추첨을 통해 5,000원 상당 기프티콘을 드립니다!
            </p>
          </div>

          {/* 정보 입력 폼 */}
          <div className="bg-gray-50 p-8 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-bold mb-6">결과를 저장하고 이벤트에 참여하세요</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">이름</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black rounded-lg"
                  placeholder="이름을 입력해주세요"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">전화번호</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black rounded-lg"
                  placeholder="010-0000-0000"
                  disabled={isSubmitting}
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-4 text-base font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg"
                >
                  {isSubmitting ? '제출 중...' : '제출하기'}
                </button>
              </div>
            </form>
          </div>

          {/* 다시하기 버튼 */}
          <div className="mt-6 text-center">
            <button
              onClick={handleRestart}
              className="text-gray-600 hover:text-black transition-colors text-sm underline"
            >
              테스트 다시하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 제출 완료 화면
  if (currentStep === 'submit') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center opacity-0 animate-fadeIn">
          <div className="mb-6">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            제출이 완료되었습니다
          </h2>
          <p className="text-gray-600 mb-2">
            소중한 참여 감사드립니다.
          </p>
          <p className="text-gray-600 mb-8">
            당첨자 발표는 추후 개별 연락을 통해 안내드리겠습니다.
          </p>
          <button
            onClick={handleRestart}
            className="bg-black text-white px-8 py-3 text-base font-medium hover:bg-gray-800 transition-colors rounded-lg"
          >
            처음으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return null;
}