// app/game/hooks/useAIChat.ts

import { useState } from 'react';
import { Message } from '../types';

interface UseAIChatProps {
  stats: {
    affection: number;
    empathy: number;
    rebellion: number;
  };
  onStatChange?: (stat: 'affection' | 'empathy' | 'rebellion', points: number) => void;
}

export function useAIChat({ stats, onStatChange }: UseAIChatProps) {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (messages: Message[]) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.slice(-10), // 최근 10개 메시지만 전송
          stats,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'AI 응답 실패');
      }

      const data = await response.json();

      // 스탯 변화 적용
      if (data.statChange && onStatChange) {
        onStatChange(data.statChange.stat, data.statChange.points);
      }

      return data.text;

    } catch (error) {
      console.error('AI Chat error:', error);
      
      // 폴백 응답 - AI가 안 되면 기본 응답
      const fallbackResponses = [
        '아 그래? ㅋㅋ',
        '음.. 그렇구나',
        '나도 비슷해',
        '진짜?',
        '오 ㅋㅋㅋ',
        '그렇긴 하지',
        '맞아',
      ];
      
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)] + ' (AI 연결 안 됨)';
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
  };
}