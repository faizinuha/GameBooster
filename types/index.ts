export interface AppItem {
  id: string;
  name: string;
  packageName: string;
  icon?: string;
  isGame?: boolean;
  cacheSize?: number;
  notificationsEnabled?: boolean;
}

export interface NotificationItem {
  id: string;
  appName: string;
  appPackage: string;
  title: string;
  message: string;
  timestamp: number;
  category: 'all' | 'social' | 'custom';
  icon?: string;
}

export interface BoostStats {
  cacheCleared: number;
  appsOptimized: number;
  notificationsBlocked: number;
  memoryFreed: number;
}

export interface DNSServer {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  description: string;
  provider: string;
  latency?: number;
  status?: 'testing' | 'success' | 'failed' | 'idle';
}
