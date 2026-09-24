import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, Search, FileText, UserCheck, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { UserManagementItem } from '../../types/admin';

export const AdminVerification: React.FC = () => {
  const [users, setUsers] = useState<UserManagementItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserManagementItem | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setUsers(adminService.getUsersList());
  }, []);

  const handleApprove = async (userId: string) => {
    await adminService.verifyUser(userId, reviewNote || 'ID documents verified');
    setUsers(adminService.getUsersList());
    setSelectedUser(null);
    setReviewNote('');
    setFeedback('User verification approved.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleReject = async (userId: string) => {
    await adminService.rejectVerification(userId, reviewNote || 'Incomplete documentation');
    setUsers(adminService.getUsersList());
    setSelectedUser(null);
    setReviewNote('');
    setFeedback('Verification marked as rejected.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const pendingList = users.filter((u) => u.verificationStatus === 'PENDING' || u.verificationStatus === 'UNVERIFIED');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#38bdf8]" />
            <span>KYC & Identity Verification Queue</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review user account authenticity, Telegram verification status, and approve withdrawals eligibility
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Fresh State Check */}
      {pendingList.length === 0 ? (
        <div className="bg-[#080f21] rounded-3xl border border-slate-800 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-emerald-400">
            <UserCheck className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-white text-base">Verification Queue Pristine & Clean</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            There are currently no pending identity or KYC reviews. As users submit verification in the app, their requests will appear here instantly.
          </p>
        </div>
      ) : (
        <div className="bg-[#080f21] rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#040814] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Telegram ID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Registration</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {pendingList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block">{u.name}</span>
                      <span className="text-[11px] font-mono text-amber-400">@{u.username}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {u.telegramId}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/15 text-amber-300">
                        {u.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(u.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => handleApprove(u.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(u.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
