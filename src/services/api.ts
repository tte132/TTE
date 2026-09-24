import { 
  User, 
  MinerLevel, 
  AdRewardConfig, 
  TaskItem, 
  DailyStreakState, 
  ReferralData, 
  WithdrawalRequest, 
  PayoutItem, 
  AppHistoryItem 
} from '../types';

const STORAGE_KEYS = {
  USER: 'tte_user_v3',
  MINER_LEVELS: 'tte_miner_levels_v3',
  AD_CONFIG: 'tte_ad_config_v3',
  TASKS: 'tte_tasks_v3',
  DAILY_STREAK: 'tte_daily_streak_v3',
  REFERRALS: 'tte_referrals_v3',
  WITHDRAWALS: 'tte_withdrawals_v3',
  HISTORY: 'tte_history_v3',
  LAST_ACTIVE_TIME: 'tte_last_active_time_v3',
  UNCLAIMED_REWARD: 'tte_unclaimed_reward_v3',
  MINING_ACTIVE: 'tte_mining_active_v3',
};

// Automatic cleanup of legacy 35-level cache
try {
  const cachedLevels = localStorage.getItem('tte_miner_levels_v3');
  if (cachedLevels) {
    const parsed = JSON.parse(cachedLevels);
    if (Array.isArray(parsed) && parsed.length <= 50) {
      localStorage.removeItem('tte_miner_levels_v3');
    }
  }
} catch {
  // ignore
}

// Support up to 10,000 realistic miner levels upgradeable with TTE points
export const MAX_MINER_LEVEL = 10000;

export function getMinerLevelFormula(lvl: number, userCurrentLevel = 1): MinerLevel {
  const safeLvl = Math.max(1, Math.min(MAX_MINER_LEVEL, Math.round(lvl)));

  // Mining Hash speed in TH/s:
  // Starts at 0.15 TH/s, scaling smoothly up to Level 10,000
  const speed = Number((0.15 + (safeLvl - 1) * 0.05 + Math.pow(safeLvl - 1, 1.15) * 0.02).toFixed(2));
  const dailyRewardTTE = Number((speed * 24 * 0.8).toFixed(2));
  const usdValue = Number((0.05 + safeLvl * 0.005).toFixed(2));

  // Balanced cost curve in TTE points
  let upgradeCost = 0;
  if (safeLvl === 1) upgradeCost = 0;
  else if (safeLvl === 2) upgradeCost = 5;
  else if (safeLvl === 3) upgradeCost = 15;
  else if (safeLvl === 4) upgradeCost = 30;
  else if (safeLvl === 5) upgradeCost = 55;
  else if (safeLvl <= 50) upgradeCost = Math.round(50 + Math.pow(safeLvl, 1.65) * 2.8);
  else if (safeLvl <= 500) upgradeCost = Math.round(200 + safeLvl * 20 + Math.pow(safeLvl, 1.45) * 3);
  else if (safeLvl <= 2500) upgradeCost = Math.round(1000 + safeLvl * 40 + Math.pow(safeLvl, 1.32) * 5);
  else upgradeCost = Math.round(4000 + safeLvl * 50 + Math.pow(safeLvl, 1.25) * 7);

  let status: MinerLevel['status'] = 'LOCKED';
  if (safeLvl === userCurrentLevel) {
    status = 'CURRENT';
  } else if (safeLvl < userCurrentLevel) {
    status = 'ACTIVE';
  } else if (safeLvl === userCurrentLevel + 1) {
    status = 'ACTIVE';
  }

  // Tier classification across 10,000 levels
  let tierName = 'Genesis Node';
  if (safeLvl > 8500) tierName = 'Cosmic Singularity';
  else if (safeLvl > 6500) tierName = 'Galactic Titan';
  else if (safeLvl > 4500) tierName = 'Stellar Supercluster';
  else if (safeLvl > 2500) tierName = 'Fusion Reactor';
  else if (safeLvl > 1000) tierName = 'Quantum Supercomputer';
  else if (safeLvl > 500) tierName = 'Cyber Matrix';
  else if (safeLvl > 100) tierName = 'Advanced Rig';

  const efficiency = `${Math.min(99.9, 94 + (safeLvl % 6)).toFixed(1)}%`;

  return {
    level: safeLvl,
    speed,
    upgradeCost,
    dailyRewardTTE,
    dailyRewardMRG: dailyRewardTTE,
    usdValue,
    status,
    efficiency,
    tierName,
  };
}

