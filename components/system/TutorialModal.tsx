import { Modal, View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { openAppSettings, openNotificationSettings, openOverlaySettings } from '../../services/systemService';

interface TutorialModalProps {
  visible: boolean;
  type: 'cache' | 'notification' | 'overlay' | null;
  onClose: () => void;
}

export const TutorialModal = ({ visible, type, onClose }: TutorialModalProps) => {
  if (!type) return null;
  
  const tutorials = {
    cache: {
      title: 'Cara Clear Cache Manual',
      icon: 'cleaning-services',
      color: theme.colors.primary,
      steps: [
        'Tap tombol "Buka Settings" di bawah',
        'Pilih aplikasi yang ingin dibersihkan cache-nya',
        'Tap "Storage" atau "Penyimpanan"',
        'Tap "Clear Cache"',
        'Ulangi untuk aplikasi lainnya',
      ],
      note: 'Clearing cache tidak akan menghapus data penting seperti login atau save game',
      action: openAppSettings,
    },
    notification: {
      title: 'Cara Disable Notifikasi',
      icon: 'notifications-off',
      color: theme.colors.danger,
      steps: [
        'Tap tombol "Buka Settings" di bawah',
        'Pilih aplikasi yang ingin dimatikan notifikasinya',
        'Tap "Notifications" atau "Notifikasi"',
        'Toggle OFF atau pilih "Block all"',
        'Untuk gaming mode, gunakan Do Not Disturb',
      ],
      note: 'Gunakan Do Not Disturb (DND) untuk sementara block semua notifikasi saat gaming',
      action: openNotificationSettings,
    },
    overlay: {
      title: 'Cara Enable Floating Bubble',
      icon: 'bubble-chart',
      color: theme.colors.warning,
      steps: [
        'Tap tombol "Buka Settings" di bawah',
        'Cari "Game Booster" di list apps',
        'Enable "Display over other apps" atau "Tampilkan di atas aplikasi lain"',
        'Kembali ke app dan aktifkan Boost Mode',
        'Floating bubble akan muncul di layar',
      ],
      note: 'Permission ini diperlukan agar floating bubble bisa muncul di atas aplikasi lain',
      action: openOverlaySettings,
    },
  };
  
  const tutorial = tutorials[type];
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconContainer, { backgroundColor: tutorial.color }]}>
                <MaterialIcons name={tutorial.icon as any} size={24} color={theme.colors.text} />
              </View>
              <Text style={styles.title}>{tutorial.title}</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8}>
              <MaterialIcons name="close" size={24} color={theme.colors.textMuted} />
            </Pressable>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
            <Text style={styles.sectionTitle}>Langkah-langkah:</Text>
            
            {tutorial.steps.map((step, index) => (
              <View key={index} style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
            
            <View style={styles.note}>
              <MaterialIcons name="info" size={20} color={theme.colors.warning} />
              <Text style={styles.noteText}>{tutorial.note}</Text>
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.buttonSecondary,
                pressed && styles.buttonPressed,
              ]}
              onPress={onClose}
            >
              <Text style={styles.buttonSecondaryText}>Tutup</Text>
            </Pressable>
            
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.buttonPrimary,
                { backgroundColor: tutorial.color },
                pressed && styles.buttonPressed,
              ]}
              onPress={async () => {
                await tutorial.action();
                onClose();
              }}
            >
              <MaterialIcons name="settings" size={20} color={theme.colors.text} />
              <Text style={styles.buttonPrimaryText}>Buka Settings</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  step: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  stepText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: 22,
  },
  note: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.warning,
  },
  noteText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonPrimaryText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  buttonSecondaryText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
  },
});
