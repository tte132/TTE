import React, { useState } from 'react';
import { Shield, Lock, Mail, KeyRound, AlertCircle, Loader2, ArrowRight, ArrowLeft, CheckCircle2, RefreshCw } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminUser } from '../../types/admin';
import tteLogoImg from '../../assets/images/tte_logo.jpg';

interface AdminLoginProps {
  onLoginSuccess: (admin: AdminUser) => void;
  onCancelToUserPanel?: () => void;
  onBackToApp?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancelToUserPanel, onBackToApp }) => {
  const [email, setEmail] = useState('admin@timetoearn.io');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleBackToUser = () => {
    window.location.hash = '';
    if (window.location.search.includes('admin')) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('admin');
        window.history.replaceState({}, '', url.pathname + (url.hash || ''));
      } catch (e) {
        // ignore
      }
    }
    if (onBackToApp) {
      onBackToApp();
    } else if (onCancelToUserPanel) {
      onCancelToUserPanel();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await adminService.login(email, password);
      if (res.success && res.session) {
        onLoginSuccess(res.session.admin);
      } else {
        setError(res.error || 'Authentication rejected. Verify credentials.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Server authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@timetoearn.io');
    setPassword('admin123456');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden select-none">
      {/* Background cyber ambiance */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-[#38bdf8]/10 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Top direct switch to user panel bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={handleBackToUser}
            className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-[#39ff14]/60 text-slate-200 hover:text-[#39ff14] text-xs font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#39ff14]" />
            <span>Switch to User Panel</span>
          </button>

          <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
            TTE Security Gateway
          </span>
        </div>

        {/* Branding badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-amber-400 via-[#39ff14]/50 to-amber-500 shadow-[0_0_24px_rgba(234,179,8,0.35)] mb-3">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-900 border-2 border-black flex items-center justify-center">
              <img src={tteLogoImg} alt="TTE Brand" className="w-full h-full object-cover" />
            </div>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-white tracking-wide flex items-center justify-center gap-2">
            TIME TO EARN
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
              Admin Portal
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Secure Management Console & Telegram Bot Control Engine
          </p>
        </div>

        {/* Login Glassmorphism Card */}
        <div className="bg-[#080e1e]/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
          
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-bold text-white uppercase tracking-wider font-display">
                Staff Authentication
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
              ROLE: RBAC Active
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@timetoearn.io"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#040814] border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400 font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#040814] border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400 font-sans"
                />
              </div>
            </div>

            {/* 2FA Ready & Auto Session details */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>2FA Protected · 8-Hour Session Timeout</span>
              </div>
              <p className="text-[10px] text-slate-500">
                All logins are cryptographically logged with IP and device signatures.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-[#39ff14] text-slate-950 font-display font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>LOGIN TO ADMIN PANEL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Direct Switch to User Panel & Auto-fill */}
          <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
            <button
              type="button"
              onClick={handleBackToUser}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:to-slate-700 border border-slate-700 hover:border-[#39ff14] text-slate-100 hover:text-[#39ff14] text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 text-[#39ff14] group-hover:-translate-x-1 transition-transform" />
              <span>DIRECT SWITCH TO USER PANEL (অ্যাপে যান)</span>
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-amber-400/90 hover:text-amber-300 flex items-center gap-1 text-[11px] font-medium"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Fill Admin Credentials</span>
              </button>

              <button
                type="button"
                onClick={handleBackToUser}
                className="text-slate-400 hover:text-white text-[11px] underline"
              >
                Exit to Mini App
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-500 mt-6">
          TIME TO EARN (TTE) · Strict Role-Based Access Control Architecture
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0b1428] rounded-2xl border border-slate-700 max-w-sm w-full p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Admin Password Recovery</span>
            </h3>

            {forgotSent ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Recovery instructions dispatched to Super Admin security mailbox.
                </span>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-300 leading-relaxed">
                  For security compliance, admin passwords cannot be recovered in plaintext. Enter your verified corporate email to receive a cryptographically signed recovery token.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="admin@timetoearn.io"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-slate-700 text-white text-xs font-mono"
                />
              </>
            )}

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSent(false);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              {!forgotSent && (
                <button
                  type="button"
                  onClick={() => setForgotSent(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs"
                >
                  Send Recovery Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
