import { Linking } from 'react-native';

export interface AppInfo {
  id: string;
  name: string;
  packageName: string;
  icon: string;
  isGame: boolean;
}

// Web fallback - tidak support native features
export const NativeManager = {
  async getInstalledApps(): Promise<AppInfo[]> {
    console.warn('getInstalledApps is not supported on web');
    // Return mock data untuk testing di web
    return [
      { id: 'com.mobile.legends', name: 'Mobile Legends', packageName: 'com.mobile.legends', icon: '', isGame: true },
      { id: 'com.garena.game.kgid', name: 'Arena of Valor', packageName: 'com.garena.game.kgid', icon: '', isGame: true },
      { id: 'com.pubg.imobile', name: 'PUBG Mobile', packageName: 'com.pubg.imobile', icon: '', isGame: true },
      { id: 'com.tencent.ig', name: 'PUBG Global', packageName: 'com.tencent.ig', icon: '', isGame: true },
      { id: 'com.dts.freefireth', name: 'Free Fire', packageName: 'com.dts.freefireth', icon: '', isGame: true },
    ];
  },

  async clearOwnCache(): Promise<void> {
    console.warn('clearOwnCache is not supported on web');
    // Web browsers manage their own cache
  },

  async openAppSettings(packageName: string): Promise<void> {
    console.warn('openAppSettings is not supported on web');
    // No equivalent on web
  },

  async requestNotificationAccess(): Promise<boolean> {
    console.warn('requestNotificationAccess is not supported on web');
    return false;
  },

  async setNotificationBlocking(enabled: boolean): Promise<boolean> {
    console.warn('setNotificationBlocking is not supported on web');
    return false;
  },

  async clearAppCache(packageName: string): Promise<void> {
    console.warn('clearAppCache is not supported on web');
  }
};
