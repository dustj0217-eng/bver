'use client';

import { useState } from 'react';

type BeaverType =
  | 'peaceful' | 'creative' | 'organized' | 'adventurous'
  | 'social' | 'ambitious' | 'healing' | 'curious';

type TestVersion = 'highschool' | 'college' | 'jobseeker' | 'worker' | null;

interface BeaverResult {
  name: string;
  emoji: string;
  description: string;
  traits: string[];
  restStyle: string;
  recommendation: string;
  celebrities: string[];
  color: string;       // 유형별 배경색
  textColor: string;   // 대비 텍스트 색
  accentColor: string; // 포인트 색
}

// ─── 유형별 색상 팔레트 (8가지 각각 다른 분위기) ───
const beaverResults: Record<BeaverType, BeaverResult> = {
  peaceful: {
    name: '고요한 비버',
    emoji: '🌙',
    color: '#1C2B3A',
    textColor: '#E8EFF5',
    accentColor: '#7EB8D4',
    description: '당신은 고요함 속에서 진정한 휴식을 찾는 비버입니다. 아무것도 하지 않는 시간의 소중함을 아는 당신은, 번잡함에서 벗어나 나만의 공간에서 깊은 평온을 느낍니다.',
    traits: ['조용한 환경에서 에너지를 충전합니다', '혼자만의 시간을 소중히 여깁니다', '미니멀한 라이프스타일을 선호합니다', '느린 템포의 일상을 즐깁니다', '깊은 사색과 명상을 좋아합니다'],
    restStyle: '완전한 정적 속에서 아무 생각 없이 누워있거나, 창밖을 바라보며 멍때리는 시간. 명상 음악이나 백색소음과 함께하는 깊은 휴식.',
    recommendation: '조용한 카페 한 켠, 집 안의 가장 편안한 소파, 혹은 자연의 소리만 들리는 공원이 당신의 쉼터가 되어줄 거예요.',
    celebrities: ['IU', '공유', '수지']
  },
  creative: {
    name: '창의적인 비버',
    emoji: '🎨',
    color: '#2D1B4E',
    textColor: '#F0E8FF',
    accentColor: '#C084FC',
    description: '당신은 영감과 자극 속에서 쉬는 독특한 비버입니다. 새로운 콘텐츠를 접하고, 아름다운 것을 감상하며, 상상력을 자유롭게 펼칠 때 진정으로 재충전됩니다.',
    traits: ['영화, 음악, 예술에서 위로를 받습니다', '새로운 아이디어에 호기심이 많습니다', '감각적이고 미적인 경험을 즐깁니다', '영감을 주는 공간과 분위기를 좋아합니다', '상상력과 창의성을 발휘하는 활동을 선호합니다'],
    restStyle: '좋아하는 영화나 시리즈를 정주행하거나, 전시회를 둘러보고, 새로운 음악을 발견하는 시간.',
    recommendation: '북카페, 미술관, 감각적인 인테리어의 공간들이 당신에게 휴식과 동시에 영감을 선물할 거예요.',
    celebrities: ['BTS RM', '아이유', '박보검']
  },
  organized: {
    name: '정돈된 비버',
    emoji: '📋',
    color: '#1A3A2A',
    textColor: '#E8F5EE',
    accentColor: '#4ADE80',
    description: '당신은 질서와 계획 속에서 마음의 평화를 얻는 비버입니다. 할 일을 정리하고, 공간을 깔끔하게 만들고, 내일을 준비할 때 비로소 진정한 안정감을 느낍니다.',
    traits: ['정리정돈된 환경을 선호합니다', '계획을 세우면 마음이 편안해집니다', '생산적인 휴식을 추구합니다', '루틴과 규칙성을 중요하게 여깁니다', '체크리스트를 완료하면 성취감을 느낍니다'],
    restStyle: '다이어리를 정리하고, 방을 깔끔하게 청소하며, 다음 주 계획을 차분히 세우는 시간.',
    recommendation: '잘 정돈된 서재, 조용한 스터디 카페, 혹은 체계적으로 정리된 나만의 작업 공간이 당신의 안식처가 될 거예요.',
    celebrities: ['송중기', '김연아', '유재석']
  },
  adventurous: {
    name: '활동적인 비버',
    emoji: '⛰️',
    color: '#3A1A0A',
    textColor: '#FFF0E8',
    accentColor: '#FB923C',
    description: '당신은 움직임과 변화 속에서 활력을 찾는 비버입니다. 가만히 있는 것보다 가벼운 산책, 새로운 장소 탐험, 몸을 움직이는 활동을 통해 진정한 재충전을 경험합니다.',
    traits: ['실외 활동으로 스트레스를 해소합니다', '새로운 장소를 탐험하는 것을 좋아합니다', '신체 활동 후 상쾌함을 느낍니다', '정적인 휴식보다 동적인 재충전을 선호합니다', '즉흥적이고 자유로운 활동을 즐깁니다'],
    restStyle: '동네를 산책하거나, 자전거를 타고, 가까운 카페나 공원을 찾아 나서는 시간.',
    recommendation: '산책로, 강변 공원, 작은 동네 골목길, 혹은 처음 가보는 카페들이 당신에게 새로운 에너지를 줄 거예요.',
    celebrities: ['박나래', '전현무', '이효리']
  },
  social: {
    name: '사교적인 비버',
    emoji: '🤝',
    color: '#3A2A0A',
    textColor: '#FFF8E8',
    accentColor: '#FBBF24',
    description: '당신은 사람들과의 교류 속에서 에너지를 얻는 비버입니다. 친구들과 대화하고, 웃고, 함께 시간을 보낼 때 진정한 휴식을 느낍니다.',
    traits: ['사람들과 함께 있을 때 에너지를 얻습니다', '대화와 소통을 통해 스트레스를 해소합니다', '친구들의 고민을 들어주는 것을 좋아합니다', '혼자보다는 함께하는 활동을 선호합니다', '새로운 사람을 만나는 것에 부담이 없습니다'],
    restStyle: '친구들과 카페에서 수다 떨거나, 함께 맛있는 음식을 먹으며 이야기 나누는 시간.',
    recommendation: '친구들과 갈 수 있는 브런치 카페, 분위기 좋은 레스토랑, 혹은 편하게 이야기 나눌 수 있는 바가 당신의 쉼터예요.',
    celebrities: ['유재석', '박나래', '김숙']
  },
  ambitious: {
    name: '열정적인 비버',
    emoji: '🔥',
    color: '#3A0A0A',
    textColor: '#FFE8E8',
    accentColor: '#F87171',
    description: '당신은 목표를 향해 달려가는 과정에서 살아있음을 느끼는 비버입니다. 휴식조차 생산적이고 의미 있어야 하며, 자기계발과 성장을 통해 재충전됩니다.',
    traits: ['자기계발 활동을 통해 에너지를 얻습니다', '목표 달성 시 큰 만족감을 느낍니다', '생산적인 활동을 선호합니다', '새로운 도전을 즐깁니다', '성장과 발전을 중요하게 여깁니다'],
    restStyle: '자격증 공부, 온라인 강의 수강, 독서, 운동 같은 자기계발 활동.',
    recommendation: '북카페, 스터디 카페, 피트니스 센터, 혹은 세미나나 워크샵 같은 배움의 공간이 당신에게 힘을 줄 거예요.',
    celebrities: ['손흥민', 'BTS RM', '김연아']
  },
  healing: {
    name: '치유하는 비버',
    emoji: '🌿',
    color: '#0A2A1A',
    textColor: '#E8FFF4',
    accentColor: '#34D399',
    description: '당신은 자연과 따뜻함 속에서 치유되는 비버입니다. 공감 능력이 뛰어나고 감정적으로 섬세하며, 평온하고 안정적인 환경에서 마음의 상처를 치유합니다.',
    traits: ['자연 속에서 마음의 평화를 찾습니다', '감정을 충분히 느끼고 표현합니다', '따뜻하고 포근한 분위기를 좋아합니다', '명상, 요가 같은 힐링 활동을 즐깁니다', '자신과 타인에게 공감하고 위로합니다'],
    restStyle: '공원 산책, 반려동물과 시간 보내기, 따뜻한 차 마시기, 명상이나 요가.',
    recommendation: '숲길, 한적한 공원, 템플스테이, 힐링 카페, 혹은 따뜻한 햇살이 드는 창가가 당신의 안식처가 될 거예요.',
    celebrities: ['이효리', '정유미', '공유']
  },
  curious: {
    name: '탐구하는 비버',
    emoji: '🔍',
    color: '#1A1A3A',
    textColor: '#E8E8FF',
    accentColor: '#818CF8',
    description: '당신은 지적 호기심을 충족시키며 쉬는 비버입니다. 새로운 지식을 배우고, 흥미로운 주제를 탐구하며, 깊이 있는 사고를 할 때 진정한 재충전을 경험합니다.',
    traits: ['새로운 지식 습득에 흥미를 느낍니다', '깊이 있는 대화와 토론을 즐깁니다', '다큐멘터리나 교양 콘텐츠를 선호합니다', '복잡한 문제를 해결하는 것을 좋아합니다', '책 읽기와 글쓰기로 생각을 정리합니다'],
    restStyle: '흥미로운 책 읽기, 다큐멘터리 시청, 팟캐스트 듣기, 새로운 분야 공부하기.',
    recommendation: '서점, 도서관, 박물관, 과학관, 혹은 조용히 사색할 수 있는 북카페가 당신의 영감의 공간이 될 거예요.',
    celebrities: ['유시민', '알베르트 아인슈타인', '빌 게이츠']
  }
};

