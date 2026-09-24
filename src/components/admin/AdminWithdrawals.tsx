import React, { useState } from 'react';
import { CreditCard, Check, X, Clock, AlertCircle, ArrowUpRight, Search, FileText, CheckCircle2 } from 'lucide-react';
import { adminService } from '../../services/adminService';

interface WithdrawalRecord {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  network: 'TON' | 'BEP20' | 'POLYGON';
  address: string;
  requestDate: string;
  status: 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  txHash?: string;
  adminNote?: string;
}

const INITIAL_WITHDRAWALS: WithdrawalRecord[] = [
  {
    id: 'wth_98210',
    userId: 'usr_tte_102',
    userName: 'QuantumNodeMiner',
    amount: 150.0,
    network: 'TON',
    address: 'EQCD39VS5jcptHL8vMjEXunPUJLcwWR6nURwgMmWC9gkEhTU',
    requestDate: '2026-09-23T18:30:00.000Z',
    status: 'PENDING',
  },
  {
    id: 'wth_98209',
    userId: 'usr_tte_089',
    userName: 'CryptoVanguard',
    amount: 50.0,
    network: 'BEP20',
    address: '0x71C...4982',
    requestDate: '2026-09-23T14:15:00.000Z',
    status: 'APPROVED',
    reviewedBy: 'admin@timetoearn.io',
    txHash: '0x39a0ff...7182',
  },
];

export const AdminWithdrawals: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(INITIAL_WITHDRAWALS);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<WithdrawalRecord | null>(null);
  const [txHashInput, setTxHashInput] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleApprove = async (rec: WithdrawalRecord) => {
    await adminService.approveWithdrawal(rec.id, txHashInput.trim() || 'ton_tx_' + Date.now().toString(36));
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === rec.id
          ? {
              ...w,
              status: 'APPROVED',
              reviewedBy: adminService.getCurrentAdmin()?.email || 'admin@timetoearn.io',
              txHash: txHashInput.trim() || 'ton_tx_' + Date.now().toString(36),
            }
          : w
      )
    );
    setSelectedRecord(null);
    setTxHashInput('');
    setFeedback(`Withdrawal #${rec.id} approved and deducted from platform reserves.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleReject = async () => {
    if (!selectedRecord) return;
    await adminService.rejectWithdrawal(selectedRecord.id, rejectReason || 'KYC verification mismatch');
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === selectedRecord.id
          ? {
              ...w,
              status: 'REJECTED',
              reviewedBy: adminService.getCurrentAdmin()?.email || 'admin@timetoearn.io',
              adminNote: rejectReason,
            }
          : w
      )
    );
    setShowRejectModal(false);
    setSelectedRecord(null);
    setRejectReason('');
    setFeedback(`Withdrawal #${selectedRecord.id} rejected.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const filtered = withdrawals.filter((w) => {
    if (filter === 'ALL') return true;
    return w.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-black text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#39ff14]" />
            <span>Withdrawal Payout & Settlement Queue</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review user cashout requests, submit blockchain transaction hashes, and track audit liabilities
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#080f21] border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-amber-400">Pending Review</span>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {withdrawals.filter((w) => w.status === 'PENDING').length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#080f21] border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-[#39ff14]">Approved / Paid</span>
          <div className="text-xl font-bold font-mono text-[#39ff14] mt-1">
            {withdrawals.filter((w) => w.status === 'APPROVED').length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#080f21] border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-rose-400">Rejected</span>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1">
            {withdrawals.filter((w) => w.status === 'REJECTED').length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#080f21] border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-[#38bdf8]">Total Payout Volume</span>
          <div className="text-xl font-bold font-mono text-white mt-1">
            200.00 TTE
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              filter === tab
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#080f21] rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#040814] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Network</th>
                <th className="py-3 px-4">Destination Address</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map((w) => (
                <tr key={w.id} className="hover:bg-slate-900/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                    #{w.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{w.userName}</span>
                    <span className="text-[10px] font-mono text-slate-500">{w.userId}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    {w.amount.toFixed(2)} TTE
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {w.network}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 truncate max-w-[150px]">
                    {w.address}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        w.status === 'APPROVED'
                          ? 'bg-[#39ff14]/15 text-[#39ff14]'
                          : w.status === 'REJECTED'
                          ? 'bg-rose-500/15 text-rose-300'
                          : 'bg-amber-400/15 text-amber-300'
                      }`}
                    >
                      {w.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {w.status === 'PENDING' ? (
                      <button
                        onClick={() => setSelectedRecord(w)}
                        className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs shadow"
                      >
                        Review Payout
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">
                        {w.reviewedBy?.slice(0, 10)}...
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#080f21] rounded-3xl border border-slate-700 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <span>Review Withdrawal #{selectedRecord.id}</span>
            </h3>

            <div className="p-3 rounded-2xl bg-[#040814] border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">User:</span>
                <span className="text-white font-bold">{selectedRecord.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="text-[#39ff14] font-mono font-bold text-sm">
                  {selectedRecord.amount.toFixed(2)} TTE
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Destination:</span>
                <span className="text-slate-300 font-mono text-[11px] truncate max-w-[200px]">
                  {selectedRecord.address}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Blockchain Tx Hash / Transaction Reference
              </label>
              <input
                type="text"
                value={txHashInput}
                onChange={(e) => setTxHashInput(e.target.value)}
                placeholder="0x9a8f... or internal reference"
                className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => setShowRejectModal(true)}
                className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold"
              >
                Reject
              </button>

              <button
                type="button"
                onClick={() => handleApprove(selectedRecord)}
                className="px-5 py-2 rounded-xl bg-[#39ff14] text-slate-950 font-bold text-xs shadow-lg shadow-[#39ff14]/20"
              >
                Approve & Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#0b1428] rounded-2xl border border-rose-500/40 max-w-sm w-full p-5 space-y-4">
            <h4 className="text-sm font-bold text-rose-300">Reject Withdrawal</h4>
            <textarea
              rows={2}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-xs text-white"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
