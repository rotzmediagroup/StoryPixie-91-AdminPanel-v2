
import { User, UserRole, UserPlatform, UserStatus, SystemHealth, AIModel, AIPromptTemplate, AdminUser, AppMetrics, DashboardStats } from '@/types';

export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "alice@example.com",
    name: "Alice Johnson",
    role: "super_admin",
    platform: ["web", "ios"],
    registrationDate: "2023-05-10T08:15:30Z",
    lastLoginDate: "2025-04-30T14:22:10Z",
    status: "active",
    credits: 150,
    profileImage: "https://i.pravatar.cc/150?img=1",
    subscription: {
      plan: "premium",
      status: "active",
      renewalDate: "2025-06-10T00:00:00Z",
    },
  },
  {
    id: "user-2",
    email: "bob@example.com",
    name: "Bob Smith",
    role: "content_moderator",
    platform: "android",
    registrationDate: "2023-06-22T11:30:00Z",
    lastLoginDate: "2025-04-29T09:45:22Z",
    status: "active",
    credits: 75,
    subscription: {
      plan: "basic",
      status: "active",
      renewalDate: "2025-05-22T00:00:00Z",
    },
  },
  {
    id: "user-3",
    email: "carol@example.com",
    name: "Carol Williams",
    role: "analytics_viewer",
    platform: "web",
    registrationDate: "2023-07-15T15:45:12Z",
    lastLoginDate: "2025-04-28T16:10:05Z",
    status: "active",
    credits: 50,
  },
  {
    id: "user-4",
    email: "dave@example.com",
    name: "Dave Brown",
    role: "support_staff",
    platform: ["ios", "android"],
    registrationDate: "2023-08-05T09:20:45Z",
    lastLoginDate: "2025-04-25T11:33:18Z",
    status: "suspended",
    credits: 25,
    profileImage: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: "user-5",
    email: "eva@example.com",
    name: "Eva Martinez",
    role: "super_admin",
    platform: "web",
    registrationDate: "2023-09-12T14:55:30Z",
    lastLoginDate: "2025-04-29T17:22:40Z",
    status: "active",
    credits: 200,
    profileImage: "https://i.pravatar.cc/150?img=5",
    subscription: {
      plan: "premium",
      status: "active",
      renewalDate: "2025-08-12T00:00:00Z",
    },
  },
  {
    id: "user-6",
    email: "frank@example.com",
    name: "Frank Taylor",
    role: "content_moderator",
    platform: ["web", "android"],
    registrationDate: "2023-10-03T10:10:10Z",
    lastLoginDate: "2025-04-27T13:40:15Z",
    status: "blocked",
    credits: 0,
    profileImage: "https://i.pravatar.cc/150?img=6",
    subscription: {
      plan: "basic",
      status: "cancelled",
    },
  },
  {
    id: "user-7",
    email: "grace@example.com",
    name: "Grace Lee",
    role: "analytics_viewer",
    platform: "ios",
    registrationDate: "2023-11-18T07:30:00Z",
    lastLoginDate: "2025-04-30T08:15:22Z",
    status: "active",
    credits: 90,
    profileImage: "https://i.pravatar.cc/150?img=7",
    subscription: {
      plan: "premium",
      status: "active",
      renewalDate: "2025-06-18T00:00:00Z",
    },
  },
  {
    id: "user-8",
    email: "harry@example.com",
    name: "Harry Wilson",
    role: "support_staff",
    platform: "web",
    registrationDate: "2023-12-01T16:20:45Z",
    lastLoginDate: "2025-04-29T15:55:10Z",
    status: "pending",
    credits: 15,
    profileImage: "https://i.pravatar.cc/150?img=8",
  },
];

export const mockAdminUsers: AdminUser[] = [
  {
    id: "admin-1",
    email: "admin@storypixie.com",
    name: "Admin User",
    role: "super_admin",
    lastLogin: "2025-04-30T16:45:22Z",
    profileImage: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: "admin-2",
    email: "moderator@storypixie.com",
    name: "Content Moderator",
    role: "content_moderator",
    lastLogin: "2025-04-30T12:33:15Z",
    profileImage: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: "admin-3",
    email: "support@storypixie.com",
    name: "Support Team",
    role: "support_staff",
    lastLogin: "2025-04-29T09:21:05Z",
    profileImage: "https://i.pravatar.cc/150?img=13"
  },
  {
    id: "admin-4",
    email: "analytics@storypixie.com",
    name: "Data Analyst",
    role: "analytics_viewer",
    lastLogin: "2025-04-29T15:17:30Z",
    profileImage: "https://i.pravatar.cc/150?img=14"
  }
];

