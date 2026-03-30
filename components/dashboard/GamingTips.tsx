import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { GlassCard } from './GlassCard';
import { theme } from '../../constants/theme';
import type { BoostStats } from '../../types';

interface GamingTipsProps {
  stats: BoostStats | null;
  isBoosting: boolean;
  selectedAppsCount: number;
}

interface Tip {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  message: string;
  color: string;
}

export const GamingTips = ({ stats, isBoosting, selectedAppsCount }: GamingTipsProps) => {
  const [currentTip, setCurrentTip] = useState<Tip | null>(null);

  useEffect(() => {
    const tip = generatePersonalizedTip();
    setCurrentTip(tip);

    // Rotate tips every 15 seconds
    const interval = setInterval(() => {
      setCurrentTip(generatePersonalizedTip());
    }, 15000);

    return () => clearInterval(interval);
  }, [stats, isBoosting, selectedAppsCount]);

  const generatePersonalizedTip = (): Tip => {
    const tips: Tip[] = [];

    // Based on cache usage
    if (stats && stats.cacheCleared > 500) {
      tips.push({
        icon: 'insights',
        title: 'Heavy Cache User',
        message: 'You have cleared over 500MB cache. Consider clearing cache more frequently for optimal performance.',
        color: theme.colors.warning,
      });
    }

    // Based on boost status
    if (isBoosting) {
      tips.push({
        icon: 'flash-on',
        title: 'Boost Active',
        message: 'Game boost is active. Your device is optimized for maximum gaming performance.',
        color: theme.colors.accent,
      });
    } else {
      tips.push({
        icon: 'power-settings-new',
        title: 'Ready to Boost',
        message: 'Activate boost mode before gaming for enhanced performance and fewer distractions.',
        color: theme.colors.primary,
      });
    }

    // Based on app count
    if (selectedAppsCount === 0) {
      tips.push({
        icon: 'add-circle-outline',
        title: 'Get Started',
        message: 'Add your favorite games to start optimizing your gaming experience.',
        color: theme.colors.textSecondary,
      });
    } else if (selectedAppsCount >= 5) {
      tips.push({
        icon: 'stars',
        title: 'Power User',
        message: `You have ${selectedAppsCount} games configured. Great job organizing your gaming library!`,
        color: theme.colors.accent,
      });
    }

    // Battery tip
    tips.push({
      icon: 'battery-charging-full',
      title: 'Battery Tip',
      message: 'Close background apps and reduce screen brightness to extend gaming sessions.',
      color: theme.colors.success,
    });

    // Network tip
    tips.push({
      icon: 'wifi',
      title: 'Network Optimization',
      message: 'Use the Network tab to test DNS speeds and find the fastest connection for online gaming.',
      color: theme.colors.primary,
    });

    // Temperature tip
    tips.push({
      icon: 'thermostat',
      title: 'Device Temperature',
      message: 'Take breaks during long gaming sessions to prevent device overheating.',
      color: theme.colors.danger,
    });

    // Notification tip
    if (stats && stats.notificationsBlocked > 20) {
      tips.push({
        icon: 'notifications-off',
        title: 'Distraction Free',
        message: `You have blocked ${stats.notificationsBlocked} notifications. Stay focused on your game!`,
        color: theme.colors.accent,
      });
    }

    return tips[Math.floor(Math.random() * tips.length)];
  };

  if (!currentTip) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(300)}
      style={styles.container}
    >
      <GlassCard variant="primary">
        <View style={styles.content}>
          <View style={[styles.iconCircle, { backgroundColor: `${currentTip.color}20` }]}>
            <MaterialIcons name={currentTip.icon} size={28} color={currentTip.color} />
          </View>
          <View style={styles.textContent}>
            <Text style={styles.title}>{currentTip.title}</Text>
            <Text style={styles.message}>{currentTip.message}</Text>
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  message: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});
