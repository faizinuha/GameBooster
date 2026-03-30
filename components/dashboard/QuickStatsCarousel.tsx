import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { GlassCard } from './GlassCard';
import { theme } from '../../constants/theme';
import type { BoostStats } from '../../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

interface QuickStatsCarouselProps {
  stats: BoostStats | null;
  isBoosting: boolean;
}

interface StatItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string | number;
  color: string;
  isActive?: boolean;
}

const StatItem = ({ icon, label, value, color, isActive }: StatItemProps) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      scale.value = withRepeat(
        withSequence(withSpring(1.05), withSpring(1)),
        -1,
        false
      );
    } else {
      scale.value = withSpring(1);
    }
  }, [isActive, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.statItem, animatedStyle]}>
      <GlassCard variant={isActive ? 'success' : 'default'}>
        <View style={styles.statContent}>
          <View style={[styles.iconCircle, { backgroundColor: `${color}20` }]}>
            <MaterialIcons name={icon} size={28} color={color} />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
};

export const QuickStatsCarousel = ({ stats, isBoosting }: QuickStatsCarouselProps) => {
  const statsData: Omit<StatItemProps, 'isActive'>[] = [
    {
      icon: 'cleaning-services',
      label: 'Cache Cleared',
      value: `${stats?.cacheCleared || 0} MB`,
      color: theme.colors.primary,
    },
    {
      icon: 'memory',
      label: 'Memory Freed',
      value: `${stats?.memoryFreed || 0} MB`,
      color: theme.colors.accent,
    },
    {
      icon: 'block',
      label: 'Notifications Blocked',
      value: stats?.notificationsBlocked || 0,
      color: theme.colors.danger,
    },
    {
      icon: 'speed',
      label: 'Apps Optimized',
      value: stats?.appsOptimized || 0,
      color: theme.colors.warning,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={CARD_WIDTH + theme.spacing.md}
        decelerationRate="fast"
      >
        {statsData.map((stat, index) => (
          <View key={index} style={styles.cardWrapper}>
            <StatItem {...stat} isActive={isBoosting} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  statItem: {
    width: '100%',
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});
