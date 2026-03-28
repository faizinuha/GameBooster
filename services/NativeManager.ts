import { NativeModules, Platform, Linking } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import RNInstalledApplication from 'react-native-installed-application';


const { NotificationManager, CacheCleaner } = NativeModules;

export interface AppInfo {
  id: string;
  name: string;
  packageName: string;
  icon: string; // base64
  isGame: boolean;
}

export const NativeManager = {
  /**
   * Mengambil daftar aplikasi yang terinstall (Android only)
   */
  async getInstalledApps(): Promise<AppInfo[]> {
    if (Platform.OS !== 'android') {
      console.warn('getInstalledApps only works on Android');
      return [];
    }
    try {
      console.log('Fetching installed apps...');
      
      // Check if native module exists
      if (!NativeModules.RNInstalledApplication) {
        console.warn('NativeModules.RNInstalledApplication is not available. Ensure you are using a Development Build, not Expo Go.');
        
        // Fallback mockup in development if real module isn't there
        if (__DEV__) {
          console.log('Using mock apps for development testing...');
          return [
            { id: 'com.mobile.legends', name: 'Mobile Legends', packageName: 'com.mobile.legends', icon: '', isGame: true },
            { id: 'com.garena.game.kgid', name: 'Arena of Valor', packageName: 'com.garena.game.kgid', icon: '', isGame: true },
            { id: 'com.pubg.imobile', name: 'PUBG Mobile', packageName: 'com.pubg.imobile', icon: '', isGame: true },
            { id: 'com.tencent.ig', name: 'PUBG Global', packageName: 'com.tencent.ig', icon: '', isGame: true },
            { id: 'com.dts.freefireth', name: 'Free Fire', packageName: 'com.dts.freefireth', icon: '', isGame: true },
          ];
        }
        return [];
      }
      
      const apps = await RNInstalledApplication.getApps();
      console.log(`Found ${apps ? apps.length : 0} apps`);
      
      if (!apps || apps.length === 0) {
        return [];
      }

      return apps.map((app: any) => ({
        id: app.packageName,
        name: app.appName || app.packageName,
        packageName: app.packageName,
        icon: app.icon || '',
        isGame: app.category === 'GAME' || app.packageName.includes('game') || app.appName?.toLowerCase().includes('game'),
      }));
    } catch (error) {
      console.error('Failed to get apps:', error);
      return [];
    }
  },

  /**
   * Menghapus cache aplikasi sendiri (Expo standard)
   */
  async clearOwnCache(): Promise<void> {
    const cacheDir = (FileSystem as any).cacheDirectory || (FileSystem as any).Paths?.cache?.uri;
    if (cacheDir) {
      try {
        const contents = await FileSystem.readDirectoryAsync(cacheDir);
        for (const item of contents) {
          const itemPath = cacheDir.endsWith('/') ? `${cacheDir}${item}` : `${cacheDir}/${item}`;
          await FileSystem.deleteAsync(itemPath, { idempotent: true });
        }
        console.log('Cache aplikasi dihapus.');
      } catch (e) {
        console.error('Failed to clear own cache:', e);
      }
    }
  },

  /**
   * Membuka pengaturan aplikasi lain untuk hapus cache manual
   */
  async openAppSettings(packageName: string): Promise<void> {
    if (Platform.OS === 'android') {
      try {
        await IntentLauncher.startActivityAsync(
          IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
          { data: `package:${packageName}` }
        );
      } catch (e) {
        console.error('Failed to open app settings:', e);
        // Fallback to generic linking
        Linking.openSettings();
      }
    } else {
      Linking.openSettings();
    }
  },

  /**
   * Meminta akses Notification Listener
   */
  async requestNotificationAccess(): Promise<boolean> {
    if (Platform.OS !== 'android' || !NotificationManager) return false;
    try {
      return await NotificationManager.requestNotificationAccess();
    } catch (e) {
      console.error('Failed to request notification access:', e);
      return false;
    }
  },

  /**
   * Mengaktifkan/menonaktifkan pemblokiran notifikasi
   */
  async setNotificationBlocking(enabled: boolean): Promise<boolean> {
    if (Platform.OS !== 'android' || !NotificationManager) {
      console.warn('NativeModules.NotificationManager is not available on this build.');
      return false;
    }
    try {
      if (enabled) {
        return await NotificationManager.enableNotificationBlocking();
      } else {
        return await NotificationManager.disableNotificationBlocking();
      }
    } catch (e) {
      console.error('Failed to toggle notification blocking:', e);
      return false;
    }
  },

  /**
   * (Eksperimental) Menghapus cache aplikasi lain (Butuh system privilege/root)
   */
  async clearAppCache(packageName: string): Promise<void> {
    if (Platform.OS !== 'android') return;
    try {
      if (CacheCleaner && CacheCleaner.clearAppCache) {
        await CacheCleaner.clearAppCache(packageName);
      } else {
        this.openAppSettings(packageName);
      }
    } catch (e) {
      console.error('Failed to clear app cache:', e);
      this.openAppSettings(packageName);
    }
  }
};
