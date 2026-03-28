import { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Animated, PanResponder, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { QuickActionsMenu } from './QuickActionsMenu';

const BUBBLE_SIZE = 56;
const SCREEN_PADDING = 16;

interface FloatingBubbleProps {
  onToggleBoost: () => void;
  onNavigateDashboard: () => void;
}

export const FloatingBubble = ({ onToggleBoost, onNavigateDashboard }: FloatingBubbleProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const screen = Dimensions.get('window');
  
  const pan = useRef(new Animated.ValueXY({
    x: screen.width - BUBBLE_SIZE - SCREEN_PADDING,
    y: screen.height / 2,
  })).current;
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        pan.flattenOffset();
        
        // Snap to nearest edge
        const currentX = (pan.x as any)._value;
        const currentY = (pan.y as any)._value;
        
        // Clamp Y position
        const maxY = screen.height - BUBBLE_SIZE - SCREEN_PADDING;
        const clampedY = Math.max(SCREEN_PADDING, Math.min(currentY, maxY));
        
        // Snap to left or right edge
        const snapX = currentX > screen.width / 2 
          ? screen.width - BUBBLE_SIZE - SCREEN_PADDING 
          : SCREEN_PADDING;
        
        Animated.spring(pan, {
          toValue: { x: snapX, y: clampedY },
          useNativeDriver: false,
          friction: 7,
        }).start();
        
        // Check if it was a tap (minimal movement)
        if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
          setIsExpanded(!isExpanded);
        }
      },
    })
  ).current;
  
  if (isMinimized) {
    return (
      <Animated.View
        style={[
          styles.minimizedBubble,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Pressable 
          onPress={() => setIsMinimized(false)}
          style={styles.minimizedButton}
        >
          <MaterialIcons name="rocket-launch" size={16} color={theme.colors.text} />
        </Pressable>
      </Animated.View>
    );
  }
  
  return (
    <>
      <Animated.View
        style={[
          styles.bubble,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.bubbleButton}>
          <MaterialIcons name="rocket-launch" size={28} color={theme.colors.text} />
        </View>
      </Animated.View>
      
      {isExpanded && (
        <QuickActionsMenu
          onClose={() => setIsExpanded(false)}
          onMinimize={() => {
            setIsMinimized(true);
            setIsExpanded(false);
          }}
          onToggleBoost={onToggleBoost}
          onNavigateDashboard={onNavigateDashboard}
          bubblePosition={{ x: (pan.x as any)._value, y: (pan.y as any)._value }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    zIndex: 9999,
  },
  bubbleButton: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  minimizedBubble: {
    position: 'absolute',
    width: 32,
    height: 32,
    zIndex: 9999,
  },
  minimizedButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    opacity: 0.6,
  },
});
