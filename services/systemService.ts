import * as FileSystem from 'expo-file-system';
import { Platform, Linking } from 'react-native';
import * as Device from 'expo-device';
import { IntentLauncher } from 'expo-intent-launcher';

// Clear app's own cache
export async function clearOwnCache(): Promise<number> {
  try {
    const cacheDir = FileSystem.cacheDirectory;
    if (!cacheDir) return 0;
    
    // Get cache size before clearing
    const cacheSize = await getCacheSize();
    
    // Delete cache directory
    await FileSystem.deleteAsync(cacheDir, { idempotent: true });
    
    // Recreate empty cache directory
    await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
    
    return cacheSize;
  } catch (error) {
    console.error('Failed to clear cache:', error);
    return 0;
  }
}

// Get current cache size in MB
export async function getCacheSize(): Promise<number> {
  try {
    const cacheDir = FileSystem.cacheDirectory;
    if (!cacheDir) return 0;
    
    const info = await FileSystem.getInfoAsync(cacheDir);
    if (info.exists && 'size' in info) {
      // Convert bytes to MB
      return Math.round((info.size || 0) / (1024 * 1024));
    }
    return 0;
  } catch (error) {
    return 0;
  }
}

// Open app settings for user to manually clear cache
export async function openAppSettings(packageName?: string): Promise<void> {
  try {
    if (Platform.OS === 'android') {
      if (packageName) {
        await IntentLauncher.startActivityAsync(
          IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
          { data: `package:${packageName}` }
        );
      } else {
        await Linking.openSettings();
      }
    } else {
      await Linking.openSettings();
    }
  } catch (error) {
    console.error('Failed to open settings:', error);
  }
}

// Open Do Not Disturb settings
export async function openDNDSettings(): Promise<void> {
  try {
    if (Platform.OS === 'android') {
      await IntentLauncher.startActivityAsync(
        IntentLauncher.ActivityAction.NOTIFICATION_POLICY_ACCESS_SETTINGS
      );
    } else {
      // iOS: Open general settings (DND is in Control Center)
      await Linking.openSettings();
    }
  } catch (error) {
    console.error('Failed to open DND settings:', error);
  }
}

// Open notification settings
export async function openNotificationSettings(): Promise<void> {
  try {
    if (Platform.OS === 'android') {
      await IntentLauncher.startActivityAsync(
        IntentLauncher.ActivityAction.APP_NOTIFICATION_SETTINGS
      );
    } else {
      await Linking.openSettings();
    }
  } catch (error) {
    console.error('Failed to open notification settings:', error);
  }
}

// Open display overlay permission settings
export async function openOverlaySettings(): Promise<void> {
  try {
    if (Platform.OS === 'android') {
      await IntentLauncher.startActivityAsync(
        IntentLauncher.ActivityAction.MANAGE_OVERLAY_PERMISSION
      );
    } else {
      await Linking.openSettings();
    }
  } catch (error) {
    console.error('Failed to open overlay settings:', error);
  }
}

// Get device info
export async function getDeviceInfo() {
  return {
    brand: Device.brand || 'Unknown',
    modelName: Device.modelName || 'Unknown',
    osName: Device.osName || 'Unknown',
    osVersion: Device.osVersion || 'Unknown',
    totalMemory: Device.totalMemory || 0,
  };
}

// Simulate RAM usage (actual RAM monitoring requires native module)
export function getRAMUsage(): { used: number; total: number; percentage: number } {
  const totalMemory = Device.totalMemory || 4 * 1024 * 1024 * 1024; // Default 4GB
  const totalGB = totalMemory / (1024 * 1024 * 1024);
  
  // Simulate realistic RAM usage (60-80% typical)
  const baseUsage = 0.6 + Math.random() * 0.2;
  const usedGB = totalGB * baseUsage;
  
  return {
    used: Math.round(usedGB * 100) / 100,
    total: Math.round(totalGB * 100) / 100,
    percentage: Math.round(baseUsage * 100),
  };
}

// Simulate CPU usage
export function getCPUUsage(): number {
  // Simulate realistic CPU usage (20-60%)
  return Math.round(20 + Math.random() * 40);
}
