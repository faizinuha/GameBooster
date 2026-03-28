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
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  appName: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  time: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: theme.fontWeight.medium,
  },
  title: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  message: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    opacity: 0.8,
  },
  clearButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
    justifyContent: 'center',
  },

});