export const INITIAL_MINER_LEVELS: MinerLevel[] = Array.from({ length: 100 }, (_, index) => {
  return getMinerLevelFormula(index + 1, 1);
});

// A brand-new fresh user arrives:
const INITIAL_USER: User = {
  id: 'tte_user_' + Math.floor(100000 + Math.random() * 900000),
  telegramId: 'tg_' + Math.floor(10000000 + Math.random() * 90000000),
  username: 'TTE_Miner',
  displayName: 'TTE Quantum Miner',
  avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  level: 1,
  balance: 0.0, // Fresh clean starting balance in TTE points
  connectedWalletBalance: 0,
  hashPower: 0.15, // Starting hash power
  boostMultiplier: 0,
  boostExpiresAt: null,
  minerLevel: 1,
  createdAt: new Date().toISOString().split('T')[0],
  verificationStatus: 'VERIFIED',
  connectedWallet: null,
  walletNetwork: null,
  isMiningActive: false, // Inactive until the user clicks START MINING
  miningStartedAt: null,
  lastActiveTimestamp: null,
};

const INITIAL_AD_CONFIG: AdRewardConfig = {
  maxAdsPerCycle: 10,
  cooldownSeconds: 7200, // 2 hours
  rewardPercentPerAd: 5, // +5%
  watchedCount: 0,
  lastCompletedAt: null,
  cooldownEndsAt: null,
  currentCycleCompleted: false,
};

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task_react',
    title: 'React to Latest Telegram Post',
    description: 'Leave a 🔥 reaction on the TTE announcement channel',
    reward: 5,
    type: 'social',
    category: 'Community',
    status: 'AVAILABLE',
    actionUrl: 'https://t.me/tte_channel',
  },
  {
    id: 'task_yt_short',
    title: 'Watch TTE Miner YouTube Short',
    description: 'Watch the full 30s tutorial on maximizing virtual hash rate',
    reward: 5,
    type: 'video',
    category: 'Video',
    status: 'AVAILABLE',
    actionUrl: 'https://youtube.com',
  },
  {
    id: 'task_join_channel',
    title: 'Join Official Telegram Channel',
    description: 'Never miss daily airdrop alerts and mining reward boosts',
    reward: 10,
    type: 'telegram',
    category: 'Official',
    status: 'AVAILABLE',
    actionUrl: 'https://t.me/tte_announcements',
  },
  {
    id: 'task_follow_x',
    title: 'Follow Social Media & Repost',
    description: 'Follow our official X handle and repost the pinned tweet',
    reward: 8,
    type: 'social',
    category: 'Social',
    status: 'AVAILABLE',
    actionUrl: 'https://twitter.com',
  },
  {
    id: 'task_rewarded_ad',
    title: 'Watch Rewarded Ad',
    description: 'Support the ecosystem with 1 sponsored partner view',
    reward: 12,
    type: 'ad',
    category: 'Bonus',
    status: 'AVAILABLE',
  },
  {
    id: 'task_partner_squad',
    title: 'Explore Web3 Partner Ecosystem',
    description: 'Check out the new TON DEX staking protocol partner',
    reward: 15,
    type: 'social',
    category: 'Partner',
    status: 'AVAILABLE',
  },
];

const INITIAL_DAILY_STREAK: DailyStreakState = {
  currentStreak: 1,
  checkedInToday: false,
  lastCheckinTimestamp: null,
  rewards: [5, 6, 7, 8, 9, 10, 15],
};

const INITIAL_REFERRALS: ReferralData = {
  referralCode: 'TTE-JOIN' + Math.floor(100 + Math.random() * 900),
  inviteLink: 'https://t.me/tte_miner_bot?start=ref_tte',
  qualifiedCount: 0,
  totalSquadCount: 0,
  squadCommissionPool: 0,
  unclaimedCommission: 0,
  instantRewardPerInvite: 100,
  miningBonusPercent: 10,
  members: [],
};

