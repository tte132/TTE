import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Copy, 
  Check, 
  ShieldCheck, 
  ExternalLink, 
  Coins, 
  Flame, 
  Zap, 
  RefreshCw, 
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { triggerHaptic } from '../utils/telegram';
import { HistoryType } from '../types';
import tteLogoImg from '../assets/images/tte_logo.jpg';

export const WalletView: React.FC = () => {
  const {
    user,
    payouts,
    history,
    setIsWithdrawModalOpen,
    setIsWalletModalOpen,
    disconnectWallet,
    submitKYC,
    addToast,
    language
  } = useApp();

  const [copiedWallet, setCopiedWallet] = useState(false);
  const [selectedHistoryFilter, setSelectedHistoryFilter] = useState<string>('ALL');
  const [isVerifyingKYC, setIsVerifyingKYC] = useState(false);

  const inAppBalance = user?.balance ?? 0;
  const walletBalance = user?.connectedWalletBalance ?? 0;
  const totalBalance = inAppBalance + walletBalance;
  const connectedAddress = user?.connectedWallet;

  const handleCopyWallet = () => {
    if (!connectedAddress) return;
    triggerHaptic('light');
    navigator.clipboard.writeText(connectedAddress);
    setCopiedWallet(true);
    addToast('success', 'Address Copied', 'Wallet address copied to clipboard');
    setTimeout(() => setCopiedWallet(false), 2000);
  };

  const handleVerifyAccount = async () => {
    try {
      setIsVerifyingKYC(true);
      await submitKYC();
    } finally {
      setIsVerifyingKYC(false);
    }
  };

  // Filter history
  const filteredHistory = history.filter((item) => {
    if (selectedHistoryFilter === 'ALL') return true;
    return item.type === selectedHistoryFilter;
  });

  const getHistoryIcon = (type: HistoryType) => {
    switch (type) {
      case 'MINING_REWARD':
      case 'CLAIM':
        return <Coins className="w-4 h-4 text-[#39ff14]" />;
      case 'AD_REWARD':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'UPGRADE':
        return <Zap className="w-4 h-4 text-[#38bdf8]" />;
      case 'WITHDRAWAL':
        return <ArrowDownLeft className="w-4 h-4 text-rose-400" />;
      case 'TASK_REWARD':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <RefreshCw className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-24 pt-2">
      
      {/* 1. Main Balance Card: "In-App Wallet Balance" */}
      <section className="bg-gradient-to-b from-[#0d162d] via-[#0a1329] to-[#070e1f] rounded-3xl border border-slate-800 p-4 shadow-xl shadow-black/40 relative overflow-hidden">
        
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-[#39ff14]" />
            In-App Wallet Balance
          </span>
          <span className="text-[10px] font-mono text-[#39ff14] bg-[#39ff14]/10 border border-[#39ff14]/30 px-2 py-0.5 rounded-full">
            INSTANT SYNC
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mb-3 leading-tight">
          Available for virtual rewards and eligible withdrawals
        </p>

        {/* Large Numbers */}
        <div className="mb-4">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
            ACTIVE IN-APP BALANCE
          </div>
          <div className="flex items-center gap-2.5 mt-1">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-400/60 shadow-[0_0_10px_rgba(234,179,8,0.3)] shrink-0 bg-slate-900">
              <img src={tteLogoImg} alt="TTE" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight font-mono tabular-nums">
                {inAppBalance.toFixed(1)}
              </span>
              <span className="text-base font-bold text-[#39ff14]">TTE</span>
              <span className="text-xs font-mono text-slate-400 ml-1">
                ≈ ${(inAppBalance * 0.00127).toFixed(2)} USD
              </span>
            </div>
          </div>
        </div>

        {/* Holdings Breakdown */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-[#060913]/70 rounded-xl p-2.5 border border-slate-800/80">
            <div className="text-[10px] text-slate-400">TOTAL TTE HOLDING</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">
              {totalBalance.toFixed(1)} TTE
            </div>
          </div>

          <div className="bg-[#060913]/70 rounded-xl p-2.5 border border-slate-800/80">
            <div className="text-[10px] text-slate-400">GRAM WALLET</div>
            <div className="text-sm font-bold text-slate-300 font-mono mt-0.5">
              {walletBalance} TTE
            </div>
          </div>
        </div>

        {/* Action Buttons: [BUY / DEX] & [WITHDRAW] */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => addToast('info', 'DEX Aggregator', 'TON DEX Swap integration will be active upon mainnet pool initialization.')}
            className="min-h-[46px] px-4 py-2.5 rounded-xl bg-[#0284c7]/20 border border-[#38bdf8]/40 hover:bg-[#0284c7]/30 text-[#38bdf8] font-display font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <ArrowUpRight className="w-4 h-4 text-[#38bdf8]" />
            <span>BUY / DEX</span>
          </button>

          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="min-h-[46px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#22c55e] to-[#39ff14] text-black font-display font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#39ff14]/25 hover:brightness-110 active:scale-95 transition-all"
          >
            <ArrowDownLeft className="w-4 h-4 fill-black" />
            <span>{language === 'bn' ? 'উইথড্র করুন' : 'WITHDRAW'}</span>
          </button>
        </div>

      </section>

      {/* 2. Wallet Connection Card */}
      <section className="bg-[#091024] rounded-2xl border border-slate-800 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#38bdf8]/15 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8]">
              <Wallet className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white">Supported Web3 Wallet</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">TON · BEP20</span>
        </div>

        {connectedAddress ? (
          <div className="bg-[#060913] rounded-xl p-3 border border-slate-800 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block">Connected Wallet ({user?.walletNetwork || 'TON'})</span>
              <span className="text-xs font-mono font-bold text-white truncate block">
                {connectedAddress.slice(0, 10)}...{connectedAddress.slice(-6)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleCopyWallet}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Copy Address"
              >
                {copiedWallet ? <Check className="w-3.5 h-3.5 text-[#39ff14]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={disconnectWallet}
                className="px-2.5 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-semibold hover:bg-rose-500/25"
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-[#060913] rounded-xl p-3 border border-slate-800">
            <span className="text-xs text-slate-400">No external wallet linked</span>
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-md shadow-[#0284c7]/20"
            >
              Connect Wallet
            </button>
          </div>
        )}
      </section>

      {/* 3. Account Verification / KYC Status Card */}
      <section className="bg-[#091024] rounded-2xl border border-slate-800 p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#39ff14]/15 border border-[#39ff14]/30 flex items-center justify-center text-[#39ff14]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">Account Verification</span>
              <span
                className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                  user?.verificationStatus === 'VERIFIED'
                    ? 'bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/30'
                    : user?.verificationStatus === 'PENDING'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {user?.verificationStatus || 'VERIFIED'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Automated Telegram user identity compliance status
            </p>
          </div>
        </div>

        {user?.verificationStatus !== 'VERIFIED' && (
          <button
            onClick={handleVerifyAccount}
            disabled={isVerifyingKYC || user?.verificationStatus === 'PENDING'}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 text-xs font-bold text-white shrink-0"
          >
            {isVerifyingKYC ? 'Verifying...' : 'VERIFY ACCOUNT'}
          </button>
        )}
      </section>

      {/* 4. Live Payouts Ticker / Feed */}
      <section className="bg-[#091024] rounded-2xl border border-slate-800 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Payouts
            </h3>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              LIVE
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Network Audited</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {payouts.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="bg-[#060913] rounded-xl p-2.5 border border-slate-800/80 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-white block">
                  {p.maskedUsername}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {p.timeAgo}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#39ff14] flex items-center justify-end gap-1">
                  <Coins className="w-3 h-3 text-[#39ff14]" />
                  {p.amount}
                </span>
                <span className="text-[9px] text-slate-400 uppercase">
                  {p.network}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. App History Section */}
      <section className="bg-[#091024] rounded-2xl border border-slate-800 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              App History
            </h3>
            <span className="text-[11px] text-slate-400">
              Showing latest {filteredHistory.length} transactions
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-[#060913] p-1 rounded-xl border border-slate-800 text-[10px]">
            {['ALL', 'CLAIM', 'UPGRADE', 'WITHDRAWAL'].map((flt) => (
              <button
                key={flt}
                onClick={() => setSelectedHistoryFilter(flt)}
                className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                  selectedHistoryFilter === flt
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {flt}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        <div className="flex flex-col gap-2">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              No transactions found for selected filter
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="bg-[#060913] rounded-xl p-2.5 border border-slate-800/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center shrink-0">
                    {getHistoryIcon(item.type)}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {item.description}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-xs font-mono font-bold ${
                      item.isPositive ? 'text-[#39ff14]' : 'text-slate-200'
                    }`}
                  >
                    {item.isPositive ? `+${item.amount}` : `-${item.amount}`} TTE
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    {item.timestamp}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
};
