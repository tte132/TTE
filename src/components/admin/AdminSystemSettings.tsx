import React, { useState } from 'react';
import { Settings, Save, AlertTriangle, ToggleLeft, ToggleRight, Check, ShieldAlert, Globe } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { SystemSettings } from '../../types/admin';

export const AdminSystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>(adminService.getSystemSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (key: keyof SystemSettings, val: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminService.saveSystemSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-black text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-400" />
            <span>General Platform & Network Control</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global system identifiers, coin branding, Telegram URLs, and Scheduled Network Maintenance Mode
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>General Platform Settings updated and active across all nodes!</span>
        </div>
      )}

      {/* SPECIAL MAINTENANCE MODE CARD */}
      <div className={`p-6 rounded-3xl border transition-all ${
        settings.maintenanceMode
          ? 'bg-rose-950/40 border-rose-500/80 shadow-[0_0_30px_rgba(244,63,94,0.25)]'
          : 'bg-[#080f21] border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-3 rounded-2xl ${settings.maintenanceMode ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'}`}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-base text-white">
                  Scheduled Maintenance Mode
                </h3>
                {settings.maintenanceMode && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                    ACTIVE ACROSS APP
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">
                When enabled, the User Panel displays: <em className="text-slate-200">"TIME TO EARN is temporarily under maintenance."</em> The Admin Panel remains accessible to authorized staff.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              settings.maintenanceMode
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            {settings.maintenanceMode ? <ToggleRight className="w-5 h-5 text-white" /> : <ToggleLeft className="w-5 h-5" />}
            <span>{settings.maintenanceMode ? 'DISABLE MAINTENANCE' : 'ENABLE MAINTENANCE'}</span>
          </button>
        </div>

        {settings.maintenanceMode && (
          <div className="mt-4 pt-4 border-t border-rose-900/60">
            <label className="block text-xs font-semibold text-rose-300 mb-1">
              Custom Maintenance Message Shown to Users:
            </label>
            <input
              type="text"
              value={settings.maintenanceMessage}
              onChange={(e) => handleChange('maintenanceMessage', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-rose-800 text-white text-xs font-medium"
            />
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Token & Brand Identifiers */}
        <div className="bg-[#080f21] rounded-3xl border border-slate-800 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-display">
            Branding & Token Economy
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Application Name</label>
              <input
                type="text"
                value={settings.appName}
                onChange={(e) => handleChange('appName', e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Virtual Token Name</label>
              <input
                type="text"
                value={settings.coinName}
                onChange={(e) => handleChange('coinName', e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Token Symbol</label>
              <input
                type="text"
                value={settings.symbol}
                onChange={(e) => handleChange('symbol', e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-amber-300 font-mono font-bold text-xs"
              />
            </div>
          </div>
        </div>

        {/* Feature Switches */}
        <div className="bg-[#080f21] rounded-3xl border border-slate-800 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-display">
            Global Feature Killswitches
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: 'miningEnabled', label: 'Virtual Mining Engine' },
              { key: 'withdrawalsEnabled', label: 'Withdrawal Cashouts' },
              { key: 'referralsEnabled', label: 'Referral Rewards' },
              { key: 'adsEnabled', label: 'Rewarded Video Boosts' },
            ].map(({ key, label }) => {
              const active = (settings as any)[key];
              return (
                <div
                  key={key}
                  onClick={() => handleChange(key as any, !active)}
                  className={`p-3.5 rounded-2xl border cursor-pointer select-none transition-all ${
                    active ? 'bg-[#39ff14]/10 border-[#39ff14]/30' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <span className="text-xs font-semibold text-white block">{label}</span>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={`w-2 h-2 rounded-full ${active ? 'bg-[#39ff14]' : 'bg-slate-600'}`}></span>
                    <span className={`text-[10px] font-bold uppercase ${active ? 'text-[#39ff14]' : 'text-slate-500'}`}>
                      {active ? 'ENABLED' : 'PAUSED'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Community & Official URLs */}
        <div className="bg-[#080f21] rounded-3xl border border-slate-800 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-display">
            Official Community & Support Links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Telegram Community Group</label>
              <input
                type="url"
                value={settings.telegramUrl}
                onChange={(e) => handleChange('telegramUrl', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Telegram Support Bot</label>
              <input
                type="url"
                value={settings.supportUrl}
                onChange={(e) => handleChange('supportUrl', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="py-3 px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-[#39ff14] text-slate-950 font-display font-black text-sm flex items-center gap-2 shadow-xl shadow-amber-400/20"
          >
            <Save className="w-4 h-4 text-black" />
            <span>SAVE SYSTEM CONFIGURATION</span>
          </button>
        </div>

      </form>
    </div>
  );
};
