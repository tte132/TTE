import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { MineView } from './components/MineView';
import { MinersStoreView } from './components/MinersStoreView';
import { TasksView } from './components/TasksView';
import { FriendsView } from './components/FriendsView';
import { WalletView } from './components/WalletView';
import { BoostHashPowerModal } from './components/BoostHashPowerModal';
import { WithdrawModal } from './components/WithdrawModal';
import { ProfileDrawer } from './components/ProfileDrawer';
import { NotificationsModal } from './components/NotificationsModal';
import { ConnectWalletModal } from './components/ConnectWalletModal';
import { ToastContainer } from './components/ToastContainer';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { adminService } from './services/adminService';
import { AdminUser } from './types/admin';

import tteLogoImg from './assets/images/tte_logo.jpg';
import { Shield, ShieldAlert, ArrowRight, Wrench } from 'lucide-react';

const MainContent: React.FC<{ currentAdmin: AdminUser | null; onOpenAdmin: () => void }> = ({
  currentAdmin,
  onOpenAdmin,
}) => {
  const { currentTab, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060913] flex flex-col items-center justify-center text-center p-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400/60 shadow-[0_0_24px_rgba(234,179,8,0.4)] mb-3 bg-slate-900 animate-pulse">
          <img src={tteLogoImg} alt="TTE Logo" className="w-full h-full object-cover" />
        </div>
        <div className="text-sm font-bold text-white font-display tracking-wide">
          Connecting to TTE Virtual Node...
        </div>
        <div className="text-xs text-slate-400 mt-1">Real-Time Virtual Rewards Mining</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col justify-between selection:bg-[#39ff14]/30 selection:text-[#39ff14] relative">
      {/* Top Header */}
      <Header />

      {/* Main Tab Content Canvas */}
      <main className="flex-1 w-full max-w-md mx-auto px-3.5 sm:px-4 pb-24">
        {currentTab === 'mine' && <MineView />}
        {currentTab === 'miners' && <MinersStoreView />}
        {currentTab === 'tasks' && <TasksView />}
        {currentTab === 'friends' && <FriendsView />}
        {currentTab === 'wallet' && <WalletView />}
      </main>

      {/* Floating Bottom Nav */}
      <BottomNav />

      {/* Global Modals & Overlays */}
      <BoostHashPowerModal />
      <WithdrawModal />
      <ProfileDrawer />
      <NotificationsModal />
      <ConnectWalletModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return (
      window.location.hash.includes('admin') ||
      window.location.search.includes('admin')
    );
  });
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(adminService.getCurrentAdmin());
  const [systemSettings, setSystemSettings] = useState(adminService.getSystemSettings());

  useEffect(() => {
    const handleHashChange = () => {
      const isHashAdmin =
        window.location.hash.includes('admin') ||
        window.location.search.includes('admin');
      setIsAdminRoute(isHashAdmin);
      setCurrentAdmin(adminService.getCurrentAdmin());
      setSystemSettings(adminService.getSystemSettings());
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const handleAdminLogout = () => {
    adminService.logout();
    setCurrentAdmin(null);
  };

  const handleSwitchToUserPanel = () => {
    try {
      window.location.hash = '';
      if (window.location.search.includes('admin')) {
        const url = new URL(window.location.href);
        url.searchParams.delete('admin');
        window.history.replaceState({}, '', url.pathname + (url.hash || ''));
      }
    } catch {
      // ignore
    }
    setIsAdminRoute(false);
  };

  const handleOpenAdmin = () => {
    window.location.hash = '#admin';
    setIsAdminRoute(true);
  };

  // 1. ADMIN PANEL VIEW
  if (isAdminRoute) {
    if (!currentAdmin) {
      return (
        <AdminLogin
          onLoginSuccess={(admin) => {
            setCurrentAdmin(admin);
          }}
          onBackToApp={handleSwitchToUserPanel}
        />
      );
    }

    return (
      <AdminLayout
        currentAdmin={currentAdmin}
        onLogout={handleAdminLogout}
        onSwitchToUserPanel={handleSwitchToUserPanel}
      />
    );
  }

  // 2. MAINTENANCE MODE (For standard users when enabled by Admin)
  if (systemSettings.maintenanceMode && !currentAdmin) {
    return (
      <div className="min-h-screen bg-[#040814] flex flex-col items-center justify-center text-center p-6 text-slate-100">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 animate-pulse">
          <Wrench className="w-8 h-8" />
        </div>
        <h1 className="font-display font-black text-xl text-white">
          Scheduled Network Maintenance
        </h1>
        <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">
          {systemSettings.maintenanceMessage ||
            'TIME TO EARN is temporarily under maintenance for mining engine upgrades. Please check back shortly.'}
        </p>

        {/* Discreet Staff Login */}
        <button
          onClick={handleOpenAdmin}
          className="mt-8 text-[11px] text-slate-600 hover:text-slate-400 font-mono transition-colors"
        >
          Staff Portal Access →
        </button>
      </div>
    );
  }

  // 3. REGULAR USER MINI APP (Completely hides admin from normal users)
  return (
    <AppProvider>
      <MainContent currentAdmin={currentAdmin} onOpenAdmin={handleOpenAdmin} />
    </AppProvider>
  );
}
