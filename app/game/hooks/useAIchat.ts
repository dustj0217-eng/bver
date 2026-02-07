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
        throw new Error('AI 응답 실패');
      }

      const data = await response.json();

      // 스탯 변화 적용
      if (data.statChange && onStatChange) {
        onStatChange(data.statChange.stat, data.statChange.points);
      }

      return data.text;

    } catch (error) {
      console.error('AI Chat error:', error);
      return '(비버가 응답하지 않습니다...)';
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
  };
}