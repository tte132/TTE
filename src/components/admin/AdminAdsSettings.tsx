import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Save, 
  ToggleLeft, 
  ToggleRight, 
  Check, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Flame, 
  Link2, 
  ExternalLink, 
  Sparkles, 
  Radio, 
  RefreshCw,
  Copy,
  AlertCircle
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdSettings } from '../../types/admin';

export const AdminAdsSettings: React.FC = () => {
  const [settings, setSettings] = useState<AdSettings>(adminService.getAdSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testUrlFeedback, setTestUrlFeedback] = useState<string | null>(null);

  useEffect(() => {
    setSettings(adminService.getAdSettings());
  }, []);

  const handleChange = (key: keyof AdSettings, val: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await adminService.saveAdSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleTestLink = () => {
    if (!settings.rewardedAdUrl || !settings.rewardedAdUrl.startsWith('http')) {
      setTestUrlFeedback('Please enter a valid HTTP/HTTPS Ad URL before testing.');
      setTimeout(() => setTestUrlFeedback(null), 3000);
      return;
    }
    window.open(settings.rewardedAdUrl, '_blank', 'noopener,noreferrer');
    setTestUrlFeedback('Opening Ad Link in new window to verify playback...');
    setTimeout(() => setTestUrlFeedback(null), 4000);
  };

  const applyPreset = (url: string, name: string) => {
    setSettings((prev) => ({
      ...prev,
      rewardedAdUrl: url,
    }));
    setTestUrlFeedback(`Applied preset: ${name}`);
    setTimeout(() => setTestUrlFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-black text-white flex items-center gap-2">
            <Eye className="w-6 h-6 text-[#38bdf8]" />
            <span>Rewarded Ads & Hash Boost Engine</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure the live Rewarded Ad URL, hash power boosts, cooldown cycles, and real-time user synchronization.
          </p>
        </div>

        {/* Global Ads Toggle */}
        <button
          type="button"
          onClick={() => handleChange('enabled', !settings.enabled)}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            settings.enabled
              ? 'bg-[#39ff14]/20 border border-[#39ff14]/40 text-[#39ff14]'
              : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
          }`}
        >
          {settings.enabled ? <ToggleRight className="w-5 h-5 text-[#39ff14]" /> : <ToggleLeft className="w-5 h-5 text-rose-400" />}
          <span>{settings.enabled ? 'ADS SYSTEM: ENABLED' : 'ADS SYSTEM: DISABLED'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-[#39ff14]/15 border border-[#39ff14]/50 text-[#39ff14] text-xs font-bold flex items-center justify-between shadow-lg shadow-[#39ff14]/10 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <Check className="w-5 h-5 shrink-0" />
            <span>
              Ad Link & Parameters saved! The User Panel has been reloaded with the new ad link.
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-[#39ff14]/20 px-2 py-0.5 rounded border border-[#39ff14]/40">
            SYNC COMPLETE
          </span>
        </div>
      )}

      {testUrlFeedback && (
        <div className="p-3 rounded-xl bg-sky-500/15 border border-sky-500/40 text-sky-300 text-xs flex items-center gap-2">
          <ExternalLink className="w-4 h-4 shrink-0" />
          <span>{testUrlFeedback}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* ============================================================ */}
        {/* PROMINENT REWARDED ADS LINK INPUT BAR (THE USER'S MAIN REQUEST) */}
        {/* ============================================================ */}
        <div className="bg-gradient-to-b from-[#0a1630] to-[#060c1d] rounded-3xl border-2 border-[#39ff14]/40 p-5 sm:p-6 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#39ff14]/20 border border-[#39ff14]/50 flex items-center justify-center text-[#39ff14]">
                <Link2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-white font-display uppercase tracking-wide flex items-center gap-2">
                  <span>REWARDED ADS LINK / DIRECT URL</span>
                  <span className="text-[10px] text-amber-400 font-mono font-normal lowercase">(অ্যাড লিংক বসানোর বার)</span>
                </h2>
                <span className="text-[11px] text-slate-400">
                  This exact link runs automatically in the User Panel when users click "WATCH AD"
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#39ff14]/15 border border-[#39ff14]/30 text-[#39ff14] text-[10px] font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse"></span>
                <span>AUTO-RUN ON CLICK</span>
              </span>
            </div>
          </div>

          {/* Large Main Input Bar */}
          <div className="mt-3 space-y-3">
            <div className="relative flex flex-col sm:flex-row items-stretch gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Link2 className="w-4 h-4 text-[#39ff14]" />
                </div>
                <input
                  type="url"
                  required
                  placeholder="https://your-ad-network.com/direct-link-or-rewarded-video-url..."
                  value={settings.rewardedAdUrl || ''}
                  onChange={(e) => handleChange('rewardedAdUrl', e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-[#040814] border-2 border-slate-700 hover:border-[#38bdf8] focus:border-[#39ff14] text-white font-mono text-xs sm:text-sm focus:outline-none transition-all shadow-inner"
                />
              </div>

              {/* Action Buttons inside/adjacent to bar */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleTestLink}
                  className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-[#38bdf8] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Test ad link in new tab"
                >
                  <ExternalLink className="w-4 h-4 text-[#38bdf8]" />
                  <span>Test Link ↗</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSave()}
                  className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-[#39ff14] to-emerald-400 text-slate-950 font-display font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#39ff14]/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 text-black stroke-[2.5]" />
                  <span>SAVE & RELOAD AD</span>
                </button>
              </div>
            </div>

            {/* Quick Network Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-mono text-slate-400 mr-1">Quick Presets:</span>

              <button
                type="button"
                onClick={() => applyPreset('https://monetag.com/direct-link-demo?zoneid=tte_mini_app', 'Monetag Direct Link')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white text-[11px] font-mono flex items-center gap-1 transition-all"
              >
                <span>Monetag Direct Link</span>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('https://adsterra.com/direct-url-demo?placement=tte_boost', 'Adsterra Video URL')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-[#38bdf8] text-slate-300 hover:text-white text-[11px] font-mono flex items-center gap-1 transition-all"
              >
                <span>Adsterra URL</span>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('https://t.me/TTECommunity', 'Telegram Sponsor Channel')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-[#39ff14] text-slate-300 hover:text-white text-[11px] font-mono flex items-center gap-1 transition-all"
              >
                <span>Telegram Sponsor</span>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('https://timetoearn.io/ads/sponsored', 'TTE Default Web3')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-400 text-[11px] font-mono flex items-center gap-1 transition-all"
              >
                <span>Default Web3</span>
              </button>
            </div>

            {/* Status explanation */}
            <div className="p-3 rounded-xl bg-black/40 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>How it works:</strong> You paste your Monetag, Adsterra, or any ad partner link above. When you click <strong>Save & Reload Ad</strong>, the system broadcasts it to the User Panel. Next time any user clicks <strong>"Watch Ad"</strong> to boost hash power, this link opens directly and executes the ad playback!
              </span>
            </div>
          </div>

        </div>

        {/* Core Parameters */}
        <div className="bg-[#080f21] rounded-3xl border border-slate-800 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-display flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Cycle Configuration & Hash Boost Economics</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Ads per cycle */}
            <div className="bg-[#040814] rounded-2xl p-4 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Ads Per Mining Cycle (Default: 10)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.adsPerCycle}
                onChange={(e) => handleChange('adsPerCycle', parseInt(e.target.value, 10) || 10)}
                className="w-full px-3 py-2 rounded-xl bg-[#091224] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Number of ads to complete full cycle</span>
            </div>

            {/* Hash power boost per ad */}
            <div className="bg-[#040814] rounded-2xl p-4 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hash Power Boost Per Ad (%)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="50"
                value={settings.hashPowerBoostPercent}
                onChange={(e) => handleChange('hashPowerBoostPercent', parseFloat(e.target.value) || 5)}
                className="w-full px-3 py-2 rounded-xl bg-[#091224] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">E.g., +5% mining speed increase per ad</span>
            </div>

            {/* Maximum boost cap */}
            <div className="bg-[#040814] rounded-2xl p-4 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Maximum Hash Boost Cap (%)
              </label>
              <input
                type="number"
                step="5"
                min="10"
                max="200"
                value={settings.maxBoostPercent}
                onChange={(e) => handleChange('maxBoostPercent', parseFloat(e.target.value) || 50)}
                className="w-full px-3 py-2 rounded-xl bg-[#091224] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Ceiling limit (e.g., max +50% extra speed)</span>
            </div>

            {/* Cooldown duration */}
            <div className="bg-[#040814] rounded-2xl p-4 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Cycle Cooldown (Minutes)
              </label>
              <input
                type="number"
                step="10"
                min="5"
                value={settings.cooldownMinutes}
                onChange={(e) => handleChange('cooldownMinutes', parseInt(e.target.value, 10) || 180)}
                className="w-full px-3 py-2 rounded-xl bg-[#091224] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">180 mins = 3 hours cooldown after 10 ads</span>
            </div>

            {/* Daily ad limit */}
            <div className="bg-[#040814] rounded-2xl p-4 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Daily Ad Watch Limit Per User
              </label>
              <input
                type="number"
                step="5"
                min="10"
                value={settings.dailyAdLimit}
                onChange={(e) => handleChange('dailyAdLimit', parseInt(e.target.value, 10) || 30)}
                className="w-full px-3 py-2 rounded-xl bg-[#091224] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Prevents automated bot abuse</span>
            </div>

            {/* Minimum duration */}
            <div className="bg-[#040814] rounded-2xl p-4 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Minimum Watch Duration (Seconds)
              </label>
              <input
                type="number"
                step="1"
                min="5"
                max="60"
                value={settings.minWatchDurationSeconds}
                onChange={(e) => handleChange('minWatchDurationSeconds', parseInt(e.target.value, 10) || 15)}
                className="w-full px-3 py-2 rounded-xl bg-[#091224] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Anti-skip validation threshold</span>
            </div>

          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-[#38bdf8] via-[#39ff14] to-emerald-400 text-slate-950 font-display font-black text-sm flex items-center gap-2 shadow-xl shadow-[#38bdf8]/20 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-black stroke-[2.5]" />
            <span>SAVE ALL AD SETTINGS & BROADCAST</span>
          </button>
        </div>

      </form>
    </div>
  );
};
