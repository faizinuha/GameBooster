import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withRepeat, withSequence } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { useEffect } from 'react';

interface BoostControlProps {
  isBoosting: boolean;
  isLoading: boolean;
  selectedCount: number;
  onBoost: () => void;
  onStop: () => void;
}

export const BoostControl = ({ 
  isBoosting, 
  isLoading, 
  selectedCount, 
  onBoost, 
  onStop 
}: BoostControlProps) => {
  
  const animatedStyle = useAnimatedStyle(() => {
    if (isBoosting) {
      return {
        transform: [
          { 
            rotate: withRepeat(
              withSequence(
                withSpring('10deg'),
                withSpring('-10deg')
              ),
              -1,
              true
            )
          }
        ]
      };
    }
    return {};
  });
  
  const canBoost = selectedCount > 0 && !isLoading;
  
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title}>
          {isBoosting ? 'Mode Boost Aktif' : 'Siap Boost'}
        </Text>
        <Text style={styles.subtitle}>
          {isBoosting 
            ? `${selectedCount} aplikasi dioptimasi`
            : selectedCount > 0 
              ? `${selectedCount} aplikasi dipilih` 
              : 'Pilih aplikasi untuk boost'}
        </Text>
      </View>
      
      <Pressable
        onPress={isBoosting ? onStop : onBoost}
        disabled={!isBoosting && !canBoost}
        style={({ pressed }) => [
          styles.button,
          isBoosting && styles.buttonActive,
          !isBoosting && !canBoost && styles.buttonDisabled,
          pressed && canBoost && styles.pressed,
        ]}
      >
        <Animated.View style={[styles.iconContainer, animatedStyle]}>
          <MaterialIcons 
            name={isBoosting ? 'stop' : 'rocket-launch'} 
            size={32} 
            color={theme.colors.text} 
          />
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: theme.colors.danger,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.surfaceLight,
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