export const mockSystemHealth: SystemHealth[] = [
  {
    service: "Firebase Auth",
    status: "operational",
    lastChecked: "2025-05-01T09:00:00Z",
    responseTime: 120
  },
  {
    service: "Firestore Database",
    status: "operational",
    lastChecked: "2025-05-01T09:00:00Z",
    responseTime: 85
  },
  {
    service: "Firebase Storage",
    status: "operational",
    lastChecked: "2025-05-01T09:00:00Z",
    responseTime: 95
  },
  {
    service: "OpenAI API",
    status: "operational",
    lastChecked: "2025-05-01T09:00:00Z",
    responseTime: 350
  },
  {
    service: "Firebase Functions",
    status: "degraded",
    lastChecked: "2025-05-01T09:00:00Z",
    responseTime: 780,
    error: "Intermittent timeouts observed"
  },
  {
    service: "Image Generation API",
    status: "operational",
    lastChecked: "2025-05-01T09:00:00Z",
    responseTime: 420
  },
  {
    service: "Web App",
    status: "operational",
    lastChecked: "2025-05-01T09:00:00Z",
    responseTime: 210
  },
  {
    service: "iOS App Backend",
    status: "operational",
    lastChecked: "2025-05-01T09:00:00Z",
    responseTime: 180
  },
  {
    service: "Android App Backend",
    status: "down",
    lastChecked: "2025-05-01T09:00:00Z",
    error: "Gateway timeout error"
  }
];

export const mockAIModels: AIModel[] = [
  {
    id: "model-1",
    name: "GPT-4o",
    provider: "OpenAI",
    version: "1.0",
    active: true,
    costPerToken: 0.00003,
    maxTokens: 8192,
    avgResponseTime: 1200
  },
  {
    id: "model-2",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    version: "1.2",
    active: true,
    costPerToken: 0.00004,
    maxTokens: 200000,
    avgResponseTime: 1500
  },
  {
    id: "model-3",
    name: "Llama 3",
    provider: "Meta",
    version: "70b",
    active: false,
    costPerToken: 0.00001,
    maxTokens: 4096,
    avgResponseTime: 900
  },
  {
    id: "model-4",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    version: "turbo-0125",
    active: true,
    costPerToken: 0.00001,
    maxTokens: 16384,
    avgResponseTime: 500
  },
  {
    id: "model-5",
    name: "Gemini Pro",
    provider: "Google",
    version: "1.0",
    active: true,
    costPerToken: 0.000025,
    maxTokens: 8192,
    avgResponseTime: 800
  }
];

export const mockPromptTemplates: AIPromptTemplate[] = [
  {
    id: "prompt-1",
    name: "Adventure Story",
    template: "Create an adventure story about {character} who discovers {object} in {location}. The story should be suitable for {age} years old and contain themes of {theme}.",
    version: 3,
    modelId: "model-1",
    createdAt: "2024-01-15T10:22:30Z",
    updatedAt: "2025-03-05T14:10:25Z",
    createdBy: "admin-1"
  },
  {
    id: "prompt-2",
    name: "Bedtime Story",
    template: "Write a soothing bedtime story featuring {character} who learns about {value}. The story should be gentle, calming, and end with {character} falling peacefully asleep.",
    version: 5,
    modelId: "model-1",
    createdAt: "2024-02-02T09:15:00Z",
    updatedAt: "2025-04-12T11:30:15Z",
    createdBy: "admin-1"
  },
  {
    id: "prompt-3",
    name: "Educational Tale",
    template: "Create an educational story that teaches children about {subject}. The main character is {character} who goes on a journey to learn about {subject} with the help of {helper}.",
    version: 2,
    modelId: "model-4",
    createdAt: "2024-02-20T13:45:10Z",
    updatedAt: "2025-03-18T16:22:05Z",
    createdBy: "admin-2"
  },
  {
    id: "prompt-4",
    name: "Fantasy Epic",
    template: "Write a fantasy story set in {setting} where {character}, a {species}, must overcome {challenge} using their special ability to {ability}.",
    version: 7,
    modelId: "model-2",
    createdAt: "2024-03-05T11:10:45Z",
    updatedAt: "2025-04-25T09:05:30Z",
    createdBy: "admin-1"
  },
  {
    id: "prompt-5",
    name: "Moral Lesson",
    template: "Create a story teaching the moral lesson about {value}. The main character {character} makes a mistake related to {value} and learns an important lesson with the help of {helper}.",
    version: 4,
    modelId: "model-5",
    createdAt: "2024-03-22T10:30:00Z",
    updatedAt: "2025-04-02T15:40:20Z",
    createdBy: "admin-3"
  }
];

