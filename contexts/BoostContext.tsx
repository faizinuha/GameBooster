import { createContext, useState, useCallback, ReactNode } from 'react';
import { AppItem, BoostStats } from '../types';
import { clearAllCache, disableNotifications, enableNotifications, getBoostStats } from '../services/appService';

interface BoostContextType {
  isBoosting: boolean;
  isLoading: boolean;
  stats: BoostStats | null;
  startBoost: (apps: AppItem[]) => Promise<boolean>;
  stopBoost: (apps: AppItem[]) => Promise<boolean>;
  loadStats: () => Promise<void>;
}

export const BoostContext = createContext<BoostContextType | undefined>(undefined);

export function BoostProvider({ children }: { children: ReactNode }) {
  const [isBoosting, setIsBoosting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<BoostStats | null>(null);
  
  const startBoost = useCallback(async (apps: AppItem[]) => {
    setIsLoading(true);
    try {
      const appIds = apps.map(app => app.id);
      
      await clearAllCache(appIds);
      await disableNotifications(appIds);
      
      setIsBoosting(true);
      
      const newStats = await getBoostStats();
      setStats(newStats);
      
      return true;
    } catch (error) {
      console.error('Boost failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const stopBoost = useCallback(async (apps: AppItem[]) => {
    setIsLoading(true);
    try {
      const appIds = apps.map(app => app.id);
      
      await enableNotifications(appIds);
      
      setIsBoosting(false);
      
      return true;
    } catch (error) {
      console.error('Stop boost failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const loadStats = useCallback(async () => {
    try {
      const newStats = await getBoostStats();
      setStats(newStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }, []);
  
  return (
    <BoostContext.Provider value={{ isBoosting, isLoading, stats, startBoost, stopBoost, loadStats }}>
      {children}
    </BoostContext.Provider>
  );
}
