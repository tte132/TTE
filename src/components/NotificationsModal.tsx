import React from 'react';
import { X, Bell, Zap, Flame, Award, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsModal: React.FC = () => {
  const { isNotificationsModalOpen, setIsNotificationsModalOpen } = useApp();

  if (!isNotificationsModalOpen) return null;

  const notifications = [
    {
      id: 'notif_1',
      title: 'Miner Hash Rate Enhanced',
      time: '10m ago',
      desc: 'Your Quantum Miner has continuously produced virtual TTE points.',
      icon: Zap,
      color: 'text-[#39ff14]',
      bg: 'bg-[#39ff14]/15',
    },
    {
      id: 'notif_2',
      title: 'New Ad Boost Cycle Available',
      time: '1h ago',
      desc: 'Watch rewarded ads to boost your temporary hash rate by +50% total.',
      icon: Flame,
      color: 'text-amber-400',
      bg: 'bg-amber-500/15',
    },
    {
      id: 'notif_3',
      title: 'Squad Qualified Commission',
      time: '2h ago',
      desc: '@sara_crypto upgraded miner. +100 TTE bonus ready to claim.',
      icon: Award,
      color: 'text-[#38bdf8]',
      bg: 'bg-[#38bdf8]/15',
    },
    {
      id: 'notif_4',
      title: 'Security Verification Active',
      time: '1d ago',
      desc: 'Telegram Mini App secure session established and verified.',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/15',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0b1428] rounded-3xl border border-slate-700 max-w-sm w-full p-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#39ff14]" />
            <h3 className="font-display font-bold text-sm text-white">Notifications</h3>
          </div>
          <button
            onClick={() => setIsNotificationsModalOpen(false)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto no-scrollbar">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className="bg-[#060913] p-3 rounded-2xl border border-slate-800/80 flex items-start gap-3"
              >
                <div className={`w-8 h-8 rounded-xl ${n.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className={`w-4 h-4 ${n.color}`} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate">{n.title}</h4>
                    <span className="text-[10px] text-slate-500 font-mono ml-2 shrink-0">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{n.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setIsNotificationsModalOpen(false)}
          className="w-full mt-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
        >
          Close
        </button>

      </div>
    </div>
  );
};
