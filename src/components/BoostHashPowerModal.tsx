import React, { useState, useEffect } from 'react';
import { 
  X, 
  Flame, 
  Play, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Tv, 
  Loader2, 
  Volume2, 
  VolumeX,
  ExternalLink,
  Radio,
  RefreshCw,
  AlertTriangle 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { triggerHaptic } from '../utils/telegram';
import { adminService } from '../services/adminService';
import boostBannerImg from '../assets/images/tte_boost_banner_1790226645093.jpg';

export const BoostHashPowerModal: React.FC = () => {
  const {
    isBoostModalOpen,
    setIsBoostModalOpen,
    adConfig,
    watchRewardedAd,
    effectiveHashPower,
    boostMultiplier,
    adCooldownRemaining,
    language
  } = useApp();

  // Active Ad settings from Admin Panel
  const [adSettings, setAdSettings] = useState(() => adminService.getAdSettings());
  const [activeAdUrl, setActiveAdUrl] = useState(() => {
    return localStorage.getItem('tte_active_rewarded_ad_url_v3') || adminService.getActiveAdUrl();
  });

  // Simulated ad player states
  const [isPlayingAd, setIsPlayingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [adCompleted, setAdCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSubmittingReward, setIsSubmittingReward] = useState(false);
  const [adOpenedInNewTab, setAdOpenedInNewTab] = useState(false);

  // Sync with Admin Panel updates in real time
  useEffect(() => {
    const handleUpdate = (e: any) => {
      const current = adminService.getAdSettings();
      setAdSettings(current);
      setActiveAdUrl(current.rewardedAdUrl || 'https://timetoearn.io/ads/sponsored');
    };

    window.addEventListener('tte_ad_settings_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('tte_ad_settings_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const maxAds = adSettings?.adsPerCycle || adConfig?.maxAdsPerCycle || 10;
  const watchedCount = adConfig?.watchedCount || 0;
  const isLimitReached = watchedCount >= maxAds || adCooldownRemaining > 0;
  const adsRemaining = Math.max(0, maxAds - watchedCount);
  const boostPercent = adSettings?.hashPowerBoostPercent || 5;

  // Format seconds to hh:mm:ss
  const formatCountdown = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Ad Playback sequence with anti-abuse timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingAd && adCountdown > 0) {
      timer = setTimeout(() => {
        setAdCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isPlayingAd && adCountdown === 0) {
      setAdCompleted(true);
      triggerHaptic('success');
    }
    return () => clearTimeout(timer);
  }, [isPlayingAd, adCountdown]);

  // RUN AD: Triggered when user clicks "WATCH AD"
  const handleStartAd = () => {
    if (isLimitReached) return;
    triggerHaptic('medium');

    const targetUrl = activeAdUrl || adminService.getActiveAdUrl();

    // 1. Launch the ad link in Telegram WebApp or browser
    try {
      if ((window as any).Telegram?.WebApp?.openLink) {
        (window as any).Telegram.WebApp.openLink(targetUrl);
      } else {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
      setAdOpenedInNewTab(true);
    } catch (e) {
      console.warn('Ad link open fallback:', e);
    }

    // 2. Start in-app player countdown
    setIsPlayingAd(true);
    const duration = Math.min(15, Math.max(5, adSettings.minWatchDurationSeconds || 5));
    setAdCountdown(duration);
    setAdCompleted(false);
  };

  const handleManualOpenAd = () => {
    const targetUrl = activeAdUrl || adminService.getActiveAdUrl();
    try {
      if ((window as any).Telegram?.WebApp?.openLink) {
        (window as any).Telegram.WebApp.openLink(targetUrl);
      } else {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
      setAdOpenedInNewTab(true);
    } catch {
      // fallback
    }
  };

  const handleClaimAdReward = async () => {
    if (!adCompleted || isSubmittingReward) return;
    try {
      setIsSubmittingReward(true);
      await watchRewardedAd();
      setIsPlayingAd(false);
      setAdCompleted(false);
      setAdOpenedInNewTab(false);
    } catch {
      // Handled in context toast
    } finally {
      setIsSubmittingReward(false);
    }
  };

  if (!isBoostModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4">
      
      {/* Modal Card Sheet */}
      <div className="bg-[#0b1428] rounded-t-3xl sm:rounded-3xl border border-slate-700 w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar p-5 shadow-2xl relative animate-in slide-in-from-bottom duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => {
            if (!isPlayingAd) setIsBoostModalOpen(false);
          }}
          disabled={isPlayingAd}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#39ff14]/25 to-[#38bdf8]/15 border border-[#39ff14]/40 flex items-center justify-center text-[#39ff14] shadow-[0_0_12px_rgba(57,255,20,0.25)]">
            <Flame className="w-6 h-6 fill-[#39ff14]" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-lg text-white">
              {language === 'bn' ? 'হ্যাশ পাওয়ার বুস্ট' : 'Hash Power Boost'}
            </h2>
            <p className="text-xs text-slate-400">
              Watch rewarded ads for instant temporary virtual hash rate
            </p>
          </div>
        </div>

        {/* Banner Card */}
        <div className="rounded-2xl overflow-hidden border border-slate-700/80 relative mb-4 h-28 flex items-center">
          <img
            src={boostBannerImg}
            alt="Rewarded Ad Boost"
            className="w-full h-full object-cover brightness-75"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-4">
            <span className="text-[10px] font-bold text-[#39ff14] uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse"></span>
              <span>LIVE REWARDED AD</span>
            </span>
            <div className="text-base font-extrabold text-white font-display">
              +{boostPercent}% Hash Power per Ad
            </div>
            <div className="text-xs text-slate-300">
              Duration: 2 hours active duration
            </div>
          </div>
        </div>

        {/* Active Configured Ad Network Indicator */}
        <div className="bg-[#050b18] rounded-xl p-2.5 border border-slate-800 mb-3 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Ad Partner Link:</span>
          </span>
          <span className="font-mono text-emerald-400 truncate max-w-[180px]" title={activeAdUrl}>
            {activeAdUrl.replace(/^https?:\/\//, '').split('/')[0] || 'timetoearn.io'}
          </span>
        </div>

        {/* Today's Ad Progress Card */}
        <div className="bg-[#060913] rounded-2xl p-4 border border-slate-800 mb-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-white">Today's Ad Progress</span>
            <span className="font-mono font-bold text-[#39ff14]">
              {watchedCount} / {maxAds} Ads Watched
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0284c7] via-[#38bdf8] to-[#39ff14] transition-all duration-300 shadow-[0_0_10px_#39ff14]"
              style={{ width: `${Math.min(100, (watchedCount / maxAds) * 100)}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5">
            <span>Ads remaining: <strong className="text-white">{adsRemaining}</strong></span>
            <span>Reward: <strong className="text-[#39ff14]">+{boostPercent}% Hash Power</strong></span>
          </div>
        </div>

        {/* Current State Info */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="bg-[#081022] rounded-xl p-2.5 border border-slate-800">
            <div className="text-[10px] text-slate-400">Current Hash Power</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">
              {effectiveHashPower} TH/s
            </div>
          </div>

          <div className="bg-[#081022] rounded-xl p-2.5 border border-slate-800">
            <div className="text-[10px] text-slate-400">Active Boost Bonus</div>
            <div className="text-sm font-bold text-[#39ff14] font-mono mt-0.5">
              +{boostMultiplier}%
            </div>
          </div>
        </div>

        {/* Limit Reached Cooldown State */}
        {isLimitReached ? (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center mb-2">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <h4 className="font-display font-bold text-sm text-white">
              Ad Limit Reached
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Your next ad cycle will be available after the cooldown.
            </p>

            <div className="my-3 py-2 px-3 rounded-xl bg-black/40 border border-slate-800 inline-flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-mono">Next ads available in:</span>
              <span className="font-mono font-bold text-[#39ff14] text-base tabular-nums">
                {formatCountdown(adCooldownRemaining || 7200)}
              </span>
            </div>

            <button
              disabled
              className="w-full py-3 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed border border-slate-700"
            >
              COOLDOWN ACTIVE
            </button>
          </div>
        ) : (
          /* Normal Watch Ad Trigger: RUNS CONFIGURED AD LINK */
          <button
            onClick={handleStartAd}
            className="w-full min-h-[50px] py-3 px-4 rounded-2xl bg-gradient-to-r from-[#22c55e] via-[#39ff14] to-emerald-400 text-black font-display font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#39ff14]/30 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-black stroke-black" />
            <span>{language === 'bn' ? `বিজ্ঞাপন দেখুন (+${boostPercent}% বুস্ট)` : `WATCH AD (+${boostPercent}% HASH POWER)`}</span>
          </button>
        )}

        {/* Server Validation & Security Note */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 mt-3">
          <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>Real-time ad link sync active · Verified reward dispatch</span>
        </div>

      </div>

      {/* ======================================================== */}
      {/* INTERACTIVE AD PLAYER OVERLAY (RUNS THE CONFIGURED AD) */}
      {/* ======================================================== */}
      {isPlayingAd && (
        <div className="fixed inset-0 z-60 bg-black/95 flex flex-col justify-between p-4 animate-in fade-in duration-200">
          
          {/* Ad Top Bar */}
          <div className="flex items-center justify-between pt-safe">
            <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-full border border-slate-800 text-xs text-white">
              <Tv className="w-3.5 h-3.5 text-[#39ff14]" />
              <span>Running Configured Partner Ad</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-full bg-[#39ff14]/20 border border-[#39ff14]/40 text-[#39ff14] font-mono font-bold text-xs">
                {adCountdown > 0 ? `Reward in: ${adCountdown}s` : 'Reward Ready!'}
              </div>
            </div>
          </div>

          {/* Ad Video Simulation Center Canvas */}
          <div className="my-auto max-w-sm mx-auto w-full text-center p-6 bg-gradient-to-b from-slate-900 to-[#0b1428] rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden">
            
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#39ff14]/20 via-[#38bdf8]/20 to-purple-500/20 border border-[#39ff14]/40 mx-auto mb-4 flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.3)]">
              <Flame className="w-10 h-10 text-[#39ff14] animate-pulse" />
            </div>

            <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
              AD LINK ACTIVE & EXECUTING
            </span>

            <h3 className="text-base font-bold text-white font-display mt-2 mb-1 truncate px-2">
              {activeAdUrl.replace(/^https?:\/\//, '')}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              The sponsored ad has been dispatched in your browser window. Keep this screen open until the verification countdown completes.
            </p>

            {/* Click to re-open ad link if popup was blocked */}
            <div className="mb-4">
              <button
                type="button"
                onClick={handleManualOpenAd}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs text-sky-300 font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open / Re-visit Ad Page ↗</span>
              </button>
            </div>

            {/* Ad Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-[#38bdf8] to-[#39ff14] transition-all duration-1000 ease-linear"
                style={{ 
                  width: `${Math.min(100, Math.max(0, (( (adSettings.minWatchDurationSeconds || 5) - adCountdown) / (adSettings.minWatchDurationSeconds || 5)) * 100))}%` 
                }}
              ></div>
            </div>

            <span className="text-[11px] text-slate-400 font-mono">
              Do not close window before countdown completes
            </span>
          </div>

          {/* Ad Bottom Actions */}
          <div className="pb-safe max-w-sm mx-auto w-full">
            {adCompleted ? (
              <button
                onClick={handleClaimAdReward}
                disabled={isSubmittingReward}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#22c55e] via-[#39ff14] to-emerald-400 text-black font-display font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#39ff14]/40 active:scale-95 transition-all cursor-pointer"
              >
                {isSubmittingReward ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Verifying & Applying Boost...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5]" />
                    <span>CLAIM +{boostPercent}% HASH POWER BOOST</span>
                  </>
                )}
              </button>
            ) : (
              <div className="text-center py-3 text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#39ff14]" />
                <span>Verifying ad view ({adCountdown}s remaining)...</span>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
