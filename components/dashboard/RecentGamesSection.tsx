import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from './GlassCard';
import { theme } from '../../constants/theme';
import type { AppItem } from '../../types';

interface LaunchHistory {
  app: AppItem;
  lastPlayed: Date;
  playCount: number;
  totalMinutes: number;
}

interface RecentGamesSectionProps {
  selectedApps: AppItem[];
  onLaunchApp: (app: AppItem) => void;
}

export const RecentGamesSection = ({ selectedApps, onLaunchApp }: RecentGamesSectionProps) => {
  const [history, setHistory] = useState<LaunchHistory[]>([]);

  useEffect(() => {
    // Simulate launch history - in real app, load from AsyncStorage
    const mockHistory: LaunchHistory[] = selectedApps.slice(0, 3).map((app, index) => ({
      app,
      lastPlayed: new Date(Date.now() - index * 3600000), // Hours ago
      playCount: Math.floor(Math.random() * 50) + 10,
      totalMinutes: Math.floor(Math.random() * 500) + 60,
    }));
    
    setHistory(mockHistory);
  }, [selectedApps]);

  const getTimeAgo = (date: Date): string => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="history" size={24} color={theme.colors.primary} />
        <Text style={styles.title}>Recent Games</Text>
      </View>

      {history.map((item, index) => (
        <Animated.View
          key={item.app.id}
          entering={FadeInDown.delay(index * 100).springify()}
        >
          <Pressable
            onPress={() => onLaunchApp(item.app)}
            style={({ pressed }) => [pressed && styles.pressed]}
          >
            <GlassCard style={styles.card}>
              <View style={styles.gameRow}>
                <View style={styles.iconContainer}>
                  <MaterialIcons
                    name={item.app.isGame ? 'sports-esports' : 'apps'}
                    size={32}
                    color={theme.colors.primary}
                  />
                </View>

                <View style={styles.gameInfo}>
                  <Text style={styles.gameName} numberOfLines={1}>
                    {item.app.name}
                  </Text>
                  <View style={styles.statsRow}>
                    <View style={styles.stat}>
                      <MaterialIcons name="access-time" size={12} color={theme.colors.textMuted} />
                      <Text style={styles.statText}>{getTimeAgo(item.lastPlayed)}</Text>
                    </View>
                    <View style={styles.stat}>
                      <MaterialIcons name="play-arrow" size={12} color={theme.colors.textMuted} />
                      <Text style={styles.statText}>{item.playCount} plays</Text>
                    </View>
                    <View style={styles.stat}>
                      <MaterialIcons name="schedule" size={12} color={theme.colors.textMuted} />
                      <Text style={styles.statText}>{item.totalMinutes}m total</Text>
                    </View>
                  </View>
                </View>

                <MaterialIcons name="play-circle-filled" size={40} color={theme.colors.accent} />
              </View>
            </GlassCard>
          </Pressable>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  card: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  gameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(224, 224, 224, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
});
