import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NotificationItem } from '../../types';
import { theme } from '../../constants/theme';

interface NotificationCardProps {
  notification: NotificationItem;
  onClear: () => void;
}

export const NotificationCard = ({ notification, onClear }: NotificationCardProps) => {
  const getTimeAgo = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="notifications" size={24} color={theme.colors.primary} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.appName}>{notification.appName}</Text>
          <Text style={styles.time}>{getTimeAgo(notification.timestamp)}</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>{notification.title}</Text>
        <Text style={styles.message} numberOfLines={2}>{notification.message}</Text>
      </View>
      
      <Pressable onPress={onClear} style={styles.clearButton} hitSlop={8}>
        <MaterialIcons name="close" size={20} color={theme.colors.textMuted} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  appName: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.primary,
  },
  time: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
  title: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  message: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  clearButton: {
    padding: theme.spacing.xs,
  },
});
