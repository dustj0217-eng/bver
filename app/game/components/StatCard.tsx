// app/game/components/StatCard.tsx

'use client';

import { getStatTitle } from '../data/constants';

interface StatCardProps {
  label: string;
  value: number;
  stat: 'affection' | 'empathy' | 'rebellion';
}

export default function StatCard({ label, value, stat }: StatCardProps) {
  const colors = {
    affection: {
      bg: 'bg-pink-50',
      bar: 'bg-pink-500',
      text: 'text-pink-600',
    },
    empathy: {
      bg: 'bg-blue-50',
      bar: 'bg-blue-500',
      text: 'text-blue-600',
    },
    rebellion: {
      bg: 'bg-purple-50',
      bar: 'bg-purple-500',
      text: 'text-purple-600',
    },
  };

  const color = colors[stat];
  const title = getStatTitle(stat, value);

  return (
    <div className={`${color.bg} rounded-xl p-4`}>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color.text} mb-1`}>{value}</div>
      <div className="text-xs text-gray-500 mb-2">{title}</div>
      <div className="h-2 bg-white/50 rounded-full overflow-hidden">
        <div
          className={`h-full ${color.bar} transition-all duration-300`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}