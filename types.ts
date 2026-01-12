
export type AppView = 'landing' | 'dashboard' | 'chat' | 'image' | 'video' | 'live' | 'quick-relief' | 'recommendations' | 'favorites' | 'daily-inspiration' | 'settings' | 'reminders' | 'my-data' | 'journal' | 'about' | 'vision' | 'auth' | 'journal-library' | 'marketing-toolkit' | 'privacy' | 'terms' | 'support' | 'integration' | 'the-void' | 'collective-soul' | 'music' | 'poetry' | 'story';

export type MembershipTier = 'seeker' | 'creator' | 'zen-master' | 'eternal' | 'universal';

export interface AwakeningStats {
  level: number;
  xp: number;
  totalXp: number;
  nextLevelXp: number;
  daysPresent: number;
  lastLoginTimestamp: number;
  currentStreak: number;
}

export interface UserProfile {
  name: string;
  email: string;
  joinedDate: number;
  tier: MembershipTier;
  awakening: AwakeningStats;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  groundingLinks?: Array<{ title: string; uri: string }>;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export interface GeneratedVideo {
  url: string;
  prompt: string;
  timestamp: number;
}

export interface CreationItem {
  id: string;
  type: 'image' | 'video' | 'reflection';
  url?: string;
  prompt: string;
  timestamp: number;
  author?: string;
}

export interface FavoriteItem {
  id: string;
  sourceView: AppView;
  title: string;
  category: string;
  description?: string;
  duration?: string;
  iconName: string; 
}

export type JournalMode = 'free' | 'guided' | 'gratitude' | 'five-minute' | 'art' | 'quiet-moments' | 'dot-to-dot';

export interface JournalTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  prompt: string;
  iconName: string;
  mode?: JournalMode;
}

export interface Reflection {
  id: string;
  content: string; 
  prompt?: string;
  mode: JournalMode;
  mood?: string;
  dayNumber?: number;
  timestamp: number;
  gratitudeItems?: string[]; 
  visualAsset?: string;
}
