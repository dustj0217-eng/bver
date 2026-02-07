// app/game/components/MissionCard.tsx
'use client';

import { Mission } from '../types';

interface MissionCardProps {
  mission: Mission;
  onClaim?: (missionId: string) => void;
}

export default function MissionCard({ mission, onClaim }: MissionCardProps) {
  const percentage = Math.min((mission.progress / mission.requirement.target) * 100, 100);
  
  const typeColors = {
    daily: 'border-blue-200 bg-blue-50',
    weekly: 'border-purple-200 bg-purple-50',
    achievement: 'border-yellow-200 bg-yellow-50',
  };

  const typeBadges = {
    daily: 'bg-blue-500 text-white',
    weekly: 'bg-purple-500 text-white',
    achievement: 'bg-yellow-500 text-white',
  };

  const typeLabels = {
    daily: '일일',
    weekly: '주간',
    achievement: '업적',
  };

  return (
    <div className={`border-2 ${typeColors[mission.type]} rounded-xl p-4 mb-3`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded ${typeBadges[mission.type]}`}>
              {typeLabels[mission.type]}
            </span>
            {mission.completed && !mission.claimed && (
              <span className="text-xs px-2 py-0.5 rounded bg-green-500 text-white">
                완료!
              </span>
            )}
            {mission.claimed && (
              <span className="text-xs px-2 py-0.5 rounded bg-gray-400 text-white">
                수령완료
              </span>
            )}
          </div>
          <h4 className="font-bold text-gray-800">{mission.title}</h4>
          <p className="text-sm text-gray-600">{mission.description}</p>
        </div>
        <div className="text-right ml-4">
          <div className="text-yellow-600 font-bold">{mission.reward.points}P</div>
          {mission.reward.title && (
            <div className="text-xs text-gray-500">+ 칭호</div>
          )}
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>진행도</span>
          <span>{mission.progress} / {mission.requirement.target}</span>
        </div>
        <div className="h-2 bg-white/70 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {mission.completed && !mission.claimed && onClaim && (
        <button
          onClick={() => onClaim(mission.id)}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-2 rounded-lg"
        >
          보상 받기
        </button>
      )}
    </div>
  );
}