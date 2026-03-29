import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../constants/theme';
import type { App } from '../../types';

interface LaunchingAnimationProps {
  visible: boolean;
  app: App | null;
  onComplete: () => void;
}

export const LaunchingAnimation = ({ visible, app, onComplete }: LaunchingAnimationProps) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (visible && app) {
      // Reset animations
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
      opacityAnim.setValue(0);
      progressAnim.setValue(0);
      
      // Start animations sequence
      Animated.sequence([
        // Fade in
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        // Scale up rocket
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        // Progress bar + rotation
        Animated.parallel([
          Animated.timing(progressAnim, {
            toValue: 100,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.loop(
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            })
          ),
        ]),
      ]).start();
      
      // Complete after 2.5 seconds
      const timer = setTimeout(() => {
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onComplete();
        });
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [visible, app]);
  
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  if (!app) return null;
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
        <LinearGradient
          colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.95)']}
          style={StyleSheet.absoluteFillObject}
        />
        
        <View style={styles.content}>
          {/* Rocket Animation */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [
                  { scale: scaleAnim },
                  { rotate: spin },
                ],
              },
            ]}
          >
            <MaterialIcons name="rocket-launch" size={80} color={theme.colors.primary} />
          </Animated.View>
          
          {/* App Name */}
          <Text style={styles.appName}>{app.name}</Text>
          
          {/* Status Messages */}
          <View style={styles.statusContainer}>
            <AnimatedStatus delay={0} text="🧹 Membersihkan cache..." />
            <AnimatedStatus delay={500} text="🚀 Mengoptimalkan performa..." />
            <AnimatedStatus delay={1000} text="⚡ Boosting power..." />
            <AnimatedStatus delay={1500} text="✨ Meluncurkan game..." />
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFillObject}
              />
            </Animated.View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

// Component untuk status message dengan delay animation
const AnimatedStatus = ({ delay, text }: { delay: number; text: string }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <Animated.Text style={[styles.statusText, { opacity }]}>
      {text}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xxl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  appName: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  statusContainer: {
    gap: theme.spacing.sm,
    alignItems: 'center',
    minHeight: 100,
  },
  statusText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});