// ─── 질문 데이터 (원본 유지) ───
const questionsByVersion = {
  highschool: [
    { id: 1, question: '시험 기간이 끝난 주말, 가장 먼저 하고 싶은 일은?', options: [{ text: '아무 생각 없이 침대에 누워서 쉬기', scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 2, curious: 0 } }, { text: '밀린 드라마나 영화 정주행하기', scores: { peaceful: 1, creative: 4, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 1, curious: 2 } }, { text: '친구들이랑 놀러 나가기', scores: { peaceful: 0, creative: 0, organized: 0, adventurous: 4, social: 5, ambitious: 0, healing: 0, curious: 0 } }, { text: '밀린 공부 하거나 자격증 준비하기', scores: { peaceful: 0, creative: 0, organized: 4, adventurous: 0, social: 0, ambitious: 5, healing: 0, curious: 2 } }] },
    { id: 2, question: '혼자 있는 시간이 생겼을 때 주로 무엇을 하나요?', options: [{ text: '그냥 멍 때리거나 잠자기', scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 0 } }, { text: '그림 그리기, 음악 듣기 같은 취미 활동', scores: { peaceful: 2, creative: 5, organized: 0, adventurous: 0, social: 0, ambitious: 1, healing: 2, curious: 1 } }, { text: '플래너 정리하거나 방 청소하기', scores: { peaceful: 1, creative: 0, organized: 5, adventurous: 0, social: 0, ambitious: 3, healing: 0, curious: 0 } }, { text: '유튜브나 블로그에서 새로운 정보 찾아보기', scores: { peaceful: 0, creative: 2, organized: 0, adventurous: 1, social: 0, ambitious: 2, healing: 0, curious: 5 } }] },
    { id: 3, question: '친구들과의 관계에서 당신의 모습은?', options: [{ text: '소수의 친한 친구들과 깊은 대화 나누는 편', scores: { peaceful: 3, creative: 2, organized: 1, adventurous: 0, social: 2, ambitious: 0, healing: 4, curious: 2 } }, { text: '많은 사람들과 어울리며 에너지를 얻는 편', scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 4, social: 5, ambitious: 2, healing: 0, curious: 0 } }, { text: '친구들의 고민을 들어주는 상담역할', scores: { peaceful: 2, creative: 1, organized: 0, adventurous: 0, social: 3, ambitious: 0, healing: 5, curious: 1 } }, { text: '혼자 있는 시간이 더 편하고 좋은 편', scores: { peaceful: 5, creative: 3, organized: 2, adventurous: 0, social: 0, ambitious: 1, healing: 2, curious: 3 } }] },
    { id: 4, question: '스트레스를 받을 때 어떻게 해소하나요?', options: [{ text: '조용히 혼자 쉬면서 회복하기', scores: { peaceful: 5, creative: 1, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 1 } }, { text: '운동하거나 밖에 나가서 움직이기', scores: { peaceful: 0, creative: 0, organized: 1, adventurous: 5, social: 1, ambitious: 3, healing: 2, curious: 0 } }, { text: '친구들한테 이야기하고 공감받기', scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 1, social: 5, ambitious: 0, healing: 3, curious: 0 } }, { text: '할 일을 정리하고 하나씩 해결하기', scores: { peaceful: 1, creative: 0, organized: 5, adventurous: 0, social: 0, ambitious: 4, healing: 0, curious: 2 } }] },
    { id: 5, question: '주말에 가장 만족스러운 순간은?', options: [{ text: '아무 계획 없이 느긋하게 쉬었을 때', scores: { peaceful: 5, creative: 1, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 0 } }, { text: '새로운 경험이나 활동을 했을 때', scores: { peaceful: 0, creative: 3, organized: 0, adventurous: 5, social: 2, ambitious: 3, healing: 0, curious: 3 } }, { text: '좋아하는 사람들과 시간 보냈을 때', scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 2, social: 5, ambitious: 0, healing: 3, curious: 0 } }, { text: '계획한 일을 모두 완료했을 때', scores: { peaceful: 0, creative: 0, organized: 5, adventurous: 1, social: 0, ambitious: 5, healing: 0, curious: 1 } }] },
    { id: 6, question: '만약 하루 자유시간이 주어진다면?', options: [{ text: '집에서 편하게 쉬면서 보내기', scores: { peaceful: 5, creative: 2, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 2, curious: 1 } }, { text: '전시회, 공연 같은 문화생활 즐기기', scores: { peaceful: 1, creative: 5, organized: 0, adventurous: 2, social: 1, ambitious: 1, healing: 1, curious: 3 } }, { text: '친구들이랑 맛집 투어나 놀러가기', scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 4, social: 5, ambitious: 0, healing: 0, curious: 0 } }, { text: '흥미로운 책 읽거나 다큐 보기', scores: { peaceful: 3, creative: 2, organized: 1, adventurous: 0, social: 0, ambitious: 2, healing: 1, curious: 5 } }] },
    { id: 7, question: '이상적인 방학은 어떤 모습인가요?', options: [{ text: '아무 걱정 없이 푹 쉬는 방학', scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 4, curious: 0 } }, { text: '여행하고 새로운 곳 가보는 방학', scores: { peaceful: 0, creative: 3, organized: 0, adventurous: 5, social: 3, ambitious: 2, healing: 1, curious: 2 } }, { text: '자격증이나 공부하며 보내는 방학', scores: { peaceful: 0, creative: 0, organized: 4, adventurous: 0, social: 0, ambitious: 5, healing: 0, curious: 3 } }, { text: '취미나 관심사에 푹 빠지는 방학', scores: { peaceful: 2, creative: 5, organized: 0, adventurous: 1, social: 0, ambitious: 1, healing: 2, curious: 4 } }] },
    { id: 8, question: '나에게 "잘 쉰 하루"란?', options: [{ text: '아무것도 하지 않아도 괜찮았던 날', scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 4, curious: 0 } }, { text: '의미 있는 성취를 이룬 날', scores: { peaceful: 0, creative: 1, organized: 4, adventurous: 2, social: 0, ambitious: 5, healing: 0, curious: 2 } }, { text: '좋은 사람들과 행복한 시간을 보낸 날', scores: { peaceful: 0, creative: 2, organized: 0, adventurous: 2, social: 5, ambitious: 0, healing: 3, curious: 0 } }, { text: '새로운 것을 배우고 느낀 날', scores: { peaceful: 1, creative: 4, organized: 1, adventurous: 2, social: 0, ambitious: 3, healing: 1, curious: 5 } }] }
  ],
  college: [
    { id: 1, question: '시험이 끝난 후, 가장 먼저 하고 싶은 일은?', options: [{ text: '기숙사/자취방에서 푹 쉬기', scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 0 } }, { text: '밀린 넷플릭스나 예능 정주행', scores: { peaceful: 2, creative: 4, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 1, curious: 2 } }, { text: '친구들이랑 술자리나 모임 가기', scores: { peaceful: 0, creative: 0, organized: 0, adventurous: 3, social: 5, ambitious: 0, healing: 0, curious: 0 } }, { text: '자격증이나 어학 공부 시작하기', scores: { peaceful: 0, creative: 0, organized: 4, adventurous: 0, social: 0, ambitious: 5, healing: 0, curious: 3 } }] },
    { id: 2, question: '과제와 팀플로 지칠 때 어떻게 회복하나요?', options: [{ text: '혼자 조용히 있으면서 마음 정리하기', scores: { peaceful: 5, creative: 1, organized: 1, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 1 } }, { text: '운동하거나 밖에 나가서 활동하기', scores: { peaceful: 0, creative: 0, organized: 0, adventurous: 5, social: 1, ambitious: 3, healing: 2, curious: 0 } }, { text: '친구들한테 푸념하고 공감받기', scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 0, social: 5, ambitious: 0, healing: 2, curious: 0 } }, { text: '할 일 목록 만들고 체계적으로 정리', scores: { peaceful: 1, creative: 0, organized: 5, adventurous: 0, social: 0, ambitious: 4, healing: 0, curious: 2 } }] },
    { id: 3, question: '동아리/모임 활동에서 당신은?', options: [{ text: '참여는 하지만 깊게 관여하지 않는 편', scores: { peaceful: 4, creative: 2, organized: 1, adventurous: 0, social: 1, ambitious: 0, healing: 2, curious: 2 } }, { text: '적극적으로 참여하고 사람들과 어울림', scores: { peaceful: 0, creative: 1, organized: 1, adventurous: 4, social: 5, ambitious: 2, healing: 1, curious: 0 } }, { text: '기획하고 운영하는 역할을 맡는 편', scores: { peaceful: 0, creative: 2, organized: 5, adventurous: 2, social: 2, ambitious: 5, healing: 0, curious: 1 } }, { text: '관심 분야 중심으로 선택적 참여', scores: { peaceful: 2, creative: 3, organized: 2, adventurous: 1, social: 1, ambitious: 2, healing: 1, curious: 5 } }] },
    { id: 4, question: '수업 없는 날, 어떻게 보내나요?', options: [{ text: '늦잠 자고 느긋하게 일어나기', scores: { peaceful: 5, creative: 1, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 0 } }, { text: '카페 가서 공부하거나 작업하기', scores: { peaceful: 1, creative: 2, organized: 3, adventurous: 0, social: 1, ambitious: 4, healing: 0, curious: 3 } }, { text: '친구들 만나거나 캠퍼스 돌아다니기', scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 4, social: 5, ambitious: 0, healing: 1, curious: 1 } }, { text: '관심 있는 주제 공부하거나 책 읽기', scores: { peaceful: 3, creative: 3, organized: 2, adventurous: 0, social: 0, ambitious: 3, healing: 1, curious: 5 } }] },
    { id: 5, question: '방학 계획을 세운다면?', options: [{ text: '특별한 계획 없이 쉬면서 보내기', scores: { peaceful: 5, creative: 1, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 4, curious: 0 } }, { text: '여행이나 새로운 경험 많이 하기', scores: { peaceful: 0, creative: 3, organized: 0, adventurous: 5, social: 3, ambitious: 2, healing: 1, curious: 2 } }, { text: '자격증, 인턴 등 스펙 쌓기', scores: { peaceful: 0, creative: 0, organized: 5, adventurous: 1, social: 0, ambitious: 5, healing: 0, curious: 2 } }, { text: '취미나 관심사에 몰두하기', scores: { peaceful: 2, creative: 5, organized: 0, adventurous: 1, social: 0, ambitious: 2, healing: 2, curious: 4 } }] },
    { id: 6, question: '이상적인 주말은?', options: [{ text: '집/자취방에서 혼자 보내기', scores: { peaceful: 5, creative: 2, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 2, curious: 2 } }, { text: '친구들과 약속 잡고 나가기', scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 4, social: 5, ambitious: 0, healing: 1, curious: 0 } }, { text: '생산적인 활동 하면서 보내기', scores: { peaceful: 0, creative: 1, organized: 5, adventurous: 1, social: 0, ambitious: 5, healing: 0, curious: 3 } }, { text: '전시회, 공연 등 문화생활 즐기기', scores: { peaceful: 1, creative: 5, organized: 0, adventurous: 2, social: 2, ambitious: 1, healing: 2, curious: 4 } }] },
    { id: 7, question: '미래에 대해 생각할 때 당신은?', options: [{ text: '너무 멀리 생각하지 않고 현재에 집중', scores: { peaceful: 4, creative: 2, organized: 0, adventurous: 1, social: 1, ambitious: 0, healing: 4, curious: 1 } }, { text: '명확한 목표를 세우고 계획 수립', scores: { peaceful: 0, creative: 0, organized: 5, adventurous: 1, social: 0, ambitious: 5, healing: 0, curious: 2 } }, { text: '다양한 가능성을 열어두고 탐색', scores: { peaceful: 1, creative: 4, organized: 0, adventurous: 3, social: 1, ambitious: 2, healing: 1, curious: 5 } }, { text: '막연하지만 좋은 일이 있을 거라 믿음', scores: { peaceful: 3, creative: 3, organized: 0, adventurous: 2, social: 2, ambitious: 1, healing: 5, curious: 1 } }] },
    { id: 8, question: '나에게 "잘 쉰 하루"란?', options: [{ text: '과제 걱정 없이 완전히 쉰 날', scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 4, curious: 0 } }, { text: '의미 있는 무언가를 성취한 날', scores: { peaceful: 0, creative: 2, organized: 4, adventurous: 2, social: 0, ambitious: 5, healing: 0, curious: 3 } }, { text: '좋은 사람들과 즐거웠던 날', scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 3, social: 5, ambitious: 0, healing: 2, curious: 0 } }, { text: '새로운 영감이나 배움이 있었던 날', scores: { peaceful: 1, creative: 4, organized: 1, adventurous: 1, social: 0, ambitious: 3, healing: 1, curious: 5 } }] }
  ],
  jobseeker: [
    { id: 1, question: '서류 마감이 끝난 저녁, 가장 하고 싶은 건?', options: [{ text: '아무 생각 없이 누워서 쉬기', scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 0 } }, { text: '드라마나 영화 보면서 마음 달래기', scores: { peaceful: 2, creative: 4, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 1 } }, { text: '친구들 만나서 스트레스 풀기', scores: { peaceful: 0, creative: 0, organized: 0, adventurous: 3, social: 5, ambitious: 0, healing: 2, curious: 0 } }, { text: '다음 지원 일정 정리하기', scores: { peaceful: 0, creative: 0, organized: 5, adventurous: 0, social: 0, ambitious: 4, healing: 0, curious: 1 } }] },
    { id: 2, question: '면접 준비로 지칠 때?', options: [{ text: '혼자 조용히 마음 추스르기', scores: { peaceful: 5, creative: 1, organized: 1, adventurous: 0, social: 0, ambitious: 0, healing: 4, curious: 0 } }, { text: '산책하거나 운동으로 기분 전환', scores: { peaceful: 1, creative: 0, organized: 0, adventurous: 5, social: 0, ambitious: 2, healing: 3, curious: 0 } }, { text: '같이 준비하는 사람들과 이야기', scores: { peaceful: 0, creative: 0, organized: 0, adventurous: 1, social: 5, ambitious: 1, healing: 2, curious: 0 } }, { text: '준비 과정 점검하고 계획 재정비', scores: { peaceful: 0, creative: 0, organized: 5, adventurous: 0, social: 0, ambitious: 5, healing: 0, curious: 2 } }] },
    { id: 3, question: '긴 공백기에 당신은?', options: [{ text: '최대한 쉬면서 에너지 회복에 집중', scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 5, curious: 0 } }, { text: '부족한 스펙 보완하며 보내기', scores: { peaceful: 0, creative: 0, organized: 4, adventurous: 0, social: 0, ambitious: 5, healing: 0, curious: 3 } }, { text: '여행이나 새로운 경험 하기', scores: { peaceful: 0, creative: 3, organized: 0, adventurous: 5, social: 2, ambitious: 1, healing: 2, curious: 2 } }, { text: '관심 분야 공부하거나 취미 활동', scores: { peaceful: 2, creative: 5, organized: 1, adventurous: 1, social: 0, ambitious: 2, healing: 2, curious: 5 } }] },
    { id: 4, question: '일정 없는 오전, 어떻게 보내나요?', options: [{ text: '푹 자고 천천히 일어나기', scores: { peaceful: 5, creative: 1, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 0 } }, { text: '카페 가서 공부하거나 준비하기', scores: { peaceful: 1, creative: 1, organized: 4, adventurous: 0, social: 1, ambitious: 5, healing: 0, curious: 2 } }, { text: '운동이나 산책으로 시작하기', scores: { peaceful: 1, creative: 0, organized: 1, adventurous: 5, social: 0, ambitious: 3, healing: 4, curious: 0 } }, { text: '관심 있는 책이나 강의 듣기', scores: { peaceful: 2, creative: 3, organized: 2, adventurous: 0, social: 0, ambitious: 3, healing: 1, curious: 5 } }] },
    { id: 5, question: '취준 과정에서 가장 위로가 되는 건?', options: [{ text: '혼자만의 조용한 휴식 시간', scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 4, curious: 0 } }, { text: '좋아하는 취미나 콘텐츠', scores: { peaceful: 2, creative: 5, organized: 0, adventurous: 1, social: 0, ambitious: 0, healing: 3, curious: 3 } }, { text: '응원해주는 사람들과의 대화', scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 1, social: 5, ambitious: 0, healing: 4, curious: 0 } }, { text: '작은 성취라도 이루는 것', scores: { peaceful: 0, creative: 1, organized: 4, adventurous: 2, social: 0, ambitious: 5, healing: 1, curious: 2 } }] },
    { id: 6, question: '만약 하루 완전히 쉴 수 있다면?', options: [{ text: '집에서 아무것도 안 하고 쉬기', scores: { peaceful: 5, creative: 1, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 4, curious: 0 } }, { text: '미뤘던 문화생활 즐기기', scores: { peaceful: 1, creative: 5, organized: 0, adventurous: 2, social: 2, ambitious: 0, healing: 2, curious: 3 } }, { text: '친구들 만나서 수다 떨기', scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 3, social: 5, ambitious: 0, healing: 2, curious: 0 } }, { text: '평소 궁금했던 것 공부하기', scores: { peaceful: 2, creative: 2, organized: 2, adventurous: 0, social: 0, ambitious: 3, healing: 0, curious: 5 } }] },
    { id: 7, question: '불합격 통보를 받았을 때?', options: [{ text: '혼자 충분히 슬퍼하고 회복하기', scores: { peaceful: 4, creative: 1, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 5, curious: 0 } }, { text: '빠르게 다음 준비 시작하기', scores: { peaceful: 0, creative: 0, organized: 4, adventurous: 2, social: 0, ambitious: 5, healing: 0, curious: 1 } }, { text: '친구들에게 털어놓고 위로받기', scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 1, social: 5, ambitious: 0, healing: 4, curious: 0 } }, { text: '원인 분석하고 개선점 찾기', scores: { peaceful: 1, creative: 1, organized: 5, adventurous: 0, social: 0, ambitious: 4, healing: 0, curious: 4 } }] },
    { id: 8, question: '나에게 "잘 쉰 하루"란?', options: [{ text: '취준 생각 안 하고 완전히 쉰 날', scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 5, curious: 0 } }, { text: '계획한 준비를 잘 마친 날', scores: { peaceful: 0, creative: 0, organized: 5, adventurous: 1, social: 0, ambitious: 5, healing: 0, curious: 2 } }, { text: '좋은 사람들과 행복했던 날', scores: { peaceful: 0, creative: 2, organized: 0, adventurous: 2, social: 5, ambitious: 0, healing: 3, curious: 0 } }, { text: '새로운 배움이나 영감을 얻은 날', scores: { peaceful: 1, creative: 4, organized: 1, adventurous: 1, social: 0, ambitious: 3, healing: 1, curious: 5 } }] }
  ],
  worker: [
    { id: 1, question: '퇴근 후 집에 도착하면?', options: [{ text: '씻고 바로 침대에 쓰러지기', scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 0 } }, { text: '넷플릭스나 유튜브 켜기', scores: { peaceful: 2, creative: 4, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 2, curious: 2 } }, { text: '약속 나가거나 모임 참석', scores: { peaceful: 0, creative: 0, organized: 0, adventurous: 3, social: 5, ambitious: 1, healing: 0, curious: 0 } }, { text: '운동하거나 자기계발 활동', scores: { peaceful: 0, creative: 0, organized: 3, adventurous: 4, social: 0, ambitious: 5, healing: 1, curious: 2 } }] },
    { id: 2, question: '업무 스트레스가 심할 때?', options: [{ text: '혼자 조용히 쉬면서 회복', scores: { peaceful: 5, creative: 1, organized: 1, adventurous: 0, social: 0, ambitious: 0, healing: 4, curious: 0 } }, { text: '운동하거나 몸 움직이기', scores: { peaceful: 0, creative: 0, organized: 1, adventurous: 5, social: 0, ambitious: 3, healing: 3, curious: 0 } }, { text: '동료나 친구들에게 푸념하기', scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 1, social: 5, ambitious: 0, healing: 2, curious: 0 } }, { text: '업무 정리하고 해결방안 찾기', scores: { peaceful: 1, creative: 0, organized: 5, adventurous: 0, social: 0, ambitious: 4, healing: 0, curious: 3 } }] },
    { id: 3, question: '회사에서 당신의 모습은?', options: [{ text: '조용히 업무에만 집중하는 편', scores: { peaceful: 4, creative: 2, organized: 3, adventurous: 0, social: 0, ambitious: 2, healing: 1, curious: 3 } }, { text: '동료들과 적극적으로 소통', scores: { peaceful: 0, creative: 1, organized: 1, adventurous: 2, social: 5, ambitious: 2, healing: 3, curious: 0 } }, { text: '목표 달성을 위해 열심히 일함', scores: { peaceful: 0, creative: 0, organized: 4, adventurous: 2, social: 1, ambitious: 5, healing: 0, curious: 2 } }, { text: '새로운 방법을 시도하고 제안', scores: { peaceful: 0, creative: 4, organized: 2, adventurous: 3, social: 1, ambitious: 3, healing: 0, curious: 5 } }] },
    { id: 4, question: '주말 오전, 어떻게 시작하나요?', options: [{ text: '알람 없이 늦잠 자기', scores: { peaceful: 5, creative: 1, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 3, curious: 0 } }, { text: '브런치 카페에서 여유롭게', scores: { peaceful: 2, creative: 3, organized: 0, adventurous: 2, social: 3, ambitious: 0, healing: 2, curious: 1 } }, { text: '운동이나 취미 활동으로 시작', scores: { peaceful: 0, creative: 2, organized: 2, adventurous: 5, social: 1, ambitious: 4, healing: 2, curious: 1 } }, { text: '주말 계획 점검하고 일정 소화', scores: { peaceful: 0, creative: 0, organized: 5, adventurous: 1, social: 0, ambitious: 5, healing: 0, curious: 2 } }] },
    { id: 5, question: '연차를 쓴다면?', options: [{ text: '집에서 완전히 쉬기', scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 5, curious: 0 } }, { text: '여행이나 새로운 경험하기', scores: { peaceful: 0, creative: 3, organized: 0, adventurous: 5, social: 2, ambitious: 1, healing: 2, curious: 3 } }, { text: '밀린 개인 업무나 정리하기', scores: { peaceful: 1, creative: 0, organized: 5, adventurous: 0, social: 0, ambitious: 4, healing: 0, curious: 1 } }, { text: '관심 분야 배우거나 취미 즐기기', scores: { peaceful: 2, creative: 5, organized: 1, adventurous: 1, social: 0, ambitious: 2, healing: 2, curious: 5 } }] },
    { id: 6, question: '이상적인 휴가 계획은?', options: [{ text: '조용한 곳에서 아무것도 안 하기', scores: { peaceful: 5, creative: 1, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 5, curious: 0 } }, { text: '액티비티나 새로운 경험 가득', scores: { peaceful: 0, creative: 2, organized: 0, adventurous: 5, social: 3, ambitious: 3, healing: 0, curious: 3 } }, { text: '효율적으로 명소 다 돌아보기', scores: { peaceful: 0, creative: 0, organized: 5, adventurous: 2, social: 1, ambitious: 4, healing: 0, curious: 2 } }, { text: '문화예술 중심의 감성 여행', scores: { peaceful: 2, creative: 5, organized: 0, adventurous: 1, social: 1, ambitious: 1, healing: 3, curious: 4 } }] },
    { id: 7, question: '일과 삶의 균형에 대한 생각은?', options: [{ text: '퇴근 후엔 완전히 쉬는 게 중요', scores: { peaceful: 5, creative: 1, organized: 0, adventurous: 0, social: 1, ambitious: 0, healing: 5, curious: 0 } }, { text: '일도 중요하지만 성장도 중요', scores: { peaceful: 0, creative: 2, organized: 3, adventurous: 2, social: 0, ambitious: 5, healing: 0, curious: 4 } }, { text: '사람들과의 관계가 가장 중요', scores: { peaceful: 1, creative: 1, organized: 0, adventurous: 2, social: 5, ambitious: 0, healing: 4, curious: 0 } }, { text: '일과 취미를 조화롭게', scores: { peaceful: 2, creative: 4, organized: 2, adventurous: 3, social: 1, ambitious: 2, healing: 2, curious: 3 } }] },
    { id: 8, question: '나에게 "잘 쉰 하루"란?', options: [{ text: '회사 생각 한 번도 안 하고 쉰 날', scores: { peaceful: 5, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 5, curious: 0 } }, { text: '의미 있는 무언가를 이룬 날', scores: { peaceful: 0, creative: 2, organized: 4, adventurous: 2, social: 0, ambitious: 5, healing: 0, curious: 3 } }, { text: '소중한 사람들과 행복한 시간', scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 2, social: 5, ambitious: 0, healing: 4, curious: 0 } }, { text: '새로운 영감이나 배움이 있던 날', scores: { peaceful: 1, creative: 5, organized: 1, adventurous: 1, social: 0, ambitious: 3, healing: 2, curious: 5 } }] }
  ]
};

