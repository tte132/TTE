import React, { useState } from 'react';
import {
  LayoutDashboard,
  Bot,
  Users,
  Pickaxe,
  Eye,
  Layers,
  Link2,
  ShieldCheck,
  CreditCard,
  BookOpen,
  CheckSquare,
  ShoppingBag,
  UserPlus,
  Settings,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Radio,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { AdminViewTab, AdminUser } from '../../types/admin';
import { adminService } from '../../services/adminService';
import tteLogoImg from '../../assets/images/tte_logo.jpg';

// Child view components
import { AdminDashboard } from './AdminDashboard';
import { AdminTelegramBot } from './AdminTelegramBot';
import { AdminUsers } from './AdminUsers';
import { AdminMiningSettings } from './AdminMiningSettings';
import { AdminAdsSettings } from './AdminAdsSettings';
import { AdminAdProviders } from './AdminAdProviders';
import { AdminAdLinks } from './AdminAdLinks';
import { AdminVerification } from './AdminVerification';
import { AdminWithdrawals } from './AdminWithdrawals';
import { AdminLedger } from './AdminLedger';
import { AdminTasks } from './AdminTasks';
import { AdminMinerStore } from './AdminMinerStore';
import { AdminReferrals } from './AdminReferrals';
import { AdminSystemSettings } from './AdminSystemSettings';
import { AdminAuditLogs } from './AdminAuditLogs';
import { AdminTeam } from './AdminTeam';

interface AdminLayoutProps {
  currentAdmin: AdminUser;
  onLogout: () => void;
  onSwitchToUserPanel: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentAdmin, onLogout, onSwitchToUserPanel }) => {
  const [activeTab, setActiveTab] = useState<AdminViewTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const botConfig = adminService.getBotConfig();

  const navigationItems: { id: AdminViewTab; label: string; icon: React.ComponentType<{ className?: string }>; highlight?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bot', label: 'Telegram Bot & Reload', icon: Bot, highlight: true },
    { id: 'users', label: 'Users Management', icon: Users },
    { id: 'mining_settings', label: 'Mining & Rewards', icon: Pickaxe },
    { id: 'ads_settings', label: 'Rewarded Ads', icon: Eye },
    { id: 'ad_providers', label: 'Ad Providers', icon: Layers },
    { id: 'ad_links', label: 'Ad Links', icon: Link2 },
    { id: 'verification', label: 'KYC & Verification', icon: ShieldCheck },
    { id: 'withdrawals', label: 'Withdrawals', icon: CreditCard },
    { id: 'ledger', label: 'Admin Ledger', icon: BookOpen },
    { id: 'tasks', label: 'Manage Tasks', icon: CheckSquare },
    { id: 'miner_store', label: 'Miner Store', icon: ShoppingBag },
    { id: 'referrals', label: 'Referral System', icon: UserPlus },
    { id: 'system_settings', label: 'General Settings', icon: Settings },
    { id: 'audit_logs', label: 'Audit Logs', icon: ShieldAlert },
    { id: 'team', label: 'Staff & Roles', icon: Users },
  ];

  const handleSelectTab = (tab: AdminViewTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col antialiased selection:bg-[#39ff14]/30 selection:text-[#39ff14]">
      
      {/* Top Admin Control Header */}
      <header className="h-16 bg-[#080e1e]/90 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-xl px-4 flex items-center justify-between">
        
        {/* Left: Mobile hamburger + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-400/60 shadow-[0_0_12px_rgba(234,179,8,0.3)] bg-slate-900 shrink-0">
              <img src={tteLogoImg} alt="TTE Brand" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-sm text-white tracking-wide">TIME TO EARN</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase">
                  ADMIN
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-0.5 font-mono">Control System v3.4</span>
            </div>
          </div>
        </div>

        {/* Right: Bot Status + Switch to User App + Admin Profile + Logout */}
        <div className="flex items-center gap-3">
          
          {/* Bot quick indicator */}
          <button
            onClick={() => setActiveTab('bot')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#060b17] border border-slate-700/60 text-xs font-mono"
            title="Click to manage and reload Telegram Bot"
          >
            <Bot className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className={`w-2 h-2 rounded-full ${botConfig.status === 'connected' ? 'bg-[#39ff14] animate-pulse' : 'bg-amber-400'}`}></span>
            <span className={`text-[11px] font-bold ${botConfig.status === 'connected' ? 'text-[#39ff14]' : 'text-amber-300'}`}>
              {botConfig.status === 'connected' ? 'BOT ONLINE' : 'BOT STANDBY'}
            </span>
          </button>

          {/* DIRECT SWITCH TO USER PANEL (1-CLICK) */}
          <button
            onClick={onSwitchToUserPanel}
            className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-[#39ff14] to-emerald-400 text-slate-950 font-display font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(57,255,20,0.35)] hover:brightness-110 active:scale-95 transition-all cursor-pointer border border-emerald-300"
            title="1-Click Direct Switch to User Panel"
          >
            <ArrowLeft className="w-4 h-4 text-black stroke-[3]" />
            <span className="font-extrabold tracking-tight">USER PANEL (সরাসরি যান)</span>
          </button>

          {/* Admin Role Pill */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
            <div className="text-right">
              <span className="font-bold text-white block text-[11px] truncate max-w-[120px]">{currentAdmin.name}</span>
              <span className="text-[9px] font-mono text-amber-300 uppercase block font-semibold">{currentAdmin.role.replace('_', ' ')}</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white text-xs font-bold font-mono">
              {currentAdmin.name.charAt(0)}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Secure Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>

      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar (Left Navigation) */}
        <aside className="w-64 bg-[#060a16] border-r border-slate-800/80 flex flex-col justify-between hidden md:flex shrink-0">
          <div className="p-3.5 space-y-2 overflow-y-auto no-scrollbar flex-1">
            
            {/* DIRECT SWITCH CARD IN SIDEBAR (1-CLICK) */}
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#0b1c36] via-[#07152b] to-[#040d1c] border border-[#39ff14]/30 shadow-lg mb-2">
              <div className="text-[10px] uppercase font-mono text-slate-400 mb-1.5 flex items-center justify-between">
                <span>Direct Panel Switch</span>
                <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-ping"></span>
              </div>
              <button
                onClick={onSwitchToUserPanel}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-[#39ff14] hover:brightness-110 text-slate-950 font-display font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#39ff14]/20 transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-black stroke-[3]" />
                <span>GO TO USER PANEL</span>
              </button>
            </div>

            <span className="text-[10px] uppercase font-mono font-bold text-slate-500 px-3 py-1 block">
              Core Navigation
            </span>

            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400/20 via-amber-400/10 to-transparent text-white border-l-4 border-amber-400 font-bold shadow-md shadow-amber-400/5'
                      : item.highlight
                      ? 'text-[#39ff14] hover:bg-[#39ff14]/10 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : item.highlight ? 'text-[#39ff14]' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.highlight && (
                    <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Sidebar Footer */}
          <div className="p-4 border-t border-slate-800/80 bg-[#040711]/60 text-[11px] text-slate-500 font-mono">
            <div className="flex justify-between items-center mb-1">
              <span>Security Node:</span>
              <span className="text-[#39ff14] font-bold">ONLINE</span>
            </div>
            <div>RBAC Enforced · Super Admin</div>
          </div>
        </aside>

        {/* Mobile Slide-Over Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="relative w-72 max-w-[85vw] bg-[#060a16] border-r border-slate-800 h-full flex flex-col justify-between p-4 z-10 overflow-y-auto">
              <div className="space-y-1">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
                  <span className="text-xs font-bold text-white uppercase font-display">Admin Navigation</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Direct Switch Button */}
                <button
                  onClick={onSwitchToUserPanel}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 via-[#39ff14] to-emerald-400 text-slate-950 font-display font-black text-xs flex items-center justify-center gap-2 shadow-lg mb-3 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-black stroke-[3]" />
                  <span>DIRECT SWITCH TO USER PANEL</span>
                </button>

                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : item.highlight
                          ? 'text-[#39ff14] bg-[#39ff14]/10'
                          : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={onLogout}
                  className="w-full py-2.5 rounded-xl bg-rose-500/10 text-rose-300 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout from Admin</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Main Workspace View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && <AdminDashboard onNavigate={setActiveTab} />}
          {activeTab === 'bot' && <AdminTelegramBot />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'mining_settings' && <AdminMiningSettings />}
          {activeTab === 'ads_settings' && <AdminAdsSettings />}
          {activeTab === 'ad_providers' && <AdminAdProviders />}
          {activeTab === 'ad_links' && <AdminAdLinks />}
          {activeTab === 'verification' && <AdminVerification />}
          {activeTab === 'withdrawals' && <AdminWithdrawals />}
          {activeTab === 'ledger' && <AdminLedger />}
          {activeTab === 'tasks' && <AdminTasks />}
          {activeTab === 'miner_store' && <AdminMinerStore />}
          {activeTab === 'referrals' && <AdminReferrals />}
          {activeTab === 'system_settings' && <AdminSystemSettings />}
          {activeTab === 'audit_logs' && <AdminAuditLogs />}
          {activeTab === 'team' && <AdminTeam />}
        </main>

      </div>

    </div>
  );
};
