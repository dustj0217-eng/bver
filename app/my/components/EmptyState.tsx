// app/my/components/EmptyState.tsx

interface EmptyStateProps {
  text: string;
  subtext: string;
}

export default function EmptyState({ text, subtext }: EmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <p className="text-sm text-gray-900 font-medium mb-1">{text}</p>
      <p className="text-xs text-gray-400">{subtext}</p>
    </div>
  );
}