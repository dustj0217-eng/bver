// app/game/chat/page.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Message, Choice, Dialogue } from './types';
import { useGameData } from './hooks/useGameData';
import ChatMessage from './components/ChatMessage';
import { 
  getGreetingByTime, 
  getRandomDialogue, 
  checkSpecialEvent,
  getDialogueById 
} from './data/dialogues';

type Theme = 'kakao' | 'line' | 'telegram' | 'beaver';

const themes = {
  kakao: {
    name: '카카오톡',
    bg: '#B2C7D9',
    myBubble: '#FFE500',
    myText: '#000000',
    otherBubble: '#FFFFFF',
    otherText: '#000000',
    header: '#FFFFFF',
    input: '#FFFFFF'
  },
  line: {
    name: 'LINE',
    bg: '#FFFFFF',
    myBubble: '#00B900',
    myText: '#FFFFFF',
    otherBubble: '#F0F0F0',
    otherText: '#000000',
    header: '#FFFFFF',
    input: '#FFFFFF'
  },
  telegram: {
    name: 'Telegram',
    bg: '#0F1419',
    myBubble: '#8774E1',
    myText: '#FFFFFF',
    otherBubble: '#2B5278',
    otherText: '#FFFFFF',
    header: '#212D3B',
    input: '#212D3B'
  },
  beaver: {
    name: '비버',
    bg: '#FFF8E7',
    myBubble: '#FFB84D',
    myText: '#000000',
    otherBubble: '#FFFFFF',
    otherText: '#000000',
    header: '#FFFFFF',
    input: '#FFFFFF'
  }
};

