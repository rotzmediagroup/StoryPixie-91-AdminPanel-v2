export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  platform: UserPlatform | UserPlatform[];
  registrationDate: string;
  lastLoginDate: string;
  status: UserStatus;
  credits: number;
  profileImage?: string;
  subscription?: {
    plan: string;
    status: string;
    renewalDate?: string;
  };
  createdAt?: any; // Added createdAt based on usage in firestoreUtils
}

export interface Session {
  id: string;
  userId: string;
  userEmail: string;
  profileId: string;
  storyId: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
    language: string;
    screenWidth: number;
    screenHeight: number;
    timeZone: string;
    appVersion: string;
  };
  startedAt: string;
  endedAt?: string;
  appPlatform: UserPlatform;
  isActive: boolean;
  lastActiveAt?: string;
  actions?: Array<{
    type: string;
    timestamp: string;
    details: Record<string, unknown>;
  }>;
  errors?: Array<{
    code: string;
    message: string;
    timestamp: string;
    context: Record<string, unknown>;
  }>;
  performance?: {
    loadTime: number;
    apiResponseTimes: Record<string, number>;
    memoryUsage?: number;
  };
}

export type UserRole = 'super_admin' | 'admin' | 'content_moderator' | 'support_staff' | 'analytics_viewer' | 'observer';
export type UserPlatform = 'web' | 'ios' | 'android';
export type UserStatus = 'active' | 'suspended' | 'blocked' | 'pending';

export interface AIPromptTemplate {
  id: string;
  name: string;
  template: string;
  version: number;
  modelId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  version: string;
  active: boolean;
  costPerToken: number;
  maxTokens: number;
  avgResponseTime: number;
}

export interface SystemHealth {
  service: string;
  status: 'operational' | 'degraded' | 'down';
  lastChecked: string;
  responseTime?: number;
  error?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  lastLogin?: string;
  profileImage?: string;
  mfa?: {
    enabled: boolean;
    secret?: string;
    verified: boolean;
  };
}

export interface AppMetrics {
  activeUsers: {
    total: number;
    byPlatform: Record<UserPlatform, number>;
  };
  storiesGenerated: {
    total: number;
    last24h: number;
    last7d: number;
    last30d: number;
  };
  errorRate: {
    current: number;
    trend: 'up' | 'down' | 'stable';
  };
  averageResponseTime: number;
  userRetention: {
    day1: number;
    day7: number;
    day30: number;
  };
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  storiesGenerated: number;
  audioPlayed: number;
  averageSessionTime: number;
}

// Admin user activity log entry
export interface AdminActivityLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  details: Record<string, unknown>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

// Admin invitation
export interface AdminInvitation {
  id: string;
  email: string;
  role: UserRole;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: string;
  expiresAt: string;
  createdBy: string;
  token: string;
}

// Story interface
export interface Story {
  id: string; // Firestore document ID
  userId: string; // ID of the user who owns the story
  kidId: string; // ID of the kid profile the story belongs to
  title: string;
  content: string; // The actual story text
  createdAt: any; // Firestore Timestamp
  status: 'pending' | 'generating' | 'completed' | 'failed' | 'flagged'; // Status of the story
  prompt?: string; // The prompt used to generate the story
  modelUsed?: string; // Which AI model generated the story
  audioUrl?: string; // URL to the generated audio file
  imageUrl?: string; // URL to the generated cover image
  isSequel?: boolean; // Flag indicating if it's a sequel
  parentStoryId?: string; // ID of the parent story if it's a sequel
  // Add other relevant fields as needed
}

