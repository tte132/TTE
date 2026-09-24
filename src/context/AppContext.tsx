import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  User, 
  MinerLevel, 
  TaskItem, 
  DailyStreakState, 
  AdRewardConfig, 
  ReferralData, 
  PayoutItem, 
  AppHistoryItem, 
  WithdrawalRequest 
} from '../types';
import { apiService, INITIAL_MINER_LEVELS } from '../services/api';
import { triggerHaptic, initTelegramApp } from '../utils/telegram';

export type NavigationTab = 'mine' | 'miners' | 'tasks' | 'friends' | 'wallet';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  user: User | null;
  minerLevels: MinerLevel[];
  tasks: TaskItem[];
  dailyStreak: DailyStreakState | null;
  adConfig: AdRewardConfig | null;
  referrals: ReferralData | null;
  payouts: PayoutItem[];
  history: AppHistoryItem[];
  withdrawals: WithdrawalRequest[];
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  // Mining Engine States
  isMiningActive: boolean;
  startMining: () => Promise<void>;
  stopMining: () => Promise<void>;
  unclaimedReward: number;
  effectiveHashPower: number;
  boostMultiplier: number;
  boostTimeRemaining: number;
  adCooldownRemaining: number;
  isClaimingReward: boolean;
  isLoading: boolean;
  toasts: Toast[];
  addToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;
  // Modals & Drawers
  isBoostModalOpen: boolean;
  setIsBoostModalOpen: (open: boolean) => void;
  isWithdrawModalOpen: boolean;
  setIsWithdrawModalOpen: (open: boolean) => void;
  isProfileDrawerOpen: boolean;
  setIsProfileDrawerOpen: (open: boolean) => void;
  isNotificationsModalOpen: boolean;
  setIsNotificationsModalOpen: (open: boolean) => void;
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (open: boolean) => void;
  language: 'en' | 'bn';
  setLanguage: (lang: 'en' | 'bn') => void;
  // Core User Actions
  claimMiningReward: () => Promise<void>;
  watchRewardedAd: () => Promise<void>;
  claimDailyCheckin: () => Promise<void>;
  startTask: (taskId: string) => Promise<void>;
  claimTask: (taskId: string) => Promise<void>;
  upgradeMiner: (level: number) => Promise<void>;
  claimSquadCommission: () => Promise<void>;
  simulateInviteFriend: () => Promise<void>;
  requestWithdrawal: (params: { amount: number; network: 'TON' | 'BEP20' | 'POLYGON'; address: string }) => Promise<void>;
  connectWallet: (address: string, network: 'TON' | 'BEP20' | 'POLYGON') => Promise<void>;
  disconnectWallet: () => Promise<void>;
  submitKYC: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [minerLevels, setMinerLevels] = useState<MinerLevel[]>(INITIAL_MINER_LEVELS);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [dailyStreak, setDailyStreak] = useState<DailyStreakState | null>(null);
  const [adConfig, setAdConfig] = useState<AdRewardConfig | null>(null);
  const [referrals, setReferrals] = useState<ReferralData | null>(null);
  const [payouts, setPayouts] = useState<PayoutItem[]>([]);
  const [history, setHistory] = useState<AppHistoryItem[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  
  const [currentTab, setCurrentTab] = useState<NavigationTab>('mine');
  const [isMiningActive, setIsMiningActive] = useState<boolean>(() => {
    return localStorage.getItem('tte_mining_active_v3') === 'true';
  });

  const [unclaimedReward, setUnclaimedReward] = useState<number>(() => {
    const saved = localStorage.getItem('tte_unclaimed_reward_v3');
    return saved ? Math.max(0, parseFloat(saved)) : 0.0000;
  });
  
  const [isClaimingReward, setIsClaimingReward] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modals
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  // Timers
  const [boostTimeRemaining, setBoostTimeRemaining] = useState<number>(0);
  const [adCooldownRemaining, setAdCooldownRemaining] = useState<number>(0);

  const isClaimingRef = useRef(false);

  const addToast = useCallback((type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const loadAllData = useCallback(async () => {
    try {
      const [
        userData,
        levelsData,
        tasksData,
        streakData,
        adConfigData,
        referralsData,
        payoutsData,
        historyData,
        withdrawalsData
      ] = await Promise.all([
        apiService.getUser(),
        apiService.getMinerLevels(),
        apiService.getTasks(),
        apiService.getDailyStreak(),
        apiService.getAdConfig(),
        apiService.getReferralData(),
        apiService.getPayouts(),
        apiService.getHistory(),
        apiService.getWithdrawals()
      ]);

      if (userData && (userData.balance === 132.5 || userData.balance === 142.8)) {
        userData.balance = 0.0;
        userData.connectedWalletBalance = 0.0;
      }

      setUser(userData);
      setMinerLevels(levelsData);
      setTasks(tasksData);
      setDailyStreak(streakData);
      setAdConfig(adConfigData);
      setReferrals(referralsData);
      setPayouts(payoutsData);
      setHistory(historyData);
      setWithdrawals(withdrawalsData);

      const activeMining = localStorage.getItem('tte_mining_active_v3') === 'true' || !!userData.isMiningActive;
      setIsMiningActive(activeMining);

      // Offline Background Mining Sync Calculation:
      if (activeMining) {
        const lastActive = localStorage.getItem('tte_last_active_time_v3');
        if (lastActive) {
          const now = Date.now();
          const elapsedSeconds = Math.max(0, Math.floor((now - parseInt(lastActive, 10)) / 1000));
          // Cap offline calculation to max 24 hours (86,400 seconds)
          const cappedSeconds = Math.min(elapsedSeconds, 86400);

          if (cappedSeconds >= 10) {
            const baseHash = userData.hashPower || 0.15;
            const boost = userData.boostMultiplier || 0;
            const effHash = Number((baseHash * (1 + boost / 100)).toFixed(2));
            const dailyRate = effHash * 24 * 0.8;
            const ratePerSec = dailyRate / 86400;
            const offlineMined = cappedSeconds * ratePerSec;

            if (offlineMined > 0.0001) {
              setUnclaimedReward((prev) => {
                const nextVal = prev + offlineMined;
                localStorage.setItem('tte_unclaimed_reward_v3', nextVal.toString());
                return nextVal;
              });

              const mins = Math.floor(cappedSeconds / 60);
              const hrs = (cappedSeconds / 3600).toFixed(1);
              const timeDisplay = cappedSeconds > 3600 ? `${hrs}h` : `${mins}m`;

              addToast(
                'info',
                '⚡ Offline Mining Sync',
                `Welcome back! While you were offline (${timeDisplay}), your node mined +${offlineMined.toFixed(4)} TTE points.`
              );
            }
          }
        }
        localStorage.setItem('tte_last_active_time_v3', Date.now().toString());
      }
    } catch {
      addToast('error', 'Sync Failed', 'Could not load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    initTelegramApp();
    loadAllData();
  }, [loadAllData]);

  // Compute effective hash power with temporary ad boost
  const boostMultiplier = user?.boostMultiplier || 0;
  const baseHashPower = user?.hashPower || 0.15;
  const effectiveHashPower = Number((baseHashPower * (1 + boostMultiplier / 100)).toFixed(2));

  // Live Mining Engine: generates virtual TTE rewards dynamically when active
  useEffect(() => {
    if (!isMiningActive) return;

    const interval = setInterval(() => {
      const dailyRate = effectiveHashPower * 24 * 0.8;
      const ratePerSec = dailyRate / 86400;
      
      setUnclaimedReward((prev) => {
        const nextVal = prev + ratePerSec;
        localStorage.setItem('tte_unclaimed_reward_v3', nextVal.toString());
        return nextVal;
      });

      // Save live heartbeat timestamp for offline calculation
      localStorage.setItem('tte_last_active_time_v3', Date.now().toString());
    }, 1000);

    return () => clearInterval(interval);
  }, [isMiningActive, effectiveHashPower]);

  // Live countdown timer for Boost duration & Ad Cooldown
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();

      // Check boost duration
      if (user?.boostExpiresAt) {
        const remaining = Math.max(0, Math.floor((user.boostExpiresAt - now) / 1000));
        setBoostTimeRemaining(remaining);
        if (remaining <= 0 && user.boostMultiplier > 0) {
          setUser((prev) => prev ? { ...prev, boostMultiplier: 0, boostExpiresAt: null } : null);
        }
      } else {
        setBoostTimeRemaining(0);
      }

      // Check ad cooldown
      if (adConfig?.cooldownEndsAt) {
        const remaining = Math.max(0, Math.floor((adConfig.cooldownEndsAt - now) / 1000));
        setAdCooldownRemaining(remaining);
        if (remaining <= 0 && adConfig.currentCycleCompleted) {
          setAdConfig((prev) => prev ? { ...prev, watchedCount: 0, cooldownEndsAt: null, currentCycleCompleted: false } : null);
        }
      } else {
        setAdCooldownRemaining(0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [user, adConfig]);

  // Start Mining Node
  const startMining = async () => {
    try {
      triggerHaptic('medium');
      const updatedUser = await apiService.startMining();
      setUser(updatedUser);
      setIsMiningActive(true);
      localStorage.setItem('tte_mining_active_v3', 'true');
      localStorage.setItem('tte_last_active_time_v3', Date.now().toString());
      triggerHaptic('success');
      addToast('success', 'Mining Started!', '🚀 TTE Quantum Mining Node is now active! Earning TTE points 24/7.');
    } catch {
      addToast('error', 'Error', 'Failed to start mining node');
    }
  };

  // Stop Mining Node
  const stopMining = async () => {
    try {
      triggerHaptic('light');
      const updatedUser = await apiService.stopMining();
      setUser(updatedUser);
      setIsMiningActive(false);
      localStorage.setItem('tte_mining_active_v3', 'false');
      addToast('info', 'Mining Paused', 'TTE Mining Node paused.');
    } catch {
      addToast('error', 'Error', 'Failed to pause mining node');
    }
  };

  // 1. Claim Virtual Mining Reward
  const claimMiningReward = async () => {
    if (isClaimingRef.current || isClaimingReward) return;
    if (unclaimedReward <= 0.0001) {
      addToast('info', 'TTE Mining', 'Mining points are generating. Please wait a moment.');
      return;
    }

    try {
      isClaimingRef.current = true;
      setIsClaimingReward(true);
      triggerHaptic('medium');

      const amountToClaim = unclaimedReward;
      const res = await apiService.claimMiningReward(amountToClaim);
      
      setUnclaimedReward(0);
      localStorage.setItem('tte_unclaimed_reward_v3', '0');
      
      if (user) {
        setUser((prev) => prev ? { ...prev, balance: res.newBalance } : null);
      }

      const newHistory = await apiService.getHistory();
      setHistory(newHistory);

      triggerHaptic('success');
      addToast('success', 'Points Claimed!', `+${res.claimedAmount.toFixed(4)} TTE credited to your balance!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Claim failed';
      addToast('error', 'Claim Failed', msg);
    } finally {
      setIsClaimingReward(false);
      isClaimingRef.current = false;
    }
  };

  // 2. Watch Rewarded Ad
  const watchRewardedAd = async () => {
    try {
      triggerHaptic('medium');
      const token = `ad_tok_${Date.now()}`;
      const res = await apiService.completeRewardedAd(token);

      setUser((prev) => prev ? {
        ...prev,
        boostMultiplier: res.boostPercent,
        boostExpiresAt: Date.now() + 7200 * 1000,
      } : null);

      setAdConfig((prev) => prev ? {
        ...prev,
        watchedCount: res.newWatchedCount,
        cooldownEndsAt: res.cooldownEndsAt,
        currentCycleCompleted: res.newWatchedCount >= prev.maxAdsPerCycle,
      } : null);

      const updatedHistory = await apiService.getHistory();
      setHistory(updatedHistory);

      triggerHaptic('success');
      addToast('success', 'Hash Power Boosted!', `+5% Hash Power activated! Total Boost: +${res.boostPercent}%`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ad reward failed';
      addToast('error', 'Ad Error', msg);
    }
  };

  // 3. Claim Daily Check-In
  const claimDailyCheckin = async () => {
    try {
      triggerHaptic('medium');
      const res = await apiService.claimDailyCheckin();

      setUser((prev) => prev ? { ...prev, balance: res.newBalance } : null);
      setDailyStreak((prev) => prev ? {
        ...prev,
        checkedInToday: true,
        lastCheckinTimestamp: Date.now(),
      } : null);

      const updatedHistory = await apiService.getHistory();
      setHistory(updatedHistory);

      triggerHaptic('success');
      addToast('success', 'Daily Streak Claimed!', `+${res.reward} TTE added to your in-app balance!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Check-in failed';
      addToast('error', 'Check-In Error', msg);
    }
  };

  // 4. Start Task
  const startTask = async (taskId: string) => {
    triggerHaptic('light');
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: 'IN_PROGRESS' as const, inProgressUntil: Date.now() + 5000 } : t));
    addToast('info', 'Task Started', 'Please complete the requirement. Verifying in 5 seconds...');
    
    setTimeout(() => {
      setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: 'COMPLETED' as const } : t));
      triggerHaptic('selection');
      addToast('success', 'Task Verified!', 'Requirement fulfilled. You can claim your reward now!');
    }, 5000);
  };

  // 5. Claim Task
  const claimTask = async (taskId: string) => {
    try {
      triggerHaptic('medium');
      const res = await apiService.claimTaskReward(taskId);

      setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: 'CLAIMED' as const } : t));
      setUser((prev) => prev ? { ...prev, balance: res.newBalance } : null);

      const updatedHistory = await apiService.getHistory();
      setHistory(updatedHistory);

      triggerHaptic('success');
      addToast('success', 'Task Reward Claimed!', `+${res.reward} TTE credited!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Task claim failed';
      addToast('error', 'Claim Error', msg);
    }
  };

  // 6. Upgrade Miner Level using TTE points
  const upgradeMiner = async (level: number) => {
    try {
      triggerHaptic('heavy');
      const res = await apiService.upgradeMiner(level);

      setUser((prev) => prev ? {
        ...prev,
        level: res.newLevel,
        minerLevel: res.newLevel,
        hashPower: res.newSpeed,
        balance: res.newBalance,
      } : null);

      setMinerLevels((prev) => prev.map((l) => {
        if (l.level === level) return { ...l, status: 'CURRENT' };
        if (l.level < level) return { ...l, status: 'ACTIVE' };
        if (l.level === level + 1) return { ...l, status: 'ACTIVE' };
        return { ...l, status: 'LOCKED' };
      }));

      const updatedHistory = await apiService.getHistory();
      setHistory(updatedHistory);

      triggerHaptic('success');
      addToast('success', 'Miner Upgraded!', `Congratulations! You unlocked Level ${res.newLevel} Miner (${res.newSpeed} TH/s)!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upgrade failed';
      addToast('error', 'Upgrade Error', msg);
    }
  };

  // 7. Claim Squad Commission
  const claimSquadCommission = async () => {
    try {
      triggerHaptic('medium');
      const res = await apiService.claimSquadCommission();

      setReferrals((prev) => prev ? { ...prev, unclaimedCommission: 0, squadCommissionPool: 0 } : null);
      setUser((prev) => prev ? { ...prev, balance: res.newBalance } : null);

      const updatedHistory = await apiService.getHistory();
      setHistory(updatedHistory);

      triggerHaptic('success');
      addToast('success', 'Commission Claimed!', `+${res.amount.toFixed(4)} TTE transferred to your in-app balance!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Commission claim failed';
      addToast('error', 'Claim Error', msg);
    }
  };

  // Simulate friend invite for quick testing
  const simulateInviteFriend = async () => {
    try {
      triggerHaptic('medium');
      const updatedRef = await apiService.simulateInviteFriend();
      setReferrals(updatedRef);
      const updatedUser = await apiService.getUser();
      setUser(updatedUser);
      const updatedHistory = await apiService.getHistory();
      setHistory(updatedHistory);

      triggerHaptic('success');
      addToast('success', 'Friend Joined!', 'A new friend joined your squad! +100 TTE instant bonus + 10 TTE pool bonus added.');
    } catch {
      addToast('error', 'Invite Error', 'Could not simulate friend join');
    }
  };

  // 8. Request Withdrawal
  const requestWithdrawal = async (params: { amount: number; network: 'TON' | 'BEP20' | 'POLYGON'; address: string }) => {
    try {
      triggerHaptic('medium');
      const newRequest = await apiService.requestWithdrawal(params);

      setUser((prev) => prev ? { ...prev, balance: Number((prev.balance - params.amount).toFixed(2)) } : null);
      setWithdrawals((prev) => [newRequest, ...prev]);

      const updatedHistory = await apiService.getHistory();
      setHistory(updatedHistory);

      triggerHaptic('success');
      addToast('success', 'Withdrawal Submitted', `Request for ${params.amount} TTE sent to verification queue.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Withdrawal failed';
      addToast('error', 'Withdrawal Error', msg);
      throw err;
    }
  };

  // 9. Wallet Connect / Disconnect
  const connectWallet = async (address: string, network: 'TON' | 'BEP20' | 'POLYGON') => {
    try {
      triggerHaptic('light');
      const updatedUser = await apiService.updateWallet(address, network);
      setUser(updatedUser);
      setIsWalletModalOpen(false);
      triggerHaptic('success');
      addToast('success', 'Wallet Connected', `Linked ${network} address: ${address.slice(0, 6)}...${address.slice(-4)}`);
    } catch {
      addToast('error', 'Connection Error', 'Failed to link wallet');
    }
  };

  const disconnectWallet = async () => {
    try {
      triggerHaptic('light');
      const updatedUser = await apiService.updateWallet(null, null);
      setUser(updatedUser);
      triggerHaptic('light');
      addToast('info', 'Wallet Disconnected', 'Your wallet has been unlinked.');
    } catch {
      addToast('error', 'Wallet Error', 'Failed to disconnect wallet');
    }
  };

  // 10. KYC Submit
  const submitKYC = async () => {
    try {
      triggerHaptic('light');
      const res = await apiService.submitKYC();
      setUser((prev) => prev ? { ...prev, verificationStatus: res.status } : null);
      triggerHaptic('success');
      addToast('success', 'Verification Pending', 'Account status submitted for automated KYC verification.');
    } catch {
      addToast('error', 'KYC Error', 'Could not submit verification');
    }
  };

  const refreshData = async () => {
    await loadAllData();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        minerLevels,
        tasks,
        dailyStreak,
        adConfig,
        referrals,
        payouts,
        history,
        withdrawals,
        currentTab,
        setCurrentTab,
        isMiningActive,
        startMining,
        stopMining,
        unclaimedReward,
        effectiveHashPower,
        boostMultiplier,
        boostTimeRemaining,
        adCooldownRemaining,
        isClaimingReward,
        isLoading,
        toasts,
        addToast,
        removeToast,
        isBoostModalOpen,
        setIsBoostModalOpen,
        isWithdrawModalOpen,
        setIsWithdrawModalOpen,
        isProfileDrawerOpen,
        setIsProfileDrawerOpen,
        isNotificationsModalOpen,
        setIsNotificationsModalOpen,
        isWalletModalOpen,
        setIsWalletModalOpen,
        language,
        setLanguage,
        claimMiningReward,
        watchRewardedAd,
        claimDailyCheckin,
        startTask,
        claimTask,
        upgradeMiner,
        claimSquadCommission,
        simulateInviteFriend,
        requestWithdrawal,
        connectWallet,
        disconnectWallet,
        submitKYC,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
