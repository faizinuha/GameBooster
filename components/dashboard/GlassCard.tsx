import { ViewStyle, StyleProp, View, StyleSheet } from 'react-native';
import { ReactNode } from 'react';
import { theme } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'primary' | 'success';
}

export const GlassCard = ({ children, style, variant = 'default' }: GlassCardProps) => {
  const getBorderColor = () => {
    switch (variant) {
      case 'primary':
        return 'rgba(224, 224, 224, 0.2)';
      case 'success':
        return 'rgba(16, 185, 129, 0.3)';
      default:
        return 'rgba(255, 255, 255, 0.05)';
    }
  };

  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return ['rgba(224, 224, 224, 0.08)', 'rgba(224, 224, 224, 0.02)'];
      case 'success':
        return ['rgba(16, 185, 129, 0.15)', 'rgba(16, 185, 129, 0.05)'];
      default:
        return ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)'];
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: getBorderColor(),
        },
        style,
      ]}
    >
      <LinearGradient
        colors={getGradientColors()}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(22, 22, 22, 0.6)',
  },
  content: {
    padding: theme.spacing.lg,
  },
});
