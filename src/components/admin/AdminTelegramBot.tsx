import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  RefreshCw, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Link2, 
  Copy, 
  Check, 
  Globe, 
  Terminal, 
  ShieldCheck, 
  Radio, 
  Sparkles,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { TelegramBotConfig } from '../../types/admin';

export const AdminTelegramBot: React.FC = () => {
  const [config, setConfig] = useState<TelegramBotConfig>(adminService.getBotConfig());
  const [tokenInput, setTokenInput] = useState(config.botToken || '');
  const [miniAppUrlInput, setMiniAppUrlInput] = useState(
    config.miniAppUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://timetoearn.io')
  );
  const [welcomeMsg, setWelcomeMsg] = useState(config.welcomeMessage);
  const [menuButtonTitle, setMenuButtonTitle] = useState(config.menuButtonTitle || 'Play TTE Mining');
  
  const [isReloading, setIsReloading] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] TTE Bot Engine initialized.`,
    `[${new Date().toLocaleTimeString()}] Waiting for Telegram Bot Token to execute reload sync...`,
  ]);

  useEffect(() => {
    const loaded = adminService.getBotConfig();
    setConfig(loaded);
    setTokenInput(loaded.botToken || '');
  }, []);

  const addLog = (msg: string) => {
    setConsoleLogs((prev) => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleReloadBot = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStatusMessage(null);
    setIsReloading(true);
    addLog(`Initiating Telegram Bot reload with token: ${tokenInput.slice(0, 6)}...`);

    try {
      // First save draft configuration
      await adminService.saveBotConfig({
        botToken: tokenInput.trim(),
        miniAppUrl: miniAppUrlInput.trim(),
        welcomeMessage: welcomeMsg,
        menuButtonTitle: menuButtonTitle,
      });

      addLog(`Connecting to Telegram Bot API (https://api.telegram.org/bot<TOKEN>/getMe)...`);

      const result = await adminService.reloadTelegramBot(tokenInput.trim(), miniAppUrlInput.trim());

      if (result.success) {
        addLog(`✓ Bot verified successfully! Username: ${result.data?.botUsername || 'TTE Bot'}`);
        addLog(`✓ WebApp Chat Menu button synchronized: "${menuButtonTitle}" -> ${miniAppUrlInput}`);
        addLog(`✓ Telegram Bot reload complete. Bot is LIVE and connected!`);

        setStatusMessage({
          type: 'success',
          text: `Telegram Bot successfully reloaded! Connected to ${result.data?.botUsername || 'Telegram Bot'} (ID: ${result.data?.botId}).`,
        });

        setConfig(adminService.getBotConfig());
      } else {
        addLog(`✕ Telegram Bot reload failed: ${result.error}`);
        setStatusMessage({
          type: 'error',
          text: result.error || 'Failed to reload Telegram Bot. Check token syntax.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown reload failure';
      addLog(`✕ Exception during bot reload: ${msg}`);
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsReloading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0c162d] via-[#09152e] to-[#0b243b] p-6 rounded-3xl border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#38bdf8]/20 to-amber-400/20 border border-[#38bdf8]/40 flex items-center justify-center text-[#38bdf8] shrink-0 shadow-lg shadow-[#38bdf8]/10">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-display font-black text-white">
                  Telegram Bot Manager & Live Reload Hub
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#39ff14]/15 text-[#39ff14] border border-[#39ff14]/30">
                  REAL-TIME SYNC
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Connect your Telegram Bot Token below. Clicking <strong className="text-white">RELOAD BOT</strong> immediately contacts Telegram API, registers the WebApp Menu Button, and synchronizes your Mini App.
              </p>
            </div>
          </div>

          {/* Quick status pill */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 rounded-2xl bg-[#060b17]/80 border border-slate-700/60 min-w-[200px]">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Bot Gateway Status</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2.5 h-2.5 rounded-full ${config.status === 'connected' ? 'bg-[#39ff14] animate-ping' : 'bg-amber-400'}`}></span>
              <span className={`w-2.5 h-2.5 rounded-full -ml-4.5 ${config.status === 'connected' ? 'bg-[#39ff14]' : 'bg-amber-400'}`}></span>
              <span className={`text-xs font-mono font-bold uppercase ${config.status === 'connected' ? 'text-[#39ff14]' : 'text-amber-300'}`}>
                {config.status === 'connected' ? 'ONLINE / RELOADED' : 'STANDBY'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">
              {config.lastReloadedAt ? `Last Sync: ${new Date(config.lastReloadedAt).toLocaleTimeString()}` : 'Not reloaded yet'}
            </span>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 text-xs animate-in fade-in duration-200 ${
            statusMessage.type === 'success'
              ? 'bg-[#39ff14]/10 border-[#39ff14]/40 text-[#39ff14]'
              : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-[#39ff14]" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          )}
          <span className="font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* Main Grid: Token Input Space + Live Bot Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Dedicated Bot Token & Configuration Space */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#080f21] rounded-3xl border border-slate-700/80 p-6 shadow-xl relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h2 className="font-display font-bold text-base text-white">
                  Telegram Bot Credentials & Reload Trigger
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">
                Official Telegram Bot API v7+
              </span>
            </div>

            <form onSubmit={handleReloadBot} className="space-y-4">
              
              {/* PRIMARY BOT TOKEN INPUT (HIGHLIGHTED SPACE) */}
              <div className="p-4 rounded-2xl bg-[#040814] border-2 border-amber-400/50 shadow-[0_0_20px_rgba(234,179,8,0.15)] relative">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-extrabold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Telegram Bot Token (Required for Reload)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Obtained from @BotFather
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="1234567890:ABCdefGhIJKlmNoPQRsTUVwxyZ1234567"
                    className="w-full pl-3.5 pr-20 py-3 rounded-xl bg-[#091224] border border-slate-700 text-white font-mono text-xs font-semibold focus:outline-none focus:border-amber-400"
                    required
                  />

                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80"
                      title={showToken ? 'Hide token' : 'Show token'}
                    >
                      {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    {tokenInput && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(tokenInput, 'token')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80"
                        title="Copy token"
                      >
                        {copiedField === 'token' ? <Check className="w-3.5 h-3.5 text-[#39ff14]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Enter your token here. When you click <strong className="text-white font-bold">RELOAD TELEGRAM BOT</strong>, the system connects directly to Telegram, verifies the bot, and configures the Mini App button!
                </p>
              </div>

              {/* Mini App URL to Bind */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Telegram Mini App WebApp URL (Destination)
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    value={miniAppUrlInput}
                    onChange={(e) => setMiniAppUrlInput(e.target.value)}
                    placeholder="https://ais-pre-rhqcs65egyfdvcpxmiqgki-657226788590.asia-east1.run.app"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#040814] border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  This URL will open when Telegram users tap the menu button inside your bot.
                </span>
              </div>

              {/* Bot Menu Button Title & Welcome Message */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Telegram Menu Button Text
                  </label>
                  <input
                    type="text"
                    value={menuButtonTitle}
                    onChange={(e) => setMenuButtonTitle(e.target.value)}
                    placeholder="Play TTE Mining"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Bot @Username
                  </label>
                  <input
                    type="text"
                    value={config.botUsername || '@TTE_MiningBot'}
                    readOnly
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814]/70 border border-slate-800 text-emerald-400 font-mono text-xs focus:outline-none cursor-default"
                  />
                </div>
              </div>

              {/* Welcome Message text area */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  /start Welcome Message (Sent to users when they start the bot)
                </label>
                <textarea
                  rows={2}
                  value={welcomeMsg}
                  onChange={(e) => setWelcomeMsg(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-slate-700 text-white text-xs leading-relaxed focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              {/* THE MAIN ACTION BUTTONS */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isReloading || !tokenInput.trim()}
                  className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-[#39ff14] to-[#22c55e] text-slate-950 font-display font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#39ff14]/20 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 text-black ${isReloading ? 'animate-spin' : ''}`} />
                  <span>{isReloading ? 'RELOADING TELEGRAM BOT...' : 'RELOAD TELEGRAM BOT NOW'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleReloadBot()}
                  disabled={isReloading || !tokenInput.trim()}
                  className="py-3 px-4 rounded-2xl bg-[#0b1b36] hover:bg-[#0e244d] border border-[#38bdf8]/40 text-[#38bdf8] text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Test Connection (/getMe)</span>
                </button>
              </div>

            </form>
          </div>

          {/* Real-Time Bot Execution Console */}
          <div className="bg-[#030610] rounded-3xl border border-slate-800 p-4">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-[#39ff14]" />
                <span>Telegram Bot API Execution Console</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse"></span>
            </div>

            <div className="font-mono text-[11px] space-y-1 text-slate-300 max-h-40 overflow-y-auto no-scrollbar">
              {consoleLogs.map((log, index) => (
                <div key={index} className="leading-relaxed">
                  {log.includes('✓') ? (
                    <span className="text-[#39ff14]">{log}</span>
                  ) : log.includes('✕') ? (
                    <span className="text-rose-400">{log}</span>
                  ) : (
                    <span className="text-slate-400">{log}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Telegram Bot Profile Card & Command Reference */}
        <div className="space-y-6">
          
          {/* Active Bot Identity Card */}
          <div className="bg-[#080f21] rounded-3xl border border-slate-700/80 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
                Bot Profile Details
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                VERIFIED
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#040814] border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-[#38bdf8] p-0.5 flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-lg">
                  TTE
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-white text-sm truncate">
                  {config.botName || 'Time To Earn Bot'}
                </h3>
                <span className="text-xs font-mono text-[#38bdf8] block truncate">
                  {config.botUsername || '@TTE_MiningBot'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Bot ID: {config.botId || '7682910382'}
                </span>
              </div>
            </div>

            {/* Configured Bot Features */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#040814]/60 border border-slate-800/80">
                <span className="text-slate-400">Mini App Menu Button:</span>
                <span className="font-semibold text-white">{config.menuButtonTitle || 'Play TTE Mining'}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#040814]/60 border border-slate-800/80">
                <span className="text-slate-400">Direct Share Link:</span>
                <button
                  onClick={() => copyToClipboard(`https://t.me/${(config.botUsername || 'TTE_MiningBot').replace('@', '')}?start=ref`, 'share')}
                  className="font-mono text-[#38bdf8] text-[11px] flex items-center gap-1 hover:underline"
                >
                  <span>Copy Link</span>
                  {copiedField === 'share' ? <Check className="w-3 h-3 text-[#39ff14]" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#040814]/60 border border-slate-800/80">
                <span className="text-slate-400">Inline Queries:</span>
                <span className="text-[#39ff14] font-semibold">Enabled</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#040814]/60 border border-slate-800/80">
                <span className="text-slate-400">Auto Hash Sync:</span>
                <span className="text-[#39ff14] font-semibold">24/7 Server Polling</span>
              </div>
            </div>

            {/* Direct Open Bot Button */}
            <a
              href={`https://t.me/${(config.botUsername || 'TTE_MiningBot').replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Open Bot in Telegram</span>
            </a>
          </div>

          {/* Quick Help Guide for Admin */}
          <div className="bg-[#080f21] rounded-3xl border border-slate-700/80 p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>How To Create & Reload Bot</span>
            </h4>
            
            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Open <strong className="text-white">@BotFather</strong> on Telegram.</li>
              <li>Type <code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded font-mono">/newbot</code> and choose a name & username ending in <code className="text-amber-300 font-mono">_bot</code>.</li>
              <li>Copy the HTTP API token provided by BotFather.</li>
              <li>Paste the token into the <strong className="text-white">Telegram Bot Token</strong> field above.</li>
              <li>Click <strong className="text-[#39ff14]">RELOAD TELEGRAM BOT NOW</strong> to activate!</li>
            </ol>
          </div>

        </div>

      </div>

    </div>
  );
};
