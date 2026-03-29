import { Platform } from 'react-native';
import { NativeManager } from './NativeManager';

export interface AppMonitorListener {
  onAppInstalled?: (app: any) => void;
  onAppUninstalled?: (packageName: string) => void;
  onAppUpdated?: (app: any) => void;
}

class AppMonitor {
  private listeners: AppMonitorListener[] = [];
  private monitoringInterval: any = null;
  private lastKnownApps: Set<string> = new Set();
  
  /**
   * Mulai monitoring aplikasi yang terinstall
   */
  startMonitoring(intervalMs: number = 5000) {
    if (Platform.OS !== 'android') {
      console.warn('App monitoring only works on Android');
      return;
    }
    
    // Initial scan
    this.scanApps();
    
    // Periodic scan
    this.monitoringInterval = setInterval(() => {
      this.scanApps();
    }, intervalMs);
    
    console.log('App monitoring started');
  }
  
  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('App monitoring stopped');
    }
  }
  
  /**
   * Scan aplikasi dan detect perubahan
   */
  private async scanApps() {
    try {
      const apps = await NativeManager.getInstalledApps();
      const currentApps = new Set(apps.map(app => app.packageName));
      
      // Detect newly installed apps
      currentApps.forEach(packageName => {
        if (!this.lastKnownApps.has(packageName)) {
          const app = apps.find(a => a.packageName === packageName);
          if (app) {
            this.notifyAppInstalled(app);
          }
        }
      });
      
      // Detect uninstalled apps
      this.lastKnownApps.forEach(packageName => {
        if (!currentApps.has(packageName)) {
          this.notifyAppUninstalled(packageName);
        }
      });
      
      this.lastKnownApps = currentApps;
    } catch (error) {
      console.error('Failed to scan apps:', error);
    }
  }
  
  /**
   * Tambah listener untuk monitor events
   */
  addListener(listener: AppMonitorListener) {
    this.listeners.push(listener);
  }
  
  /**
   * Hapus listener
   */
  removeListener(listener: AppMonitorListener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }
  
  /**
   * Notify listeners tentang app baru terinstall
   */
  private notifyAppInstalled(app: any) {
    console.log('New app detected:', app.name);
    this.listeners.forEach(listener => {
      if (listener.onAppInstalled) {
        listener.onAppInstalled(app);
      }
    });
  }
  
  /**
   * Notify listeners tentang app di-uninstall
   */
  private notifyAppUninstalled(packageName: string) {
    console.log('App removed:', packageName);
    this.listeners.forEach(listener => {
      if (listener.onAppUninstalled) {
        listener.onAppUninstalled(packageName);
      }
    });
  }
}

export const appMonitor = new AppMonitor();
