import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
        };

        const borders = {
          success: 'border-emerald-200 bg-white',
          error: 'border-rose-200 bg-white',
          warning: 'border-amber-200 bg-white',
          info: 'border-blue-200 bg-white'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border ${
              borders[toast.type] || 'border-stone-200 bg-white'
            } animate-in slide-in-from-right-5 fade-in duration-200`}
          >
            {icons[toast.type] || icons.info}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-stone-900 leading-tight">
                {toast.title}
              </p>
              {toast.message && (
                <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 -mr-1 -mt-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
