import { createContext, useState, useCallback, ReactNode } from 'react';
import { AppItem, BoostStats } from '../types';
import { clearAllCache, disableNotifications, enableNotifications, getBoostStats } from '../services/appService';
import { clearOwnCache } from '../services/systemService';
import { useAlert } from '@/template';

interface BoostContextType {
  isBoosting: boolean;
  isLoading: boolean;
  stats: BoostStats | null;
  startBoost: (apps: AppItem[]) => Promise<boolean>;
  stopBoost: (apps: AppItem[]) => Promise<boolean>;
  loadStats: () => Promise<void>;
  clearCache: () => Promise<void>;
}

export const BoostContext = createContext<BoostContextType | undefined>(undefined);

export function BoostProvider({ children }: { children: ReactNode }) {
  const [isBoosting, setIsBoosting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<BoostStats | null>(null);
  const { showAlert } = useAlert();
  
  const clearCache = useCallback(async () => {
    setIsLoading(true);
    try {
      const cacheCleared = await clearOwnCache();
      
      setStats(prev => ({
        cacheCleared: (prev?.cacheCleared || 0) + cacheCleared,
        appsOptimized: prev?.appsOptimized || 0,
        notificationsBlocked: prev?.notificationsBlocked || 0,
        memoryFreed: (prev?.memoryFreed || 0) + cacheCleared,
      }));
      
      showAlert(
        'Cache Dibersihkan',
        `Berhasil membersihkan ${cacheCleared}MB cache dari Game Booster app`
      );
    } catch (error) {
      console.error('Clear cache failed:', error);
      showAlert('Error', 'Gagal membersihkan cache');
    } finally {
      setIsLoading(false);
    }
  }, [showAlert]);
  
  const startBoost = useCallback(async (apps: AppItem[]) => {
    setIsLoading(true);
    try {
      const appIds = apps.map(app => app.id);
      
      // Clear cache for Game Booster app itself (realistic)
      const ownCacheCleared = await clearOwnCache();
      
      // Mock operations for selected apps
      await clearAllCache(appIds);
      await disableNotifications(appIds);
      
      setIsBoosting(true);
      
      const newStats = await getBoostStats();
      setStats({
        ...newStats,
        cacheCleared: newStats.cacheCleared + ownCacheCleared,
        memoryFreed: newStats.memoryFreed + ownCacheCleared,
      });
      
      showAlert(
        'Boost Mode Aktif',
        `${apps.length} aplikasi dioptimasi. Cache dibersihkan.`
      );
      
      return true;
    } catch (error) {
      console.error('Boost failed:', error);
      showAlert('Error', 'Gagal mengaktifkan boost mode');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [showAlert]);
  
  const stopBoost = useCallback(async (apps: AppItem[]) => {
    setIsLoading(true);
    try {
      const appIds = apps.map(app => app.id);
      
      await enableNotifications(appIds);
      
      setIsBoosting(false);
      
      showAlert('Boost Mode Nonaktif', 'Semua pengaturan dikembalikan normal');
      
      return true;
    } catch (error) {
      console.error('Stop boost failed:', error);
      showAlert('Error', 'Gagal menonaktifkan boost mode');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [showAlert]);
  
  const loadStats = useCallback(async () => {
    try {
      const newStats = await getBoostStats();
      setStats(newStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }, []);
  
  return (
    <BoostContext.Provider value={{ isBoosting, isLoading, stats, startBoost, stopBoost, loadStats, clearCache }}>
      {children}
    </BoostContext.Provider>
  );
}
