import React, { useState, useEffect } from 'react';
import { Pickaxe, Save, RotateCcw, AlertTriangle, Check, ShieldCheck, Zap } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { MiningRewardSettings } from '../../types/admin';

export const AdminMiningSettings: React.FC = () => {
  const [settings, setSettings] = useState<MiningRewardSettings>(adminService.getMiningSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  useEffect(() => {
    setSettings(adminService.getMiningSettings());
  }, []);

  const handleChange = (key: keyof MiningRewardSettings, val: number) => {
    setSettings((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminService.saveMiningSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = async () => {
    const defaults = await adminService.resetMiningSettingsToDefault();
    setSettings(defaults);
    setShowConfirmReset(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-black text-white flex items-center gap-2">
            <Pickaxe className="w-6 h-6 text-amber-400" />
            <span>Mining & Reward Distribution Configuration</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global mining difficulty, hash speeds, claim intervals, and referral tier economics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowConfirmReset(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>Mining & Reward parameters successfully saved and synchronized with User Panel!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: Core Mining Parameters */}
        <div className="bg-[#080f21] rounded-3xl border border-slate-800 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-display flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#39ff14]" />
            <span>Core Quantum Mining Node Parameters</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Base Mining Speed */}
            <div className="bg-[#040814] rounded-2xl p-4 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Base Mining Speed (TH/s)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={settings.baseMiningSpeed}
                onChange={(e) => handleChange('baseMiningSpeed', parseFloat(e.target.value) || 0.05)}
                className="w-full px-3 py-2 rounded-xl bg-[#091224] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default speed for Level 1 miners</span>
            </div>

            {/* Reward Rate Multiplier */}
            <div className="bg-[#040814] rounded-2xl p-4 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Global Reward Rate Multiplier
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={settings.rewardRate}
                onChange={(e) => handleChange('rewardRate', parseFloat(e.target.value) || 1.0)}
                className="w-full px-3 py-2 rounded-xl bg-[#091224] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">1.0 = 100% normal distribution</span>
            </div>

            {/* Maximum Mining Level */}
            <div className="bg-[#040814] rounded-2xl p-4 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Maximum Mining Level (Max Tier Cap)
              </label>
              <input
                type="number"
                step="50"
                min="5"
                max="10000"
                value={settings.maxMiningLevel}
                onChange={(e) => handleChange('maxMiningLevel', parseInt(e.target.value, 10) || 10000)}
                className="w-full px-3 py-2 rounded-xl bg-[#091224] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Full 10,000 upgradeable miner levels active</span>
            </div>

            {/* Claim Interval */}
            <div className="bg-[#040814] rounded-2xl p-4 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Claim Interval (Seconds)
              </label>
              <input
                type="number"
                step="5"
                min="10"
                value={settings.claimIntervalSeconds}
                onChange={(e) => handleChange('claimIntervalSeconds', parseInt(e.target.value, 10) || 60)}
                className="w-full px-3 py-2 rounded-xl bg-[#091224] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Minimum time between manual claims</span>
            </div>

            {/* Minimum Claim Amount */}
            <div className="bg-[#040814] rounded-2xl p-4 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Minimum Claim Threshold (TTE)
              </label>
              <input
                type="number"
                step="0.001"
                min="0.001"
                value={settings.minClaimAmount}
                onChange={(e) => handleChange('minClaimAmount', parseFloat(e.target.value) || 0.01)}
                className="w-full px-3 py-2 rounded-xl bg-[#091224] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Accumulated reward required before claim</span>
            </div>

            {/* Daily Reward Limit */}
            <div className="bg-[#040814] rounded-2xl p-4 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Max Daily Reward Cap (TTE / user)
              </label>
              <input
                type="number"
                step="10"
                min="50"
                value={settings.dailyRewardLimit}
                onChange={(e) => handleChange('dailyRewardLimit', parseFloat(e.target.value) || 500)}
                className="w-full px-3 py-2 rounded-xl bg-[#091224] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Anti-inflation daily cap per account</span>
            </div>

          </div>
        </div>

        {/* Section 2: Referral & Social Rewards */}
        <div className="bg-[#080f21] rounded-3xl border border-slate-800 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-display flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Referrals, Onboarding & Check-In Rewards</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-[#040814] rounded-2xl p-4 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Instant Invite Reward (TTE)
              </label>
              <input
                type="number"
                step="10"
                value={settings.referralRewardInstant}
                onChange={(e) => handleChange('referralRewardInstant', parseFloat(e.target.value) || 100)}
                className="w-full px-3 py-2 rounded-xl bg-[#091224] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="bg-[#040814] rounded-2xl p-4 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Squad Mining Royalty (%)
              </label>
              <input
                type="number"
                step="1"
                min="1"
                max="50"
                value={settings.referralPercentage}
                onChange={(e) => handleChange('referralPercentage', parseFloat(e.target.value) || 10)}
                className="w-full px-3 py-2 rounded-xl bg-[#091224] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="bg-[#040814] rounded-2xl p-4 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Daily Check-In Base (TTE)
              </label>
              <input
                type="number"
                step="1"
                value={settings.dailyCheckinBaseReward}
                onChange={(e) => handleChange('dailyCheckinBaseReward', parseFloat(e.target.value) || 5)}
                className="w-full px-3 py-2 rounded-xl bg-[#091224] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="bg-[#040814] rounded-2xl p-4 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Welcome Bonus (TTE)
              </label>
              <input
                type="number"
                step="1"
                value={settings.welcomeReward}
                onChange={(e) => handleChange('welcomeReward', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-[#091224] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="py-3 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-[#39ff14] text-slate-950 font-display font-black text-sm flex items-center gap-2 shadow-xl shadow-amber-400/20 hover:brightness-110 active:scale-98 transition-all"
          >
            <Save className="w-4 h-4 text-black" />
            <span>SAVE REWARD SETTINGS</span>
          </button>
        </div>

      </form>

      {/* Reset Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0b1428] rounded-2xl border border-amber-400/40 max-w-sm w-full p-5 space-y-4">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Reset All Reward Settings?</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              This action will restore default TTE base mining speed (0.05 TH/s), 60s claim interval, and 10% squad commission.
            </p>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
