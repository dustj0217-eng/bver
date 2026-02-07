// app/game/data/missions.ts
import { Mission } from '../types';

export const DAILY_MISSIONS: Omit<Mission, 'progress' | 'completed' | 'claimed'>[] = [
  {
    id: 'daily_chat_3',
    title: '비버와 수다 떨기',
    description: '비버와 3번 대화하기',
    type: 'daily',
    requirement: {
      type: 'chat_count',
      target: 3,
    },
    reward: {
      points: 5,
    },
  },
  {
    id: 'daily_login',
    title: '출석 체크',
    description: '오늘 접속하기',
    type: 'daily',
    requirement: {
      type: 'login_streak',
      target: 1,
    },
    reward: {
      points: 2,
    },
  },
  {
    id: 'daily_shop',
    title: '상점 둘러보기',
    description: '상점 페이지 방문하기',
    type: 'daily',
    requirement: {
      type: 'shop_visit',
      target: 1,
    },
    reward: {
      points: 2,
    },
  },
  {
    id: 'daily_choice_5',
    title: '진심 어린 대답',
    description: '선택지 5번 고르기',
    type: 'daily',
    requirement: {
      type: 'choice_count',
      target: 5,
    },
    reward: {
      points: 3,
    },
  },
];

export const WEEKLY_MISSIONS: Omit<Mission, 'progress' | 'completed' | 'claimed'>[] = [
  {
    id: 'weekly_login_7',
    title: '개근상',
    description: '7일 연속 접속하기',
    type: 'weekly',
    requirement: {
      type: 'login_streak',
      target: 7,
    },
    reward: {
      points: 30,
    },
  },
  {
    id: 'weekly_chat_20',
    title: '수다쟁이',
    description: '일주일간 20번 대화하기',
    type: 'weekly',
    requirement: {
      type: 'chat_count',
      target: 20,
    },
    reward: {
      points: 20,
    },
  },
];

export const ACHIEVEMENT_MISSIONS: Omit<Mission, 'progress' | 'completed' | 'claimed'>[] = [
  {
    id: 'ach_affection_50',
    title: '친구 됐어요',
    description: '친밀도 50 달성',
    type: 'achievement',
    requirement: {
      type: 'stat_level',
      stat: 'affection',
      target: 50,
    },
    reward: {
      points: 50,
      title: '비버의 친구',
    },
  },
  {
    id: 'ach_affection_100',
    title: '영혼의 동반자',
    description: '친밀도 100 달성',
    type: 'achievement',
    requirement: {
      type: 'stat_level',
      stat: 'affection',
      target: 100,
    },
    reward: {
      points: 100,
      title: '비버의 절친',
    },
  },
  {
    id: 'ach_empathy_50',
    title: '공감 능력자',
    description: '공감도 50 달성',
    type: 'achievement',
    requirement: {
      type: 'stat_level',
      stat: 'empathy',
      target: 50,
    },
    reward: {
      points: 50,
      title: '같은 처지',
    },
  },
  {
    id: 'ach_empathy_100',
    title: '완벽한 이해',
    description: '공감도 100 달성',
    type: 'achievement',
    requirement: {
      type: 'stat_level',
      stat: 'empathy',
      target: 100,
    },
    reward: {
      points: 100,
      title: '동병상련',
    },
  },
  {
    id: 'ach_rebellion_50',
    title: '저항하는 자',
    description: '반항도 50 달성',
    type: 'achievement',
    requirement: {
      type: 'stat_level',
      stat: 'rebellion',
      target: 50,
    },
    reward: {
      points: 50,
      title: '반항아',
    },
  },
  {
    id: 'ach_rebellion_100',
    title: '퇴사 각성',
    description: '반항도 100 달성',
    type: 'achievement',
    requirement: {
      type: 'stat_level',
      stat: 'rebellion',
      target: 100,
    },
    reward: {
      points: 100,
      title: '혁명가',
    },
  },
  {
    id: 'ach_level_10',
    title: '레벨업 마스터',
    description: '레벨 10 달성',
    type: 'achievement',
    requirement: {
      type: 'stat_level',
      stat: 'affection', // 더미
      target: 10,
    },
    reward: {
      points: 100,
    },
  },
  {
    id: 'ach_chat_100',
    title: '대화왕',
    description: '총 100번 대화하기',
    type: 'achievement',
    requirement: {
      type: 'chat_count',
      target: 100,
    },
    reward: {
      points: 200,
      title: '비버의 수다 파트너',
    },
  },
];

export const initializeMissions = (): Mission[] => {
  return [
    ...DAILY_MISSIONS.map(m => ({ ...m, progress: 0, completed: false, claimed: false })),
    ...WEEKLY_MISSIONS.map(m => ({ ...m, progress: 0, completed: false, claimed: false })),
    ...ACHIEVEMENT_MISSIONS.map(m => ({ ...m, progress: 0, completed: false, claimed: false })),
  ];
};