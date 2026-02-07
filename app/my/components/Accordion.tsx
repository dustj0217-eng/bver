// app/my/components/Accordion.tsx

interface AccordionProps {
  title: string;
  badge?: number | string;
  open: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function Accordion({
  title,
  badge,
  open,
  onClick,
  children,
}: AccordionProps) {
  return (
    <div className="overflow-hidden">
      <button
        onClick={onClick}
        className="w-full px-5 py-5 flex justify-between items-center"
      >
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold">{title}</span>
          {badge !== undefined && (
            <span className={`text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center ${
              badge === '!' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-900 text-white'
            }`}>
              {badge}
            </span>
          )}
        </div>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-5 pb-5 border-t">{children}</div>}
    </div>
  );
}