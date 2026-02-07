// app/game/missions/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useGameData } from '../hooks/useGameData';
import MissionCard from '../components/MissionCard';

export default function MissionsPage() {
  const router = useRouter();
  const { gameData, loading, claimMissionReward } = useGameData();

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

  const dailyMissions = gameData.missions.filter(m => m.type === 'daily');
  const weeklyMissions = gameData.missions.filter(m => m.type === 'weekly');
  const achievements = gameData.missions.filter(m => m.type === 'achievement');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center">
          <button 
            onClick={() => router.back()}
            className="text-gray-600 font-medium"
          >
            ← 뒤로
          </button>
          <h1 className="flex-1 text-center font-bold text-lg">미션</h1>
          <div className="w-12"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {/* 일일 미션 */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">일일 미션</h2>
          <p className="text-sm text-gray-500 mb-4">매일 자정에 초기화됩니다</p>
          {dailyMissions.map(mission => (
            <MissionCard 
              key={mission.id} 
              mission={mission}
              onClaim={claimMissionReward}
            />
          ))}
        </section>

        {/* 주간 미션 */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">주간 미션</h2>
          <p className="text-sm text-gray-500 mb-4">매주 월요일 초기화됩니다</p>
          {weeklyMissions.map(mission => (
            <MissionCard 
              key={mission.id} 
              mission={mission}
              onClaim={claimMissionReward}
            />
          ))}
        </section>

        {/* 업적 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">업적</h2>
          <p className="text-sm text-gray-500 mb-4">영구적으로 도전할 수 있는 목표입니다</p>
          {achievements.map(mission => (
            <MissionCard 
              key={mission.id} 
              mission={mission}
              onClaim={claimMissionReward}
            />
          ))}
        </section>
      </div>
    </div>
  );
}