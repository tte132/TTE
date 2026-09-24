import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  ShieldAlert, 
  UserX, 
  UserCheck, 
  KeyRound, 
  FileText, 
  ExternalLink, 
  X, 
  Check, 
  AlertCircle, 
  Plus,
  Coins,
  Zap,
  Calendar,
  Phone,
  Mail,
  Send,
  Loader2,
  Clock
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { UserManagementItem } from '../../types/admin';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserManagementItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'VERIFIED' | 'UNVERIFIED' | 'SUSPENDED' | 'ACTIVE'>('ALL');
  const [selectedUser, setSelectedUser] = useState<UserManagementItem | null>(null);
  
  // Action Modals State
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [suspendReason, setSuspendReason] = useState('');
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [tempPasswordResult, setTempPasswordResult] = useState<{ code: string; expires: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const list = adminService.getUsersList();
    setUsers(list);
  };

  const handleCreateTestUser = () => {
    // Allows admin to register a real user when desired, but starts completely empty by default
    const count = users.length + 1;
    const newUser: UserManagementItem = {
      id: `usr_tte_${Date.now().toString(36)}`,
      name: `Telegram Miner ${count}`,
      username: `miner_${count}`,
      email: `user${count}@telegramexample.com`,
      phone: `+1 (555) 019-${1000 + count}`,
      telegramId: `${890000000 + count}`,
      registrationDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      verificationStatus: 'UNVERIFIED',
      accountStatus: 'ACTIVE',
      miningLevel: 1,
      miningSpeed: 0.05,
      rewardBalance: 0.0,
      referralCount: 0,
      totalEarned: 0.0,
      totalWithdrawn: 0.0,
      walletAddress: '',
      adminNotes: ['Account freshly created via verified Telegram link.'],
    };

    const updated = [newUser, ...users];
    adminService.saveUsersList(updated);
    setUsers(updated);
    setActionSuccess(`Fresh user registered: @${newUser.username}`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // User Actions
  const handleVerify = async (userId: string) => {
    setIsProcessing(true);
    await adminService.verifyUser(userId, 'Verified by Admin review.');
    loadUsers();
    if (selectedUser?.id === userId) {
      setSelectedUser((prev) => (prev ? { ...prev, verificationStatus: 'VERIFIED' } : null));
    }
    setActionSuccess('User successfully verified.');
    setIsProcessing(false);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleSuspend = async () => {
    if (!selectedUser) return;
    setIsProcessing(true);
    await adminService.suspendUser(selectedUser.id, suspendReason || 'Terms violation review');
    loadUsers();
    setSelectedUser((prev) => (prev ? { ...prev, accountStatus: 'SUSPENDED' } : null));
    setShowSuspendModal(false);
    setSuspendReason('');
    setActionSuccess('User account has been suspended.');
    setIsProcessing(false);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleUnsuspend = async (userId: string) => {
    setIsProcessing(true);
    await adminService.unsuspendUser(userId);
    loadUsers();
    if (selectedUser?.id === userId) {
      setSelectedUser((prev) => (prev ? { ...prev, accountStatus: 'ACTIVE' } : null));
    }
    setActionSuccess('User account unsuspended and active.');
    setIsProcessing(false);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleAddNote = async (userId: string) => {
    if (!adminNoteInput.trim()) return;
    await adminService.addAdminNote(userId, adminNoteInput.trim());
    loadUsers();
    if (selectedUser?.id === userId) {
      setSelectedUser((prev) =>
        prev
          ? {
              ...prev,
              adminNotes: [...prev.adminNotes, `[${new Date().toLocaleDateString()}] ${adminNoteInput.trim()}`],
            }
          : null
      );
    }
    setAdminNoteInput('');
    setActionSuccess('Admin note appended to permanent record.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleSendPasswordReset = async (userId: string) => {
    setIsProcessing(true);
    const res = await adminService.sendPasswordReset(userId);
    setIsProcessing(false);
    setActionSuccess(res.message);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleGenerateTempPassword = async (userId: string) => {
    setIsProcessing(true);
    const res = await adminService.generateTemporaryPassword(userId);
    setTempPasswordResult({ code: res.tempCode, expires: res.expiresMinutes });
    setIsProcessing(false);
  };

  // Filtering
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.telegramId.includes(searchQuery) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'VERIFIED') return u.verificationStatus === 'VERIFIED';
    if (statusFilter === 'UNVERIFIED') return u.verificationStatus === 'UNVERIFIED';
    if (statusFilter === 'SUSPENDED') return u.accountStatus === 'SUSPENDED';
    if (statusFilter === 'ACTIVE') return u.accountStatus === 'ACTIVE';

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            <span>User Accounts & Security Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real registered user records, verification state, suspensions, and access security
          </p>
        </div>

        <button
          onClick={handleCreateTestUser}
          className="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4 text-[#39ff14]" />
          <span>Simulate Telegram User Registration</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-[#080f21] rounded-2xl border border-slate-800 p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, Username, Telegram ID, Email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#040814] border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
          {(['ALL', 'VERIFIED', 'UNVERIFIED', 'SUSPENDED', 'ACTIVE'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === filter
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table / Empty State */}
      <div className="bg-[#080f21] rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        {filteredUsers.length === 0 ? (
          /* Pristine Fresh State (as user requested) */
          <div className="p-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-base text-white">
              {users.length === 0 ? 'No Users Registered Yet' : 'No Users Match Search Criteria'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              {users.length === 0
                ? 'The database is completely fresh and clean. New users will appear here automatically when they start the Telegram Bot or launch the Mini App.'
                : 'Try adjusting your search query or switching filters to view users.'}
            </p>
            {users.length === 0 && (
              <button
                onClick={handleCreateTestUser}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Simulate 1st Telegram User</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#040814] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Telegram ID</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Mining Level</th>
                  <th className="py-3.5 px-4">Reward Balance</th>
                  <th className="py-3.5 px-4">Registration</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-900/40 transition-colors">
                    {/* User info */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-white block">{user.name}</span>
                        <span className="text-[11px] text-amber-400 font-mono block">@{user.username}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{user.id}</span>
                      </div>
                    </td>

                    {/* Telegram ID */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {user.telegramId}
                    </td>

                    {/* Verification Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          user.verificationStatus === 'VERIFIED'
                            ? 'bg-[#39ff14]/15 text-[#39ff14] border border-[#39ff14]/30'
                            : user.verificationStatus === 'REJECTED'
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {user.verificationStatus === 'VERIFIED' && <ShieldCheck className="w-3 h-3" />}
                        {user.verificationStatus}
                      </span>
                    </td>

                    {/* Account Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          user.accountStatus === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {user.accountStatus}
                      </span>
                    </td>

                    {/* Mining */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-white">Lvl {user.miningLevel}</span>
                      <span className="text-[10px] text-slate-400 block">{user.miningSpeed} TH/s</span>
                    </td>

                    {/* Balance */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#39ff14]">
                      {user.rewardBalance.toFixed(2)} TTE
                    </td>

                    {/* Registration Date */}
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(user.registrationDate).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-3 py-1.5 rounded-lg bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 text-[#38bdf8] border border-[#38bdf8]/30 font-bold text-xs"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* USER MANAGEMENT DRAWER / MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#080f21] rounded-3xl border border-slate-700 max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold text-lg">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-lg text-white">
                    {selectedUser.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-amber-400 font-mono">@{selectedUser.username}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400 font-mono">ID: {selectedUser.id}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedUser(null);
                  setTempPasswordResult(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Statistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#040814] rounded-2xl p-3 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">TTE Balance</span>
                <div className="text-base font-bold text-[#39ff14] font-mono mt-0.5">
                  {selectedUser.rewardBalance.toFixed(2)}
                </div>
              </div>

              <div className="bg-[#040814] rounded-2xl p-3 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Mining Node</span>
                <div className="text-base font-bold text-white font-mono mt-0.5">
                  Level {selectedUser.miningLevel}
                </div>
              </div>

              <div className="bg-[#040814] rounded-2xl p-3 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Referrals</span>
                <div className="text-base font-bold text-amber-300 font-mono mt-0.5">
                  {selectedUser.referralCount} Users
                </div>
              </div>

              <div className="bg-[#040814] rounded-2xl p-3 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Withdrawn</span>
                <div className="text-base font-bold text-slate-300 font-mono mt-0.5">
                  {selectedUser.totalWithdrawn.toFixed(2)} TTE
                </div>
              </div>
            </div>

            {/* Detailed Contact & Identity */}
            <div className="bg-[#040814] rounded-2xl p-4 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  Email Address:
                </span>
                <span className="font-mono text-white">{selectedUser.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  Phone Number:
                </span>
                <span className="font-mono text-white">{selectedUser.phone}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-slate-500" />
                  Telegram UID:
                </span>
                <span className="font-mono text-[#38bdf8] font-bold">{selectedUser.telegramId}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Registered Date:
                </span>
                <span className="text-slate-300">{new Date(selectedUser.registrationDate).toLocaleString()}</span>
              </div>
            </div>

            {/* Security Actions (Never showing password!) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-display">
                Account Actions & Security Control
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {selectedUser.verificationStatus !== 'VERIFIED' ? (
                  <button
                    onClick={() => handleVerify(selectedUser.id)}
                    disabled={isProcessing}
                    className="py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verify User</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleVerify(selectedUser.id)}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold cursor-default"
                  >
                    <span>Already Verified ✓</span>
                  </button>
                )}

                {selectedUser.accountStatus === 'ACTIVE' ? (
                  <button
                    onClick={() => setShowSuspendModal(true)}
                    className="py-2.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Suspend User</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnsuspend(selectedUser.id)}
                    disabled={isProcessing}
                    className="py-2.5 px-3 rounded-xl bg-[#39ff14]/15 hover:bg-[#39ff14]/25 border border-[#39ff14]/30 text-[#39ff14] text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Unsuspend User</span>
                  </button>
                )}

                <button
                  onClick={() => handleSendPasswordReset(selectedUser.id)}
                  disabled={isProcessing}
                  className="py-2.5 px-3 rounded-xl bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 border border-[#38bdf8]/30 text-[#38bdf8] text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Reset Link</span>
                </button>

                <button
                  onClick={() => handleGenerateTempPassword(selectedUser.id)}
                  disabled={isProcessing}
                  className="py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Temp Credential</span>
                </button>
              </div>

              {/* Temporary Password Result box */}
              {tempPasswordResult && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-300 font-bold">One-Time Temporary Passcode:</span>
                    <span className="font-mono text-white text-sm font-bold bg-black/60 px-2.5 py-1 rounded-lg border border-amber-400/40">
                      {tempPasswordResult.code}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Expires in {tempPasswordResult.expires} minutes. This passcode is shown only once and will never be stored in plaintext.
                  </p>
                </div>
              )}
            </div>

            {/* Permanent Admin Notes */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-display">
                Permanent Admin Audit Notes
              </h4>

              <div className="space-y-1.5 max-h-32 overflow-y-auto no-scrollbar font-mono text-[11px]">
                {selectedUser.adminNotes.map((note, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-[#040814] text-slate-300 border border-slate-800">
                    {note}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="Append confidential admin observation..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#040814] border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => handleAddNote(selectedUser.id)}
                  disabled={!adminNoteInput.trim()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold disabled:opacity-40"
                >
                  Save Note
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Suspend Confirmation Modal */}
      {showSuspendModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#0b1428] rounded-2xl border border-rose-500/40 max-w-sm w-full p-5 space-y-4">
            <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Confirm Account Suspension</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Suspending <strong className="text-white">@{selectedUser.username}</strong> will freeze mining payouts, pause virtual reward claims, and prevent mini app authorization.
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Reason for Suspension:
              </label>
              <textarea
                rows={2}
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="Multiple accounts / automated script violation..."
                className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowSuspendModal(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspend}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
