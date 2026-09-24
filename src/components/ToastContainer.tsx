import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-14 left-0 right-0 z-60 pointer-events-none flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto max-w-sm w-full rounded-2xl p-3 border shadow-2xl backdrop-blur-md flex items-start gap-2.5 animate-in slide-in-from-top-2 duration-200 ${
              isSuccess
                ? 'bg-[#091522]/95 border-[#39ff14]/50 shadow-[#39ff14]/15 text-white'
                : isError
                ? 'bg-[#1e0d16]/95 border-rose-500/50 shadow-rose-500/15 text-white'
                : 'bg-[#0b1428]/95 border-[#38bdf8]/50 shadow-[#38bdf8]/15 text-white'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-[#39ff14]" />
              ) : isError ? (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              ) : (
                <Info className="w-4 h-4 text-[#38bdf8]" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h5 className="text-xs font-bold leading-tight font-display">{toast.title}</h5>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white shrink-0 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
