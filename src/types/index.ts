export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED';

export type TaskStatus = 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'COOLDOWN' | 'CLAIMED';

export type WithdrawalStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REJECTED';

export type HistoryType = 
  | 'MINING_REWARD'
  | 'AD_REWARD'
  | 'TASK_REWARD'
  | 'REFERRAL_REWARD'
  | 'UPGRADE'
  | 'WITHDRAWAL'
  | 'CLAIM';

export interface User {
  id: string;
  telegramId: string;
  username: string;
  displayName: string;
  avatar: string;
  level: number;
  balance: number; // in-app virtual TTE balance
  connectedWalletBalance: number; // wallet TTE
  hashPower: number; // base TH/s
  boostMultiplier: number; // temporary boost percentage e.g. 15 for +15%
  boostExpiresAt: number | null; // timestamp ms
  minerLevel: number;
  createdAt: string;
  verificationStatus: VerificationStatus;
  connectedWallet: string | null;
  walletNetwork: 'TON' | 'BEP20' | 'POLYGON' | null;
  isMiningActive?: boolean;
  miningStartedAt?: number | null;
  lastActiveTimestamp?: number | null;
}

export interface MinerLevel {
  level: number;
  speed: number; // in TH/s
  upgradeCost: number; // in TTE Points
  dailyRewardTTE: number;
  dailyRewardMRG?: number;
  usdValue: number;
  status: 'CURRENT' | 'ACTIVE' | 'NEED_TTE' | 'LOCKED';
  efficiency: string;
  tierName?: string;
}

export interface AdRewardConfig {
  maxAdsPerCycle: number;
  cooldownSeconds: number;
  rewardPercentPerAd: number; // +5%
  watchedCount: number;
  lastCompletedAt: number | null;
  cooldownEndsAt: number | null;
  currentCycleCompleted: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  reward: number; // in TTE Points
  type: 'social' | 'video' | 'telegram' | 'checkin' | 'ad';
  category: string;
  cooldownSeconds?: number;
  status: TaskStatus;
  actionUrl?: string;
  inProgressUntil?: number;
}

export interface DailyStreakState {
  currentStreak: number; // 1-7
  checkedInToday: boolean;
  lastCheckinTimestamp: number | null;
  rewards: number[]; // [5, 6, 7, 8, 9, 10, 15] in TTE Points
}

export interface ReferralMember {
  id: string;
  name: string;
  username: string;
  avatar: string;
  level: number;
  qualified: boolean;
  joinedDaysAgo: number;
  commissionEarned: number;
}

export interface ReferralData {
  referralCode: string;
  inviteLink: string;
  qualifiedCount: number;
  totalSquadCount: number;
  squadCommissionPool: number; // in TTE Points
  unclaimedCommission: number;
  instantRewardPerInvite: number; // 100 TTE
  miningBonusPercent: number; // 10%
  members: ReferralMember[];
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  network: 'TON' | 'BEP20' | 'POLYGON';
  address: string;
  fee: number;
  netAmount: number;
  status: WithdrawalStatus;
  createdAt: string;
  txHash?: string;
}

export interface PayoutItem {
  id: string;
  maskedUsername: string;
  timeAgo: string;
  amount: number;
  network: string;
}

export interface AppHistoryItem {
  id: string;
  type: HistoryType;
  title: string;
  description: string;
  amount: number;
  isPositive: boolean;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING' | 'REJECTED';
}

export type NavigationTab = 'tasks' | 'miners' | 'mine' | 'friends' | 'wallet';
