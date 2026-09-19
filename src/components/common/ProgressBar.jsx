import React from 'react';

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'amber',
  size = 'md',
  sublabel
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100))) || 0;

  const colorClasses = {
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    charcoal: 'bg-stone-900'
  };

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5'
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5 text-xs font-medium text-stone-700">
          <span>{label}</span>
          <span>{showPercentage ? `${percentage}%` : `${value} / ${max}`}</span>
        </div>
      )}
      <div className={`w-full bg-stone-100 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`${colorClasses[color] || 'bg-amber-500'} ${heightClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {sublabel && (
        <div className="mt-1 text-[11px] text-stone-500">
          {sublabel}
        </div>
      )}
    </div>
  );
}
