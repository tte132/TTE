import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Globe, 
  MessageSquare, 
  Send, 
  FileText, 
  ExternalLink, 
  ChevronRight, 
  Lock, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { triggerHaptic } from '../utils/telegram';

export const ProfileDrawer: React.FC = () => {
  const {
    user,
    isProfileDrawerOpen,
    setIsProfileDrawerOpen,
    language,
    setLanguage,
    setIsWalletModalOpen,
    addToast
  } = useApp();

  const [copiedId, setCopiedId] = useState(false);
  const [activeSubModal, setActiveSubModal] = useState<'terms' | 'privacy' | null>(null);

  if (!isProfileDrawerOpen) return null;

  const maskedUserId = user?.id ? `${user.id.slice(0, 4)}••••${user.id.slice(-4)}` : 'usr_88••••412';

  const handleCopyId = () => {
    if (!user?.id) return;
    triggerHaptic('light');
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    addToast('success', 'User ID Copied', 'Your masked user ID has been copied.');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleOpenChannel = () => {
    triggerHaptic('light');
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink('https://t.me/tte_announcements');
    } else {
      window.open('https://t.me/tte_announcements', '_blank');
    }
  };

  const handleContactSupport = () => {
    triggerHaptic('light');
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink('https://t.me/tte_support_bot');
    } else {
      window.open('https://t.me/tte_support_bot', '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Sliding Sheet Panel */}
      <div className="bg-[#081024] w-full max-w-sm h-full flex flex-col justify-between border-l border-slate-800 shadow-2xl p-5 overflow-y-auto no-scrollbar animate-in slide-in-from-right duration-200">
        
        <div>
          {/* Top header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <h3 className="font-display font-bold text-base text-white">
              {language === 'bn' ? 'ইউজার প্রোফাইল' : 'Account & Profile'}
            </h3>
            <button
              onClick={() => setIsProfileDrawerOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="bg-[#060913] rounded-2xl p-4 border border-slate-800 mb-4 flex items-center gap-3.5">
            <div className="relative">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#39ff14] bg-slate-800">
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"}
                  alt={user?.displayName || "User"}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 px-1.5 h-4 rounded-full bg-[#39ff14] text-black flex items-center justify-center font-bold text-[8px] font-mono shadow-sm">
                Lvl {user?.minerLevel || 1}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-sm text-white truncate">
                  {user?.displayName || "Abu Bokkor"}
                </span>
                <ShieldCheck className="w-4 h-4 text-[#39ff14] shrink-0" />
              </div>

              <div className="text-[11px] text-[#39ff14] font-mono font-semibold">
                Miner Level {user?.minerLevel || 1} / 10,000
              </div>

              <div className="text-xs text-slate-400 font-mono">
                @{user?.username || "AbuBokkor"}
              </div>

              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
                <span>UID: <strong className="text-slate-300 font-mono">{maskedUserId}</strong></span>
                <button
                  onClick={handleCopyId}
                  className="text-slate-400 hover:text-white"
                  title="Copy UID"
                >
                  {copiedId ? <Check className="w-3 h-3 text-[#39ff14]" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          {/* Account Meta Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            <div className="bg-[#0b1428] rounded-xl p-2.5 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Joined Date</span>
              <span className="font-mono text-slate-200 font-semibold">{user?.createdAt || '2026-08-14'}</span>
            </div>
            <div className="bg-[#0b1428] rounded-xl p-2.5 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Verification Status</span>
              <span className="font-bold text-[#39ff14] uppercase text-[11px]">{user?.verificationStatus || 'VERIFIED'}</span>
            </div>
          </div>

          {/* Menu Options */}
          <div className="space-y-1.5 mb-5">
            {/* Language Switch */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#060913] border border-slate-800 text-xs">
              <span className="text-slate-300 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#38bdf8]" />
                Language
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    language === 'en' ? 'bg-[#0284c7] text-white' : 'text-slate-400'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('bn')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    language === 'bn' ? 'bg-[#0284c7] text-white' : 'text-slate-400'
                  }`}
                >
                  বাংলা
                </button>
              </div>
            </div>

            {/* Wallet Connect Shortcut */}
            <button
              onClick={() => {
                setIsProfileDrawerOpen(false);
                setIsWalletModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#060913] border border-slate-800 text-xs text-slate-300 hover:text-white"
            >
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#39ff14]" />
                Connected Wallet
              </span>
              <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                <span>{user?.connectedWallet ? `${user.connectedWallet.slice(0, 6)}...` : 'Not linked'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Terms */}
            <button
              onClick={() => setActiveSubModal('terms')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#060913] border border-slate-800 text-xs text-slate-300 hover:text-white"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                Terms of Service
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Privacy */}
            <button
              onClick={() => setActiveSubModal('privacy')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#060913] border border-slate-800 text-xs text-slate-300 hover:text-white"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-slate-400" />
                Privacy Policy
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {/* Section 11: Support & Telegram Cards */}
          <div className="space-y-2.5">
            {/* Subscribe Telegram Channel Card */}
            <div className="bg-gradient-to-r from-[#0284c7]/20 via-[#0a1b38] to-[#060913] p-3.5 rounded-2xl border border-[#38bdf8]/30">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#38bdf8]/20 text-[#38bdf8] flex items-center justify-center">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Subscribe Telegram Channel</h4>
                    <span className="text-[10px] text-slate-400 font-mono">@tte_announcements</span>
                  </div>
                </div>
                <button
                  onClick={handleOpenChannel}
                  className="px-3 py-1.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-[11px] shadow-sm flex items-center gap-1"
                >
                  <span>OPEN</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[10px] text-slate-300 mt-1">Official Announcements & Rewards Updates</p>
            </div>

            {/* Contact Support Card */}
            <div className="bg-gradient-to-r from-[#22c55e]/15 via-[#0b1a28] to-[#060913] p-3.5 rounded-2xl border border-[#39ff14]/30">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#39ff14]/20 text-[#39ff14] flex items-center justify-center">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Contact Support</h4>
                    <span className="text-[10px] text-slate-400 font-mono">@tte_support_bot</span>
                  </div>
                </div>
                <button
                  onClick={handleContactSupport}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#22c55e] to-[#39ff14] text-black font-extrabold text-[11px] shadow-sm flex items-center gap-1"
                >
                  <span>CONTACT</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[10px] text-slate-300 mt-1">24/7 Dedicated Telegram Community Support</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500 font-mono">
          TTE Mining App · Version 2.4.0-web
        </div>

      </div>

      {/* Sub-modal for Terms / Privacy */}
      {activeSubModal && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-[#0b1428] rounded-3xl border border-slate-700 max-w-sm w-full p-5 max-h-[80vh] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="font-bold text-sm text-white">
                {activeSubModal === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
              </h4>
              <button
                onClick={() => setActiveSubModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto my-3 text-xs text-slate-300 leading-relaxed space-y-2 pr-1">
              <p>
                <strong>Virtual Mining Terms:</strong> TTE rewards represent virtual in-app mining points for node simulation, community participation, and task engagement.
              </p>
              <p>
                Withdrawals and on-chain settlements are subject to automated verification checks, anti-abuse cooldowns, and network liquidity protocols.
              </p>
              <p>
                Users agree not to exploit automated scripts, multiple accounts, or tampered clients. Violations result in account suspension and forfeiture of virtual reward claims.
              </p>
            </div>

            <button
              onClick={() => setActiveSubModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
