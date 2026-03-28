import { Modal, View, Text, StyleSheet, ScrollView, Pressable, Linking, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DNSServer } from '../../types';
import { theme } from '../../constants/theme';

interface DNSGuideModalProps {
  visible: boolean;
  dns: DNSServer | null;
  onClose: () => void;
}

export const DNSGuideModal = ({ visible, dns, onClose }: DNSGuideModalProps) => {
  if (!dns) return null;
  
  const openWifiSettings = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings();
    } else {
      Linking.openURL('App-Prefs:WIFI');
    }
  };
  
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
            <Text style={styles.title}>Cara Set DNS Manual</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <MaterialIcons name="close" size={24} color={theme.colors.textMuted} />
            </Pressable>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.dnsInfo}>
              <Text style={styles.dnsName}>{dns.name}</Text>
              <View style={styles.dnsValues}>
                <View style={styles.dnsRow}>
                  <Text style={styles.label}>Primary DNS:</Text>
                  <Text style={styles.value}>{dns.primary}</Text>
                </View>
                <View style={styles.dnsRow}>
                  <Text style={styles.label}>Secondary DNS:</Text>
                  <Text style={styles.value}>{dns.secondary}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="android" size={20} color={theme.colors.success} />
                <Text style={styles.sectionTitle}>Android</Text>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>
                  Buka <Text style={styles.bold}>Settings</Text> → <Text style={styles.bold}>Wi-Fi</Text>
                </Text>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  Tap & hold WiFi yang sedang terkoneksi, pilih <Text style={styles.bold}>Modify Network</Text>
                </Text>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>
                  Pilih <Text style={styles.bold}>Advanced Options</Text> → <Text style={styles.bold}>IP Settings: Static</Text>
                </Text>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepText}>Masukkan DNS:</Text>
                  <Text style={styles.dnsCode}>DNS 1: {dns.primary}</Text>
                  <Text style={styles.dnsCode}>DNS 2: {dns.secondary}</Text>
                </View>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>5</Text>
                </View>
                <Text style={styles.stepText}>
                  Tap <Text style={styles.bold}>Save</Text> dan reconnect WiFi
                </Text>
              </View>
            </View>
            
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="apple" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.sectionTitle}>iOS</Text>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>
                  Buka <Text style={styles.bold}>Settings</Text> → <Text style={styles.bold}>Wi-Fi</Text>
                </Text>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  Tap icon <Text style={styles.bold}>(i)</Text> di samping WiFi yang terkoneksi
                </Text>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>
                  Scroll ke <Text style={styles.bold}>Configure DNS</Text> → pilih <Text style={styles.bold}>Manual</Text>
                </Text>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <Text style={styles.stepText}>
                  Hapus DNS lama, tap <Text style={styles.bold}>Add Server</Text>
                </Text>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>5</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepText}>Tambahkan DNS:</Text>
                  <Text style={styles.dnsCode}>{dns.primary}</Text>
                  <Text style={styles.dnsCode}>{dns.secondary}</Text>
                </View>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>6</Text>
                </View>
                <Text style={styles.stepText}>
                  Tap <Text style={styles.bold}>Save</Text>
                </Text>
              </View>
            </View>
            
            <View style={styles.note}>
              <MaterialIcons name="info" size={20} color={theme.colors.warning} />
              <Text style={styles.noteText}>
                Setelah set DNS, restart WiFi atau device untuk hasil maksimal
              </Text>
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.buttonSecondary,
                pressed && styles.buttonPressed,
              ]}
              onPress={openWifiSettings}
            >
              <MaterialIcons name="settings" size={20} color={theme.colors.primary} />
              <Text style={styles.buttonSecondaryText}>Buka WiFi Settings</Text>
            </Pressable>
            
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.buttonPrimary,
                pressed && styles.buttonPressed,
              ]}
              onPress={onClose}
            >
              <Text style={styles.buttonPrimaryText}>Mengerti</Text>
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
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  dnsInfo: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  dnsName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  dnsValues: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
  },
  dnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  value: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    fontFamily: 'monospace',
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
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
  stepContent: {
    flex: 1,
  },
  stepText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: 22,
  },
  bold: {
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  dnsCode: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'monospace',
    color: theme.colors.primary,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.xs,
  },
  note: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.md,
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
    borderColor: theme.colors.primary,
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
    color: theme.colors.primary,
  },
});
