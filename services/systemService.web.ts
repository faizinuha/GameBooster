// Web-compatible version of systemService (no IntentLauncher)

// Clear app's own cache (web doesn't support this)
export async function clearOwnCache(): Promise<number> {
  console.log('Cache clearing not supported on web');
  return 0;
}

// Get current cache size in MB (web doesn't support this)
export async function getCacheSize(): Promise<number> {
  return 0;
}

// Open app settings (not supported on web)
export async function openAppSettings(packageName?: string): Promise<void> {
  console.log('Opening settings not supported on web');
}

// Open Do Not Disturb settings (not supported on web)
export async function openDNDSettings(): Promise<void> {
  console.log('DND settings not supported on web');
}

// Open notification settings (not supported on web)
export async function openNotificationSettings(): Promise<void> {
  console.log('Notification settings not supported on web');
}

// Open display overlay permission settings (not supported on web)
export async function openOverlaySettings(): Promise<void> {
  console.log('Overlay settings not supported on web');
}

// Get device info (web version)
export async function getDeviceInfo() {
  return {
    brand: 'Browser',
    modelName: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Browser',
    osName: 'Web',
    osVersion: '1.0',
    totalMemory: 8 * 1024 * 1024 * 1024, // Assume 8GB for web
  };
}

// Simulate RAM usage
export function getRAMUsage(): { used: number; total: number; percentage: number } {
  const totalGB = 8; // Assume 8GB
  const baseUsage = 0.6 + Math.random() * 0.2;
  const usedGB = totalGB * baseUsage;
  
  return {
    used: Math.round(usedGB * 100) / 100,
    total: totalGB,
    percentage: Math.round(baseUsage * 100),
  };
}

// Simulate CPU usage
export function getCPUUsage(): number {
  return Math.round(20 + Math.random() * 40);
}
