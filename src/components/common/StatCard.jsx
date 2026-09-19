import React from 'react';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  color = 'amber',
  onClick,
  badge
}) {
  const colorMap = {
    amber: {
      bg: 'bg-amber-500/10 text-amber-600',
      border: 'border-amber-500/20'
    },
    emerald: {
      bg: 'bg-emerald-500/10 text-emerald-600',
      border: 'border-emerald-500/20'
    },
    blue: {
      bg: 'bg-blue-500/10 text-blue-600',
      border: 'border-blue-500/20'
    },
    purple: {
      bg: 'bg-purple-500/10 text-purple-600',
      border: 'border-purple-500/20'
    },
    rose: {
      bg: 'bg-rose-500/10 text-rose-600',
      border: 'border-rose-500/20'
    },
    charcoal: {
      bg: 'bg-stone-900 text-amber-400',
      border: 'border-stone-800'
    }
  };

  const scheme = colorMap[color] || colorMap.amber;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs transition-all hover:shadow-md ${
        onClick ? 'cursor-pointer hover:border-amber-400' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${scheme.bg} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
          {value}
        </span>
        {badge && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-medium">
            {badge}
          </span>
        )}
      </div>
      {(subtext || trend) && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-stone-500 font-medium">
          {trend && (
            <span
              className={`font-semibold ${
                trend.startsWith('+') ? 'text-emerald-600' : 'text-stone-600'
              }`}
            >
              {trend}
            </span>
          )}
          {subtext && <span>{subtext}</span>}
        </div>
      )}
    </div>
  );
}
