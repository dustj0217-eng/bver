// app/game/hooks/useBeaverInitiative.ts

import { useEffect, useState } from 'react';
import { Message } from '../types';

interface UseBeaverInitiativeProps {
  enabled: boolean;
  stats: {
    affection: number;
    empathy: number;
    rebellion: number;
  };
  onNewMessage: (message: Message) => void;
}

export function useBeaverInitiative({ enabled, stats, onNewMessage }: UseBeaverInitiativeProps) {
  const [lastMessageTime, setLastMessageTime] = useState(Date.now());

  useEffect(() => {
    if (!enabled) return;

    // 30분 ~ 2시간 사이에 랜덤하게 비버가 먼저 톡 보냄
    const minDelay = 30 * 60 * 1000; // 30분
    const maxDelay = 120 * 60 * 1000; // 2시간
    const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;

    const timer = setTimeout(() => {
      sendBeaverMessage();
    }, randomDelay);

    return () => clearTimeout(timer);
  }, [lastMessageTime, enabled]);

  const sendBeaverMessage = async () => {
    const messages = generateRandomMessage(stats);
    
    const beaverMessage: Message = {
      id: `beaver-initiative-${Date.now()}`,
      sender: 'beaver',
      text: messages,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    onNewMessage(beaverMessage);
    setLastMessageTime(Date.now());
  };

  return { lastMessageTime };
}

function generateRandomMessage(stats: { affection: number; empathy: number; rebellion: number }): string {
  const { affection, rebellion } = stats;

  const messages = {
    high_affection: [
      '야 심심해... 뭐해?',
      '오늘 점심 뭐 먹었어?',
      '나 지금 커피 마시는 중ㅋㅋ',
      '회의 끝났다 ㅠㅠ 드디어',
      '너 요즘 어때?',
    ],
    medium_affection: [
      '야',
      '뭐해',
      '밥 먹었어?',
      '퇴근 언제해',
    ],
    high_rebellion: [
      '하... 오늘도 최악이네',
      '일 진짜 안 하고 싶다',
      'ㅈㄴ 짜증나',
      '상사 진짜...',
    ],
  };

  if (rebellion > 60) {
    return messages.high_rebellion[Math.floor(Math.random() * messages.high_rebellion.length)];
  } else if (affection > 60) {
    return messages.high_affection[Math.floor(Math.random() * messages.high_affection.length)];
  } else {
    return messages.medium_affection[Math.floor(Math.random() * messages.medium_affection.length)];
  }
}