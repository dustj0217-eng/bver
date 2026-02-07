// app/game/components/ActionButton.tsx
'use client';

import Link from 'next/link';

interface ActionButtonProps {
  icon: string;
  label: string;
  sublabel: string;
  href: string;
  highlight?: boolean;
  badge?: number;
}

export default function ActionButton({ 
  icon, 
  label, 
  sublabel, 
  href, 
  highlight = false,
  badge = 0,
}: ActionButtonProps) {
  return (
    <Link href={href}>
      <div 
        className={`relative rounded-xl p-4 transition-all ${
          highlight 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg' 
            : 'bg-white text-gray-800 shadow'
        }`}
      >
        {badge > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {badge}
          </div>
        )}
        <div className="text-3xl mb-2">{icon}</div>
        <div className={`font-bold ${highlight ? 'text-white' : 'text-gray-800'}`}>
          {label}
        </div>
        <div className={`text-sm ${highlight ? 'text-blue-100' : 'text-gray-500'}`}>
          {sublabel}
        </div>
      </div>
    </Link>
  );
}