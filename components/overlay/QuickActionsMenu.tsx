import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { useAlert } from '../../template';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
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
  const viewRef = useRef(null);
  
  const handleScreenshot = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        showAlert('Permission Denied', 'Media library permission required for screenshots');
        return;
      }
      
      showAlert('Screenshot', 'Screenshot feature requires view reference. Akan diimplementasikan dengan capture screen.');
      onClose();
    } catch (error) {
      showAlert('Error', 'Failed to take screenshot');
    }
  };
  
  const handleScreenRecord = () => {
    showAlert(
      'Screen Recording',
      'Untuk screen recording, gunakan fitur bawaan device:\n\niOS: Control Center > Screen Recording\nAndroid: Quick Settings > Screen Record'
    );
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
        <View style={styles.menu}>
          <Text style={styles.menuTitle}>Quick Actions</Text>
          
          <Pressable 
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
            onPress={handleScreenshot}
          >
            <MaterialIcons name="screenshot" size={24} color={theme.colors.primary} />
            <Text style={styles.menuItemText}>Screenshot</Text>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
            onPress={handleScreenRecord}
          >
            <MaterialIcons name="fiber-manual-record" size={24} color={theme.colors.danger} />
            <Text style={styles.menuItemText}>Screen Record</Text>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
            onPress={handleToggleBoost}
          >
            <MaterialIcons name="flash-on" size={24} color={theme.colors.warning} />
            <Text style={styles.menuItemText}>Toggle Boost</Text>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
            onPress={handleDashboard}
          >
            <MaterialIcons name="dashboard" size={24} color={theme.colors.success} />
            <Text style={styles.menuItemText}>Dashboard</Text>
          </Pressable>
          
          <View style={styles.divider} />
          
          <Pressable 
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
            onPress={onMinimize}
          >
            <MaterialIcons name="minimize" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.menuItemText}>Minimize</Text>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
            onPress={onClose}
          >
            <MaterialIcons name="close" size={24} color={theme.colors.textMuted} />
            <Text style={styles.menuItemText}>Close</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    minWidth: 240,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  menuTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.md,
  },
  pressed: {
    backgroundColor: theme.colors.surfaceLight,
  },
  menuItemText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
});
