export type AdminRole = 'super_admin' | 'admin' | 'support';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  status: 'active' | 'suspended';
  twoFactorEnabled: boolean;
  createdAt: string;
  lastLoginAt: string;
  avatar?: string;
}

export interface AdminSession {
  token: string;
  admin: AdminUser;
  expiresAt: number;
  device: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminId: string;
  adminEmail: string;
  action: string;
  target: string;
  previousValue?: string;
  newValue?: string;
  ipAddress?: string;
}

export interface TelegramBotConfig {
  botToken: string;
  botUsername: string;
  botName: string;
  botId: string;
  webhookUrl: string;
  miniAppUrl: string;
  status: 'connected' | 'disconnected' | 'reloading' | 'error';
  lastReloadedAt: string | null;
  welcomeMessage: string;
  menuButtonTitle: string;
  lastError?: string;
}

export interface MiningRewardSettings {
  baseMiningSpeed: number; // 0.05 TH/s
  rewardRate: number; // rate multiplier
  maxMiningLevel: number; // 10000 (up to 10,000 levels)
  claimIntervalSeconds: number; // 60
  minClaimAmount: number; // 0.01 TTE
  dailyRewardLimit: number; // 500 TTE
  referralRewardInstant: number; // 100 TTE
  referralPercentage: number; // 10%
  welcomeReward: number; // 0 TTE (fresh)
  dailyCheckinBaseReward: number; // 5 TTE
  taskRewardMultiplier: number; // 1.0
  adRewardPercent: number; // 5%
  adRewardMultiplier: number; // 1.0
}

export interface AdSettings {
  enabled: boolean;
  adsPerCycle: number;
  rewardPerAdPercent: number;
  hashPowerBoostPercent: number;
  maxBoostPercent: number;
  cooldownMinutes: number;
  dailyAdLimit: number;
  minWatchDurationSeconds: number;
  rewardedAdUrl: string; // The active Ads Link configured by admin (e.g. Monetag direct link, Adsterra URL, sponsor URL)
  adFormat?: 'direct_link' | 'popup_window' | 'iframe_player';
  adTitle?: string;
}

export interface AdProvider {
  id: string;
  name: string;
  type: 'direct' | 'adsterra' | 'monetag' | 'propeller' | 'google_admob' | 'custom';
  appId: string;
  zoneId: string;
  placementId: string;
  directAdUrl: string;
  rewardedAdUrl: string;
  bannerUrl: string;
  interstitialUrl: string;
  status: 'active' | 'disabled';
  priority: number;
  notes?: string;
}

export interface AdLinkConfig {
  id: string;
  providerId: string;
  providerName: string;
  type: 'rewarded' | 'direct' | 'banner' | 'interstitial';
  url: string;
  status: 'active' | 'inactive';
  lastTestedAt?: string;
}

export interface PlatformLedgerItem {
  id: string;
  date: string;
  type: 'CREDIT' | 'DEBIT';
  reference: string;
  amount: number;
  balanceAfter: number;
  admin: string;
  note: string;
}

export interface PlatformBalanceSummary {
  currentReserveBalance: number;
  totalLiabilities: number;
  pendingWithdrawalsAmount: number;
  completedWithdrawalsAmount: number;
  totalRewardsIssued: number;
  totalRewardsClaimed: number;
}

export interface SystemSettings {
  appName: string;
  coinName: string;
  symbol: string;
  logoUrl: string;
  supportUrl: string;
  telegramUrl: string;
  websiteUrl: string;
  termsUrl: string;
  privacyUrl: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  registrationEnabled: boolean;
  withdrawalsEnabled: boolean;
  referralsEnabled: boolean;
  adsEnabled: boolean;
  miningEnabled: boolean;
}

export interface UserManagementItem {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  telegramId: string;
  registrationDate: string;
  lastActive: string;
  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'DISABLED';
  miningLevel: number;
  miningSpeed: number;
  rewardBalance: number;
  referralCount: number;
  totalEarned: number;
  totalWithdrawn: number;
  walletAddress?: string;
  adminNotes: string[];
  lastLoginIp?: string;
}

export type AdminViewTab =
  | 'dashboard'
  | 'bot'
  | 'users'
  | 'mining_settings'
  | 'ads_settings'
  | 'ad_providers'
  | 'ad_links'
  | 'ad_analytics'
  | 'verification'
  | 'withdrawals'
  | 'ledger'
  | 'transactions'
  | 'tasks'
  | 'miner_store'
  | 'referrals'
  | 'system_settings'
  | 'audit_logs'
  | 'team';
