import { useState, useCallback } from 'react';
import { AppItem, BoostStats } from '../types';
import { clearAllCache, disableNotifications, enableNotifications, getBoostStats } from '../services/appService';

export const useBoost = () => {
  const [isBoosting, setIsBoosting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<BoostStats | null>(null);
  
  const startBoost = useCallback(async (apps: AppItem[]) => {
    setIsLoading(true);
    try {
      const appIds = apps.map(app => app.id);
      
      // Clear cache
      await clearAllCache(appIds);
      
      // Disable notifications
      await disableNotifications(appIds);
      
      setIsBoosting(true);
      
      // Get updated stats
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
      
      // Re-enable notifications
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
  
  return {
    isBoosting,
    isLoading,
    stats,
    startBoost,
    stopBoost,
    loadStats,
  };
};
