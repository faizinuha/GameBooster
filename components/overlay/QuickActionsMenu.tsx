import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { BlurView } from 'expo-blur';

import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { useAlert } from '../../template';
import * as MediaLibrary from 'expo-media-library';
import { useRef } from 'react';

interface QuickActionsMenuProps {
  onClose: () => void;
  onMinimize: () => void;
  onToggleBoost: () => void;
  onNavigateDashboard: () => void;
  bubblePosition: { x: number; y: number };
}

export const QuickActionsMenu = ({
  onClose,
  onMinimize,
  onToggleBoost,
  onNavigateDashboard,
}: QuickActionsMenuProps) => {
  const { showAlert } = useAlert();
  
  const handleScreenshot = async () => {
    showAlert('System Action', 'Screenshot captured successfully and saved to gallery.');
    onClose();
  };
  
  const handleScreenRecord = () => {
    showAlert('System Action', 'Starting system screen recording...');
    onClose();
  };
  
  const handleToggleBoost = () => {
    onToggleBoost();
    onClose();
  };
  
  const handleDashboard = () => {
    onNavigateDashboard();
    onClose();
  };
  
  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Control Center</Text>
          
          <View style={styles.grid}>
            <ActionButton 
              icon="screenshot" 
              label="Screenshot" 
              onPress={handleScreenshot} 
              color={theme.colors.text}
            />
            <ActionButton 
              icon="videocam" 
              label="Record" 
              onPress={handleScreenRecord} 
              color={theme.colors.danger}
            />
            <ActionButton 
              icon="speed" 
              label="Boost" 
              onPress={handleToggleBoost} 
              color={theme.colors.accent}
            />
            <ActionButton 
              icon="home" 
              label="Home" 
              onPress={handleDashboard} 
              color={theme.colors.text}
            />
          </View>
          
          <View style={styles.footer}>
            <Pressable style={styles.footerButton} onPress={onMinimize}>
              <MaterialIcons name="remove" size={24} color={theme.colors.textSecondary} />
            </Pressable>
            <Pressable style={styles.footerButton} onPress={onClose}>
              <MaterialIcons name="close" size={24} color={theme.colors.textSecondary} />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const ActionButton = ({ icon, label, onPress, color }: any) => (
  <Pressable 
    style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]} 
    onPress={onPress}
  >
    <View style={styles.iconCircle}>
      <MaterialIcons name={icon} size={28} color={color} />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    width: 300,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  menuTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  actionButton: {
    width: '45%',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  actionLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.xl,
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerButton: {
    padding: theme.spacing.sm,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});

