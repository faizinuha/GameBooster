import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { theme } from '../../constants/theme';
import { commonStyles } from '../../constants/styles';
import { NotificationItem } from '../../types';
import { getNotifications, clearNotification, clearAllNotifications } from '../../services/notificationService';
import { CategoryTabs } from '../../components/notifications/CategoryTabs';
import { NotificationCard } from '../../components/notifications/NotificationCard';
import { NativeManager } from '../../services/NativeManager';

type Category = 'all' | 'social' | 'custom';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState<Category>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getNotifications(category);
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [category]);
  
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);
  
  const handleClear = async (id: string) => {
    await clearNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const handleClearAll = async () => {
    await clearAllNotifications();
    setNotifications([]);
  };

  const [isBlockingEnabled, setIsBlockingEnabled] = useState(false);

  const toggleBlocking = async () => {
    const success = await NativeManager.setNotificationBlocking(!isBlockingEnabled);
    if (success) {
      setIsBlockingEnabled(!isBlockingEnabled);
    } else {
      // If failed, maybe need permission
      await NativeManager.requestNotificationAccess();
    }
  };
  
  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Notifikasi</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable 
            onPress={toggleBlocking} 
            style={[styles.actionButton, isBlockingEnabled && styles.actionButtonActive]}
          >
            <MaterialIcons 
              name={isBlockingEnabled ? "notifications-off" : "notifications-none"} 
              size={20} 
              color={isBlockingEnabled ? theme.colors.white : theme.colors.primary} 
            />
          </Pressable>
          {notifications.length > 0 && (
            <Pressable onPress={handleClearAll} style={styles.clearAllButton}>
              <Text style={styles.clearAllText}>Hapus Semua</Text>
            </Pressable>
          )}
        </View>
      </View>
      
      {/* Category Tabs */}
      <CategoryTabs
        selectedCategory={category}
        onSelectCategory={setCategory}
      />
      
      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <NotificationCard
            notification={item}
            onClear={() => handleClear(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="notifications-off" size={64} color={theme.colors.textMuted} />
            <Text style={styles.emptyText}>Tidak ada notifikasi</Text>
            <Text style={styles.emptySubtext}>
              {category === 'all' 
                ? 'Semua notifikasi akan muncul di sini'
                : `Tidak ada notifikasi ${category === 'social' ? 'media sosial' : 'custom'}`}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  clearAllButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  clearAllText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.danger,
  },
  actionButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  actionButtonActive: {
    backgroundColor: theme.colors.danger,
    borderColor: theme.colors.danger,
  },
  list: {
    padding: theme.spacing.lg,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl * 2,
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.lg,
  },
  emptySubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
});
