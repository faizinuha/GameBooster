import { NativeModules, Platform, Linking } from 'react-native';
import * as FileSystem from 'expo-file-system';
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
    if (Platform.OS !== 'android') return [];
    try {
      const apps = await RNInstalledApplication.getApps();
      return apps.map((app: any) => ({
        id: app.packageName,
        name: app.appName,
        packageName: app.packageName,
        icon: app.icon,
        isGame: app.category === 'GAME',
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
    const cacheDir = FileSystem.cacheDirectory;
    if (cacheDir) {
      try {
        await FileSystem.deleteAsync(cacheDir, { idempotent: true });
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
    if (Platform.OS !== 'android') return false;
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
    if (Platform.OS !== 'android') return false;
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
