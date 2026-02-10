// app/game/chat/page.tsx (최종 개선 버전)

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
  getDialogueById,
  getRandomFarewell
} from '../data/dialogues';

type Theme = 'kakao' | 'line' | 'instagram' | 'discord' | 'beaver';
type ChatMode = 'scripted' | 'free';
type ConversationState = 'active' | 'ended';

interface ChatStorage {
  messages: Message[];
  lastChatTime: number;
  conversationState: ConversationState;
  currentDialogueId: string | null;
}

const themes = {
  kakao: {
    name: '카카오톡',
    bg: '#B2C7D9',
    myBubble: '#FFE500',
    myText: '#000000',
    otherBubble: '#FFFFFF',
    otherText: '#000000',
    header: '#FFFFFF',
    headerText: '#000000',
    input: '#FFFFFF',
    inputText: '#000000',
    border: 'rgba(0,0,0,0.1)'
  },
  line: {
    name: 'LINE',
    bg: '#FFFFFF',
    myBubble: '#00B900',
    myText: '#FFFFFF',
    otherBubble: '#F0F0F0',
    otherText: '#000000',
    header: '#FFFFFF',
    headerText: '#000000',
    input: '#FFFFFF',
    inputText: '#000000',
    border: 'rgba(0,0,0,0.1)'
  },
  instagram: {
    name: 'Instagram',
    bg: '#FFFFFF',
    myBubble: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    myText: '#FFFFFF',
    otherBubble: '#EFEFEF',
    otherText: '#000000',
    header: '#FFFFFF',
    headerText: '#000000',
    input: '#FFFFFF',
    inputText: '#000000',
    border: 'rgba(0,0,0,0.1)'
  },
  discord: {
    name: 'Discord',
    bg: '#36393F',
    myBubble: '#5865F2',
    myText: '#FFFFFF',
    otherBubble: '#40444B',
    otherText: '#DCDDDE',
    header: '#202225',
    headerText: '#FFFFFF',
    input: '#40444B',
    inputText: '#DCDDDE',
    border: 'rgba(0,0,0,0.3)'
  },
  beaver: {
    name: '비버톡',
    bg: '#FFF8E7',
    myBubble: '#FFB84D',
    myText: '#000000',
    otherBubble: '#FFFFFF',
    otherText: '#000000',
    header: '#FFB84D',
    headerText: '#000000',
    input: '#FFFFFF',
    inputText: '#000000',
    border: 'rgba(255,184,77,0.3)'
  }
};

