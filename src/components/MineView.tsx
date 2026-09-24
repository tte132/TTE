import React, { useState } from 'react';
import { 
  Zap, 
  ArrowUpRight, 
  Coins, 
  Wallet, 
  Flame, 
  CheckCircle2, 
  Loader2, 
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Cpu,
  Play,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CoinMascot } from './CoinMascot';
import { getMinerLevelFormula, MAX_MINER_LEVEL } from '../services/api';
import boostBannerImg from '../assets/images/tte_boost_banner_1790226645093.jpg';
import tteLogoImg from '../assets/images/tte_logo.jpg';

export const MineView: React.FC = () => {
  const {
    user,
    unclaimedReward,
    effectiveHashPower,
    boostMultiplier,
    boostTimeRemaining,
    claimMiningReward,
    isClaimingReward,
    setCurrentTab,
    setIsBoostModalOpen,
    adConfig,
    language,
    isMiningActive,
    startMining
  } = useApp();

  const currentLvl = user?.minerLevel || 1;
  const currentLevelData = getMinerLevelFormula(currentLvl, currentLvl);
  const nextLevelData = currentLvl < MAX_MINER_LEVEL ? getMinerLevelFormula(currentLvl + 1, currentLvl) : null;

  const [claimSuccessFeedback, setClaimSuccessFeedback] = useState(false);
  const [isStartingMining, setIsStartingMining] = useState(false);

  const handleStartMining = async () => {
    try {
      setIsStartingMining(true);
      await startMining();
    } finally {
      setIsStartingMining(false);
    }
  };

  const handleClaim = async () => {
    if (isClaimingReward || unclaimedReward <= 0.0001) return;
    try {
      await claimMiningReward();
      setClaimSuccessFeedback(true);
      setTimeout(() => setClaimSuccessFeedback(false), 2500);
    } catch {
      // Handled in context
    }
  };

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const inAppBalance = user?.balance ?? 0;
  const walletBalance = user?.connectedWalletBalance ?? 0;
  const totalBalance = inAppBalance + walletBalance;

  return (
    <div className="flex flex-col gap-4 pb-24 pt-2">
      
      {/* 1. Asset Card: "My Asset Holding" */}
      <section className="bg-gradient-to-b from-[#0d162d] to-[#091024] rounded-2xl border border-slate-800/90 p-4 shadow-lg shadow-black/40 relative overflow-hidden">
        {/* Subtle decorative mesh */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#38bdf8]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-[#39ff14]" />
            {language === 'bn' ? 'আমার অ্যাসেট হোল্ডিং' : 'My Asset Holding'}
          </span>
          <span className="text-[11px] text-[#38bdf8] font-mono flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            1 TTE ≈ $0.00127 USD
          </span>
        </div>

        {/* Total TTE prominent display */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-400/60 shadow-[0_0_10px_rgba(234,179,8,0.3)] shrink-0 bg-slate-900">
              <img src={tteLogoImg} alt="TTE Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">
                {language === 'bn' ? 'মোট ব্যালেন্স' : 'Total Balance'}
              </div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight flex items-baseline gap-1.5">
                <span className="font-mono tabular-nums">{totalBalance.toFixed(2)}</span>
                <span className="text-sm font-bold text-[#39ff14]">TTE</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-[11px] text-slate-400 font-medium">Estimated USD</div>
            <div className="text-base font-bold text-slate-200 font-mono tabular-nums">
              ≈ ${(totalBalance * 0.00127).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Sub-breakdown rows */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80">
          <div className="bg-[#060913]/60 rounded-xl p-2.5 border border-slate-800/60 transition-all hover:border-[#39ff14]/30">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
              <span>{language === 'bn' ? 'ইন-অ্যাপ ব্যালেন্স' : 'In-App Balance'}</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse"></span>
                <span className="text-[9px] text-[#39ff14] font-mono font-bold tracking-wider">LIVE</span>
              </span>
            </div>
            <div className="text-sm font-bold text-white font-mono tabular-nums">
              {inAppBalance.toFixed(2)} <span className="text-[11px] font-sans text-slate-400 font-normal">TTE</span>
            </div>
          </div>

          <div className="bg-[#060913]/60 rounded-xl p-2.5 border border-slate-800/60">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
              <span>{language === 'bn' ? 'ওয়ালেট ব্যালেন্স' : 'Wallet Balance'}</span>
              <Wallet className="w-3 h-3 text-[#38bdf8]" />
            </div>
            <div className="text-sm font-bold text-white font-mono tabular-nums">
              {walletBalance.toFixed(2)} <span className="text-[11px] font-sans text-slate-400 font-normal">TTE</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Miner Card */}
      <section className="bg-gradient-to-b from-[#0b1428] via-[#091122] to-[#060c1c] rounded-3xl border border-slate-800/90 p-4 shadow-xl shadow-black/50 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#39ff14]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Card Info Row */}
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-display font-black text-white tracking-wide">
                Level {currentLvl} / 10,000 Miner
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gradient-to-r from-amber-400/20 to-emerald-400/20 text-amber-300 border border-amber-400/30">
                1 - 10,000 Levels
              </span>
              {isMiningActive ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#39ff14]/15 text-[#39ff14] border border-[#39ff14]/40 shadow-[0_0_8px_rgba(57,255,20,0.3)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse"></span>
                  MINING ACTIVE
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-400/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  READY TO START
                </span>
              )}
            </div>

            {/* Level Tier Name & Quick Store Link */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-display font-bold text-sky-400">
                {currentLevelData.tierName || 'Genesis Node'}
              </span>
              <span className="text-[10px] text-slate-500">•</span>
              <button
                onClick={() => setCurrentTab('miners')}
                className="text-xs font-bold text-[#39ff14] hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>Store (1 - 10,000)</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Speed: </span>
              <span className="text-white font-mono font-bold">{effectiveHashPower} TH/s</span>
              {boostMultiplier > 0 && (
                <span className="text-[#39ff14] font-semibold text-[11px] bg-[#39ff14]/10 px-1 rounded">
                  +{boostMultiplier}% Boost
                </span>
              )}
            </div>
          </div>

          {/* Active time / Boost remaining */}
          <div className="text-right">
            {boostTimeRemaining > 0 ? (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-[#38bdf8] text-[11px] font-mono">
                <Clock className="w-3 h-3 animate-spin" />
                <span>{formatTime(boostTimeRemaining)}</span>
              </div>
            ) : isMiningActive ? (
              <span className="text-[11px] text-[#39ff14] font-mono flex items-center gap-1">
                <Activity className="w-3 h-3 text-[#39ff14] animate-pulse" />
                24/7 Running
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                Standby
              </span>
            )}
          </div>
        </div>

        {/* 1 - 10,000 Levels Progression Bar */}
        <div className="mt-3 p-2.5 rounded-2xl bg-[#060913]/90 border border-slate-800/80 relative z-10">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">
              Progress: Level {currentLvl} of {MAX_MINER_LEVEL.toLocaleString()}
            </span>
            {nextLevelData && (
              <span className="text-amber-300 font-mono text-[11px] font-bold">
                Next: Lvl {nextLevelData.level} ({nextLevelData.upgradeCost.toLocaleString()} TTE)
              </span>
            )}
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0284c7] via-[#38bdf8] to-[#39ff14] transition-all duration-300 shadow-[0_0_8px_#39ff14]"
              style={{ width: `${Math.max(1, Math.min(100, (currentLvl / MAX_MINER_LEVEL) * 100))}%` }}
            ></div>
          </div>
        </div>

        {/* Center Mascot Coin Graphic */}
        <CoinMascot
          speedTh={isMiningActive ? effectiveHashPower : 0}
          boostMultiplier={boostMultiplier}
          onCoinTap={() => {
            if (!isMiningActive) {
              handleStartMining();
            }
          }}
        />

        {/* Offline Mining Status Badge */}
        <div className="relative z-10 flex items-center justify-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-sky-950/60 text-sky-300 border border-sky-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping"></span>
            ⚡ Background Offline Mining Active (Auto-earns when closed)
          </span>
        </div>

        {/* Unclaimed Virtual Mining Reward Counter */}
        <div className="relative z-10 bg-[#060913]/80 rounded-2xl p-3 border border-slate-800/80 mb-4 text-center">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-[#39ff14]" />
            <span>{language === 'bn' ? 'অদাবিকৃত ভার্চুয়াল মাইনিং রিওয়ার্ড' : 'Unclaimed Mining Reward'}</span>
          </div>

          <div className="text-2xl sm:text-3xl font-display font-extrabold text-[#39ff14] font-mono tabular-nums tracking-tight">
            +{unclaimedReward.toFixed(4)} <span className="text-sm font-sans text-white">TTE</span>
          </div>

          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-[10px] text-slate-400">
              Generating ~{((effectiveHashPower * 24 * 0.8) / 24).toFixed(3)} TTE / hour
            </span>
            <span className="text-[10px] text-slate-400">·</span>
            <span className="text-[10px] text-[#38bdf8] font-medium">Virtual TTE Points</span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        {!isMiningActive ? (
          <div className="relative z-10">
            <button
              onClick={handleStartMining}
              disabled={isStartingMining}
              className="w-full min-h-[52px] px-4 py-3 rounded-2xl bg-gradient-to-r from-[#22c55e] via-[#39ff14] to-[#22c55e] text-black font-display font-black text-base flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(57,255,20,0.4)] hover:brightness-110 active:scale-[0.98] transition-all"
            >
              {isStartingMining ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-black" />
                  <span>STARTING QUANTUM NODE...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-black stroke-black" />
                  <span>START MINING (LEVEL {currentLvl} / 10,000)</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-1.5">
              Click Start to launch your 24/7 quantum node. Points continue to accumulate even offline!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 relative z-10">
            {/* UPGRADE Button (Secondary Blue Action) */}
            <button
              onClick={() => setCurrentTab('miners')}
              className="min-h-[48px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white font-display font-bold text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-[#0284c7]/20 border border-[#38bdf8]/40 active:scale-[0.98] transition-all"
              aria-label="Upgrade Miner"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{language === 'bn' ? 'আপগ্রেড (১-১০,০০০)' : 'UPGRADE (1 - 10,000)'}</span>
              <ArrowUpRight className="w-4 h-4 text-sky-200" />
            </button>

            {/* CLAIM REWARD Button (Neon Lime Primary Action) */}
            <button
              onClick={handleClaim}
              disabled={isClaimingReward || unclaimedReward <= 0.0001}
              className={`min-h-[48px] px-4 py-2.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-1.5 shadow-lg active:scale-[0.98] transition-all ${
                unclaimedReward > 0.0001 && !isClaimingReward
                  ? 'bg-gradient-to-r from-[#22c55e] to-[#39ff14] text-black shadow-[#39ff14]/30 hover:brightness-110 border border-[#39ff14]'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
              }`}
              aria-label="Claim Virtual Mining Reward"
            >
              {isClaimingReward ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>CLAIMING...</span>
                </>
              ) : claimSuccessFeedback ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>CLAIMED ✓</span>
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4 fill-black" />
                  <span>{language === 'bn' ? 'রিওয়ার্ড ক্লেইম' : 'CLAIM REWARD'}</span>
                </>
              )}
            </button>
          </div>
        )}

      </section>

      {/* 3. BOOST HASH POWER Banner Card */}
      <section className="bg-gradient-to-r from-[#091122] via-[#0d1b36] to-[#091122] rounded-2xl border border-[#39ff14]/30 p-4 shadow-lg shadow-black/40 relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-[#39ff14]/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/40 mb-1.5">
              <Flame className="w-3 h-3 fill-[#39ff14]" />
              BOOST HASH POWER
            </div>
            <h3 className="font-display font-bold text-base text-white">
              {language === 'bn' ? 'হ্যাশ পাওয়ার বুস্ট করুন' : 'Watch Rewarded Ads'}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed max-w-[240px]">
              Watch rewarded ads to increase your virtual mining power (+5% per ad).
            </p>
          </div>

          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-700/80 shadow-inner">
            <img
              src={boostBannerImg}
              alt="Hash Power Booster"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Stats and Action */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/80 relative z-10">
          <div>
            <div className="text-[10px] text-slate-400">Current Hash Power</div>
            <div className="text-sm font-bold text-white font-mono">
              {effectiveHashPower} TH/s
              <span className="text-[#39ff14] text-xs font-semibold ml-1">
                (+{adConfig?.rewardPercentPerAd || 5}% per ad)
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsBoostModalOpen(true)}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#22c55e] to-[#39ff14] text-black font-display font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#39ff14]/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <span>{language === 'bn' ? 'বিজ্ঞাপন দেখে বুস্ট' : 'WATCH ADS & BOOST'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-black stroke-[3]" />
          </button>
        </div>
      </section>

      {/* Mini Quick Tasks Strip */}
      <section className="bg-[#091024]/80 rounded-2xl border border-slate-800/80 p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Daily Tasks Available</div>
            <div className="text-[11px] text-slate-400">Earn up to +45 TTE today</div>
          </div>
        </div>
        <button
          onClick={() => setCurrentTab('tasks')}
          className="text-xs font-bold text-[#38bdf8] hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/20"
        >
          View Tasks
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </section>

    </div>
  );
};