export const mockAppMetrics: AppMetrics = {
  activeUsers: {
    total: 1284,
    byPlatform: {
      web: 513,
      ios: 492,
      android: 279
    }
  },
  storiesGenerated: {
    total: 45678,
    last24h: 782,
    last7d: 5241,
    last30d: 21356
  },
  errorRate: {
    current: 1.2,
    trend: "down"
  },
  averageResponseTime: 1350,
  userRetention: {
    day1: 85.4,
    day7: 72.1,
    day30: 58.6
  }
};

export const mockDashboardStats: DashboardStats = {
  totalUsers: 8452,
  activeUsers: 1284,
  storiesGenerated: 45678,
  audioPlayed: 32451,
  averageSessionTime: 14.5
};

export const mockDailyActiveUsers = [
  { date: '2025-04-01', web: 420, ios: 385, android: 195 },
  { date: '2025-04-02', web: 435, ios: 390, android: 210 },
  { date: '2025-04-03', web: 455, ios: 410, android: 225 },
  { date: '2025-04-04', web: 470, ios: 400, android: 235 },
  { date: '2025-04-05', web: 490, ios: 415, android: 240 },
  { date: '2025-04-06', web: 505, ios: 425, android: 245 },
  { date: '2025-04-07', web: 510, ios: 435, android: 250 },
  { date: '2025-04-08', web: 495, ios: 445, android: 255 },
  { date: '2025-04-09', web: 485, ios: 455, android: 260 },
  { date: '2025-04-10', web: 475, ios: 460, android: 265 },
  { date: '2025-04-11', web: 480, ios: 465, android: 260 },
  { date: '2025-04-12', web: 490, ios: 470, android: 255 },
  { date: '2025-04-13', web: 500, ios: 465, android: 250 },
  { date: '2025-04-14', web: 510, ios: 475, android: 255 },
  { date: '2025-04-15', web: 515, ios: 480, android: 260 },
  { date: '2025-04-16', web: 520, ios: 485, android: 265 },
  { date: '2025-04-17', web: 525, ios: 490, android: 270 },
  { date: '2025-04-18', web: 530, ios: 485, android: 275 },
  { date: '2025-04-19', web: 525, ios: 480, android: 270 },
  { date: '2025-04-20', web: 520, ios: 475, android: 265 },
  { date: '2025-04-21', web: 515, ios: 480, android: 270 },
  { date: '2025-04-22', web: 510, ios: 485, android: 275 },
  { date: '2025-04-23', web: 515, ios: 490, android: 270 },
  { date: '2025-04-24', web: 520, ios: 485, android: 265 },
  { date: '2025-04-25', web: 525, ios: 480, android: 270 },
  { date: '2025-04-26', web: 530, ios: 485, android: 275 },
  { date: '2025-04-27', web: 525, ios: 490, android: 270 },
  { date: '2025-04-28', web: 515, ios: 485, android: 275 },
  { date: '2025-04-29', web: 520, ios: 490, android: 270 },
  { date: '2025-04-30', web: 513, ios: 492, android: 279 },
];

export const mockStoryGenerationStats = [
  { date: '2025-04-01', count: 652 },
  { date: '2025-04-02', count: 681 },
  { date: '2025-04-03', count: 671 },
  { date: '2025-04-04', count: 705 },
  { date: '2025-04-05', count: 632 },
  { date: '2025-04-06', count: 591 },
  { date: '2025-04-07', count: 623 },
  { date: '2025-04-08', count: 645 },
  { date: '2025-04-09', count: 678 },
  { date: '2025-04-10', count: 712 },
  { date: '2025-04-11', count: 731 },
  { date: '2025-04-12', count: 701 },
  { date: '2025-04-13', count: 684 },
  { date: '2025-04-14', count: 695 },
  { date: '2025-04-15', count: 711 },
  { date: '2025-04-16', count: 731 },
  { date: '2025-04-17', count: 741 },
  { date: '2025-04-18', count: 722 },
  { date: '2025-04-19', count: 694 },
  { date: '2025-04-20', count: 683 },
  { date: '2025-04-21', count: 701 },
  { date: '2025-04-22', count: 721 },
  { date: '2025-04-23', count: 745 },
  { date: '2025-04-24', count: 752 },
  { date: '2025-04-25', count: 761 },
  { date: '2025-04-26', count: 723 },
  { date: '2025-04-27', count: 714 },
  { date: '2025-04-28', count: 736 },
  { date: '2025-04-29', count: 751 },
  { date: '2025-04-30', count: 782 },
];
