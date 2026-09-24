import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Coins, 
  ExternalLink, 
  MessageCircle, 
  Play, 
  Flame, 
  Sparkles, 
  Clock, 
  Share2, 
  Loader2, 
  Check 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TaskItem } from '../types';

export const TasksView: React.FC = () => {
  const {
    tasks,
    dailyStreak,
    claimDailyCheckin,
    startTask,
    claimTask,
    setIsBoostModalOpen,
    language
  } = useApp();

  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [claimingTaskId, setClaimingTaskId] = useState<string | null>(null);

  const handleCheckin = async () => {
    if (dailyStreak?.checkedInToday || isCheckingIn) return;
    try {
      setIsCheckingIn(true);
      await claimDailyCheckin();
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleClaimTask = async (taskId: string) => {
    try {
      setClaimingTaskId(taskId);
      await claimTask(taskId);
    } finally {
      setClaimingTaskId(null);
    }
  };

  const currentStreak = dailyStreak?.currentStreak || 4;
  const isCheckedIn = dailyStreak?.checkedInToday || false;
  const streakRewards = dailyStreak?.rewards || [5, 6, 7, 8, 9, 10, 15];

  // Helper icon for task type
  const getTaskIcon = (type: TaskItem['type']) => {
    switch (type) {
      case 'telegram':
        return <MessageCircle className="w-4 h-4 text-[#38bdf8]" />;
      case 'video':
        return <Play className="w-4 h-4 text-rose-400" />;
      case 'ad':
        return <Flame className="w-4 h-4 text-[#39ff14]" />;
      case 'social':
        return <Share2 className="w-4 h-4 text-indigo-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-24 pt-2">
      
      {/* 1. Daily Check-in Streak Section */}
      <section className="bg-gradient-to-b from-[#0d162d] to-[#091024] rounded-2xl border border-slate-800 p-4 shadow-lg shadow-black/40">
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#39ff14]/15 border border-[#39ff14]/30 flex items-center justify-center text-[#39ff14]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-white">
                {language === 'bn' ? 'দৈনিক চেক-ইন স্ট্রিক' : 'Daily Check-in Streak'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Log in daily to earn continuous virtual TTE rewards
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Streak</span>
            <span className="text-sm font-extrabold text-[#39ff14] font-mono">
              Day {currentStreak}/7
            </span>
          </div>
        </div>

        {/* 7-Day Streak Scroller */}
        <div className="grid grid-cols-7 gap-1.5 py-2">
          {streakRewards.map((reward, idx) => {
            const dayNum = idx + 1;
            const isCompleted = dayNum < currentStreak || (dayNum === currentStreak && isCheckedIn);
            const isCurrent = dayNum === currentStreak && !isCheckedIn;

            return (
              <div
                key={dayNum}
                className={`rounded-xl p-2 flex flex-col items-center justify-center text-center transition-all ${
                  isCompleted
                    ? 'bg-[#39ff14]/15 border border-[#39ff14]/40 text-[#39ff14]'
                    : isCurrent
                    ? 'bg-[#0b1f3d] border-2 border-[#38bdf8] shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                    : 'bg-[#060913]/60 border border-slate-800/80 text-slate-400'
                }`}
              >
                <span className="text-[10px] font-semibold text-slate-400 mb-0.5">
                  D{dayNum}
                </span>

                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-[#39ff14] my-0.5" />
                ) : (
                  <Coins className="w-4 h-4 text-amber-400 my-0.5" />
                )}

                <span className={`text-[10px] font-mono font-bold ${isCompleted ? 'text-[#39ff14]' : 'text-slate-200'}`}>
                  +{reward}
                </span>
              </div>
            );
          })}
        </div>

        {/* Check In Action Button */}
        <div className="mt-3 pt-2 border-t border-slate-800">
          <button
            onClick={handleCheckin}
            disabled={isCheckedIn || isCheckingIn}
            className={`w-full min-h-[44px] py-2.5 px-4 rounded-xl font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              isCheckedIn
                ? 'bg-slate-800 text-[#39ff14] border border-[#39ff14]/30 cursor-default'
                : 'bg-gradient-to-r from-[#22c55e] to-[#39ff14] text-black shadow-lg shadow-[#39ff14]/30 hover:brightness-110 active:scale-98'
            }`}
          >
            {isCheckingIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Checking In...</span>
              </>
            ) : isCheckedIn ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>CHECKED IN ✓ (Day {currentStreak})</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 fill-black" />
                <span>CHECK IN (+{streakRewards[currentStreak - 1] || 8} TTE)</span>
              </>
            )}
          </button>
        </div>

      </section>

      {/* 2. Tasks List Section */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-display font-bold text-white tracking-wide">
          {language === 'bn' ? 'উপার্জন টাস্কসমূহ' : 'Available Earning Tasks'}
        </h3>
        <span className="text-xs text-slate-400">
          {tasks.filter((t) => t.status !== 'CLAIMED').length} available
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {tasks.map((task) => {
          const isAvailable = task.status === 'AVAILABLE';
          const isInProgress = task.status === 'IN_PROGRESS';
          const isCompleted = task.status === 'COMPLETED';
          const isClaimed = task.status === 'CLAIMED';

          return (
            <div
              key={task.id}
              className={`rounded-2xl p-3.5 border transition-all flex items-center justify-between gap-3 ${
                isClaimed
                  ? 'bg-[#060913]/40 border-slate-900 opacity-60'
                  : 'bg-[#091024] border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Left Icon and Title */}
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center shrink-0 mt-0.5">
                  {getTaskIcon(task.type)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {task.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-1">
                    {task.description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs font-mono font-bold text-[#39ff14]">
                      +{task.reward} TTE
                    </span>
                    <span className="text-[10px] text-slate-500">·</span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {task.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action Button */}
              <div className="shrink-0">
                {isClaimed ? (
                  <div className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-500 text-[11px] font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    DONE
                  </div>
                ) : isCompleted ? (
                  <button
                    onClick={() => handleClaimTask(task.id)}
                    disabled={claimingTaskId === task.id}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#22c55e] to-[#39ff14] text-black font-extrabold text-xs flex items-center gap-1 shadow-md shadow-[#39ff14]/20 active:scale-95 transition-all"
                  >
                    {claimingTaskId === task.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Coins className="w-3.5 h-3.5 fill-black" />
                    )}
                    <span>CLAIM</span>
                  </button>
                ) : isInProgress ? (
                  <div className="px-3 py-1.5 rounded-xl bg-[#0284c7]/20 border border-[#38bdf8]/40 text-[#38bdf8] text-[11px] font-semibold flex items-center gap-1.5">
                    <Clock className="w-3 h-3 animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : task.type === 'ad' ? (
                  <button
                    onClick={() => setIsBoostModalOpen(true)}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-bold text-xs flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Flame className="w-3 h-3 fill-white" />
                    <span>WATCH</span>
                  </button>
                ) : (
                  <button
                    onClick={() => startTask(task.id)}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-bold text-xs flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all"
                  >
                    <span>START</span>
                    <ExternalLink className="w-3 h-3 text-sky-200" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
