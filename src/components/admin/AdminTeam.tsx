import React, { useState } from 'react';
import { Users, Shield, Plus, Check, ShieldCheck, Lock } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminUser, AdminRole } from '../../types/admin';

export const AdminTeam: React.FC = () => {
  const currentAdmin = adminService.getCurrentAdmin();
  const [team, setTeam] = useState<AdminUser[]>([
    {
      id: 'adm_super_01',
      name: 'TTE Operations Director',
      email: 'admin@timetoearn.io',
      role: 'super_admin',
      status: 'active',
      twoFactorEnabled: true,
      createdAt: '2026-01-01',
      lastLoginAt: new Date().toISOString(),
    },
    {
      id: 'adm_support_01',
      name: 'Support Agent Alpha',
      email: 'support@timetoearn.io',
      role: 'support',
      status: 'active',
      twoFactorEnabled: true,
      createdAt: '2026-02-15',
      lastLoginAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);

  const [feedback, setFeedback] = useState<string | null>(null);

  const isSuperAdmin = currentAdmin?.role === 'super_admin';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-black text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-400" />
            <span>Staff Administration & Role Permissions</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Granular access control: Super Admin (Unrestricted), Admin (Operations & Payouts), Support (Read-only Profiles)
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Role explanation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#080f21] border border-amber-400/30">
          <span className="text-[10px] font-bold text-amber-300 uppercase">SUPER ADMIN</span>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Full root authority. Can manage other admins, change financial parameters, and reload Telegram Bot.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#080f21] border border-[#38bdf8]/30">
          <span className="text-[10px] font-bold text-[#38bdf8] uppercase">ADMIN</span>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Operations control: Users management, ad networks, verification approvals, and basic payouts.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#080f21] border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase">SUPPORT</span>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Customer assistance: Read-only user profiles, append admin notes, inspect KYC status. Cannot alter funds.
          </p>
        </div>
      </div>

      {/* Team Table */}
      <div className="bg-[#080f21] rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#040814] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">2FA Security</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {team.map((m) => (
                <tr key={m.id} className="hover:bg-slate-900/40">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{m.name}</span>
                    <span className="text-[11px] font-mono text-slate-400">{m.email}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        m.role === 'super_admin'
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                          : m.role === 'admin'
                          ? 'bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {m.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#39ff14] font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Enforced</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 uppercase">
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {new Date(m.lastLoginAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
