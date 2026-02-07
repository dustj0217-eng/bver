// app/game/components/ChatMessage.tsx
'use client';

import Image from 'next/image';
import { Message, Choice } from '../types';

interface ChatMessageProps {
  message: Message;
  onChoiceSelect?: (choice: Choice) => void;
  theme: {
    myBubble: string;
    myText: string;
    otherBubble: string;
    otherText: string;
  };
}

export default function ChatMessage({ message, onChoiceSelect, theme }: ChatMessageProps) {
  return (
    <div>
      {message.sender === 'beaver' ? (
        // 비버 메시지 (왼쪽)
        <div className="flex gap-2 items-end">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/bver.png"
              alt="비버"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col items-start max-w-[70%]">
            <div 
              className="rounded-2xl px-4 py-2"
              style={{ 
                backgroundColor: theme.otherBubble,
                color: theme.otherText 
              }}
            >
              <div className="whitespace-pre-wrap">{message.text}</div>
            </div>
            <div className="text-xs opacity-50 mt-1 px-1">
              {message.time}
            </div>
          </div>
        </div>
      ) : (
        // 사용자 메시지 (오른쪽)
        <div className="flex gap-2 items-end justify-end">
          <div className="flex flex-col items-end max-w-[70%]">
            <div 
              className="rounded-2xl px-4 py-2"
              style={{ 
                backgroundColor: theme.myBubble,
                color: theme.myText 
              }}
            >
              <div className="whitespace-pre-wrap">{message.text}</div>
            </div>
            <div className="text-xs opacity-50 mt-1 px-1">
              {message.time}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}