export default function ChatPage() {
  const router = useRouter();
  const { gameData, loading, increaseStat, incrementChatCount } = useGameData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>('kakao');
  const [currentChoices, setCurrentChoices] = useState<Choice[] | null>(null);
  const [currentDialogueId, setCurrentDialogueId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const theme = themes[currentTheme];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!loading && gameData && !initialized.current) {
      initialized.current = true;
      const specialEvent = checkSpecialEvent();
      const greeting = specialEvent || getGreetingByTime();
      
      const initMessage: Message = {
        id: '1',
        sender: 'beaver',
        text: greeting.text,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages([initMessage]);
      setCurrentChoices(greeting.choices || null);
      setCurrentDialogueId(greeting.id);
    }
  }, [loading, gameData]);

  const handleChoice = async (choice: Choice) => {
    const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    
    // 선택지 제거
    setCurrentChoices(null);
    
    // 사용자 메시지 추가 (내 말풍선)
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: choice.text,
      time: now,
    };

    setMessages(prev => [...prev, userMessage]);

    // 스탯 업데이트
    await increaseStat(choice.stat);
    await incrementChatCount();

    // 비버 응답 처리
    setIsTyping(true);
    
    setTimeout(() => {
      let nextDialogue: Dialogue | null = null;
      
      // nextDialogueId가 있으면 해당 대화를 찾음
      if (choice.nextDialogueId) {
        nextDialogue = getDialogueById(choice.nextDialogueId);
      } 
      // nextDialogueId가 없으면 랜덤 대화
      else {
        nextDialogue = getRandomDialogue(choice.stat);
      }

      // 대화를 찾지 못한 경우 처리
      if (!nextDialogue) {
        setIsTyping(false);
        setCurrentChoices(null);
        return;
      }

      const beaverMessage: Message = {
        id: `beaver-${Date.now()}`,
        sender: 'beaver',
        text: nextDialogue.text,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };
      
      setIsTyping(false);
      setMessages(prev => [...prev, beaverMessage]);
      
      // 엔딩 대화인 경우 선택지 표시 후 더 이상 진행 안 함
      if (nextDialogue.isEnding) {
        setCurrentChoices(nextDialogue.choices || null);
        setCurrentDialogueId(null); // 엔딩이므로 대화 ID 초기화
      } else {
        setCurrentChoices(nextDialogue.choices || null);
        setCurrentDialogueId(nextDialogue.id);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.bg }}>
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.bg }}>
        <div className="text-gray-500">로그인이 필요합니다</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: theme.bg }}>
      {/* 헤더 */}
      <div className="flex-shrink-0 sticky z-30 top-14 md:top-16" style={{ backgroundColor: theme.header }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="text-xl w-10"
          >
            ←
          </button>
          
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <Image
                src="/bver.png"
                alt="비버"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <div className="font-semibold">비버</div>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-xl w-10 text-right"
          >
            ⋮
          </button>
        </div>

        {/* 스탯바 */}
        <div className="px-4 pb-3">
          <div className="flex gap-3 text-xs">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span>친밀도</span>
                <span>{gameData.stats.affection}</span>
              </div>
              <div className="h-1 bg-black bg-opacity-10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-pink-500 transition-all duration-300"
                  style={{ width: `${gameData.stats.affection}%` }}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span>공감도</span>
                <span>{gameData.stats.empathy}</span>
              </div>
              <div className="h-1 bg-black bg-opacity-10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${gameData.stats.empathy}%` }}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span>반항도</span>
                <span>{gameData.stats.rebellion}</span>
              </div>
              <div className="h-1 bg-black bg-opacity-10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 transition-all duration-300"
                  style={{ width: `${gameData.stats.rebellion}%` }}
                />
              </div>
            </div>
          </div>
          <div className="text-right text-xs mt-1 opacity-60">
            Lv.{gameData.stats.level} · {gameData.stats.points}P
          </div>
        </div>
      </div>

      {/* 설정 패널 */}
      {showSettings && (
        <div 
          className="absolute top-16 right-4 z-40 rounded-lg p-4 min-w-[200px]"
          style={{ backgroundColor: theme.header }}
        >
          <div className="font-semibold mb-3">테마 설정</div>
          <div className="space-y-2">
            {(Object.keys(themes) as Theme[]).map((themeKey) => (
              <button
                key={themeKey}
                onClick={() => {
                  setCurrentTheme(themeKey);
                  setShowSettings(false);
                }}
                className="w-full text-left px-3 py-2 rounded transition-colors"
                style={{
                  backgroundColor: currentTheme === themeKey ? theme.myBubble : 'transparent',
                  color: currentTheme === themeKey ? theme.myText : 'inherit'
                }}
              >
                {themes[themeKey].name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-3 pb-32">
          <div className="text-xs text-center opacity-50 mb-4">
            💬 총 {messages.length}개의 메시지
          </div>
          
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              theme={theme}
            />
          ))}
          
          {/* 타이핑 인디케이터 */}
          {isTyping && (
            <div className="flex gap-2 items-end">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/bver.png"
                  alt="비버"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div 
                className="rounded-2xl px-4 py-3"
                style={{ backgroundColor: theme.otherBubble }}
              >
                <div className="flex gap-1">
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce" 
                    style={{ 
                      backgroundColor: theme.otherText,
                      opacity: 0.4,
                      animationDelay: '0ms' 
                    }} 
                  />
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce" 
                    style={{ 
                      backgroundColor: theme.otherText,
                      opacity: 0.4,
                      animationDelay: '150ms' 
                    }} 
                  />
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce" 
                    style={{ 
                      backgroundColor: theme.otherText,
                      opacity: 0.4,
                      animationDelay: '300ms' 
                    }} 
                  />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 하단 입력창 영역 (선택지 표시) */}
      <div className="fixed left-0 right-0 z-30 border-t bottom-[40px] md:bottom-0 bg-white"
        style={{
          backgroundColor: theme.input,
          borderColor: 'rgba(0,0,0,0.1)',
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-3">
          {currentChoices && currentChoices.length > 0 ? (
            <div className="space-y-2">
              {currentChoices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 active:scale-95"
                  style={{
                    backgroundColor: theme.bg,
                    color: theme.otherText,
                    opacity: 0.9
                  }}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          ) : (
            <div 
              className="w-full px-4 py-3 rounded-full text-center opacity-50"
              style={{
                backgroundColor: theme.bg,
                color: theme.otherText
              }}
            >
              메시지를 기다리는 중...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}