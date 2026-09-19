import React from 'react';

const STATUS_CONFIGS = {
  // Client statuses
  'Lead': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  'New': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  'Onboarding': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  'Active': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  'On Hold': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  'Completed': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', dot: 'bg-teal-500' },
  'Inactive': { bg: 'bg-stone-100', text: 'text-stone-600', border: 'border-stone-200', dot: 'bg-stone-400' },
  'Cancelled': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },

  // Order statuses
  'In Production': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500' },
  'Partially Delivered': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-500' },

  // Script statuses
  'Draft': { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-200', dot: 'bg-stone-400' },
  'Assigned': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  'In Review': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' },
  'Sent to Client': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500' },
  'Revision Required': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
  'Approved': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  'Ready for Shoot': { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200', dot: 'bg-teal-500' },

  // Creator availability
  'Available': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  'Booked': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500' },
  'Unavailable': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },

  // Shoot statuses
  'Scheduled': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  'Confirmed': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  'In Progress': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500' },
  'Reshoot Required': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },

  // Video Pipeline stages
  'Script Approved': { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-200', dot: 'bg-stone-500' },
  'Shoot Pending': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500' },
  'Raw Footage Received': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', dot: 'bg-cyan-500' },
  'Video Editing': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  'Internal QA': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  'Client Review': { bg: 'bg-amber-100', text: 'text-amber-900', border: 'border-amber-300', dot: 'bg-amber-600' },
  'Revision': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
  'Final Approved': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  'Delivered': { bg: 'bg-emerald-100', text: 'text-emerald-900', border: 'border-emerald-300', dot: 'bg-emerald-600' },

  // Task priorities
  'Urgent': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
  'High': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500' },
  'Medium': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  'Low': { bg: 'bg-stone-100', text: 'text-stone-600', border: 'border-stone-200', dot: 'bg-stone-400' },
  'To Do': { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-200', dot: 'bg-stone-500' },
  'Done': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },

  // Payments / Payouts
  'Paid': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  'Partially Paid': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500' },
  'Unpaid': { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-200', dot: 'bg-stone-400' },
  'Overdue': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
  'Pending': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500' },

  // Tickets
  'Open': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  'Resolved': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' }
};

export default function Badge({ status, size = 'sm', showDot = true, className = '' }) {
  const config = STATUS_CONFIGS[status] || {
    bg: 'bg-stone-100',
    text: 'text-stone-700',
    border: 'border-stone-200',
    dot: 'bg-stone-400'
  };

  const sizeClasses = size === 'xs'
    ? 'px-2 py-0.5 text-xs font-medium'
    : size === 'md'
    ? 'px-3 py-1 text-sm font-medium'
    : 'px-2.5 py-0.5 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border whitespace-nowrap ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      )}
      <span>{status}</span>
    </span>
  );
}
