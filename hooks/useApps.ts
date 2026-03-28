import { useState, useEffect, useCallback } from 'react';
import { AppItem } from '../types';
import { getInstalledApps } from '../services/appService';

export const useApps = () => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [selectedApps, setSelectedApps] = useState<AppItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const loadApps = useCallback(async () => {
    setIsLoading(true);
    try {
      const installedApps = await getInstalledApps();
      setApps(installedApps);
    } catch (error) {
      console.error('Failed to load apps:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const toggleApp = useCallback((app: AppItem) => {
    setSelectedApps(prev => {
      const exists = prev.find(a => a.id === app.id);
      if (exists) {
        return prev.filter(a => a.id !== app.id);
      }
      return [...prev, app];
    });
  }, []);
  
  const removeApp = useCallback((appId: string) => {
    setSelectedApps(prev => prev.filter(a => a.id !== appId));
  }, []);
  
  const clearSelection = useCallback(() => {
    setSelectedApps([]);
  }, []);
  
  useEffect(() => {
    loadApps();
  }, [loadApps]);
  
  return {
    apps,
    selectedApps,
    isLoading,
    toggleApp,
    removeApp,
    clearSelection,
    reloadApps: loadApps,
  };
};
