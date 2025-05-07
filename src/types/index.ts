import { Timestamp } from "firebase/firestore";

// Corresponds to the structure in Firestore `users` collection
export interface User {
  id: string; // Document ID from Firestore
  email: string;
  displayName?: string; // From Firestore
  photoURL?: string | null; // From Firestore
  
  isActive: boolean; // From Firestore
  isAdmin: boolean; // From Firestore
  isEmailVerified: boolean; // From Firestore
  isWizardComplete: boolean; // From Firestore

  createdAt: Timestamp; // From Firestore
  lastLoginAt: Timestamp; // From Firestore
  updatedAt?: Timestamp; // Should be in Firestore, good practice

  roles: string[]; // e.g., ["user"], ["admin"], ["super-admin"]

  pixieDust: {
    purple: number;
    gold: number;
  };

  subscription: {
    status: string; // e.g., "free", "premium", "cancelled"
    planId?: string | null;
    provider?: string | null;
    providerSubscriptionId?: string | null;
    currentPeriodStart?: Timestamp | null;
    currentPeriodEnd?: Timestamp | null;
    trialEnd?: Timestamp | null;
    cancelAtPeriodEnd?: boolean;
    canceledAt?: Timestamp | null;
    autoRenew?: boolean;
    updatedAt?: Timestamp; // Last update to subscription sub-document
  };

  purchaseHistory?: Array<any>; // Define more strictly if needed
  migrationFlags?: Record<string, any>; // Or define more strictly
  
  // Fields from old User type that are NOT directly in the main user document from app signup:
  // name: string; // Replaced by displayName
  // role: UserRole; // Replaced by roles array and isAdmin boolean
  // platform: UserPlatform | UserPlatform[]; // Not in user doc
  // registrationDate: string; // Replaced by createdAt (Timestamp)
  // lastLoginDate: string; // Replaced by lastLoginAt (Timestamp)
  // status: UserStatus; // Replaced/Represented by isActive (boolean) and potentially roles
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

// UserRole is now covered by the `roles: string[]` and `isAdmin: boolean` in the User interface.
// If specific role strings are needed for type checking elsewhere, they can be defined as a union type:
export type DefinedUserRole = "user" | "moderator" | "admin" | "super-admin";

export type UserPlatform = "web" | "ios" | "android";

// UserStatus is now primarily represented by `isActive: boolean` in the User interface.
// If a more granular string status is needed for UI that derives from isActive or roles, 
// it can be handled in the component or a helper function.
// For example, the `userColumns.tsx` might derive a display status.
export type DisplayUserStatus = "active" | "inactive" | "blocked" | "pending_verification";


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
  apiKey?: string; 
  costPerToken?: number; 
  maxTokens?: number; 
  avgResponseTime?: number; 
  createdAt?: Timestamp; 
  updatedAt?: Timestamp; 
}

export interface SystemHealth {
  service: string;
  status: "operational" | "degraded" | "down";
  lastChecked: string;
  responseTime?: number;
  error?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string; // This might be displayName for consistency
  role: DefinedUserRole; // Using the new DefinedUserRole
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
    trend: "up" | "down" | "stable";
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

export interface AdminInvitation {
  id: string;
  email: string;
  role: DefinedUserRole;
  status: "pending" | "accepted" | "expired";
  createdAt: string;
  expiresAt: string;
  createdBy: string;
  token: string;
}

export interface Story {
  id: string; 
  userId: string; 
  profileId: string; 
  title: string;
  content: string; 
  createdAt: Timestamp; 
  status: "pending" | "generating" | "completed" | "failed" | "flagged"; 
  prompt?: string; 
  modelUsed?: string; 
  audioUrl?: string; 
  imageUrl?: string; 
  isSequel?: boolean; 
  parentStoryId?: string; 
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  language: string;
  readingLevel: "beginner" | "intermediate" | "advanced";
  avatar: string;
  gender: "male" | "female" | "other";
  characterSets: CharacterSet[];
  createdAt?: Timestamp; 
}

export interface CharacterSet {
  id: string;
  name: string;
  characters: any[]; 
}

export interface StoryGenerationRequest {
  id: string; 
  userId: string;
  kidId: string; 
  prompt: string;
  modelId?: string; 
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: Timestamp; 
  updatedAt?: Timestamp; 
  resultStoryId?: string; 
  errorMessage?: string; 
}

export interface AISettings {
  defaultStoryModelId: string; 
  defaultSequelModelId: string; 
  fallbackStoryModelId?: string; 
  fallbackSequelModelId?: string; 
  defaultStoryPrompt: string; 
  defaultSequelPrompt: string; 
  updatedAt?: Timestamp; 
}

// For chart data, if used
export interface ChartDataPoint {
  date: string; // e.g., "YYYY-MM-DD"
  value: number;
}

