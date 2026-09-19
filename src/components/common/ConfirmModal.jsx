import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showClose={false}>
      <div className="flex items-start gap-4">
        <div
          className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center ${
            isDanger ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
          }`}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-stone-900 leading-snug">
            {title}
          </h3>
          <p className="mt-2 text-sm text-stone-600 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={() => {
            if (onConfirm) onConfirm();
          }}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer text-white ${
            isDanger
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'bg-amber-600 hover:bg-amber-700'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
