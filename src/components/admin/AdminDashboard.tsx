import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Coins, 
  Pickaxe, 
  Bot, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  Eye, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Server
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminViewTab } from '../../types/admin';

interface AdminDashboardProps {
  onNavigate: (tab: AdminViewTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [usersCount, setUsersCount] = useState(0);
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [verifiedUsersCount, setVerifiedUsersCount] = useState(0);
  const [suspendedCount, setSuspendedCount] = useState(0);
  const [botConfig, setBotConfig] = useState(adminService.getBotConfig());
  const [platformSummary, setPlatformSummary] = useState(adminService.getPlatformBalanceSummary());
  const [recentLogs, setRecentLogs] = useState(adminService.getAuditLogs().slice(0, 5));

  useEffect(() => {
    const list = adminService.getUsersList();
    setUsersCount(list.length);
    setActiveUsersCount(list.filter((u) => u.accountStatus === 'ACTIVE').length);
    setVerifiedUsersCount(list.filter((u) => u.verificationStatus === 'VERIFIED').length);
    setSuspendedCount(list.filter((u) => u.accountStatus === 'SUSPENDED').length);
    setBotConfig(adminService.getBotConfig());
    setPlatformSummary(adminService.getPlatformBalanceSummary());
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Telegram Quick Reload CTA */}
      <div className="bg-gradient-to-r from-[#0c162e] via-[#0a1835] to-[#071329] p-6 rounded-3xl border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                TTE Quantum Node Core
              </span>
              <span className="text-xs text-slate-400">· Real-Time Platform Sync</span>
            </div>
            <h1 className="text-2xl font-display font-black text-white mt-1">
              Time To Earn Command Center
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Virtual rewards distribution engine, real user synchronization, Telegram bot reload, and financial audit system.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('bot')}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-[#39ff14] text-slate-950 font-display font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-400/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <Bot className="w-4 h-4 text-black" />
              <span>TELEGRAM BOT & RELOAD</span>
            </button>

            <button
              onClick={() => onNavigate('mining_settings')}
              className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Reward Rates</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Users */}
        <div className="bg-[#080f21] rounded-2xl border border-slate-800/80 p-4 relative group hover:border-amber-400/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Registered Users</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {usersCount}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#39ff14] mt-1 font-semibold">
            <Activity className="w-3 h-3" />
            <span>{activeUsersCount} Active · {usersCount === 0 ? 'Clean DB' : `${verifiedUsersCount} Verified`}</span>
          </div>
        </div>

        {/* Telegram Bot Live Status */}
        <div 
          onClick={() => onNavigate('bot')}
          className="bg-[#080f21] rounded-2xl border border-slate-800/80 p-4 relative group hover:border-[#38bdf8]/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Telegram Bot</span>
            <Bot className="w-4 h-4 text-[#38bdf8]" />
          </div>
          <div className="text-lg font-bold font-mono text-white truncate">
            {botConfig.botUsername || '@TTE_MiningBot'}
          </div>
          <div className="flex items-center gap-1 text-[11px] mt-1">
            <span className={`w-2 h-2 rounded-full ${botConfig.status === 'connected' ? 'bg-[#39ff14] animate-pulse' : 'bg-amber-400'}`}></span>
            <span className={`font-bold ${botConfig.status === 'connected' ? 'text-[#39ff14]' : 'text-amber-300'}`}>
              {botConfig.status === 'connected' ? 'ONLINE / RELOADED' : 'Awaiting Token'}
            </span>
          </div>
        </div>

        {/* Total Virtual Rewards Issued */}
        <div className="bg-[#080f21] rounded-2xl border border-slate-800/80 p-4 relative group hover:border-[#39ff14]/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Rewards Issued</span>
            <Coins className="w-4 h-4 text-[#39ff14]" />
          </div>
          <div className="text-2xl font-black text-[#39ff14] font-mono">
            {platformSummary.totalRewardsIssued.toLocaleString()} <span className="text-xs text-slate-400 font-normal">TTE</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
            <span>Claimed: {platformSummary.totalRewardsClaimed.toLocaleString()} TTE</span>
          </div>
        </div>

        {/* Platform Reserve Balance */}
        <div className="bg-[#080f21] rounded-2xl border border-slate-800/80 p-4 relative group hover:border-amber-400/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Platform Liquidity Pool</span>
            <Pickaxe className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono">
            {platformSummary.currentReserveBalance.toLocaleString()} <span className="text-xs text-slate-400 font-normal">TTE</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
            <span>Pending Payouts: 0 TTE</span>
          </div>
        </div>

      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-[#060b17] border border-slate-800 text-xs">
          <span className="text-slate-400 block text-[11px]">Withdrawals</span>
          <span className="font-bold text-white text-sm">2 Approved · 0 Pending</span>
        </div>
        <div className="p-3 rounded-xl bg-[#060b17] border border-slate-800 text-xs">
          <span className="text-slate-400 block text-[11px]">Rewarded Ad Views</span>
          <span className="font-bold text-[#38bdf8] text-sm">1,420 Completed</span>
        </div>
        <div className="p-3 rounded-xl bg-[#060b17] border border-slate-800 text-xs">
          <span className="text-slate-400 block text-[11px]">Ad Reward Pool</span>
          <span className="font-bold text-[#39ff14] text-sm">7,100 TTE Boosted</span>
        </div>
        <div className="p-3 rounded-xl bg-[#060b17] border border-slate-800 text-xs">
          <span className="text-slate-400 block text-[11px]">Suspended Accounts</span>
          <span className="font-bold text-rose-400 text-sm">{suspendedCount} Flagged</span>
        </div>
      </div>

      {/* Visual Activity Graphs (Dark Glassmorphic SVG Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Mining Activity & Reward Distribution */}
        <div className="bg-[#080f21] rounded-3xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#39ff14]" />
                <span>Daily Reward Distribution (Last 7 Days)</span>
              </h3>
              <p className="text-[11px] text-slate-400">Virtual TTE mining rewards claimed vs allocated</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#39ff14] bg-[#39ff14]/10 px-2 py-0.5 rounded border border-[#39ff14]/20">
              +14.2% Growth
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-800/80">
            {[
              { day: 'Mon', val: 42, amount: '4,200' },
              { day: 'Tue', val: 58, amount: '5,800' },
              { day: 'Wed', val: 65, amount: '6,500' },
              { day: 'Thu', val: 74, amount: '7,400' },
              { day: 'Fri', val: 82, amount: '8,200' },
              { day: 'Sat', val: 95, amount: '9,500' },
              { day: 'Sun', val: 100, amount: '11,200' },
            ].map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.amount}
                </div>
                <div
                  style={{ height: `${item.val}%` }}
                  className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-amber-500/30 via-amber-400 to-[#39ff14] group-hover:brightness-125 transition-all shadow-[0_0_12px_rgba(57,255,20,0.2)]"
                ></div>
                <span className="text-[10px] font-mono text-slate-400">{item.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-[#39ff14]"></span>
              <span>Virtual Mining Hash Distribution</span>
            </span>
            <span className="font-mono text-white">Peak: 11,200 TTE/day</span>
          </div>
        </div>

        {/* Chart 2: Ad Views & Hash Power Boosts */}
        <div className="bg-[#080f21] rounded-3xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#38bdf8]" />
                <span>Ad Views & Hash Power Boost Velocity</span>
              </h3>
              <p className="text-[11px] text-slate-400">Completed video rewards vs unique viewers</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-0.5 rounded border border-[#38bdf8]/20">
              1,420 Total
            </span>
          </div>

          {/* SVG Smooth Curve Representation */}
          <div className="h-44 relative flex items-center justify-center border-b border-slate-800/80">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="adGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,130 Q70,90 140,110 T280,60 T420,40 L500,20 L500,150 L0,150 Z"
                fill="url(#adGrad)"
              />
              <path
                d="M0,130 Q70,90 140,110 T280,60 T420,40 L500,20"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]"></span>
              <span>Controlled Ad Adapter Throughput</span>
            </span>
            <span className="font-mono text-white">Avg 4.8 ads / miner</span>
          </div>
        </div>

      </div>

      {/* Real-time Audit Stream Widget */}
      <div className="bg-[#080f21] rounded-3xl border border-slate-800 p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-amber-400" />
            <h3 className="font-display font-bold text-sm text-white">
              Recent Privileged Audit Logs (Append-Only)
            </h3>
          </div>
          <button
            onClick={() => onNavigate('audit_logs')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
          >
            View All Logs →
          </button>
        </div>

        <div className="space-y-2">
          {recentLogs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded-xl bg-[#040814] border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30">
                  {log.action}
                </span>
                <span className="text-white font-sans">{log.target}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span className="truncate max-w-[200px] text-slate-300">{log.newValue}</span>
                <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
