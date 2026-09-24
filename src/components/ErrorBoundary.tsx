import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in TTE App:', error, errorInfo);
  }

  private handleReload = () => {
    try {
      window.location.reload();
    } catch {
      window.location.href = window.location.href;
    }
  };

  private handleClearAndReset = () => {
    try {
      // Clear relevant local storage items that might be corrupt
      const keys = [
        'tte_user_v3',
        'tte_mining_active_v3',
        'tte_unclaimed_reward_v3',
        'tte_last_active_time_v3',
        'tte_miner_levels_v3',
        'tte_tasks_v3',
        'tte_daily_streak_v3',
        'tte_referrals_v3',
        'tte_withdrawals_v3',
        'tte_history_v3',
      ];
      keys.forEach((k) => localStorage.removeItem(k));
    } catch {
      // Ignore
    }
    this.handleReload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060913] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-[0_0_24px_rgba(244,63,94,0.2)]">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h1 className="text-xl font-display font-black text-white mb-2">
            Something went wrong
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mb-6">
            The application encountered a temporary display issue. Tap reload to restart your node.
          </p>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={this.handleReload}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-[#39ff14] to-emerald-400 text-slate-950 font-display font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#39ff14]/20 active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-black" />
              <span>Reload Page</span>
            </button>

            <button
              onClick={this.handleClearAndReset}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Local Cache & Reload</span>
            </button>
          </div>

          {this.state.error?.message && (
            <div className="mt-6 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-500 max-w-xs truncate">
              {this.state.error.message}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
