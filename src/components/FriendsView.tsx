import React, { useState } from 'react';
import { 
  Users, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Coins, 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  Loader2,
  UserPlus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { triggerHaptic } from '../utils/telegram';

export const FriendsView: React.FC = () => {
  const {
    user,
    referrals,
    claimSquadCommission,
    simulateInviteFriend,
    addToast,
    language
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const inviteLink = referrals?.inviteLink || `https://t.me/tte_miner_bot?start=ref_${user?.id || 'tte'}`;
  const commissionPool = referrals?.squadCommissionPool ?? 0;
  const qualifiedCount = referrals?.qualifiedCount ?? 0;
  const totalSquad = referrals?.totalSquadCount ?? 0;
  const unclaimed = referrals?.unclaimedCommission ?? 0;
  const instantReward = referrals?.instantRewardPerInvite ?? 100;
  const bonusPercent = referrals?.miningBonusPercent ?? 10;
  const members = referrals?.members ?? [];

  const handleCopyLink = () => {
    triggerHaptic('light');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(inviteLink);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = inviteLink;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      addToast('success', 'Link Copied', 'Referral link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      addToast('info', 'Referral Link', inviteLink);
    }
  };

  const handleInviteFriends = () => {
    triggerHaptic('medium');
    const shareText = `🚀 Join my TTE Mining Squad and get +100 TTE bonus! Mine virtual crypto every second:\n${inviteLink}`;
    
    // Telegram Mini App Share
    if (window.Telegram?.WebApp && window.Telegram.WebApp.openTelegramLink) {
      const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`;
      window.Telegram.WebApp.openTelegramLink(tgUrl);
    } else if (navigator.share) {
      navigator.share({
        title: 'Join my TTE Mining Squad',
        text: shareText,
        url: inviteLink,
      }).catch(() => {
        handleCopyLink();
      });
    } else {
      const tgWebUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`;
      window.open(tgWebUrl, '_blank');
      handleCopyLink();
    }
  };

  const handleClaimCommission = async () => {
    if (commissionPool <= 0 && unclaimed <= 0) {
      addToast('info', 'Squad Commission', 'No unclaimed commission currently in pool.');
      return;
    }
    if (isClaiming) return;

    try {
      setIsClaiming(true);
      await claimSquadCommission();
    } finally {
      setIsClaiming(false);
    }
  };

  const handleSimulateInvite = async () => {
    try {
      setIsSimulating(true);
      await simulateInviteFriend();
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-24 pt-2">
      
      {/* 1. Top Profile Card: "Referral Squad" */}
      <section className="bg-gradient-to-b from-[#0d162d] to-[#091024] rounded-2xl border border-slate-800 p-4 shadow-lg shadow-black/40 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#38bdf8] bg-slate-800">
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"}
                  alt={user?.displayName || "User"}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#39ff14] rounded-full border-2 border-[#091024] flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-base text-white">
                  Referral Squad
                </h3>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/40">
                  Active Inviter
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                @{user?.username || 'TTE_Miner'} · Level {user?.minerLevel || 1}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Status</span>
            <span className="text-xs font-semibold text-[#38bdf8] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#39ff14]" />
              Verified
            </span>
          </div>
        </div>
      </section>

      {/* 2. Squad Mining Commission Pool Card */}
      <section className="bg-gradient-to-b from-[#0b1428] to-[#080e1e] rounded-2xl border border-slate-800 p-4 shadow-lg">
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#39ff14]" />
            Squad Mining
          </span>
          <span className="text-[11px] text-[#38bdf8] font-mono">
            {bonusPercent}% Squad Bonus
          </span>
        </div>

        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          Virtual referral commission generated from qualified squad activity. When you claim, points transfer to your in-app balance and this pool resets.
        </p>

        <div className="bg-[#060913] rounded-xl p-3 border border-slate-800/80 flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] text-slate-400">Squad Commission Pool</div>
            <div className="text-xl font-display font-extrabold text-[#39ff14] font-mono tabular-nums">
              {commissionPool.toFixed(4)} <span className="text-xs font-sans text-white">TTE</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              ≈ ${(commissionPool * 0.00127).toFixed(4)} USD
            </div>
          </div>

          <button
            onClick={handleClaimCommission}
            disabled={commissionPool <= 0 || isClaiming}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              commissionPool > 0 && !isClaiming
                ? 'bg-gradient-to-r from-[#22c55e] to-[#39ff14] text-black shadow-md shadow-[#39ff14]/30 hover:brightness-110 active:scale-95'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            {isClaiming ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : (
              <span>{language === 'bn' ? 'কমিশন ক্লেইম' : 'CLAIM SQUAD COMMISSION'}</span>
            )}
          </button>
        </div>

        {/* Invite Banner Callout */}
        <div className="bg-gradient-to-r from-[#0284c7]/20 via-[#38bdf8]/10 to-transparent p-3 rounded-xl border border-[#38bdf8]/30">
          <div className="text-xs font-bold text-white mb-0.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#39ff14]" />
            Get +{instantReward} TTE for each Invite
          </div>
          <div className="text-[11px] text-slate-300 leading-snug">
            +{instantReward} TTE instant virtual reward per friend + {bonusPercent}% referral mining bonus.
          </div>
        </div>

      </section>

      {/* 3. Squad Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#091024] rounded-2xl p-3 border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400">Qualified</div>
          <div className="text-lg font-display font-extrabold text-[#39ff14] font-mono mt-0.5">
            {qualifiedCount}
          </div>
        </div>

        <div className="bg-[#091024] rounded-2xl p-3 border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400">Total Squad</div>
          <div className="text-lg font-display font-extrabold text-white font-mono mt-0.5">
            {totalSquad}
          </div>
        </div>

        <div className="bg-[#091024] rounded-2xl p-3 border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400">Unclaimed</div>
          <div className="text-lg font-display font-extrabold text-[#38bdf8] font-mono mt-0.5">
            {commissionPool.toFixed(2)} <span className="text-[10px] font-normal text-slate-400">TTE</span>
          </div>
        </div>
      </div>

      {/* Referral Link Box with Copy Button */}
      <div className="bg-[#091024] rounded-2xl p-3 border border-slate-800">
        <div className="text-[11px] text-slate-400 mb-1.5 font-medium flex items-center justify-between">
          <span>Your Referral Link</span>
          <span className="text-[10px] text-[#39ff14] font-mono">Code: {referrals?.referralCode || 'TTE'}</span>
        </div>
        <div className="flex items-center gap-2 bg-[#060913] p-2 rounded-xl border border-slate-800/80">
          <input
            type="text"
            readOnly
            value={inviteLink}
            className="bg-transparent text-xs text-slate-300 font-mono flex-1 outline-none truncate"
          />
          <button
            onClick={handleCopyLink}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1 shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#39ff14]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* 4. Action Buttons: [INVITE FRIENDS] & [COPY LINK] & [SIMULATE FRIEND] */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleInviteFriends}
          className="min-h-[48px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#22c55e] to-[#39ff14] text-black font-display font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#39ff14]/30 hover:brightness-110 active:scale-98 transition-all"
        >
          <Share2 className="w-4 h-4" />
          <span>{language === 'bn' ? 'ইনভাইট ফ্রেন্ডস' : 'INVITE FRIENDS'}</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="min-h-[48px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-display font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0284c7]/20 border border-[#38bdf8]/40 hover:brightness-110 active:scale-98 transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-[#39ff14]" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'COPIED!' : (language === 'bn' ? 'লিঙ্ক কপি' : 'COPY LINK')}</span>
        </button>
      </div>

      {/* Simulator helper button for user testing */}
      <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-dashed border-slate-700">
        <div className="flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-[#38bdf8]" />
          <span className="text-xs text-slate-300">
            Want to test referral & squad commission?
          </span>
        </div>
        <button
          onClick={handleSimulateInvite}
          disabled={isSimulating}
          className="px-3 py-1.5 rounded-lg bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-700/60 text-xs font-bold flex items-center gap-1 transition-all"
        >
          {isSimulating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>+ Test Friend (+100 TTE)</span>}
        </button>
      </div>

      {/* 5. Referral Squad Member List */}
      <div className="mt-1">
        <div className="flex items-center justify-between px-1 mb-2">
          <h3 className="text-sm font-display font-bold text-white tracking-wide">
            {language === 'bn' ? 'স্কোয়াড মেম্বার তালিকা' : 'Squad Members'} ({members.length})
          </h3>
          <span className="text-xs text-slate-400">
            Active Hash Contributors
          </span>
        </div>

        {members.length === 0 ? (
          <div className="bg-[#091024] rounded-2xl p-6 border border-slate-800 text-center">
            <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <div className="text-xs font-bold text-white">No Squad Members Yet</div>
            <div className="text-[11px] text-slate-400 mt-1 max-w-[240px] mx-auto">
              Share your link with friends to earn +100 TTE per invite plus 10% lifetime mining commission!
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-[#091024] rounded-2xl p-3 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-slate-700">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{member.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{member.username}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Miner Level {member.level} · Joined {member.joinedDaysAgo}d ago
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                      member.qualified
                        ? 'bg-[#39ff14]/15 text-[#39ff14] border border-[#39ff14]/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {member.qualified ? 'Qualified' : 'Unqualified'}
                  </span>
                  {member.commissionEarned > 0 && (
                    <div className="text-[10px] text-[#38bdf8] font-mono mt-0.5">
                      +{member.commissionEarned} TTE
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
