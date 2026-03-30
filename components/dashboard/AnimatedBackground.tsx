import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface AnimatedBackgroundProps {
  isBoosting?: boolean;
}

export const AnimatedBackground = ({ isBoosting = false }: AnimatedBackgroundProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 8000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 0.5, 1],
      isBoosting
        ? ['#0D0D0D', '#1A0F1F', '#0D0D0D'] // Darker purple tint when boosting
        : ['#0D0D0D', '#0F1419', '#0D0D0D'] // Deep charcoal gradient
    );

    return {
      backgroundColor,
    };
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
      <LinearGradient
        colors={
          isBoosting
            ? ['rgba(139, 92, 246, 0.1)', 'transparent', 'rgba(16, 185, 129, 0.1)']
            : ['rgba(255, 255, 255, 0.03)', 'transparent', 'rgba(224, 224, 224, 0.02)']
        }
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </Animated.View>
  );
};
