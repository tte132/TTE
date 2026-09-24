import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Lock, 
  Check, 
  TrendingUp, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  X, 
  AlertCircle,
  Loader2,
  Coins,
  Search,
  ChevronRight,
  Flame,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MinerLevel } from '../types';
import { getMinerLevelFormula, MAX_MINER_LEVEL } from '../services/api';
import minerRigImg from '../assets/images/tte_miner_rig_1790226634866.jpg';

interface TierCategory {
  id: string;
  name: string;
  bnName: string;
  min: number;
  max: number;
  color: string;
}

const TIERS: TierCategory[] = [
  { id: 'tier_1', name: 'Genesis Nodes', bnName: 'জেনেসিস নোড', min: 1, max: 50, color: 'text-emerald-400' },
  { id: 'tier_2', name: 'Cyber Rigs', bnName: 'সাইবার রিগ', min: 51, max: 250, color: 'text-sky-400' },
  { id: 'tier_3', name: 'Quantum Nodes', bnName: 'কোয়ান্টাম নোড', min: 251, max: 1000, color: 'text-indigo-400' },
  { id: 'tier_4', name: 'Fusion Matrix', bnName: 'ফিউশন ম্যাট্রিক্স', min: 1001, max: 3000, color: 'text-purple-400' },
  { id: 'tier_5', name: 'Stellar Core', bnName: 'স্টেলার কোর', min: 3001, max: 6000, color: 'text-amber-400' },
  { id: 'tier_6', name: 'Galactic Titan', bnName: 'গ্যালাকটিক টাইটান', min: 6001, max: 8500, color: 'text-rose-400' },
  { id: 'tier_7', name: 'Cosmic Singularity', bnName: 'কসমিক সিঙ্গুলারিটি', min: 8501, max: 10000, color: 'text-[#39ff14]' },
];

