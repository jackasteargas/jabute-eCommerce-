import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface AdminConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName?: string;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onClose: () => void;
}

export const AdminConfirmModal: React.FC<AdminConfirmModalProps> = ({
  isOpen,
  title,
  message,
  itemName,
  confirmLabel = 'Delete Permanently',
  confirmVariant = 'danger',
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                confirmVariant === 'danger'
                  ? 'bg-rose-100 text-rose-600'
                  : confirmVariant === 'warning'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-stone-900 text-white'
              }`}>
                {confirmVariant === 'danger' ? (
                  <Trash2 className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-base font-black text-stone-900">{title}</h3>
                <p className="text-xs text-stone-500 mt-0.5">Please confirm your decision below.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
            <p>{message}</p>
            {itemName && (
              <p className="mt-2 font-bold text-stone-900 bg-white p-2 rounded-lg border border-stone-200 truncate">
                {itemName}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition-all cursor-pointer ${
                confirmVariant === 'danger'
                  ? 'bg-rose-600 hover:bg-rose-700 active:scale-95'
                  : confirmVariant === 'warning'
                  ? 'bg-amber-600 hover:bg-amber-700 active:scale-95'
                  : 'bg-stone-900 hover:bg-stone-800 active:scale-95'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
