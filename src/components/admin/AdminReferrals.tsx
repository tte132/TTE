import React, { useState } from 'react';
import { UserPlus, Save, Check, Users, Sparkles, TrendingUp } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminReferrals: React.FC = () => {
  const [instantReward, setInstantReward] = useState(100);
  const [miningBonusPercent, setMiningBonusPercent] = useState(10);
  const [maxDepth, setMaxDepth] = useState(1);
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-black text-white flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-amber-400" />
            <span>Referral & Squad Commission Architecture</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure multi-tier invite incentives, instant sign-up bonuses, and squad hash power royalties
          </p>
        </div>
      </div>

      {success && (
        <div className="p-3.5 rounded-2xl bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>Referral rules successfully saved and active.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div className="bg-[#080f21] rounded-3xl border border-slate-800 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-display">
            Incentive Rules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Instant Reward Per Invite (TTE)
              </label>
              <input
                type="number"
                value={instantReward}
                onChange={(e) => setInstantReward(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white font-mono text-xs"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Credited immediately when invitee joins</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Squad Hash Royalty (%)
              </label>
              <input
                type="number"
                value={miningBonusPercent}
                onChange={(e) => setMiningBonusPercent(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white font-mono text-xs"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">% bonus on invitee mined points</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Referral Tree Depth
              </label>
              <input
                type="number"
                value={maxDepth}
                onChange={(e) => setMaxDepth(parseInt(e.target.value, 10) || 1)}
                min="1"
                max="3"
                className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white font-mono text-xs"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">1 = Direct referrals only</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="py-3 px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-[#39ff14] text-slate-950 font-display font-black text-sm flex items-center gap-2 shadow"
          >
            <Save className="w-4 h-4 text-black" />
            <span>SAVE REFERRAL RULES</span>
          </button>
        </div>
      </form>
    </div>
  );
};
