import React, { useState } from 'react';
import { Zap, Sparkles } from 'lucide-react';
import tteLogoImg from '../assets/images/tte_logo.jpg';
import { triggerHaptic } from '../utils/telegram';

interface CoinMascotProps {
  speedTh: number;
  boostMultiplier?: number;
  onCoinTap?: () => void;
}

export const CoinMascot: React.FC<CoinMascotProps> = ({ 
  speedTh, 
  boostMultiplier = 0,
  onCoinTap 
}) => {
  const [tapEffect, setTapEffect] = useState(false);
  const [floatingStars, setFloatingStars] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    triggerHaptic('light');
    setTapEffect(true);
    setTimeout(() => setTapEffect(false), 200);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newStar = { id: Date.now(), x, y };

    setFloatingStars((prev) => [...prev.slice(-4), newStar]);
    setTimeout(() => {
      setFloatingStars((prev) => prev.filter((s) => s.id !== newStar.id));
    }, 800);

    if (onCoinTap) onCoinTap();
  };

  return (
    <div className="relative flex flex-col items-center justify-center my-4 py-2 select-none">
      
      {/* Outer ambient energy glow */}
      <div className="absolute w-60 h-60 rounded-full bg-gradient-to-tr from-[#eab308]/20 via-[#39ff14]/15 to-[#38bdf8]/15 blur-3xl -z-10 pointer-events-none"></div>

      {/* Rotating cyber ring decoration */}
      <div className="relative w-52 h-52 sm:w-56 sm:h-56 flex items-center justify-center">
        
        {/* Outer dashed spinning border */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#eab308]/40 animate-[spin_24s_linear_infinite] pointer-events-none"></div>
        <div className="absolute -inset-2 rounded-full border border-[#39ff14]/30 animate-[spin_18s_linear_infinite_reverse] pointer-events-none"></div>

        {/* Central interactive coin container */}
        <div 
          onClick={handleTap}
          className={`relative w-44 h-44 sm:w-48 sm:h-48 rounded-full cursor-pointer transition-transform duration-150 ease-out active:scale-95 ${
            tapEffect ? 'scale-90' : 'hover:scale-[1.02]'
          }`}
          style={{
            boxShadow: '0 0 35px rgba(234, 179, 8, 0.35), 0 0 15px rgba(57, 255, 20, 0.25)',
          }}
        >
          {/* Gold & Neon Ring Edge */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-b from-[#eab308] via-[#39ff14]/50 to-[#ca8a04] p-[2.5px] shadow-[0_0_20px_rgba(234,179,8,0.4)]">
            <div className="w-full h-full rounded-full bg-[#060913] overflow-hidden">
              <img
                src={tteLogoImg}
                alt="TTE Official Time To Earn Logo"
                className="w-full h-full object-cover object-center transform transition-transform hover:scale-105 duration-300"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback styled SVG container if image fails
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-[#131109] to-slate-950 p-4 text-center">
                        <div class="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 font-black text-xl mb-1">TTE</div>
                        <span class="text-xs font-bold text-white tracking-widest">TIME TO EARN</span>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          </div>

          {/* Floating Tap Sparkles */}
          {floatingStars.map((star) => (
            <span
              key={star.id}
              className="absolute pointer-events-none text-amber-300 font-bold text-xs font-mono animate-out fade-out slide-out-to-top duration-700 -translate-x-1/2 -translate-y-1/2 shadow-sm"
              style={{ left: star.x, top: star.y }}
            >
              +TTE
            </span>
          ))}

          {/* Center Hologram Overlay / Status Badge */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#060913]/95 border border-amber-400/60 shadow-[0_0_12px_rgba(234,179,8,0.35)] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-[#39ff14] -ml-3"></span>
            <span className="text-[11px] font-mono font-bold text-white tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#39ff14] fill-[#39ff14]" />
              {speedTh} TH/s
              {boostMultiplier > 0 && (
                <span className="text-amber-300 text-[10px] font-extrabold">+{boostMultiplier}%</span>
              )}
            </span>
          </div>

        </div>

      </div>

      {/* Subtitle tag */}
      <div className="flex items-center gap-1.5 mt-4 text-xs text-slate-300">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Tap TTE coin to synchronize mining frequency</span>
      </div>

    </div>
  );
};
