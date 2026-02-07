// app/game/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useGameData } from './hooks/useGameData';

type Tab = 'main' | 'missions' | 'stats';

export default function GameHub() {
  const router = useRouter();
  const { gameData, loading, claimMissionReward } = useGameData();
  const [mounted, setMounted] = useState(false);
  const [currentTab, setCurrentTab] = useState<Tab>('main');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-stone-500">로딩 중...</div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-stone-500">로그인이 필요합니다</div>
      </div>
    );
  }

  const unclaimedRewards = gameData.missions.filter(m => m.completed && !m.claimed).length;
  const dailyMissions = gameData.missions.filter(m => m.type === 'daily');
  const completedMissions = gameData.missions.filter(m => m.completed).length;
  const totalMissions = gameData.missions.length;

  const formatLastChat = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  return (
    <div className="h-screen flex flex-col bg-stone-100 overflow-hidden pb-[60px] md:pb-0">
      {/* 상단 고정 영역 - 프로필, 스탯, 포인트 */}
      <div className="fixed top-14 md:top-16 left-0 right-0 z-20 bg-stone-100 p-4 pb-2">
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-start gap-3">
            {/* 좌측: 프로필 */}
            <div className="flex-shrink-0">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-stone-300">
                <Image 
                  src="/bver.png" 
                  alt="비버"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center mt-1">
                <div className="text-xs font-bold text-stone-700">비버</div>
                <div className="text-xs text-stone-500">Lv.{gameData.stats.level}</div>
              </div>
            </div>

            {/* 중앙: 스탯바 */}
            <div className="flex-1 space-y-2">
              {/* 친밀도 */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-pink-600 whitespace-nowrap">💗 친밀도</span>
                <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-pink-400 transition-all duration-300"
                    style={{ width: `${gameData.stats.affection}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-pink-600 w-6 text-right">{gameData.stats.affection}</span>
              </div>

              {/* 공감도 */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-blue-600 whitespace-nowrap">💙 공감도</span>
                <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-400 transition-all duration-300"
                    style={{ width: `${gameData.stats.empathy}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-blue-600 w-6 text-right">{gameData.stats.empathy}</span>
              </div>

              {/* 반항도 */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-purple-600 whitespace-nowrap">💜 반항도</span>
                <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-400 transition-all duration-300"
                    style={{ width: `${gameData.stats.rebellion}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-purple-600 w-6 text-right">{gameData.stats.rebellion}</span>
              </div>
            </div>

            {/* 우측: 포인트 */}
            <div className="flex-shrink-0">
              <div className="bg-amber-100 rounded-lg px-3 py-2 text-center min-w-[70px]">
                <div className="text-xs text-amber-700 font-medium">포인트</div>
                <div className="text-lg font-bold text-amber-900">
                  {gameData.stats.points.toLocaleString()}
                </div>
              </div>
              <div className="text-xs text-center text-stone-500 mt-2">
                {gameData.chatHistory.loginStreak}일 연속
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 relative overflow-y-auto pt-32">
        {/* 배경 일러스트 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="relative w-72 h-72">
            <Image 
              src="/bver.png" 
              alt="비버"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* UI 오버레이 */}
        <div className="relative z-10 p-4 min-h-full flex flex-col">
          {/* 스페이서 */}
          <div className="flex-1" />

          {/* 탭 컨텐츠 */}
          {currentTab === 'main' && (
            <div className="fixed left-0 right-0 bottom-[60px] md:bottom-[48px] z-20 px-4 pb-3 bg-stone-100">
              <div className="text-xs text-stone-500 text-center mb-3">
                마지막 대화: {formatLastChat(gameData.chatHistory.lastChatTime)}
              </div>
              <button
                onClick={() => router.push('/game/chat')}
                className="w-full bg-amber-500 text-white font-bold py-4 rounded-lg active:scale-95 transition-transform"
              >
                💬 대화하기
              </button>
            </div>
          )}

          {currentTab === 'missions' && (
            <div className="bg-white rounded-xl p-4 max-h-96 overflow-y-auto">
              <div className="text-sm font-bold text-stone-800 mb-3 flex items-center justify-between">
                <span>미션</span>
                <span className="text-xs text-stone-500">{completedMissions}/{totalMissions}</span>
              </div>
              <div className="space-y-2">
                {dailyMissions.map(mission => (
                  <div 
                    key={mission.id}
                    className="bg-stone-50 rounded-lg p-3 border border-stone-200"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="text-xs font-medium text-stone-800 mb-1">
                          {mission.completed ? '✓' : '·'} {mission.title}
                        </div>
                        <div className="text-xs text-stone-500">
                          {mission.description}
                        </div>
                      </div>
                      {mission.completed && !mission.claimed && (
                        <button
                          onClick={() => claimMissionReward(mission.id)}
                          className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded active:scale-95 transition-transform flex-shrink-0"
                        >
                          받기
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'stats' && (
            <div className="bg-white rounded-xl p-4">
              <div className="text-sm font-bold text-stone-800 mb-4">통계</div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-stone-100">
                  <span className="text-stone-600">총 대화 횟수</span>
                  <span className="font-bold text-stone-800">{gameData.chatHistory.totalChats}회</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-stone-100">
                  <span className="text-stone-600">연속 접속</span>
                  <span className="font-bold text-stone-800">{gameData.chatHistory.loginStreak}일</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-stone-100">
                  <span className="text-stone-600">최대 연속</span>
                  <span className="font-bold text-stone-800">{gameData.chatHistory.maxLoginStreak}일</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-stone-100">
                  <span className="text-stone-600">완료한 미션</span>
                  <span className="font-bold text-stone-800">{completedMissions}개</span>
                </div>
                {gameData.achievements.length > 0 && (
                  <div className="pt-3 mt-2 border-t border-stone-200">
                    <div className="text-stone-600 mb-2">획득한 칭호</div>
                    <div className="flex flex-wrap gap-1">
                      {gameData.achievements.map((achievement, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium"
                        >
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 고정 탭바 */}
      <div className="fixed left-0 right-0 bottom-[40px] md:bottom-0 z-30 bg-white border-t border-stone-200">
        <div className="max-w-2xl mx-auto flex">
          <button
            onClick={() => setCurrentTab('main')}
            className={`flex-1 py-3 text-center font-medium transition-all ${
              currentTab === 'main' 
                ? 'bg-stone-800 text-white' 
                : 'bg-white text-stone-500'
            }`}
          >
            <div className="text-xs">홈</div>
          </button>
          <button
            onClick={() => setCurrentTab('missions')}
            className={`flex-1 py-3 text-center font-medium transition-all relative ${
              currentTab === 'missions' 
                ? 'bg-stone-800 text-white' 
                : 'bg-white text-stone-500'
            }`}
          >
            {unclaimedRewards > 0 && (
              <div className="absolute top-1 right-1/4 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unclaimedRewards}
              </div>
            )}
            <div className="text-xs">미션</div>
          </button>
          <button
            onClick={() => setCurrentTab('stats')}
            className={`flex-1 py-3 text-center font-medium transition-all ${
              currentTab === 'stats' 
                ? 'bg-stone-800 text-white' 
                : 'bg-white text-stone-500'
            }`}
          >
            <div className="text-xs">통계</div>
          </button>
        </div>
      </div>
    </div>
  );
}