import { AppItem, BoostStats } from '../types';

// Mock system apps - In production, this would use native modules
export const getInstalledApps = async (): Promise<AppItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: '1',
      name: 'Mobile Legends',
      packageName: 'com.mobile.legends',
      isGame: true,
      cacheSize: 245,
      notificationsEnabled: true,
    },
    {
      id: '2',
      name: 'PUBG Mobile',
      packageName: 'com.pubg.mobile',
      isGame: true,
      cacheSize: 512,
      notificationsEnabled: true,
    },
    {
      id: '3',
      name: 'Free Fire',
      packageName: 'com.garena.freefire',
      isGame: true,
      cacheSize: 189,
      notificationsEnabled: true,
    },
    {
      id: '4',
      name: 'Genshin Impact',
      packageName: 'com.mihoyo.genshin',
      isGame: true,
      cacheSize: 892,
      notificationsEnabled: false,
    },
    {
      id: '5',
      name: 'WhatsApp',
      packageName: 'com.whatsapp',
      isGame: false,
      cacheSize: 156,
      notificationsEnabled: true,
    },
    {
      id: '6',
      name: 'Instagram',
      packageName: 'com.instagram',
      isGame: false,
      cacheSize: 234,
      notificationsEnabled: true,
    },
  ];
};

export const clearAppCache = async (appId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return true;
};

export const clearAllCache = async (appIds: string[]): Promise<number> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Return total MB cleared
  return Math.floor(Math.random() * 500) + 200;
};

export const disableNotifications = async (appIds: string[]): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
};

export const enableNotifications = async (appIds: string[]): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
};

export const getBoostStats = async (): Promise<BoostStats> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    cacheCleared: 1247,
    appsOptimized: 12,
    notificationsBlocked: 234,
    memoryFreed: 2048,
  };
};
