import React, { useState, useEffect } from 'react';
import { Layers, Plus, Check, ShieldCheck, ToggleLeft, ToggleRight, Trash2, Edit2, Link, ExternalLink } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdProvider } from '../../types/admin';

export const AdminAdProviders: React.FC = () => {
  const [providers, setProviders] = useState<AdProvider[]>(adminService.getAdProviders());
  const [editingProvider, setEditingProvider] = useState<AdProvider | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setProviders(adminService.getAdProviders());
  }, []);

  const handleSetActive = async (id: string) => {
    const updated = await adminService.setActiveProvider(id);
    setProviders(updated);
    setSuccessMsg(`Active ad provider switched to: ${updated.find((p) => p.id === id)?.name}`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSaveProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProvider) return;

    let updated: AdProvider[];
    if (providers.some((p) => p.id === editingProvider.id)) {
      updated = providers.map((p) => (p.id === editingProvider.id ? editingProvider : p));
    } else {
      updated = [...providers, editingProvider];
    }

    await adminService.saveAdProviders(updated);
    setProviders(updated);
    setEditingProvider(null);
    setSuccessMsg('Ad provider successfully configured.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDeleteProvider = async (id: string) => {
    const updated = providers.filter((p) => p.id !== id);
    await adminService.saveAdProviders(updated);
    setProviders(updated);
    setSuccessMsg('Provider removed.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-black text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-400" />
            <span>Ad Network Provider Adapters</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Safe controlled provider adapter system without injecting unverified third-party executable scripts
          </p>
        </div>

        <button
          onClick={() =>
            setEditingProvider({
              id: 'prov_' + Date.now().toString(36),
              name: 'New Ad Network',
              type: 'custom',
              appId: '',
              zoneId: '',
              placementId: '',
              directAdUrl: '',
              rewardedAdUrl: '',
              bannerUrl: '',
              interstitialUrl: '',
              status: 'disabled',
              priority: providers.length + 1,
              notes: 'Custom controlled adapter',
            })
          }
          className="h-10 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-[#39ff14] text-slate-950 font-display font-extrabold text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Add Ad Provider</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {providers.map((p) => (
          <div
            key={p.id}
            className={`p-5 rounded-3xl border transition-all relative ${
              p.status === 'active'
                ? 'bg-[#09152b] border-[#39ff14]/60 shadow-[0_0_24px_rgba(57,255,20,0.15)]'
                : 'bg-[#080f21] border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-white text-sm">{p.name}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  p.status === 'active'
                    ? 'bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {p.status}
              </span>
            </div>

            <div className="space-y-2 py-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Type:</span>
                <span className="font-mono text-amber-300">{p.type.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">App / SDK ID:</span>
                <span className="font-mono text-white">{p.appId || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Zone ID:</span>
                <span className="font-mono text-white">{p.zoneId || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Priority:</span>
                <span className="font-mono text-[#38bdf8]">Rank {p.priority}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 line-clamp-2">
              {p.notes}
            </p>

            <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingProvider(p)}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>

              {p.status !== 'active' ? (
                <button
                  onClick={() => handleSetActive(p.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#39ff14]/15 hover:bg-[#39ff14]/25 text-[#39ff14] border border-[#39ff14]/30 font-bold text-xs"
                >
                  Set Active
                </button>
              ) : (
                <span className="text-xs font-bold text-[#39ff14] font-mono">ACTIVE NETWORK</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Provider Modal */}
      {editingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#080f21] rounded-3xl border border-slate-700 max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <h3 className="text-base font-bold text-white font-display">Configure Ad Network Provider</h3>

            <form onSubmit={handleSaveProvider} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Provider Name</label>
                <input
                  type="text"
                  value={editingProvider.name}
                  onChange={(e) => setEditingProvider({ ...editingProvider, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Adapter Type</label>
                  <select
                    value={editingProvider.type}
                    onChange={(e) => setEditingProvider({ ...editingProvider, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white text-xs"
                  >
                    <option value="direct">Direct Network</option>
                    <option value="monetag">Monetag</option>
                    <option value="adsterra">Adsterra</option>
                    <option value="google_admob">Google AdMob</option>
                    <option value="custom">Custom Adapter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority Rank</label>
                  <input
                    type="number"
                    value={editingProvider.priority}
                    onChange={(e) => setEditingProvider({ ...editingProvider, priority: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">App / SDK ID</label>
                  <input
                    type="text"
                    value={editingProvider.appId}
                    onChange={(e) => setEditingProvider({ ...editingProvider, appId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Zone ID</label>
                  <input
                    type="text"
                    value={editingProvider.zoneId}
                    onChange={(e) => setEditingProvider({ ...editingProvider, zoneId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Rewarded Video Endpoint / URL</label>
                <input
                  type="url"
                  value={editingProvider.rewardedAdUrl}
                  onChange={(e) => setEditingProvider({ ...editingProvider, rewardedAdUrl: e.target.value })}
                  placeholder="https://provider.example/rewarded"
                  className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Notes / Adapter Details</label>
                <textarea
                  rows={2}
                  value={editingProvider.notes || ''}
                  onChange={(e) => setEditingProvider({ ...editingProvider, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setEditingProvider(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Save Provider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
