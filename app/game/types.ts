import { ReactNode } from "react";

// app/game/types.ts
export type StatType = 'affection' | 'empathy' | 'rebellion';

export interface Choice {
  id: string;
  text: string;
  stat: StatType;
  points?: number;
  nextDialogueId?: string; // 다음 대화 ID (특정 대화로 이동)
  isFarewell?: boolean;
}

export interface Dialogue {
  id: string;
  text: string;
  choices?: Choice[]; // optional로 변경 (엔딩 대화는 선택지가 없을 수도 있음)
  condition?: {
    stat?: StatType;
    minValue?: number;
  };
  time?: 'morning' | 'afternoon' | 'evening' | 'night';
  isEnding?: boolean; // 대화 세션의 마지막인지 여부
  isFarewell?: boolean;
}

export interface Message {
  id: string;
  sender: 'beaver' | 'user';
  text: string;
  time: string;
  choices?: Choice[];
}

export interface GameStats {
  level: number;
  affection: number;
  empathy: number;
  rebellion: number;
  points: number;
  exp: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement';
  requirement: {
    type: 'chat_count' | 'stat_level' | 'login_streak' | 'shop_visit' | 'choice_count';
    stat?: StatType;
    target: number;
  };
  reward: {
    points: number;
    title?: string;
  };
  progress: number;
  completed: boolean;
  claimed: boolean;
}

export interface ChatHistory {
  maxLoginStreak: ReactNode;
  lastChatTime: string;
  todayChats: number;
  totalChats: number;
  loginStreak: number;
  lastLoginDate: string;
}

export interface GameData {
  userId: string;
  stats: GameStats;
  missions: Mission[];
  chatHistory: ChatHistory;
  achievements: string[];
  lastUpdated: string;
}