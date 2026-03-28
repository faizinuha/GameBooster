import { View, Text, StyleSheet, ScrollView, Pressable, Linking, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useAlert } from '../../template';
import { theme } from '../../constants/theme';
import { commonStyles } from '../../constants/styles';
import { useBoostContext } from '../../hooks/useBoostContext';
import { NativeManager } from '../../services/NativeManager';

interface SettingItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  color?: string;
  rightElement?: React.ReactNode;
}

const SettingItem = ({ icon, title, subtitle, onPress, showArrow = true, color = theme.colors.primary, rightElement }: SettingItemProps) => (
  <Pressable
    onPress={onPress}
    disabled={!onPress}
    style={({ pressed }) => [
      styles.settingItem,
      pressed && onPress && styles.pressed,
    ]}
  >
    <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
      <MaterialIcons name={icon} size={24} color={color} />
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    {rightElement ? rightElement : showArrow && (
      <MaterialIcons name="chevron-right" size={24} color={theme.colors.textMuted} />
    )}
  </Pressable>
);

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const { stats, loadStats } = useBoostContext();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoClearCache, setAutoClearCache] = useState(false);
  const [floatingBubble, setFloatingBubble] = useState(true);
  
  const handleFeedback = () => {
    Linking.openURL('mailto:support@gamebooster.com?subject=Feedback');
  };
  
  const handleSupport = () => {
    Linking.openURL('https://support.gamebooster.com');
  };
  
  const handlePrivacy = () => {
    showAlert(
      'Privasi & Keamanan',
      'Game Booster tidak mengumpulkan data pribadi. Semua data disimpan lokal di device Anda. Kami tidak mengirim informasi apapun ke server.'
    );
  };
  
  const handleStorage = async () => {
    await loadStats();
    showAlert(
      'Penyimpanan',
      `Total cache dibersihkan: ${stats?.cacheCleared || 0}MB\nNotifikasi diblokir: ${stats?.notificationsBlocked || 0}`,
      [
        { text: 'Tutup', style: 'cancel' },
        { 
          text: 'Hapus Semua Lagi', 
          onPress: async () => {
            await NativeManager.clearOwnCache();
            showAlert('Info', 'Cache internal berhasil dibersihkan.');
          } 
        }
      ]
    );
  };
  
  const handleAbout = () => {
    showAlert(
      'Tentang Game Booster',
      'Game Booster v1.0.0\n\nDikembangkan dengan fokus pada privasi dan keamanan pengguna.\n\nFitur:\n• Clear cache aplikasi\n• Disable notifikasi saat gaming\n• Floating quick actions\n• Monitoring performa\n\n© 2024 Game Booster'
    );
  };
  
  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>
        
        {/* App Info */}
        <View style={styles.appInfo}>
          <View style={styles.appIconContainer}>
            <MaterialIcons name="rocket-launch" size={48} color={theme.colors.primary} />
          </View>
          <Text style={styles.appName}>Game Booster</Text>
          <Text style={styles.appVersion}>Versi 1.0.0</Text>
        </View>
        
        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Umum</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="notifications"
              title="Notifikasi App"
              subtitle="Terima notifikasi dari app"
              showArrow={false}
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: theme.colors.surfaceLight, true: theme.colors.primary }}
                  thumbColor={theme.colors.text}
                />
              }
            />
            <SettingItem
              icon="delete-sweep"
              title="Auto Clear Cache"
              subtitle="Bersihkan cache otomatis saat boost"
              showArrow={false}
              rightElement={
                <Switch
                  value={autoClearCache}
                  onValueChange={setAutoClearCache}
                  trackColor={{ false: theme.colors.surfaceLight, true: theme.colors.primary }}
                  thumbColor={theme.colors.text}
                />
              }
            />
            <SettingItem
              icon="bubble-chart"
              title="Floating Bubble"
              subtitle="Tampilkan bubble saat boost aktif"
              showArrow={false}
              rightElement={
                <Switch
                  value={floatingBubble}
                  onValueChange={setFloatingBubble}
                  trackColor={{ false: theme.colors.surfaceLight, true: theme.colors.primary }}
                  thumbColor={theme.colors.text}
                />
              }
            />
            <SettingItem
              icon="security"
              title="Privasi & Keamanan"
              subtitle="Kebijakan privasi dan keamanan data"
              onPress={handlePrivacy}
            />
            <SettingItem
              icon="storage"
              title="Penyimpanan"
              subtitle="Lihat statistik penyimpanan"
              onPress={handleStorage}
            />
          </View>
        </View>
        
        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dukungan</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="feedback"
              title="Feedback"
              subtitle="Kirim saran dan masukan"
              onPress={handleFeedback}
              color={theme.colors.success}
            />
            <SettingItem
              icon="help"
              title="Support"
              subtitle="Bantuan dan panduan penggunaan"
              onPress={handleSupport}
              color={theme.colors.warning}
            />
            <SettingItem
              icon="info"
              title="Tentang Aplikasi"
              subtitle="Informasi versi dan lisensi"
              onPress={handleAbout}
              color={theme.colors.textSecondary}
            />
          </View>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Dibuat dengan fokus privasi & keamanan
          </Text>
          <Text style={styles.footerSubtext}>
            © 2024 Game Booster. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  appIconContainer: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  appName: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  appVersion: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pressed: {
    backgroundColor: theme.colors.surfaceLight,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  footerText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  footerSubtext: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
