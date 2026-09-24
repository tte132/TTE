import React from 'react';
import { Bell, ShieldCheck, Globe, Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import tteLogoImg from '../assets/images/tte_logo.jpg';

export const Header: React.FC = () => {
  const { 
    user, 
    setIsProfileDrawerOpen, 
    setIsNotificationsModalOpen, 
    language, 
    setLanguage 
  } = useApp();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  const [tapCount, setTapCount] = React.useState(0);
  const lastTapRef = React.useRef(0);

  const handleLogoTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current > 2000) {
      setTapCount(1);
    } else {
      const next = tapCount + 1;
      setTapCount(next);
      if (next >= 5) {
        window.location.hash = '#admin';
        setTapCount(0);
      }
    }
    lastTapRef.current = now;
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#060913]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 pt-safe transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* Brand Zone */}
        <div 
          onClick={handleLogoTap}
          className="flex items-center gap-2.5 cursor-pointer select-none active:scale-95 transition-transform"
          title="TTE Mining Node"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-400/60 shadow-[0_0_12px_rgba(234,179,8,0.35)] bg-[#081022] flex items-center justify-center shrink-0">
            <img 
              src={tteLogoImg} 
              alt="TTE Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-display font-extrabold text-base tracking-wide text-white leading-none">
                TTE
              </h1>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-400/30 leading-none">
                TIME TO EARN
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal leading-tight mt-0.5">
              Virtual Mining & Rewards
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="h-8 px-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1 active:scale-95 transition-all"
            title="Toggle Language"
            aria-label="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>{language === 'en' ? 'EN' : 'বাংলা'}</span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => setIsNotificationsModalOpen(true)}
            className="w-8 h-8 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white flex items-center justify-center relative active:scale-95 transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#39ff14] shadow-[0_0_6px_#39ff14]"></span>
          </button>

          {/* User Profile Avatar / Menu Trigger */}
          <button
            onClick={() => setIsProfileDrawerOpen(true)}
            className="flex items-center gap-1.5 pl-1 pr-1.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 hover:border-slate-600 active:scale-95 transition-all"
            aria-label="User Profile"
          >
            <div className="relative">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-800 border border-[#38bdf8]/50">
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"}
                  alt={user?.displayName || "Profile"}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {user?.verificationStatus === 'VERIFIED' && (
                <ShieldCheck className="w-3 h-3 text-[#39ff14] absolute -bottom-1 -right-1 bg-[#060913] rounded-full" />
              )}
            </div>
            <Menu className="w-3.5 h-3.5 text-slate-400" />
          </button>

        </div>
      </div>
    </header>
  );
};
