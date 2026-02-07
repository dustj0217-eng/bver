// app/my/components/sections/PointsSection.tsx

'use client';

import RewardAdButton from '@/app/my/components/RewardAdButton';

interface PointsSectionProps {
  points: number;
  onRewardEarned: (points: number) => void;
}

export default function PointsSection({
  points,
  onRewardEarned,
}: PointsSectionProps) {
  return (
    <div className="pt-2 space-y-4">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">보유 포인트</p>
            <p className="text-3xl font-bold text-gray-900">{points.toLocaleString()}P</p>
          </div>
        </div>
        
        <RewardAdButton onRewardEarned={onRewardEarned} />
        
        <p className="text-xs text-gray-500 text-center mt-3">
          광고 시청으로 포인트를 모아<br />구매 시 사용하세요
        </p>
      </div>
    </div>
  );
}