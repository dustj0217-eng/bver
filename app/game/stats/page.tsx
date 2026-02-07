// app/game/stats/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useGameData } from '../hooks/useGameData';
import { getStatTitle, getExpForLevel } from '../data/constants';

export default function StatsPage() {
  const router = useRouter();
  const { gameData, loading } = useGameData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로그인이 필요합니다</div>
      </div>
    );
  }

  const nextLevelExp = getExpForLevel(gameData.stats.level);
  const expPercentage = (gameData.stats.exp / nextLevelExp) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center">
          <button 
            onClick={() => router.back()}
            className="text-gray-600 font-medium"
          >
            ← 뒤로
          </button>
          <h1 className="flex-1 text-center font-bold text-lg">프로필</h1>
          <div className="w-12"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {/* 프로필 카드 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-24 h-24">
              <Image
                src="/bver.png"
                alt="비버"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">비버</h2>
              <div className="text-gray-600 mb-2">Lv.{gameData.stats.level} 직장인</div>
              <div className="mb-1">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>경험치</span>
                  <span>{gameData.stats.exp} / {nextLevelExp}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all"
                    style={{ width: `${expPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {gameData.stats.points.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">포인트</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {gameData.chatHistory.totalChats}
              </div>
              <div className="text-sm text-gray-500">총 대화</div>
            </div>
          </div>
        </div>

        {/* 스탯 상세 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <h3 className="font-bold text-gray-800 mb-4">관계 통계</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-700">친밀도</span>
                <span className="text-pink-500 font-bold">{gameData.stats.affection}</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-1">
                <div 
                  className="h-full bg-pink-500 transition-all"
                  style={{ width: `${gameData.stats.affection}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">
                {getStatTitle('affection', gameData.stats.affection)}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-700">공감도</span>
                <span className="text-blue-500 font-bold">{gameData.stats.empathy}</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-1">
                <div 
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${gameData.stats.empathy}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">
                {getStatTitle('empathy', gameData.stats.empathy)}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-700">반항도</span>
                <span className="text-purple-500 font-bold">{gameData.stats.rebellion}</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-1">
                <div 
                  className="h-full bg-purple-500 transition-all"
                  style={{ width: `${gameData.stats.rebellion}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">
                {getStatTitle('rebellion', gameData.stats.rebellion)}
              </div>
            </div>
          </div>
        </div>

        {/* 활동 기록 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <h3 className="font-bold text-gray-800 mb-4">활동 기록</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">오늘 대화</div>
              <div className="text-2xl font-bold text-blue-600">
                {gameData.chatHistory.todayChats}
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">연속 접속</div>
              <div className="text-2xl font-bold text-green-600">
                {gameData.chatHistory.loginStreak}일
              </div>
            </div>
          </div>
        </div>

        {/* 획득한 칭호 */}
        {gameData.achievements.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4">획득한 칭호</h3>
            <div className="flex flex-wrap gap-2">
              {gameData.achievements.map((achievement, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 text-yellow-800 rounded-full text-sm font-medium"
                >
                  {achievement}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}