const INITIAL_PAYOUTS: PayoutItem[] = [
  { id: 'pay_1', maskedUsername: 'CMu****', timeAgo: '12m ago', amount: 500, network: 'TON' },
  { id: 'pay_2', maskedUsername: 'A****', timeAgo: '23m ago', amount: 930, network: 'TON' },
  { id: 'pay_3', maskedUsername: 'Vik****', timeAgo: '34m ago', amount: 1200, network: 'TON' },
  { id: 'pay_4', maskedUsername: 'Dmit****', timeAgo: '45m ago', amount: 650, network: 'BEP20' },
  { id: 'pay_5', maskedUsername: 'Elena****', timeAgo: '1h ago', amount: 800, network: 'TON' },
  { id: 'pay_6', maskedUsername: 'Zub****', timeAgo: '2h ago', amount: 1500, network: 'POLYGON' },
];

const INITIAL_HISTORY: AppHistoryItem[] = [];

// Storage Helpers
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiService = {
  STORAGE_KEYS,

  // Get User Profile
  async getUser(): Promise<User> {
    await delay(80);
    if (typeof window !== 'undefined') {
      ['tte_user_v2', 'tte_user', 'mrg_user'].forEach((k) => {
        try { localStorage.removeItem(k); } catch {}
      });
    }

    const user = getStored<User>(STORAGE_KEYS.USER, INITIAL_USER);

    // If running inside Telegram Mini App, automatically sync the real Telegram user
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user) {
      try {
        const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
        if (tgUser.id) {
          user.telegramId = String(tgUser.id);
          if (tgUser.username) {
            user.username = tgUser.username;
          }
          const fullName = `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim();
          if (fullName) {
            user.displayName = fullName;
          }
          setStored(STORAGE_KEYS.USER, user);
        }
      } catch (e) {
        console.warn('Telegram user sync notice:', e);
      }
    }

    // Ensure balance starts strictly at 0.00 real time if legacy mock detected
    if (user.balance === 132.5 || user.balance === 142.8 || user.balance == null) {
      user.balance = 0.0;
      user.connectedWalletBalance = 0.0;
      setStored(STORAGE_KEYS.USER, user);
    }
    return user;
  },

  // Start Mining Node
  async startMining(): Promise<User> {
    await delay(200);
    const user = getStored<User>(STORAGE_KEYS.USER, INITIAL_USER);
    const now = Date.now();
    user.isMiningActive = true;
    user.miningStartedAt = user.miningStartedAt || now;
    user.lastActiveTimestamp = now;
    setStored(STORAGE_KEYS.USER, user);
    localStorage.setItem(STORAGE_KEYS.MINING_ACTIVE, 'true');
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_TIME, now.toString());

    // Add entry in history
    const history = getStored<AppHistoryItem[]>(STORAGE_KEYS.HISTORY, INITIAL_HISTORY);
    history.unshift({
      id: `hist_${now}`,
      type: 'MINING_REWARD',
      title: 'TTE Mining Node Started',
      description: `Active Level ${user.minerLevel} Miner (${user.hashPower} TH/s)`,
      amount: 0,
      isPositive: true,
      timestamp: 'Just now',
      status: 'COMPLETED',
    });
    setStored(STORAGE_KEYS.HISTORY, history.slice(0, 50));

    return user;
  },

  // Stop / Pause Mining Node
  async stopMining(): Promise<User> {
    await delay(150);
    const user = getStored<User>(STORAGE_KEYS.USER, INITIAL_USER);
    user.isMiningActive = false;
    setStored(STORAGE_KEYS.USER, user);
    localStorage.setItem(STORAGE_KEYS.MINING_ACTIVE, 'false');
    return user;
  },

  // Get Miner Levels (Supports full 10,000 levels range)
  async getMinerLevels(startLevel = 1, count = 100): Promise<MinerLevel[]> {
    await delay(60);
    const user = getStored<User>(STORAGE_KEYS.USER, INITIAL_USER);
    const userLvl = user.minerLevel || 1;
    
    // Generate window of levels up to MAX_MINER_LEVEL (10,000)
    const start = Math.max(1, Math.min(MAX_MINER_LEVEL, startLevel));
    const end = Math.min(MAX_MINER_LEVEL, start + count - 1);
    const length = end - start + 1;

    return Array.from({ length }, (_, idx) => {
      const lvl = start + idx;
      return getMinerLevelFormula(lvl, userLvl);
    });
  },

  // Get specific miner level details (1 - 10,000)
  getMinerLevel(level: number): MinerLevel {
    const user = getStored<User>(STORAGE_KEYS.USER, INITIAL_USER);
    return getMinerLevelFormula(level, user.minerLevel || 1);
  },

  // Get Ad Config
  async getAdConfig(): Promise<AdRewardConfig> {
    await delay(80);
    const config = getStored<AdRewardConfig>(STORAGE_KEYS.AD_CONFIG, INITIAL_AD_CONFIG);
    if (config.cooldownEndsAt && Date.now() > config.cooldownEndsAt) {
      config.watchedCount = 0;
      config.cooldownEndsAt = null;
      config.currentCycleCompleted = false;
      setStored(STORAGE_KEYS.AD_CONFIG, config);
    }
    return config;
  },

  // Get Tasks
  async getTasks(): Promise<TaskItem[]> {
    await delay(100);
    return getStored<TaskItem[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
  },

  // Get Daily Streak
  async getDailyStreak(): Promise<DailyStreakState> {
    await delay(80);
    const streak = getStored<DailyStreakState>(STORAGE_KEYS.DAILY_STREAK, INITIAL_DAILY_STREAK);
    if (streak.lastCheckinTimestamp) {
      const hoursSince = (Date.now() - streak.lastCheckinTimestamp) / (1000 * 60 * 60);
      if (hoursSince >= 24) {
        streak.checkedInToday = false;
        if (hoursSince >= 48) {
          streak.currentStreak = 1;
        }
        setStored(STORAGE_KEYS.DAILY_STREAK, streak);
      }
    }
    return streak;
  },

  // Get Referral Data
  async getReferralData(): Promise<ReferralData> {
    await delay(90);
    const user = getStored<User>(STORAGE_KEYS.USER, INITIAL_USER);
    const referrals = getStored<ReferralData>(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
    referrals.inviteLink = `https://t.me/tte_miner_bot?start=ref_${user.id}`;
    referrals.referralCode = `TTE-${user.id.slice(-5).toUpperCase()}`;
    return referrals;
  },

  // Get Live Payouts
  async getPayouts(): Promise<PayoutItem[]> {
    await delay(80);
    return INITIAL_PAYOUTS;
  },

  // Get History
  async getHistory(): Promise<AppHistoryItem[]> {
    await delay(90);
    return getStored<AppHistoryItem[]>(STORAGE_KEYS.HISTORY, INITIAL_HISTORY);
  },

  // Get Withdrawals
  async getWithdrawals(): Promise<WithdrawalRequest[]> {
    await delay(80);
    return getStored<WithdrawalRequest[]>(STORAGE_KEYS.WITHDRAWALS, []);
  },

  // Claim Virtual Mining Reward
  async claimMiningReward(accumulatedReward: number): Promise<{ success: boolean; newBalance: number; claimedAmount: number; message: string }> {
    await delay(250);
    if (accumulatedReward <= 0.0001) {
      throw new Error('Reward too small to claim');
    }

    const user = getStored<User>(STORAGE_KEYS.USER, INITIAL_USER);
    const claimed = Number(accumulatedReward.toFixed(4));
    user.balance = Number((user.balance + claimed).toFixed(4));
    user.lastActiveTimestamp = Date.now();
    setStored(STORAGE_KEYS.USER, user);

    // Record in history
    const history = getStored<AppHistoryItem[]>(STORAGE_KEYS.HISTORY, INITIAL_HISTORY);
    history.unshift({
      id: `hist_${Date.now()}`,
      type: 'CLAIM',
      title: 'TTE Mining Claim',
      description: `Claimed accumulated virtual reward into in-app wallet`,
      amount: claimed,
      isPositive: true,
      timestamp: 'Just now',
      status: 'COMPLETED',
    });
    setStored(STORAGE_KEYS.HISTORY, history.slice(0, 50));

    return {
      success: true,
      newBalance: user.balance,
      claimedAmount: claimed,
      message: `Successfully transferred +${claimed.toFixed(4)} TTE to your in-app balance!`,
    };
  },

  // Complete rewarded ad
  async completeRewardedAd(adToken: string): Promise<{ success: boolean; newWatchedCount: number; boostPercent: number; cooldownEndsAt: number | null }> {
    await delay(350);
    if (!adToken) {
      throw new Error('Invalid ad session verification token');
    }

    const adConfig = getStored<AdRewardConfig>(STORAGE_KEYS.AD_CONFIG, INITIAL_AD_CONFIG);
    const now = Date.now();

    if (adConfig.cooldownEndsAt && now < adConfig.cooldownEndsAt) {
      throw new Error('Ad cycle is currently cooling down');
    }

    if (adConfig.watchedCount >= adConfig.maxAdsPerCycle) {
      throw new Error('Maximum ads for this cycle reached');
    }

    adConfig.watchedCount += 1;
    adConfig.lastCompletedAt = now;

    let cooldownEndsAt: number | null = null;
    if (adConfig.watchedCount >= adConfig.maxAdsPerCycle) {
      cooldownEndsAt = now + adConfig.cooldownSeconds * 1000;
      adConfig.cooldownEndsAt = cooldownEndsAt;
      adConfig.currentCycleCompleted = true;
    }
    setStored(STORAGE_KEYS.AD_CONFIG, adConfig);

    const user = getStored<User>(STORAGE_KEYS.USER, INITIAL_USER);
    user.boostMultiplier = (user.boostMultiplier || 0) + adConfig.rewardPercentPerAd;
    user.boostExpiresAt = now + 7200 * 1000; // 2 hours
    setStored(STORAGE_KEYS.USER, user);

    const history = getStored<AppHistoryItem[]>(STORAGE_KEYS.HISTORY, INITIAL_HISTORY);
    history.unshift({
      id: `hist_${Date.now()}`,
      type: 'AD_REWARD',
      title: 'Rewarded Ad Boost',
      description: `+${adConfig.rewardPercentPerAd}% Hash Power Boost (${adConfig.watchedCount}/${adConfig.maxAdsPerCycle})`,
      amount: 1.0,
      isPositive: true,
      timestamp: 'Just now',
      status: 'COMPLETED',
    });
    setStored(STORAGE_KEYS.HISTORY, history.slice(0, 50));

    return {
      success: true,
      newWatchedCount: adConfig.watchedCount,
      boostPercent: user.boostMultiplier,
      cooldownEndsAt,
    };
  },

  // Daily check-in
  async claimDailyCheckin(): Promise<{ success: boolean; reward: number; newStreak: number; newBalance: number }> {
    await delay(250);
    const streakState = getStored<DailyStreakState>(STORAGE_KEYS.DAILY_STREAK, INITIAL_DAILY_STREAK);
    if (streakState.checkedInToday) {
      throw new Error('Already checked in today');
    }

    const dayReward = streakState.rewards[streakState.currentStreak - 1] || 15;
    const user = getStored<User>(STORAGE_KEYS.USER, INITIAL_USER);
    user.balance = Number((user.balance + dayReward).toFixed(2));
    setStored(STORAGE_KEYS.USER, user);

    streakState.checkedInToday = true;
    streakState.lastCheckinTimestamp = Date.now();
    setStored(STORAGE_KEYS.DAILY_STREAK, streakState);

    const history = getStored<AppHistoryItem[]>(STORAGE_KEYS.HISTORY, INITIAL_HISTORY);
    history.unshift({
      id: `hist_${Date.now()}`,
      type: 'TASK_REWARD',
      title: `Daily Check-In (Day ${streakState.currentStreak})`,
      description: `Consecutive attendance bonus`,
      amount: dayReward,
      isPositive: true,
      timestamp: 'Just now',
      status: 'COMPLETED',
    });
    setStored(STORAGE_KEYS.HISTORY, history.slice(0, 50));

    return {
      success: true,
      reward: dayReward,
      newStreak: streakState.currentStreak,
      newBalance: user.balance,
    };
  },

  // Claim specific task reward
  async claimTaskReward(taskId: string): Promise<{ success: boolean; reward: number; newBalance: number }> {
    await delay(300);
    const tasks = getStored<TaskItem[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    const targetIndex = tasks.findIndex((t) => t.id === taskId);
    if (targetIndex === -1) throw new Error('Task not found');

    const task = tasks[targetIndex];
    if (task.status === 'CLAIMED') throw new Error('Reward already claimed');

    task.status = 'CLAIMED';
    setStored(STORAGE_KEYS.TASKS, tasks);

    const user = getStored<User>(STORAGE_KEYS.USER, INITIAL_USER);
    user.balance = Number((user.balance + task.reward).toFixed(2));
    setStored(STORAGE_KEYS.USER, user);

    const history = getStored<AppHistoryItem[]>(STORAGE_KEYS.HISTORY, INITIAL_HISTORY);
    history.unshift({
      id: `hist_${Date.now()}`,
      type: 'TASK_REWARD',
      title: task.title,
      description: task.description,
      amount: task.reward,
      isPositive: true,
      timestamp: 'Just now',
      status: 'COMPLETED',
    });
    setStored(STORAGE_KEYS.HISTORY, history.slice(0, 50));

    return {
      success: true,
      reward: task.reward,
      newBalance: user.balance,
    };
  },

  // Upgrade miner level using TTE points (Supports Level 1 to 10,000)
  async upgradeMiner(targetLevel: number): Promise<{ success: boolean; newLevel: number; newSpeed: number; newBalance: number }> {
    await delay(400);
    const user = getStored<User>(STORAGE_KEYS.USER, INITIAL_USER);
    
    if (targetLevel < 1 || targetLevel > MAX_MINER_LEVEL) {
      throw new Error(`Target miner level must be between 1 and ${MAX_MINER_LEVEL}`);
    }

    const nextLvl = getMinerLevelFormula(targetLevel, user.minerLevel || 1);

    if (user.balance < nextLvl.upgradeCost) {
      throw new Error(`Insufficient TTE Points balance. Required: ${nextLvl.upgradeCost} TTE Points`);
    }

    user.balance = Number((user.balance - nextLvl.upgradeCost).toFixed(2));
    user.level = targetLevel;
    user.minerLevel = targetLevel;
    user.hashPower = nextLvl.speed;
    setStored(STORAGE_KEYS.USER, user);

    // History record
    const history = getStored<AppHistoryItem[]>(STORAGE_KEYS.HISTORY, INITIAL_HISTORY);
    history.unshift({
      id: `hist_${Date.now()}`,
      type: 'UPGRADE',
      title: `Miner Upgrade to Level ${targetLevel}`,
      description: `New virtual hash rate: ${nextLvl.speed} TH/s (${nextLvl.tierName || 'Node'})`,
      amount: nextLvl.upgradeCost,
      isPositive: false,
      timestamp: 'Just now',
      status: 'COMPLETED',
    });
    setStored(STORAGE_KEYS.HISTORY, history.slice(0, 50));

    return {
      success: true,
      newLevel: targetLevel,
      newSpeed: nextLvl.speed,
      newBalance: user.balance,
    };
  },

  // Squad referral claim - Completely resets pool and unclaimed to 0 and transfers to user balance!
  async claimSquadCommission(): Promise<{ success: boolean; amount: number; newBalance: number }> {
    await delay(300);
    const referrals = getStored<ReferralData>(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
    const claimableAmount = referrals.unclaimedCommission || referrals.squadCommissionPool || 0;
    
    if (claimableAmount <= 0) {
      throw new Error('No unclaimed referral commission available');
    }

    const claimed = Number(claimableAmount.toFixed(4));
    referrals.unclaimedCommission = 0;
    referrals.squadCommissionPool = 0;
    setStored(STORAGE_KEYS.REFERRALS, referrals);

    const user = getStored<User>(STORAGE_KEYS.USER, INITIAL_USER);
    user.balance = Number((user.balance + claimed).toFixed(4));
    setStored(STORAGE_KEYS.USER, user);

    const history = getStored<AppHistoryItem[]>(STORAGE_KEYS.HISTORY, INITIAL_HISTORY);
    history.unshift({
      id: `hist_${Date.now()}`,
      type: 'REFERRAL_REWARD',
      title: 'Squad Referral Commission',
      description: 'Claimed squad mining bonus directly to in-app balance',
      amount: claimed,
      isPositive: true,
      timestamp: 'Just now',
      status: 'COMPLETED',
    });
    setStored(STORAGE_KEYS.HISTORY, history.slice(0, 50));

    return {
      success: true,
      amount: claimed,
      newBalance: user.balance,
    };
  },

  // Add simulated friend invite to test referral & squad commission feature
  async simulateInviteFriend(): Promise<ReferralData> {
    await delay(300);
    const referrals = getStored<ReferralData>(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
    const user = getStored<User>(STORAGE_KEYS.USER, INITIAL_USER);

    const names = ['Alex', 'David', 'Sophia', 'Kareem', 'Elena', 'Rahul'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const newMember = {
      id: `sq_${Date.now()}`,
      name: randomName,
      username: `@${randomName.toLowerCase()}_crypto`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      level: 1,
      qualified: true,
      joinedDaysAgo: 0,
      commissionEarned: 2.5,
    };

    referrals.members.unshift(newMember);
    referrals.totalSquadCount += 1;
    referrals.qualifiedCount += 1;
    // Add bonus to squad pool and direct invite bonus
    referrals.squadCommissionPool = Number((referrals.squadCommissionPool + 10.0).toFixed(4));
    referrals.unclaimedCommission = Number((referrals.unclaimedCommission + 10.0).toFixed(4));
    setStored(STORAGE_KEYS.REFERRALS, referrals);

    // Give instant invite reward to user balance
    user.balance = Number((user.balance + referrals.instantRewardPerInvite).toFixed(2));
    setStored(STORAGE_KEYS.USER, user);

    const history = getStored<AppHistoryItem[]>(STORAGE_KEYS.HISTORY, INITIAL_HISTORY);
    history.unshift({
      id: `hist_${Date.now()}`,
      type: 'REFERRAL_REWARD',
      title: `Squad Friend Joined (${newMember.username})`,
      description: `+100 TTE instant invite bonus awarded!`,
      amount: 100,
      isPositive: true,
      timestamp: 'Just now',
      status: 'COMPLETED',
    });
    setStored(STORAGE_KEYS.HISTORY, history.slice(0, 50));

    return referrals;
  },

  // Request withdrawal
  async requestWithdrawal(params: { amount: number; network: 'TON' | 'BEP20' | 'POLYGON'; address: string }): Promise<WithdrawalRequest> {
    await delay(450);
    const { amount, network, address } = params;
    const user = getStored<User>(STORAGE_KEYS.USER, INITIAL_USER);

    if (amount <= 0) throw new Error('Invalid withdrawal amount');
    if (amount > user.balance) throw new Error('Requested amount exceeds available balance');
    if (amount < 50) throw new Error('Minimum withdrawal is 50 TTE');
    if (!address || address.length < 10) throw new Error('Invalid wallet address format');

    const fee = Number((amount * 0.02).toFixed(2)); // 2% network fee
    const netAmount = Number((amount - fee).toFixed(2));

    // Deduct user balance
    user.balance = Number((user.balance - amount).toFixed(2));
    setStored(STORAGE_KEYS.USER, user);

    const newRequest: WithdrawalRequest = {
      id: `wd_${Date.now()}`,
      userId: user.id,
      amount,
      network,
      address,
      fee,
      netAmount,
      status: 'PENDING',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const withdrawals = getStored<WithdrawalRequest[]>(STORAGE_KEYS.WITHDRAWALS, []);
    withdrawals.unshift(newRequest);
    setStored(STORAGE_KEYS.WITHDRAWALS, withdrawals);

    const history = getStored<AppHistoryItem[]>(STORAGE_KEYS.HISTORY, INITIAL_HISTORY);
    history.unshift({
      id: `hist_${Date.now()}`,
      type: 'WITHDRAWAL',
      title: `Withdrawal Request (${network})`,
      description: `Sent to ${address.slice(0, 6)}...${address.slice(-4)}`,
      amount,
      isPositive: false,
      timestamp: 'Just now',
      status: 'PENDING',
    });
    setStored(STORAGE_KEYS.HISTORY, history.slice(0, 50));

    return newRequest;
  },

  // Connect or disconnect wallet
  async updateWallet(address: string | null, network: 'TON' | 'BEP20' | 'POLYGON' | null): Promise<User> {
    await delay(200);
    const user = getStored<User>(STORAGE_KEYS.USER, INITIAL_USER);
    user.connectedWallet = address;
    user.walletNetwork = network;
    setStored(STORAGE_KEYS.USER, user);
    return user;
  },

  // KYC verification
  async submitKYC(): Promise<{ success: boolean; status: 'PENDING' }> {
    await delay(350);
    const user = getStored<User>(STORAGE_KEYS.USER, INITIAL_USER);
    user.verificationStatus = 'PENDING';
    setStored(STORAGE_KEYS.USER, user);
    return { success: true, status: 'PENDING' };
  }
};
