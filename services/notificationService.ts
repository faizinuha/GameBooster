import { NotificationItem } from '../types';

export const getNotifications = async (category: 'all' | 'social' | 'custom' = 'all'): Promise<NotificationItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const allNotifications: NotificationItem[] = [
    {
      id: '1',
      appName: 'WhatsApp',
      appPackage: 'com.whatsapp',
      title: 'New message',
      message: 'John: Hey, are you available?',
      timestamp: Date.now() - 300000,
      category: 'social',
    },
    {
      id: '2',
      appName: 'Instagram',
      appPackage: 'com.instagram',
      title: 'New follower',
      message: 'sarah_123 started following you',
      timestamp: Date.now() - 600000,
      category: 'social',
    },
    {
      id: '3',
      appName: 'Mobile Legends',
      appPackage: 'com.mobile.legends',
      title: 'Game Update',
      message: 'New hero available!',
      timestamp: Date.now() - 900000,
      category: 'custom',
    },
    {
      id: '4',
      appName: 'System',
      appPackage: 'com.android.system',
      title: 'Storage',
      message: 'Running out of storage space',
      timestamp: Date.now() - 1200000,
      category: 'all',
    },
  ];
  
  if (category === 'all') return allNotifications;
  return allNotifications.filter(n => n.category === category || n.category === 'all');
};

export const clearNotification = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return true;
};

export const clearAllNotifications = async (): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return true;
};
