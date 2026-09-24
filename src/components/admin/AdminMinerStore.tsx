import React, { useState, useEffect } from 'react';
import { ShoppingBag, Edit2, Check, Zap, Search, Layers } from 'lucide-react';
import { apiService, MAX_MINER_LEVEL, getMinerLevelFormula } from '../../services/api';
import { MinerLevel } from '../../types';

export const AdminMinerStore: React.FC = () => {
  const [levels, setLevels] = useState<MinerLevel[]>([]);
  const [editingLevel, setEditingLevel] = useState<MinerLevel | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [startLevel, setStartLevel] = useState<number>(1);
  const [searchLevel, setSearchLevel] = useState<string>('');

  useEffect(() => {
    loadLevels(startLevel);
  }, [startLevel]);

  const loadLevels = async (start: number) => {
    const data = await apiService.getMinerLevels(start, 12);
    setLevels(data);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(searchLevel, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= MAX_MINER_LEVEL) {
      setStartLevel(Math.max(1, Math.min(MAX_MINER_LEVEL - 11, parsed)));
      setSearchLevel('');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLevel) return;

    const updated = levels.map((l) => (l.level === editingLevel.level ? editingLevel : l));
    setLevels(updated);
    setEditingLevel(null);
    setFeedback(`Miner Level ${editingLevel.level} parameters updated successfully.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-black text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            <span>Miner Tier Store Management (Levels 1 - 10,000)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global catalog of 10,000 upgradeable miner nodes with dynamic hash rate scaling and TTE point costs
          </p>
        </div>

        {/* Quick Level Jump Form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              min="1"
              max={MAX_MINER_LEVEL}
              placeholder="Find Level (1 - 10,000)..."
              value={searchLevel}
              onChange={(e) => setSearchLevel(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#040814] border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-amber-400 w-48"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs"
          >
            Jump
          </button>
        </form>
      </div>

      {/* Quick Tier Selectors */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { label: 'Levels 1 - 12', start: 1 },
          { label: 'Levels 50 - 62', start: 50 },
          { label: 'Levels 100 - 112', start: 100 },
          { label: 'Levels 500 - 512', start: 500 },
          { label: 'Levels 1,000 - 1,012', start: 1000 },
          { label: 'Levels 2,500 - 2,512', start: 2500 },
          { label: 'Levels 5,000 - 5,012', start: 5000 },
          { label: 'Levels 9,988 - 10,000', start: 9988 },
        ].map((tier) => (
          <button
            key={tier.start}
            onClick={() => setStartLevel(tier.start)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all border ${
              startLevel === tier.start
                ? 'bg-amber-400 text-slate-950 font-bold border-amber-300'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            {tier.label}
          </button>
        ))}
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Grid of Miner Tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {levels.map((lvl) => (
          <div key={lvl.level} className="bg-[#080f21] rounded-3xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="font-display font-black text-white text-base">Level {lvl.level} Node</span>
                <span className="text-[10px] text-slate-400 block">{lvl.tierName || 'Virtual Rig'}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {lvl.efficiency}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Mining Speed:</span>
                <span className="font-mono font-bold text-[#39ff14]">{lvl.speed} TH/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Upgrade Cost:</span>
                <span className="font-mono text-amber-300 font-bold">{lvl.upgradeCost.toLocaleString()} TTE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Daily Return:</span>
                <span className="font-mono text-white">~{lvl.dailyRewardTTE} TTE/day</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setEditingLevel(lvl)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Configure Tier</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingLevel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#080f21] rounded-3xl border border-slate-700 max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-display">Configure Level {editingLevel.level}</h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hash Power (TH/s)</label>
                <input
                  type="number"
                  step="0.05"
                  value={editingLevel.speed}
                  onChange={(e) => setEditingLevel({ ...editingLevel, speed: parseFloat(e.target.value) || 0.1 })}
                  className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Upgrade Cost (TTE Points)</label>
                <input
                  type="number"
                  value={editingLevel.upgradeCost}
                  onChange={(e) => setEditingLevel({ ...editingLevel, upgradeCost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Reward Estimation (TTE)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editingLevel.dailyRewardTTE}
                  onChange={(e) => setEditingLevel({ ...editingLevel, dailyRewardTTE: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white font-mono text-xs"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLevel(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Save Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
