import React, { useState } from 'react';
import { 
  X, 
  ArrowDownLeft, 
  ShieldCheck, 
  AlertCircle, 
  Coins, 
  Loader2, 
  CheckCircle2, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { triggerHaptic } from '../utils/telegram';

export const WithdrawModal: React.FC = () => {
  const {
    user,
    withdrawals,
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    requestWithdrawal,
    language
  } = useApp();

  const [network, setNetwork] = useState<'TON' | 'BEP20' | 'POLYGON'>('TON');
  const [address, setAddress] = useState<string>(user?.connectedWallet || '');
  const [amountStr, setAmountStr] = useState<string>('50');
  const [showConfirmStep, setShowConfirmStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const availableBalance = user?.balance || 0;
  const minWithdrawal = 50;
  const numAmount = parseFloat(amountStr) || 0;
  const fee = Number((numAmount * 0.02).toFixed(2)); // 2% network handling fee
  const finalAmount = Math.max(0, Number((numAmount - fee).toFixed(2)));
  const estUsd = Number((finalAmount * 0.00127).toFixed(2));

  const handleMaxAmount = () => {
    setAmountStr(Math.floor(availableBalance).toString());
  };

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (numAmount < minWithdrawal) {
      setSubmitError(`Minimum withdrawal is ${minWithdrawal} TTE`);
      return;
    }
    if (numAmount > availableBalance) {
      setSubmitError(`Requested amount exceeds available balance`);
      return;
    }
    if (!address.trim() || address.length < 8) {
      setSubmitError('Please enter a valid wallet address');
      return;
    }

    triggerHaptic('light');
    setShowConfirmStep(true);
  };

  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await requestWithdrawal({
        amount: numAmount,
        network,
        address: address.trim(),
      });
      setShowConfirmStep(false);
      setIsWithdrawModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Withdrawal failed';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isWithdrawModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4">
      <div className="bg-[#0b1428] rounded-t-3xl sm:rounded-3xl border border-slate-700 w-full max-w-md max-h-[92vh] overflow-y-auto no-scrollbar p-5 shadow-2xl relative animate-in slide-in-from-bottom duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setShowConfirmStep(false);
            setIsWithdrawModalOpen(false);
          }}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#22c55e]/20 to-[#39ff14]/20 border border-[#39ff14]/40 flex items-center justify-center text-[#39ff14]">
            <ArrowDownLeft className="w-5 h-5 fill-[#39ff14]" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-base text-white">
              {language === 'bn' ? 'উইথড্রয়াল পোর্টাল' : 'Withdraw TTE Virtual Rewards'}
            </h2>
            <p className="text-[11px] text-slate-400">
              Transfer earned virtual rewards to supported blockchain wallets
            </p>
          </div>
        </div>

        {/* Available Balance Box */}
        <div className="bg-[#060913] rounded-2xl p-3.5 border border-slate-800 flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] text-slate-400">Available Balance</div>
            <div className="text-xl font-display font-extrabold text-white font-mono tabular-nums">
              {availableBalance.toFixed(2)} <span className="text-xs font-sans text-[#39ff14]">TTE</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-400">Minimum Withdrawal</div>
            <div className="text-xs font-mono font-bold text-slate-300">
              {minWithdrawal} TTE
            </div>
          </div>
        </div>

        {submitError && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Step 1: Input Form */}
        {!showConfirmStep ? (
          <form onSubmit={handleProceedToConfirm} className="space-y-3.5">
            {/* Network Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Select Network
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'TON', label: 'TON Network' },
                  { id: 'BEP20', label: 'BNB Chain' },
                  { id: 'POLYGON', label: 'Polygon' },
                ].map((net) => (
                  <button
                    key={net.id}
                    type="button"
                    onClick={() => setNetwork(net.id as any)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                      network === net.id
                        ? 'bg-[#0284c7] text-white shadow-md shadow-[#0284c7]/30 border border-[#38bdf8]'
                        : 'bg-[#060913] text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {net.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Wallet Address Input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Destination Wallet Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. UQBOT6k7H8x9Q3UacNd810zK"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#060913] border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-[#38bdf8]"
                required
              />
            </div>

            {/* Amount Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Withdrawal Amount
                </label>
                <button
                  type="button"
                  onClick={handleMaxAmount}
                  className="text-[11px] font-bold text-[#39ff14] hover:underline"
                >
                  MAX
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min={minWithdrawal}
                  max={availableBalance}
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  className="w-full pl-3.5 pr-16 py-2.5 rounded-xl bg-[#060913] border border-slate-800 text-white font-mono text-sm font-bold focus:outline-none focus:border-[#39ff14]"
                  required
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  TTE
                </span>
              </div>
            </div>

            {/* Calculated Fee Breakdown */}
            <div className="bg-[#081022] rounded-xl p-3 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span>Estimated Value:</span>
                <span className="font-mono text-white">≈ ${estUsd} USD</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Network Processing Fee (2%):</span>
                <span className="font-mono text-slate-300">{fee} TTE</span>
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80 font-bold">
                <span className="text-white">You will receive:</span>
                <span className="font-mono text-[#39ff14]">{finalAmount} TTE</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#22c55e] to-[#39ff14] text-black font-display font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#39ff14]/25 hover:brightness-110 active:scale-98 transition-all"
            >
              <span>PROCEED TO REVIEW</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          /* Step 2: Confirmation Modal Review */
          <div className="space-y-4">
            <div className="bg-[#060913] rounded-2xl p-4 border border-slate-800 space-y-3 text-xs">
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                Confirm Withdrawal Details
              </h3>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Withdrawal Amount:</span>
                <span className="font-mono font-bold text-white">{numAmount} TTE</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Network:</span>
                <span className="font-mono font-semibold text-[#38bdf8]">{network}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Destination Address:</span>
                <span className="font-mono font-semibold text-slate-200 text-[11px] truncate max-w-[180px]">
                  {address}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Network Handling Fee:</span>
                <span className="font-mono text-slate-300">{fee} TTE</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 font-bold text-sm">
                <span className="text-white">Final Payout:</span>
                <span className="font-mono text-[#39ff14] text-base">{finalAmount} TTE</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Withdrawal request will enter server verification queue (status: PENDING).</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setShowConfirmStep(false)}
                disabled={isSubmitting}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Back / Edit
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="py-2.5 rounded-xl bg-gradient-to-r from-[#22c55e] to-[#39ff14] text-black font-display font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#39ff14]/30"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>CONFIRM WITHDRAWAL</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Withdrawal History Section */}
        {withdrawals.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Recent Withdrawal Requests
            </h4>
            <div className="space-y-2">
              {withdrawals.slice(0, 3).map((wd) => (
                <div
                  key={wd.id}
                  className="bg-[#060913] p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white font-mono block">
                      {wd.amount} TTE ({wd.network})
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {wd.address.slice(0, 8)}...{wd.address.slice(-4)}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      wd.status === 'COMPLETED'
                        ? 'bg-[#39ff14]/20 text-[#39ff14]'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {wd.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
