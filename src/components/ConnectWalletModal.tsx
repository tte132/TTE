import React, { useState } from 'react';
import { X, Wallet, Check, Loader2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ConnectWalletModal: React.FC = () => {
  const { isWalletModalOpen, setIsWalletModalOpen, connectWallet } = useApp();
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  if (!isWalletModalOpen) return null;

  const walletOptions = [
    {
      id: 'tonkeeper',
      name: 'Tonkeeper (TON)',
      network: 'TON' as const,
      address: 'UQBOT6k7H8x9Q3UacNd810zK',
      badge: 'Recommended',
      color: 'bg-[#0284c7]',
    },
    {
      id: 'tg_wallet',
      name: 'Telegram Wallet (@wallet)',
      network: 'TON' as const,
      address: 'EQD2_Z8P794k1lQmNz6a12bT',
      badge: 'Mini App Native',
      color: 'bg-blue-600',
    },
    {
      id: 'metamask',
      name: 'MetaMask / Trust (BEP20)',
      network: 'BEP20' as const,
      address: '0x71C...4e89',
      badge: 'EVM',
      color: 'bg-amber-600',
    },
    {
      id: 'polygon',
      name: 'Polygon Wallet (MATIC)',
      network: 'POLYGON' as const,
      address: '0x89F...1b23',
      badge: 'Polygon',
      color: 'bg-purple-600',
    },
  ];

  const handleSelectWallet = async (opt: typeof walletOptions[0]) => {
    try {
      setIsConnecting(opt.id);
      // Simulate quick handshake
      await new Promise((r) => setTimeout(r, 600));
      await connectWallet(opt.address, opt.network);
    } finally {
      setIsConnecting(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0b1428] rounded-3xl border border-slate-700 max-w-sm w-full p-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#39ff14]" />
            <h3 className="font-display font-bold text-sm text-white">Connect Supported Wallet</h3>
          </div>
          <button
            onClick={() => setIsWalletModalOpen(false)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Link your non-custodial wallet to receive eligible withdrawals directly onto the blockchain network.
        </p>

        <div className="space-y-2.5">
          {walletOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleSelectWallet(opt)}
              disabled={isConnecting !== null}
              className="w-full bg-[#060913] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-3 rounded-2xl flex items-center justify-between transition-all group active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${opt.color} flex items-center justify-center text-white font-bold text-xs`}>
                  {opt.network.slice(0, 3)}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                    {opt.name}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {opt.badge}
                  </span>
                </div>
              </div>

              {isConnecting === opt.id ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#39ff14]" />
              ) : (
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 text-center">
          Client-side mock signature handshake · Never share your seed phrase
        </div>

      </div>
    </div>
  );
};