const versionLabels = {
  highschool: '고등학생',
  college: '대학생',
  jobseeker: '취준생',
  worker: '직장인'
};

const VERSION_ICONS: Record<string, string> = {
  highschool: '📚',
  college: '🎓',
  jobseeker: '💼',
  worker: '🖥️'
};

// ─── 공통 CSS ───
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Nanum+Gothic:wght@400;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #1E1C18;
    --cream: #FAFAF8;
    --gray-light: #F4F4F2;
    --gray-mid: #E0E0DC;
    --gray-text: #888884;
    --font-display: 'Black Han Sans', sans-serif;
    --font-body: 'Nanum Gothic', sans-serif;
  }

  body { background: var(--cream); font-family: var(--font-body); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scaleIn {
    0%   { opacity: 0; transform: scale(0.88); }
    70%  { transform: scale(1.03); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes fillBar {
    from { width: 0%; }
    to   { width: var(--target-width); }
  }

  .fade-up   { animation: fadeUp 0.5s ease both; }
  .fade-in   { animation: fadeIn 0.5s ease both; }
  .scale-in  { animation: scaleIn 0.55s cubic-bezier(.2,.8,.3,1.2) both; }

  /* 퀴즈 전환 */
  .quiz-enter  { animation: fadeUp 0.3s ease both; }
  .quiz-exit-f { animation: fadeUp 0.3s ease reverse both; }
  .quiz-exit-b { animation: fadeUp 0.3s ease reverse both; }

  /* 선택지 버튼 */
  .option-btn {
    width: 100%;
    text-align: left;
    padding: 18px 20px;
    border: 2px solid var(--gray-mid);
    background: #fff;
    font-family: var(--font-body);
    font-size: 15px;
    color: var(--ink);
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, transform 0.1s;
    line-height: 1.5;
    position: relative;
  }
  .option-btn::before {
    content: attr(data-index);
    font-family: var(--font-display);
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--gray-text);
    margin-right: 12px;
  }
  .option-btn:hover:not(:disabled) {
    border-color: var(--ink);
    background: var(--gray-light);
    transform: translateX(4px);
  }
  .option-btn:active:not(:disabled) {
    transform: translateX(2px) scale(0.99);
  }
  .option-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* 버전 선택 버튼 */
  .version-btn {
    width: 100%;
    padding: 20px 24px;
    border: 2px solid var(--gray-mid);
    background: #fff;
    font-family: var(--font-body);
    font-size: 17px;
    font-weight: 800;
    color: var(--ink);
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, transform 0.12s, box-shadow 0.12s;
    display: flex;
    align-items: center;
    gap: 14px;
    text-align: left;
  }
  .version-btn:hover {
    border-color: var(--ink);
    background: var(--gray-light);
    transform: translateX(6px);
    box-shadow: -4px 0 0 var(--ink);
  }

  /* 결과 특성 아이템 */
  .trait-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    font-size: 14px;
    line-height: 1.6;
    opacity: 0;
  }
  .trait-item.visible {
    animation: fadeUp 0.4s ease forwards;
  }

  /* 결과 폼 인풋 */
  .result-input {
    width: 100%;
    background: rgba(255,255,255,0.1);
    border: 2px solid rgba(255,255,255,0.2);
    padding: 14px 16px;
    font-family: var(--font-body);
    font-size: 15px;
    color: inherit;
    transition: border-color 0.15s;
  }
  .result-input:focus {
    outline: none;
    border-color: rgba(255,255,255,0.7);
    background: rgba(255,255,255,0.15);
  }
  .result-input::placeholder { color: rgba(255,255,255,0.4); }

  /* 제출 버튼 */
  .submit-btn {
    width: 100%;
    padding: 16px;
    font-family: var(--font-display);
    font-size: 20px;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s;
    border: none;
  }
  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.25);
  }
  .submit-btn:active:not(:disabled) {
    transform: translateY(1px);
  }
  .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
