// app/game/chat/page.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Message, Choice, Dialogue } from '../types';
import { useGameData } from '../hooks/useGameData';
import { useAIChat } from '../hooks/useAIchat';
import ChatMessage from '../components/ChatMessage';
import { 
  getGreetingByTime, 
  getRandomDialogue, 
  checkSpecialEvent,
  getDialogueById 
} from '../data/dialogues';

type Theme = 'kakao' | 'line' | 'telegram' | 'beaver';
type ChatMode = 'scripted' | 'free'; // 대화 모드: 스크립트 or 자유

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
  const [chatMode, setChatMode] = useState<ChatMode>('scripted');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const theme = themes[currentTheme];

  // AI 채팅 훅
  const { sendMessage: sendAIMessage, isLoading: aiLoading } = useAIChat({
    stats: gameData?.stats || { affection: 0, empathy: 0, rebellion: 0 },
    onStatChange: async (stat, points) => {
      await increaseStat(stat);
    },
  });

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
      
      // 선택지에 "자유롭게 대화하기" 옵션 추가
      const extendedChoices = [
        ...(greeting.choices || []),
        {
          id: 'free-mode',
          text: '💬 자유롭게 대화하기',
          stat: 'affection' as const,
          nextDialogueId: undefined
        }
      ];
      
      setCurrentChoices(extendedChoices);
      setCurrentDialogueId(greeting.id);
    }
  }, [loading, gameData]);

  // 스크립트 선택지 처리
  const handleChoice = async (choice: Choice) => {
    const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    
    setCurrentChoices(null);
    
    // "자유롭게 대화하기" 선택 시 바로 자유 모드로
    if (choice.id === 'free-mode') {
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: choice.text,
        time: now,
      };
      setMessages(prev => [...prev, userMessage]);
      
      const beaverResponse: Message = {
        id: `beaver-${Date.now()}`,
        sender: 'beaver',
        text: '오 그래? 뭐든 편하게 얘기해~',
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, beaverResponse]);
        setChatMode('free');
      }, 800);
      
      return;
    }
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: choice.text,
      time: now,
    };

    setMessages(prev => [...prev, userMessage]);

    await increaseStat(choice.stat);
    await incrementChatCount();

    setIsTyping(true);
    
    setTimeout(() => {
      let nextDialogue: Dialogue | null = null;
      
      if (choice.nextDialogueId) {
        nextDialogue = getDialogueById(choice.nextDialogueId);
      } else {
        nextDialogue = getRandomDialogue(choice.stat);
      }

      if (!nextDialogue) {
        setIsTyping(false);
        setCurrentChoices(null);
        // 스크립트가 끝나면 자유 모드로 전환
        setChatMode('free');
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
      
      if (nextDialogue.isEnding) {
        // 엔딩 선택지에도 "자유 대화" 옵션 추가
        const endingChoices = [
          ...(nextDialogue.choices || []),
          {
            id: 'free-mode',
            text: '💬 자유롭게 대화하기',
            stat: 'affection' as const,
          }
        ];
        setCurrentChoices(endingChoices);
        setCurrentDialogueId(null);
      } else {
        // 일반 선택지에도 "자유 대화" 옵션 추가
        const regularChoices = [
          ...(nextDialogue.choices || []),
          {
            id: 'free-mode',
            text: '💬 자유롭게 대화하기',
            stat: 'affection' as const,
          }
        ];
        setCurrentChoices(regularChoices);
        setCurrentDialogueId(nextDialogue.id);
      }
    }, 1500);
  };

  // 자유 입력 처리
  const handleFreeInput = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;

    const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputText,
      time: now,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    await incrementChatCount();

    setIsTyping(true);

    // AI 응답 받기
    const newMessages = [...messages, userMessage];
    const aiResponse = await sendAIMessage(newMessages);

    setIsTyping(false);

    const beaverMessage: Message = {
      id: `beaver-${Date.now()}`,
      sender: 'beaver',
      text: aiResponse,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, beaverMessage]);
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
              <div className="text-xs opacity-60">
                {chatMode === 'scripted' ? '스토리 모드' : 'AI 채팅'}
              </div>
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
          <div className="font-semibold mb-3">설정</div>
          
          {/* 대화 모드 전환 */}
          <div className="mb-4">
            <div className="text-sm mb-2">대화 모드</div>
            <button
              onClick={() => {
                setChatMode(chatMode === 'scripted' ? 'free' : 'scripted');
                setShowSettings(false);
              }}
              className="w-full text-left px-3 py-2 rounded bg-opacity-10"
              style={{ backgroundColor: theme.myBubble }}
            >
              {chatMode === 'scripted' ? '자유 채팅으로 전환' : '스토리로 돌아가기'}
            </button>
          </div>

          {/* 테마 설정 */}
          <div className="font-semibold mb-2">테마</div>
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
          {(isTyping || aiLoading) && (
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

      {/* 하단 입력창 영역 */}
      <div className="fixed left-0 right-0 z-30 border-t bottom-[40px] md:bottom-0 bg-white"
        style={{
          backgroundColor: theme.input,
          borderColor: 'rgba(0,0,0,0.1)',
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-3">
          {chatMode === 'scripted' && currentChoices && currentChoices.length > 0 ? (
            // 스크립트 모드: 선택지 버튼
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
          ) : chatMode === 'free' ? (
            // 자유 모드: 입력창
            <form onSubmit={handleFreeInput} className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-4 py-3 rounded-full outline-none"
                style={{
                  backgroundColor: theme.bg,
                  color: theme.otherText,
                }}
                disabled={aiLoading}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || aiLoading}
                className="px-6 py-3 rounded-full font-semibold transition-all active:scale-95 disabled:opacity-50"
                style={{
                  backgroundColor: theme.myBubble,
                  color: theme.myText,
                }}
              >
                전송
              </button>
            </form>
          ) : (
            // 대기 중
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