export const MinersStoreView: React.FC = () => {
  const { 
    user, 
    upgradeMiner, 
    setIsBoostModalOpen,
    language 
  } = useApp();

  const currentLevelNum = user?.minerLevel || 1;
  const userBalance = user?.balance || 0;

  // Selected tier category
  const [selectedTierId, setSelectedTierId] = useState<string>(() => {
    const found = TIERS.find((t) => currentLevelNum >= t.min && currentLevelNum <= t.max);
    return found ? found.id : 'tier_1';
  });

  // Search/Jump to specific level (1 - 10,000)
  const [jumpInput, setJumpInput] = useState('');
  const [activeWindowStart, setActiveWindowStart] = useState<number>(() => {
    return Math.max(1, Math.min(MAX_MINER_LEVEL - 23, currentLevelNum - 1));
  });
  const [displayCount, setDisplayCount] = useState(24);

  // Upgrade modal state
  const [selectedMinerForUpgrade, setSelectedMinerForUpgrade] = useState<MinerLevel | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Active tier object
  const activeTier = TIERS.find((t) => t.id === selectedTierId) || TIERS[0];

  // Next immediate level object
  const nextLevel = useMemo(() => {
    if (currentLevelNum >= MAX_MINER_LEVEL) return null;
    return getMinerLevelFormula(currentLevelNum + 1, currentLevelNum);
  }, [currentLevelNum]);

  // Current level object
  const currentLevelData = useMemo(() => {
    return getMinerLevelFormula(currentLevelNum, currentLevelNum);
  }, [currentLevelNum]);

  // Calculate progress to next level
  const progressPercent = nextLevel && nextLevel.upgradeCost > 0
    ? Math.min(100, Math.max(5, Math.round((userBalance / nextLevel.upgradeCost) * 100)))
    : 100;

  // Generate levels to display for selected tier / window
  const displayedMiners = useMemo(() => {
    const start = Math.max(activeTier.min, activeWindowStart);
    const end = Math.min(activeTier.max, start + displayCount - 1);
    const length = Math.max(0, end - start + 1);

    return Array.from({ length }, (_, idx) => {
      const lvl = start + idx;
      return getMinerLevelFormula(lvl, currentLevelNum);
    });
  }, [activeTier, activeWindowStart, displayCount, currentLevelNum]);

  // Handle tier tab change
  const handleSelectTier = (tier: TierCategory) => {
    setSelectedTierId(tier.id);
    setActiveWindowStart(tier.min);
    setDisplayCount(24);
  };

  // Jump to specific level
  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lvl = parseInt(jumpInput, 10);
    if (isNaN(lvl) || lvl < 1 || lvl > MAX_MINER_LEVEL) return;

    const targetTier = TIERS.find((t) => lvl >= t.min && lvl <= t.max) || TIERS[0];
    setSelectedTierId(targetTier.id);
    setActiveWindowStart(Math.max(targetTier.min, Math.min(targetTier.max - 23, lvl - 2)));
    setDisplayCount(24);
    setJumpInput('');
  };

  const handleJumpToMyLevel = () => {
    const myTier = TIERS.find((t) => currentLevelNum >= t.min && currentLevelNum <= t.max) || TIERS[0];
    setSelectedTierId(myTier.id);
    setActiveWindowStart(Math.max(myTier.min, Math.min(myTier.max - 23, currentLevelNum - 1)));
    setDisplayCount(24);
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(activeTier.max - activeWindowStart + 1, prev + 24));
  };

  const handleOpenUpgradeModal = (miner: MinerLevel) => {
    setSelectedMinerForUpgrade(miner);
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedMinerForUpgrade) return;
    try {
      setIsUpgrading(true);
      await upgradeMiner(selectedMinerForUpgrade.level);
      setSelectedMinerForUpgrade(null);
    } catch {
      // Handled in context toast
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-24 pt-2">
      
      {/* 1. Top Summary Card: "MY LEVEL JOURNEY (1 - 10,000)" */}
      <section className="bg-gradient-to-b from-[#0d162d] to-[#091024] rounded-3xl border border-slate-800 p-4 sm:p-5 shadow-xl relative overflow-hidden">
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-display">
            <Zap className="w-3.5 h-3.5 text-[#39ff14]" />
            <span>{language === 'bn' ? 'আমার লেভেল জার্নি' : 'MY LEVEL JOURNEY'}</span>
          </span>
          <span className="text-[11px] text-[#39ff14] font-mono font-bold bg-[#39ff14]/15 px-2.5 py-0.5 rounded-full border border-[#39ff14]/30">
            {language === 'bn' ? 'সর্বোচ্চ লেভেল ১০,০০০' : 'Peak: Level 10,000'}
          </span>
        </div>

        {/* Level & Points metrics */}
        <div className="grid grid-cols-3 gap-2 py-2">
          <div className="bg-[#060913]/80 rounded-2xl p-3 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 font-semibold">Current Level</div>
            <div className="text-lg sm:text-xl font-display font-black text-[#39ff14] mt-0.5">
              Lvl {currentLevelNum}
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              {currentLevelData.tierName}
            </div>
          </div>

          <div className="bg-[#060913]/80 rounded-2xl p-3 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 font-semibold">Peak Cap</div>
            <div className="text-lg sm:text-xl font-display font-black text-[#38bdf8] mt-0.5">
              10,000
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              Cosmic God
            </div>
          </div>

          <div className="bg-[#060913]/80 rounded-2xl p-3 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 font-semibold">In-App Points</div>
            <div className="text-base sm:text-lg font-display font-bold text-white flex items-baseline gap-1 mt-0.5">
              <span className="text-[#39ff14] font-mono">{userBalance.toFixed(1)}</span>
              <span className="text-[10px] text-slate-400">TTE</span>
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              Balance
            </div>
          </div>
        </div>

        {/* Progress Bar to next level */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">
              {nextLevel ? `${progressPercent}% towards Level ${nextLevel.level}` : 'Max Level 10,000 Reached!'}
            </span>
            {nextLevel && (
              <span className="text-slate-400 text-[11px] font-mono">
                Need {nextLevel.upgradeCost.toLocaleString()} TTE Points
              </span>
            )}
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0284c7] via-[#38bdf8] to-[#39ff14] transition-all duration-500 shadow-[0_0_8px_#39ff14]"
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            ></div>
          </div>
        </div>

      </section>

      {/* Boost Callout */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0b1730]/70 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-[#39ff14]/20 border border-[#39ff14]/40 flex items-center justify-center text-[#39ff14] shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs text-slate-300 truncate">
            Need hash power faster? Watch rewarded ads for instant boost!
          </span>
        </div>
        <button
          onClick={() => setIsBoostModalOpen(true)}
          className="text-xs font-black text-[#39ff14] hover:underline whitespace-nowrap pl-2 cursor-pointer font-display"
        >
          Boost Now
        </button>
      </div>

      {/* 2. Jump to Level & My Level Quick Jump */}
      <div className="bg-[#070e20] p-3 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <form onSubmit={handleJumpSubmit} className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              min="1"
              max={MAX_MINER_LEVEL}
              placeholder="Jump to Level (1 - 10,000)..."
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#39ff14]"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-display font-bold text-xs border border-slate-600 active:scale-95 transition-all cursor-pointer"
          >
            Go
          </button>
        </form>

        <button
          type="button"
          onClick={handleJumpToMyLevel}
          className="px-3.5 py-2 rounded-xl bg-[#39ff14]/15 hover:bg-[#39ff14]/25 border border-[#39ff14]/40 text-[#39ff14] font-display font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>My Level ({currentLevelNum})</span>
        </button>
      </div>

      {/* 3. Tier Navigation Tabs (1 to 10,000) */}
      <div>
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 font-display">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Miner Tier (1 - 10,000)</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {activeTier.min.toLocaleString()} - {activeTier.max.toLocaleString()}
          </span>
        </div>

        {/* Scrollable Tier Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {TIERS.map((tier) => {
            const isSelected = tier.id === selectedTierId;
            const hasCurrent = currentLevelNum >= tier.min && currentLevelNum <= tier.max;

            return (
              <button
                key={tier.id}
                onClick={() => handleSelectTier(tier)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-500 via-[#39ff14] to-emerald-400 text-slate-950 border-[#39ff14] shadow-md shadow-[#39ff14]/20'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{language === 'bn' ? tier.bnName : tier.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isSelected ? 'bg-black/30 text-black font-extrabold' : 'bg-black/40 text-slate-400'
                }`}>
                  {tier.min}-{tier.max}
                </span>
                {hasCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Miners Grid */}
      <div className="flex items-center justify-between px-1 mt-1">
        <h3 className="text-sm font-display font-bold text-white tracking-wide flex items-center gap-1.5">
          <span>{language === 'bn' ? 'মাইনার রিগ তালিকা' : `${activeTier.name} (Tiers ${activeTier.min} - ${activeTier.max})`}</span>
        </h3>
        <span className="text-xs text-slate-400">
          Showing {displayedMiners.length} Nodes
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {displayedMiners.map((miner) => {
          const isCurrent = miner.level === currentLevelNum;
          const isOwned = miner.level < currentLevelNum;
          const isNext = miner.level === currentLevelNum + 1;
          const isLocked = miner.level > currentLevelNum + 1;
          const canAfford = userBalance >= miner.upgradeCost;
          const dailyVal = miner.dailyRewardTTE ?? miner.dailyRewardMRG ?? 0;

          return (
            <div
              key={miner.level}
              className={`rounded-2xl p-3.5 flex flex-col justify-between transition-all relative overflow-hidden ${
                isCurrent
                  ? 'bg-gradient-to-b from-[#0f2142] to-[#09142b] border-2 border-[#39ff14] shadow-[0_0_16px_rgba(57,255,20,0.25)]'
                  : isNext
                  ? 'bg-gradient-to-b from-[#0a162d] to-[#060e20] border-2 border-[#38bdf8]/80 hover:border-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                  : isOwned
                  ? 'bg-[#081022]/60 border border-slate-800/80 opacity-80'
                  : 'bg-[#060b18]/70 border border-slate-800/50 opacity-60'
              }`}
            >
              {/* Badge for Current Level */}
              {isCurrent && (
                <div className="absolute top-0 right-0 bg-[#39ff14] text-black text-[9px] font-extrabold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                  CURRENT
                </div>
              )}

              {isNext && (
                <div className="absolute top-0 right-0 bg-[#38bdf8] text-black text-[9px] font-extrabold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                  NEXT
                </div>
              )}

              {/* Top Row: Level and Points cost */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-display font-black text-white">
                    LEVEL {miner.level} / 10,000
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ≈ ${miner.usdValue}
                  </span>
                </div>

                {/* Miner Mini Rig Illustration */}
                <div className="my-2.5 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-xl bg-slate-900/90 border border-slate-800 p-1 relative flex items-center justify-center overflow-hidden">
                    <img
                      src={minerRigImg}
                      alt={`Miner Rig Level ${miner.level}`}
                      className="w-full h-full object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                        <Lock className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Speed & Daily Yield in TTE */}
                <div className="space-y-1 my-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Speed:</span>
                    <span className="font-mono font-bold text-white flex items-center gap-0.5">
                      <Cpu className="w-3 h-3 text-[#38bdf8]" />
                      {miner.speed} TH/s
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Daily Est:</span>
                    <span className="font-mono text-[#39ff14] text-[10px] font-semibold">
                      +{dailyVal} TTE
                    </span>
                  </div>
                  {miner.upgradeCost > 0 && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Cost:</span>
                      <span className="font-mono text-amber-300 font-bold text-[11px]">
                        {miner.upgradeCost.toLocaleString()} TTE
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-1.5 rounded-xl bg-[#39ff14]/20 border border-[#39ff14]/50 text-[#39ff14] text-[11px] font-bold flex items-center justify-center gap-1 cursor-default"
                  >
                    <Check className="w-3 h-3" />
                    <span>ACTIVE NODE</span>
                  </button>
                ) : isOwned ? (
                  <button
                    disabled
                    className="w-full py-1.5 rounded-xl bg-slate-800 text-slate-400 text-[11px] font-medium flex items-center justify-center gap-1 cursor-default"
                  >
                    <span>UNLOCKED</span>
                  </button>
                ) : isNext ? (
                  <button
                    onClick={() => handleOpenUpgradeModal(miner)}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded-xl text-[11px] font-extrabold font-display flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-gradient-to-r from-emerald-500 via-[#39ff14] to-emerald-400 text-black shadow-md shadow-[#39ff14]/30 hover:brightness-110 active:scale-95'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <Zap className="w-3 h-3 fill-black" />
                        <span>UPGRADE</span>
                      </>
                    ) : (
                      <span>NEED {miner.upgradeCost.toLocaleString()} TTE</span>
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-1.5 rounded-xl bg-slate-900 text-slate-500 text-[11px] font-medium flex items-center justify-center gap-1 border border-slate-800/80 cursor-not-allowed"
                  >
                    <Lock className="w-3 h-3" />
                    <span>LOCKED</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Load More Levels in this Tier */}
      {displayedMiners.length < (activeTier.max - activeWindowStart + 1) && (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white inline-flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronDown className="w-4 h-4 text-[#39ff14]" />
            <span>Load More Nodes in {activeTier.name} (+24)</span>
          </button>
        </div>
      )}

      {/* 5. Upgrade Confirmation Modal */}
      {selectedMinerForUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0b1428] rounded-3xl border border-slate-700 max-w-sm w-full p-5 shadow-2xl relative animate-in fade-in duration-200">
            
            <button
              onClick={() => setSelectedMinerForUpgrade(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#39ff14]/25 to-[#38bdf8]/15 border border-[#39ff14]/40 flex items-center justify-center text-[#39ff14]">
                <Zap className="w-6 h-6 fill-[#39ff14]" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base text-white">
                  Upgrade to Level {selectedMinerForUpgrade.level} / 10,000
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedMinerForUpgrade.tierName || 'Node'}
                </p>
              </div>
            </div>

            <div className="bg-[#060913] rounded-2xl p-4 border border-slate-800 space-y-2 mb-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Hash Rate Increase:</span>
                <span className="font-mono font-bold text-[#39ff14]">
                  {currentLevelData.speed} TH/s → {selectedMinerForUpgrade.speed} TH/s
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Est Daily Yield:</span>
                <span className="font-mono text-white">
                  +{selectedMinerForUpgrade.dailyRewardTTE} TTE / day
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Required Points:</span>
                <span className="font-mono font-bold text-amber-300">
                  {selectedMinerForUpgrade.upgradeCost.toLocaleString()} TTE Points
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Your Current Balance:</span>
                <span className="font-mono font-bold text-white">
                  {userBalance.toFixed(2)} TTE
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirmUpgrade}
              disabled={isUpgrading || userBalance < selectedMinerForUpgrade.upgradeCost}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-[#39ff14] to-emerald-400 text-slate-950 font-display font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#39ff14]/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              {isUpgrading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>UPGRADING QUANTUM NODE...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3] text-black" />
                  <span>CONFIRM UPGRADE (LEVEL {selectedMinerForUpgrade.level} / 10,000)</span>
                </>
              )}
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
