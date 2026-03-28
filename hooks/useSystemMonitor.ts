import { useState, useEffect, useCallback } from 'react';
import { getRAMUsage, getCPUUsage, getDeviceInfo } from '../services/systemService';

interface SystemStats {
  ram: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: number;
  device: {
    brand: string;
    modelName: string;
    osName: string;
    osVersion: string;
    totalMemory: number;
  } | null;
}

export function useSystemMonitor(enabled: boolean = true) {
  const [stats, setStats] = useState<SystemStats>({
    ram: { used: 0, total: 0, percentage: 0 },
    cpu: 0,
    device: null,
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  
  const updateStats = useCallback(() => {
    const ram = getRAMUsage();
    const cpu = getCPUUsage();
    
    setStats(prev => ({
      ...prev,
      ram,
      cpu,
    }));
  }, []);
  
  const loadDeviceInfo = useCallback(async () => {
    const device = await getDeviceInfo();
    setStats(prev => ({
      ...prev,
      device,
    }));
  }, []);
  
  useEffect(() => {
    loadDeviceInfo();
  }, [loadDeviceInfo]);
  
  useEffect(() => {
    if (!enabled) {
      setIsMonitoring(false);
      return;
    }
    
    setIsMonitoring(true);
    
    // Initial update
    updateStats();
    
    // Update every 2 seconds
    const interval = setInterval(updateStats, 2000);
    
    return () => {
      clearInterval(interval);
      setIsMonitoring(false);
    };
  }, [enabled, updateStats]);
  
  return {
    stats,
    isMonitoring,
    refresh: updateStats,
  };
}
