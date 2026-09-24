import React from 'react';
import { Pickaxe, Zap, CheckSquare, Users, Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavigationTab } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface TabItem {
  id: NavigationTab;
  label: string;
  labelBn: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabItem[] = [
  { id: 'tasks', label: 'Tasks', labelBn: 'টাস্ক', icon: CheckSquare },
  { id: 'miners', label: 'Miners', labelBn: 'মাইনার্স', icon: Zap },
  { id: 'mine', label: 'Mine', labelBn: 'মাইন', icon: Pickaxe },
  { id: 'friends', label: 'Friends', labelBn: 'ফ্রেন্ডস', icon: Users },
  { id: 'wallet', label: 'Wallet', labelBn: 'ওয়ালেট', icon: Wallet },
];

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, language } = useApp();

  const handleSelectTab = (tab: NavigationTab) => {
    triggerHaptic('selection');
    setCurrentTab(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#060913]/95 backdrop-blur-xl border-t border-slate-800/80 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.6)]">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1.5 transition-all relative ${
                isActive ? 'text-[#39ff14]' : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={tab.label}
            >
              {/* Active Glow Pill */}
              {isActive && (
                <span className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-1 bg-[#39ff14] rounded-full shadow-[0_0_10px_#39ff14]"></span>
              )}

              <div
                className={`p-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'scale-110 drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]'
                    : 'active:scale-95'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>

              <span
                className={`text-[10px] tracking-tight mt-0.5 leading-none font-medium ${
                  isActive ? 'text-[#39ff14] font-semibold' : 'text-slate-400'
                }`}
              >
                {language === 'bn' ? tab.labelBn : tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