`;

export default function EventTestPage() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'select' | 'quiz' | 'result' | 'submit'>('intro');
  const [selectedVersion, setSelectedVersion] = useState<TestVersion>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<BeaverType, number>>({ peaceful: 0, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 0, curious: 0 });
  const [answersHistory, setAnswersHistory] = useState<Array<Record<BeaverType, number>>>([]);
  const [result, setResult] = useState<BeaverType | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>('forward');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = () => setCurrentStep('select');
  const handleVersionSelect = (version: TestVersion) => { setSelectedVersion(version); setCurrentStep('quiz'); };

  const handleAnswer = (optionScores: Record<BeaverType, number>) => {
    setIsAnimating(true);
    setAnimationDirection('forward');
    setTimeout(() => {
      const newScores = { ...scores };
      Object.keys(optionScores).forEach(k => { newScores[k as BeaverType] += optionScores[k as BeaverType]; });
      setAnswersHistory([...answersHistory, optionScores]);
      setScores(newScores);
      const questions = questionsByVersion[selectedVersion!];
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        const maxScore = Math.max(...Object.values(newScores));
        const resultType = (Object.keys(newScores) as BeaverType[]).find(k => newScores[k] === maxScore) || 'peaceful';
        setResult(resultType);
        setCurrentStep('result');
      }
      setTimeout(() => setIsAnimating(false), 50);
    }, 280);
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
          Object.keys(lastAnswer).forEach(k => { newScores[k as BeaverType] -= lastAnswer[k as BeaverType]; });
          setScores(newScores);
          setAnswersHistory(newHistory);
        }
        setCurrentQuestion(currentQuestion - 1);
        setTimeout(() => setIsAnimating(false), 50);
      }, 280);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbxUcjD8m_y0MdVTNv3eAuKjnM9a0b7R2LD1_0wNPRy1lbaDa88BKFbHOY17sMUxR08hxA/exec';
      await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: formData.name, phone: formData.phone, testVersion: versionLabels[selectedVersion!], result: result ? beaverResults[result].name : '', resultType: result, timestamp: new Date().toISOString(), scores }) });
      setCurrentStep('submit');
    } catch { alert('제출 중 오류가 발생했습니다.'); }
    finally { setIsSubmitting(false); }
  };

  const handleRestart = () => {
    setCurrentStep('intro'); setSelectedVersion(null); setCurrentQuestion(0);
    setScores({ peaceful: 0, creative: 0, organized: 0, adventurous: 0, social: 0, ambitious: 0, healing: 0, curious: 0 });
    setAnswersHistory([]); setResult(null); setFormData({ name: '', phone: '' });
  };

  // ── 공통 레이아웃 래퍼 ──
  const PageWrap = ({ children, bg = 'var(--cream)' }: { children: React.ReactNode; bg?: string }) => (
    <div style={{ minHeight: '100svh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: 'var(--font-body)' }}>
      {children}
    </div>
  );

  // ━━━ 인트로 ━━━
  if (currentStep === 'intro') return (
    <PageWrap>
      <style>{CSS}</style>
      <div style={{ maxWidth: 440, width: '100%' }}>
        {/* 이벤트 배지 */}
        <div className="fade-up" style={{ animationDelay: '0s', display: 'inline-block', background: '#1E1C18', color: '#E8C547', padding: '6px 16px', fontSize: 12, fontFamily: 'var(--font-display)', letterSpacing: '0.14em', marginBottom: 28 }}>
          EVENT · 참여자 추첨 기프티콘 증정
        </div>

        {/* 타이틀 */}
        <h1 className="fade-up" style={{ animationDelay: '0.1s', fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 11vw, 64px)', color: 'var(--ink)', lineHeight: 1.0, letterSpacing: '-0.02em', marginBottom: 24 }}>
          당신은<br />어떤<br /><span style={{ color: '#C94040' }}>비버</span>인가요?
        </h1>

        {/* 구분선 + 설명 */}
        <div className="fade-up" style={{ animationDelay: '0.2s' }}>
          <div style={{ width: 32, height: 3, background: 'var(--ink)', marginBottom: 20 }} />
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8, marginBottom: 8 }}>비버하우스는 '쉼'에 대해 생각합니다.</p>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8, marginBottom: 32 }}>
            바쁘게 살아가는 하루 속에서, 우리는 각자 다른 방식으로 쉬고 있죠.
            8가지 질문으로 지금의 당신과 가장 닮은 비버를 찾아보세요.
          </p>
        </div>

        <button
          className="fade-up"
          onClick={handleStart}
          style={{ animationDelay: '0.3s', background: 'var(--ink)', color: '#fff', border: 'none', padding: '16px 40px', fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: '0.06em', cursor: 'pointer', transition: 'transform 0.1s, box-shadow 0.1s' }}
          onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'translateY(-2px)'; (e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.transform = ''; (e.target as HTMLElement).style.boxShadow = ''; }}
        >
          시작하기
        </button>
      </div>
    </PageWrap>
  );

  // ━━━ 버전 선택 ━━━
  if (currentStep === 'select') return (
    <PageWrap>
      <style>{CSS}</style>
      <div style={{ maxWidth: 440, width: '100%' }}>
        <div className="fade-up" style={{ animationDelay: '0s', fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--gray-text)', marginBottom: 16 }}>
          STEP 1 · 상황 선택
        </div>
        <h2 className="fade-up" style={{ animationDelay: '0.1s', fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 7vw, 36px)', color: 'var(--ink)', lineHeight: 1.15, marginBottom: 8 }}>
          현재 당신의<br />상황을 선택해주세요
        </h2>
        <p className="fade-up" style={{ animationDelay: '0.15s', fontSize: 14, color: 'var(--gray-text)', marginBottom: 32 }}>
          상황에 맞는 질문으로 더 정확한 결과를 알려드려요
        </p>
        <div className="fade-up" style={{ animationDelay: '0.2s', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Object.entries(versionLabels).map(([key, label]) => (
            <button key={key} className="version-btn" onClick={() => handleVersionSelect(key as TestVersion)}>
              <span style={{ fontSize: 22 }}>{VERSION_ICONS[key]}</span>
              <span>{label}</span>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--gray-text)' }}>→</span>
            </button>
          ))}
        </div>
      </div>
    </PageWrap>
  );

  // ━━━ 퀴즈 ━━━
  if (currentStep === 'quiz' && selectedVersion) {
    const questions = questionsByVersion[selectedVersion];
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <PageWrap>
        <style>{CSS}</style>
        <div style={{ maxWidth: 520, width: '100%' }}>

          {/* 상단 메타 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.14em', color: 'var(--gray-text)' }}>
              {versionLabels[selectedVersion]} 버전
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--gray-text)' }}>
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>

          {/* 진행 바 — 두껍고 색 있게 */}
          <div style={{ position: 'relative', marginBottom: 36 }}>
            <div style={{ height: 6, background: 'var(--gray-mid)', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--ink)', width: `${progress}%`, transition: 'width 0.4s cubic-bezier(.4,0,.2,1)' }} />
            </div>
            {/* 퍼센트 표시 */}
            <div style={{ position: 'absolute', right: 0, top: 12, fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--gray-text)' }}>
              {Math.round(progress)}%
            </div>
          </div>

          {/* 질문 + 선택지 */}
          <div
            className={isAnimating ? (animationDirection === 'forward' ? 'quiz-exit-f' : 'quiz-exit-b') : 'quiz-enter'}
            key={currentQuestion}
          >
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 5vw, 26px)', color: 'var(--ink)', lineHeight: 1.35, marginBottom: 28 }}>
              {question.question}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {question.options.map((option, i) => (
                <button
                  key={i}
                  className="option-btn"
                  data-index={String.fromCharCode(65 + i)}
                  onClick={() => handleAnswer(option.scores)}
                  disabled={isAnimating}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>

          {/* 뒤로가기 */}
          {currentQuestion > 0 && (
            <button
              onClick={handlePrevious}
              disabled={isAnimating}
              style={{ marginTop: 24, background: 'none', border: 'none', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--gray-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-text)')}
            >
              ← 이전 질문으로
            </button>
          )}
        </div>
      </PageWrap>
    );
  }

  // ━━━ 결과 ━━━
  if (currentStep === 'result' && result && selectedVersion) {
    const d = beaverResults[result];

    return (
      <div style={{ minHeight: '100svh', background: d.color, fontFamily: 'var(--font-body)' }}>
        <style>{CSS}</style>

        <div style={{ maxWidth: 560, margin: '0 auto', padding: '60px 24px 80px' }}>

          {/* 유형 레이블 */}
          <div className="fade-up" style={{ animationDelay: '0s', display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: d.textColor, padding: '5px 14px', fontSize: 11, fontFamily: 'var(--font-display)', letterSpacing: '0.16em', marginBottom: 24 }}>
            {versionLabels[selectedVersion]} 버전 · 당신의 비버 유형
          </div>

          {/* 유형 이름 — 임팩트 있게 */}
          <h1 className="scale-in" style={{ animationDelay: '0.1s', fontFamily: 'var(--font-display)', fontSize: 'clamp(48px, 13vw, 80px)', color: d.accentColor, lineHeight: 1.0, letterSpacing: '-0.02em', marginBottom: 8 }}>
            {d.name}
          </h1>
          <div className="fade-up" style={{ animationDelay: '0.25s', width: 40, height: 4, background: d.accentColor, marginBottom: 24 }} />

          {/* 설명 */}
          <p className="fade-up" style={{ animationDelay: '0.3s', fontSize: 15, color: d.textColor, opacity: 0.85, lineHeight: 1.85, marginBottom: 40 }}>
            {d.description}
          </p>

          {/* 특성 */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.16em', color: d.accentColor, marginBottom: 16 }}>
              TRAITS
            </div>
            <div style={{ borderTop: `1px solid rgba(255,255,255,0.12)` }}>
              {d.traits.map((trait, i) => (
                <div key={i} className="trait-item visible" style={{ animationDelay: `${0.35 + i * 0.08}s`, color: d.textColor, borderBottomColor: 'rgba(255,255,255,0.1)' }}>
                  <span style={{ color: d.accentColor, marginTop: 2, flexShrink: 0 }}>—</span>
                  <span>{trait}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 휴식 스타일 / 추천 공간 */}
          {[{ label: 'REST STYLE', content: d.restStyle }, { label: 'RECOMMENDATION', content: d.recommendation }].map((sec, i) => (
            <div key={i} className="fade-up" style={{ animationDelay: `${0.7 + i * 0.1}s`, marginBottom: 28, padding: '20px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.18em', color: d.accentColor, marginBottom: 10 }}>{sec.label}</div>
              <p style={{ fontSize: 14, color: d.textColor, opacity: 0.8, lineHeight: 1.8 }}>{sec.content}</p>
            </div>
          ))}

          {/* 비슷한 유형 */}
          <div className="fade-up" style={{ animationDelay: '0.9s', fontSize: 12, color: d.textColor, opacity: 0.5, marginBottom: 48 }}>
            비슷한 유형 · {d.celebrities.join(', ')}
          </div>

          {/* 구분선 */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.15)', marginBottom: 40 }} />

          {/* 이벤트 폼 */}
          <div className="fade-up" style={{ animationDelay: '1.0s' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.16em', color: d.accentColor, marginBottom: 16 }}>
              EVENT ENTRY · 추첨으로 기프티콘 증정
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: d.textColor, marginBottom: 20 }}>
              결과를 저장하고<br />이벤트에 참여하세요
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--font-display)', letterSpacing: '0.12em', color: d.accentColor, marginBottom: 8 }}>이름</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="이름을 입력해주세요" className="result-input" disabled={isSubmitting} style={{ color: d.textColor }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--font-display)', letterSpacing: '0.12em', color: d.accentColor, marginBottom: 8 }}>전화번호</label>
                <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="010-0000-0000" className="result-input" disabled={isSubmitting} style={{ color: d.textColor }} />
              </div>
              <button type="submit" disabled={isSubmitting} className="submit-btn" style={{ background: d.accentColor, color: d.color, marginTop: 8 }}>
                {isSubmitting ? 'SUBMITTING...' : '제출하기'}
              </button>
            </form>

            <button onClick={handleRestart} style={{ marginTop: 20, background: 'none', border: 'none', fontFamily: 'var(--font-body)', fontSize: 13, color: d.textColor, opacity: 0.5, cursor: 'pointer', textDecoration: 'underline' }}>
              테스트 다시하기
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ━━━ 제출 완료 ━━━
  if (currentStep === 'submit') return (
    <PageWrap>
      <style>{CSS}</style>
      <div className="fade-in" style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 64, color: 'var(--ink)', lineHeight: 1, marginBottom: 16 }}>DONE.</div>
        <div style={{ width: 32, height: 3, background: 'var(--ink)', margin: '0 auto 24px' }} />
        <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8, marginBottom: 8 }}>소중한 참여 감사드립니다.</p>
        <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8, marginBottom: 36 }}>당첨자 발표는 추후 개별 연락을 통해 안내드리겠습니다.</p>
        <button
          onClick={handleRestart}
          style={{ background: 'var(--ink)', color: '#fff', border: 'none', padding: '14px 36px', fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.06em', cursor: 'pointer' }}
        >
          처음으로 돌아가기
        </button>
      </div>
    </PageWrap>
  );

  return null;
}