import React, { useState } from 'react';
import { Link2, ExternalLink, Check, ToggleLeft, ToggleRight, Save, Globe } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdLinkConfig } from '../../types/admin';

export const AdminAdLinks: React.FC = () => {
  const [links, setLinks] = useState<AdLinkConfig[]>(adminService.getAdLinks());
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleToggle = async (id: string) => {
    const updated = links.map((l) => (l.id === id ? { ...l, status: (l.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive' } : l));
    await adminService.saveAdLinks(updated);
    setLinks(updated);
    setSuccessMsg('Ad link status updated.');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleUrlChange = (id: string, url: string) => {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, url } : l)));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminService.saveAdLinks(links);
    setSuccessMsg('All ad destination URLs saved and active on backend!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-black text-white flex items-center gap-2">
            <Link2 className="w-6 h-6 text-[#38bdf8]" />
            <span>Ad Link & Destination URL Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure direct ad targets, rewarded video URLs, and partner tracking links without releasing new app versions
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        {links.map((link) => (
          <div key={link.id} className="bg-[#080f21] rounded-3xl border border-slate-800 p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">{link.type} Ad Target</span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {link.providerName}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleToggle(link.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    link.status === 'active'
                      ? 'bg-[#39ff14]/15 text-[#39ff14] border border-[#39ff14]/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {link.status === 'active' ? <ToggleRight className="w-4 h-4 text-[#39ff14]" /> : <ToggleLeft className="w-4 h-4" />}
                  <span className="uppercase text-[10px]">{link.status}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target URL (Backend Synchronized)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => handleUrlChange(link.id, e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#040814] border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>

                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Link</span>
                </a>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="py-3 px-8 rounded-2xl bg-gradient-to-r from-[#38bdf8] to-[#39ff14] text-slate-950 font-display font-black text-sm flex items-center gap-2 shadow-xl shadow-[#38bdf8]/20"
          >
            <Save className="w-4 h-4 text-black" />
            <span>SAVE AD LINKS</span>
          </button>
        </div>
      </form>
    </div>
  );
};
