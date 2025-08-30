interface BadgeProps {
  children: string;
  color: 'yellow' | 'green' | 'blue';
}

export function Badge({ children, color }: BadgeProps) {
  const colorMap = {
    yellow: 'bg-yellow-100 text-yellow-800 ring-yellow-600/20',
    green: 'bg-green-100 text-green-800 ring-green-600/20',
    blue: 'bg-blue-100 text-blue-800 ring-blue-600/20'
  } as const;

  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${colorMap[color]}`}>
      {children}
    </span>
  );
}
