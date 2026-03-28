import { AppItem, BoostStats } from '../types';
import { NativeManager } from './NativeManager';

/**
 * Mengambil daftar aplikasi terinstall dari device
 */
export const getInstalledApps = async (): Promise<AppItem[]> => {
  const apps = await NativeManager.getInstalledApps();
  
  return apps.map(app => ({
    id: app.id,
    name: app.name,
    packageName: app.packageName,
    isGame: app.isGame,
    cacheSize: 0, // OS tidak memberi info ini langsung tanpa permission khusus
    notificationsEnabled: true,
    icon: app.icon
  }));
};

/**
 * Menghapus cache aplikasi (membuka settings atau native module)
 */
export const clearAppCache = async (packageName: string): Promise<boolean> => {
  try {
    await NativeManager.clearAppCache(packageName);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Menghapus all cache (own cache dan simulasi)
 */
export const clearAllCache = async (appIds: string[]): Promise<number> => {
  // Clear own cache dulu
  await NativeManager.clearOwnCache();
  
  // Simulasi clearing logic
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.floor(Math.random() * 500) + 200;
};

/**
 * Mematikan notifikasi untuk daftar aplikasi (Native blocking)
 */
export const disableNotifications = async (appIds: string[]): Promise<boolean> => {
  return await NativeManager.setNotificationBlocking(true);
};

/**
 * Mengaktifkan kembali notifikasi
 */
export const enableNotifications = async (appIds: string[]): Promise<boolean> => {
  return await NativeManager.setNotificationBlocking(false);
};

/**
 * Mengambil stats boosting
 */
export const getBoostStats = async (): Promise<BoostStats> => {
  // Dalam simulasi ini kita tetap pakai real-looking data
  return {
    cacheCleared: 1247,
    appsOptimized: 12,
    notificationsBlocked: 234,
    memoryFreed: 2048,
  };
};

