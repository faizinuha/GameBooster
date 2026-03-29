import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppItem } from '../../types';
import { theme } from '../../constants/theme';

interface AppCardProps {
  app: AppItem;
  isSelected: boolean;
  onToggle: () => void;
  onRemove?: () => void;
  showRemove?: boolean;
  onLaunch?: (app: AppItem) => void;
}

export const AppCard = ({ app, isSelected, onToggle, onRemove, showRemove = false, onLaunch }: AppCardProps) => {
  const handlePress = () => {
    if (showRemove && onLaunch) {
      // Jika di selected apps list, launch app
      onLaunch(app);
    } else {
      // Jika di modal add apps, toggle selection
      onToggle();
    }
  };
  
  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        isSelected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons 
          name={app.isGame ? 'sports-esports' : 'apps'} 
          size={32} 
          color={isSelected ? theme.colors.primary : theme.colors.textSecondary} 
        />
      </View>
      
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{app.name}</Text>
        <View style={styles.details}>
          {app.cacheSize !== undefined && (
            <Text style={styles.cache}>{app.cacheSize} MB cache</Text>
          )}
          {app.isGame && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Game</Text>
            </View>
          )}
        </View>
      </View>
      
      {showRemove && onRemove ? (
        <Pressable onPress={onRemove} style={styles.removeButton} hitSlop={8}>
          <MaterialIcons name="close" size={20} color={theme.colors.textMuted} />
        </Pressable>
      ) : (
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && (
            <MaterialIcons name="check" size={16} color={theme.colors.text} />
          )}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selected: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}10`,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  cache: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  badge: {
    backgroundColor: theme.colors.primary + '30',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  badgeText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  removeButton: {
    padding: theme.spacing.xs,
  },
});
