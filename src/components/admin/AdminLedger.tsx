import React, { useState } from 'react';
import { BookOpen, Plus, Download, ShieldCheck, ArrowUpRight, ArrowDownRight, Check } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { PlatformLedgerItem } from '../../types/admin';

export const AdminLedger: React.FC = () => {
  const [ledger, setLedger] = useState<PlatformLedgerItem[]>(adminService.getLedger());
  const [summary, setSummary] = useState(adminService.getPlatformBalanceSummary());
  const [showAddModal, setShowAddModal] = useState(false);
  const [entryType, setEntryType] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [refInput, setRefInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountInput) || 0;
    if (amount <= 0 || !refInput.trim()) return;

    adminService.addLedgerRecord(entryType, refInput.trim(), amount, noteInput.trim() || 'Manual adjustment');
    setLedger(adminService.getLedger());
    setSummary(adminService.getPlatformBalanceSummary());
    setShowAddModal(false);
    setRefInput('');
    setAmountInput('');
    setNoteInput('');
    setFeedback('Immutable ledger entry successfully committed.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleExportCSV = () => {
    const headers = 'ID,Date,Type,Reference,Amount,BalanceAfter,Admin,Note\n';
    const rows = ledger
      .map(
        (l) =>
          `"${l.id}","${l.date}","${l.type}","${l.reference}",${l.amount},${l.balanceAfter},"${l.admin}","${l.note}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tte_ledger_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-black text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <span>Platform Balance & Immutable Double-Entry Ledger</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Platform reserves, virtual reward liability, credit/debit records, and cryptographically tied audit ledger
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-[#39ff14] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Add Ledger Entry</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#080f21] rounded-3xl border border-amber-400/30 p-5 shadow-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase">Platform Reserve Balance</span>
          <div className="text-2xl font-black text-amber-300 font-mono mt-1">
            {summary.currentReserveBalance.toLocaleString()} <span className="text-xs text-slate-400">TTE</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Virtual liquidity pool backed by platform node</span>
        </div>

        <div className="bg-[#080f21] rounded-3xl border border-slate-800 p-5 shadow-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total User Reward Liability</span>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {summary.totalLiabilities.toLocaleString()} <span className="text-xs text-slate-400">TTE</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Unclaimed balance accumulated across miners</span>
        </div>

        <div className="bg-[#080f21] rounded-3xl border border-slate-800 p-5 shadow-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase">Settled Withdrawals</span>
          <div className="text-2xl font-black text-[#39ff14] font-mono mt-1">
            {summary.completedWithdrawalsAmount.toLocaleString()} <span className="text-xs text-slate-400">TTE</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Successfully debited & paid out</span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-[#080f21] rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#040814] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Debit</th>
                <th className="py-3 px-4">Credit</th>
                <th className="py-3 px-4">Balance After</th>
                <th className="py-3 px-4">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {ledger.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40">
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                    {new Date(item.date).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.type === 'CREDIT'
                          ? 'bg-[#39ff14]/15 text-[#39ff14]'
                          : 'bg-rose-500/15 text-rose-300'
                      }`}
                    >
                      {item.type === 'CREDIT' ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{item.reference}</span>
                    <span className="text-[10px] text-slate-500">{item.note}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-rose-400">
                    {item.type === 'DEBIT' ? `-${item.amount.toLocaleString()} TTE` : '—'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#39ff14]">
                    {item.type === 'CREDIT' ? `+${item.amount.toLocaleString()} TTE` : '—'}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    {item.balanceAfter.toLocaleString()} TTE
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px] truncate max-w-[120px]">
                    {item.admin}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#080f21] rounded-3xl border border-slate-700 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-display">New Ledger Entry</h3>

            <form onSubmit={handleAddEntry} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Transaction Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEntryType('CREDIT')}
                    className={`py-2 rounded-xl text-xs font-bold ${
                      entryType === 'CREDIT' ? 'bg-[#39ff14] text-black' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    + CREDIT (Deposit)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEntryType('DEBIT')}
                    className={`py-2 rounded-xl text-xs font-bold ${
                      entryType === 'DEBIT' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    - DEBIT (Withdrawal)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reference Title</label>
                <input
                  type="text"
                  value={refInput}
                  onChange={(e) => setRefInput(e.target.value)}
                  placeholder="e.g. Seed Liquidity Expansion"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (TTE)</label>
                <input
                  type="number"
                  step="1"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="10000"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Audit Note</label>
                <textarea
                  rows={2}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Operational justification..."
                  className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Post Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