// 로컬 스토리지 키
const STORAGE_KEY = 'beaver_chat_data';

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
  const [conversationState, setConversationState] = useState<ConversationState>('active');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const beaverMessageTimer = useRef<NodeJS.Timeout | null>(null);

  const theme = themes[currentTheme];

  const { sendMessage: sendAIMessage, isLoading: aiLoading } = useAIChat({
    stats: gameData?.stats || { affection: 0, empathy: 0, rebellion: 0 },
    onStatChange: async (stat, points) => {
      await increaseStat(stat);
    },
  });

  // 선택지 애니메이션
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // 로컬 스토리지 저장
  const saveChatData = (data: Partial<ChatStorage>) => {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      const current: ChatStorage = existing ? JSON.parse(existing) : {
        messages: [],
        lastChatTime: Date.now(),
        conversationState: 'active',
        currentDialogueId: null
      };

      const updated = { ...current, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('로컬 스토리지 저장 실패:', error);
    }
  };

  // 로컬 스토리지 불러오기
  const loadChatData = (): ChatStorage | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('로컬 스토리지 불러오기 실패:', error);
      return null;
    }
  };

  // 비버가 먼저 말 거는 함수
  const beaverInitiateChat = () => {
    if (conversationState === 'ended') {
      // 대화가 종료 상태면 새로운 대화 시작
      const specialEvent = checkSpecialEvent();
      const greeting = specialEvent || getGreetingByTime();
      
      const initMessage: Message = {
        id: `beaver-${Date.now()}`,
        sender: 'beaver',
        text: greeting.text,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages(prev => [...prev, initMessage]);
      setCurrentChoices(greeting.choices || []);
      setCurrentDialogueId(greeting.id);
      setConversationState('active');
      saveChatData({
        messages: [...messages, initMessage],
        conversationState: 'active',
        currentDialogueId: greeting.id,
        lastChatTime: Date.now()
      });
    }
  };

  // 시간 기반 비버 메시지 스케줄링
  const scheduleBeaverMessage = () => {
    if (beaverMessageTimer.current) {
      clearTimeout(beaverMessageTimer.current);
    }

    // 5-15분 랜덤 간격 (개발 중에는 짧게: 30초-2분)
    const minDelay = 30 * 1000; // 30초
    const maxDelay = 2 * 60 * 1000; // 2분
    // 실제 배포 시: const minDelay = 5 * 60 * 1000; // 5분
    // 실제 배포 시: const maxDelay = 15 * 60 * 1000; // 15분
    
    const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;

    beaverMessageTimer.current = setTimeout(() => {
      beaverInitiateChat();
      scheduleBeaverMessage(); // 다음 메시지 예약
    }, randomDelay);
  };

  // 시간대별 자동 메시지 체크
  const checkScheduledMessages = () => {
    const hour = new Date().getHours();
    const savedData = loadChatData();
    
    // 마지막 대화 시간 체크
    if (!savedData || !savedData.lastChatTime) return;
    
    const lastChatDate = new Date(savedData.lastChatTime);
    const lastChatHour = lastChatDate.getHours();
    
    // 시간대가 바뀌었고, 특정 시간대일 때 메시지 보내기
    const scheduleHours = [8, 12, 15, 18, 22]; // 출근, 점심, 오후, 퇴근, 밤
    
    if (scheduleHours.includes(hour) && lastChatHour !== hour) {
      beaverInitiateChat();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentChoices]);

  // 초기화 (로컬 스토리지에서 복원)
  useEffect(() => {
    if (!loading && gameData && !initialized.current) {
      initialized.current = true;
      
      const savedData = loadChatData();
      
      if (savedData && savedData.messages.length > 0) {
        // 기존 대화 복원
        setMessages(savedData.messages);
        setConversationState(savedData.conversationState);
        setCurrentDialogueId(savedData.currentDialogueId);
        
        // 대화가 종료 상태가 아니고 다이얼로그가 있으면 선택지 복원
        if (savedData.conversationState === 'active' && savedData.currentDialogueId) {
          const dialogue = getDialogueById(savedData.currentDialogueId);
          if (dialogue) {
            setCurrentChoices(dialogue.choices || []);
          }
        }
        
        // 시간대별 메시지 체크
        checkScheduledMessages();
      } else {
        // 새 대화 시작
        const specialEvent = checkSpecialEvent();
        const greeting = specialEvent || getGreetingByTime();
        
        const initMessage: Message = {
          id: '1',
          sender: 'beaver',
          text: greeting.text,
          time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        };
        
        setMessages([initMessage]);
        setCurrentChoices(greeting.choices || []);
        setCurrentDialogueId(greeting.id);
        
        saveChatData({
          messages: [initMessage],
          lastChatTime: Date.now(),
          conversationState: 'active',
          currentDialogueId: greeting.id
        });
      }
      
      // 비버 메시지 타이머 시작
      scheduleBeaverMessage();
    }

    return () => {
      if (beaverMessageTimer.current) {
        clearTimeout(beaverMessageTimer.current);
      }
    };
  }, [loading, gameData]);

  // 메시지 변경 시 로컬 스토리지 업데이트
  useEffect(() => {
    if (messages.length > 0 && initialized.current) {
      saveChatData({ messages });
    }
  }, [messages]);

  const handleChoice = async (choice: Choice) => {
    // 대화 마치기 선택
    if (choice.isFarewell) {
      const choiceText = choice.text;
      setCurrentChoices(null);
      
      // 타이핑 효과
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= choiceText.length) {
          setInputText(choiceText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 30);

      await new Promise(resolve => setTimeout(resolve, choiceText.length * 30 + 200));
      
      const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: choiceText,
        time: now,
      };

      setMessages(prev => [...prev, userMessage]);
      setInputText('');

      // 비버의 작별 인사
      setIsTyping(true);
      setTimeout(async () => {
        const farewell = getRandomFarewell();
        const beaverMessage: Message = {
          id: `beaver-${Date.now()}`,
          sender: 'beaver',
          text: farewell.text,
          time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        };
        
        setIsTyping(false);
        setMessages(prev => [...prev, beaverMessage]);
        setConversationState('ended');
        setCurrentChoices(null);
        setCurrentDialogueId(null);
        
        saveChatData({
          conversationState: 'ended',
          currentDialogueId: null,
          lastChatTime: Date.now()
        });
      }, 1000);
      
      return;
    }

    // 일반 선택지 처리
    const choiceText = choice.text;
    setCurrentChoices(null);
    
    // 타이핑 효과
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= choiceText.length) {
        setInputText(choiceText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 30);

    await new Promise(resolve => setTimeout(resolve, choiceText.length * 30 + 200));
    
    const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: choiceText,
      time: now,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

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
        setChatMode('free');
        saveChatData({
          currentDialogueId: null,
          lastChatTime: Date.now()
        });
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
      setCurrentChoices(nextDialogue.choices || []);
      setCurrentDialogueId(nextDialogue.id);
      
      saveChatData({
        currentDialogueId: nextDialogue.id,
        lastChatTime: Date.now()
      });
    }, 1500);
  };

  const handleFreeInput = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim() || aiLoading) return;

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

    // 대화가 종료 상태였으면 다시 활성화
    if (conversationState === 'ended') {
      setConversationState('active');
      saveChatData({ conversationState: 'active' });
    }

    setIsTyping(true);

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
    saveChatData({ lastChatTime: Date.now() });
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
      <div 
        className="flex-shrink-0 sticky z-30 top-14 md:top-16" 
        style={{ 
          backgroundColor: theme.header,
          borderBottom: `1px solid ${theme.border}`
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="text-xl w-10"
            style={{ color: theme.headerText }}
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
            <div style={{ color: theme.headerText }}>
              <div className="font-semibold">비버</div>
              <div className="text-xs opacity-60">
                {chatMode === 'scripted' ? '스토리 모드' : 'AI 채팅'}
                {conversationState === 'ended' && ' (대기 중)'}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-xl w-10 text-right"
            style={{ color: theme.headerText }}
          >
            ⋮
          </button>
        </div>

        {/* 스탯바 */}
        <div className="px-4 pb-3">
          <div className="flex gap-3 text-xs" style={{ color: theme.headerText }}>
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
          <div className="text-right text-xs mt-1 opacity-60" style={{ color: theme.headerText }}>
            Lv.{gameData.stats.level} · {gameData.stats.points}P
          </div>
        </div>
      </div>

      {/* 설정 패널 */}
      {showSettings && (
        <div 
          className="absolute top-16 right-4 z-40 rounded-lg p-4 min-w-[200px] shadow-lg border"
          style={{ 
            backgroundColor: theme.header,
            borderColor: theme.border,
            color: theme.headerText
          }}
        >
          <div className="font-semibold mb-3">설정</div>
          
          {/* 대화 모드 전환 */}
          <div className="mb-4">
            <div className="text-sm mb-2">대화 모드</div>
            <button
              onClick={() => {
                const newMode = chatMode === 'scripted' ? 'free' : 'scripted';
                setChatMode(newMode);
                setShowSettings(false);
              }}
              className="w-full text-left px-3 py-2 rounded transition-colors"
              style={{ 
                background: currentTheme === 'instagram' ? theme.myBubble : theme.myBubble,
                color: theme.myText
              }}
            >
              {chatMode === 'scripted' ? '✨ 자유 채팅으로 전환' : '📖 스토리로 돌아가기'}
            </button>
          </div>

          {/* 대화 데이터 초기화 */}
          <div className="mb-4">
            <button
              onClick={() => {
                if (confirm('대화 내역을 모두 삭제하시겠습니까?')) {
                  localStorage.removeItem(STORAGE_KEY);
                  window.location.reload();
                }
              }}
              className="w-full text-left px-3 py-2 rounded transition-colors text-sm bg-red-500 text-white"
            >
              🗑️ 대화 내역 삭제
            </button>
          </div>

          {/* 테마 설정 */}
          <div className="font-semibold mb-2 text-sm">테마</div>
          <div className="space-y-2">
            {(Object.keys(themes) as Theme[]).map((themeKey) => (
              <button
                key={themeKey}
                onClick={() => {
                  setCurrentTheme(themeKey);
                  setShowSettings(false);
                }}
                className="w-full text-left px-3 py-2 rounded transition-colors text-sm"
                style={{
                  backgroundColor: currentTheme === themeKey 
                    ? (themeKey === 'instagram' ? '#667EEA' : themes[themeKey].myBubble)
                    : 'transparent',
                  color: currentTheme === themeKey ? themes[themeKey].myText : 'inherit'
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
          <div 
            className="text-xs text-center mb-4"
            style={{ color: theme.otherText, opacity: 0.5 }}
          >
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

          {/* 선택지 영역 */}
          {chatMode === 'scripted' && conversationState === 'active' && currentChoices && currentChoices.length > 0 && (
            <div className="flex flex-col items-end gap-2 mt-4">
              {/* 타이핑 애니메이션 */}
              <div className="rounded-2xl px-4 py-2.5 bg-gray-100 border" style={{ borderColor: theme.border }}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full animate-bounce bg-gray-400" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce bg-gray-400" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce bg-gray-400" style={{ animationDelay: '300ms' }} />
                </div>
              </div>

              {/* 선택지 버튼들 */}
              {currentChoices.map((choice, index) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  className="rounded-2xl px-4 py-3 max-w-[75%] text-left transition-all duration-300 hover:scale-105 active:scale-95 bg-gray-100 hover:bg-gray-200 border shadow-sm"
                  style={{
                    borderColor: theme.border,
                    color: currentTheme === 'discord' ? '#202225' : '#1F2937',
                    animationDelay: `${index * 100}ms`,
                    animation: 'slideIn 0.3s ease-out forwards',
                    opacity: 0
                  }}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 하단 입력창 */}
      <div 
        className="fixed left-0 right-0 z-30 border-t bottom-[40px] md:bottom-0"
        style={{
          backgroundColor: theme.input,
          borderColor: theme.border,
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-3">
          <form onSubmit={handleFreeInput} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                chatMode === 'scripted' 
                  ? conversationState === 'ended'
                    ? '비버가 먼저 말을 걸 때까지 기다려주세요...'
                    : '위 선택지를 선택해주세요...'
                  : '메시지를 입력하세요...'
              }
              className="flex-1 px-4 py-3 rounded-full outline-none"
              style={{
                backgroundColor: currentTheme === 'discord' || currentTheme === 'beaver' ? theme.bg : '#F5F5F5',
                color: theme.inputText,
                border: `1px solid ${theme.border}`
              }}
              disabled={chatMode === 'scripted' || aiLoading}
            />
            <button
              type="submit"
              disabled={chatMode === 'scripted' || !inputText.trim() || aiLoading}
              className="px-6 py-3 rounded-full font-semibold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: currentTheme === 'instagram' ? theme.myBubble : theme.myBubble,
                color: theme.myText,
              }}
            >
              전송
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}