import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { commonStyles } from '../../constants/styles';
import { useApps } from '../../hooks/useApps';
import { useBoostContext } from '../../hooks/useBoostContext';
import { StatCard } from '../../components/ui/StatCard';
import { BoostControl } from '../../components/dashboard/BoostControl';
import { AppCard } from '../../components/dashboard/AppCard';
import { AddAppModal } from '../../components/dashboard/AddAppModal';
import { FloatingBubble } from '../../components/overlay/FloatingBubble';
import { SystemStats } from '../../components/system/SystemStats';
import { TutorialModal } from '../../components/system/TutorialModal';
import { openDNDSettings } from '../../services/systemService';
import { PingDisplay } from '../../components/network/PingDisplay';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { apps, selectedApps, toggleApp, removeApp, reloadApps } = useApps();
  const { isBoosting, isLoading, stats, startBoost, stopBoost, loadStats, clearCache } = useBoostContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [tutorialType, setTutorialType] = useState<'cache' | 'notification' | 'overlay' | null>(null);
  
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleScan = async () => {
    setIsScanning(true);
    await reloadApps();
    setTimeout(() => setIsScanning(false), 2000);
  };
  
  const handleBoost = async () => {
    if (selectedApps.length > 0) {
      await startBoost(selectedApps);
    }
  };
  
  const handleStopBoost = async () => {
    await stopBoost(selectedApps);
  };
  
  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Core Engine</Text>
            <Text style={styles.subtitle}>System performance optimized</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <PingDisplay />
            <Pressable onPress={handleScan} style={styles.scanButton}>
              <MaterialIcons 
                name={isScanning ? "sync" : "security"} 
                size={24} 
                color={isScanning ? theme.colors.accent : theme.colors.text} 
              />
            </Pressable>
          </View>
        </View>
        
        {/* System Monitor */}
        <View style={styles.section}>
          <SystemStats enabled={isBoosting} />
        </View>
        
        {/* Stats */}
        {stats && (
          <View style={styles.statsContainer}>
            <StatCard 
              icon="cleaning-services" 
              label="Cache Dibersihkan" 
              value={`${stats.cacheCleared}MB`}
              color={theme.colors.primary}
            />
            <StatCard 
              icon="block" 
              label="Notif Diblokir" 
              value={stats.notificationsBlocked}
              color={theme.colors.danger}
            />
          </View>
        )}
        
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionsGrid}>
            <Pressable
              style={({ pressed }) => [
                styles.actionCard,
                pressed && styles.actionPressed,
              ]}
              onPress={clearCache}
              disabled={isLoading}
            >
              <MaterialIcons name="cleaning-services" size={24} color={theme.colors.primary} />
              <Text style={styles.actionTitle}>Clear Cache</Text>
              <Text style={styles.actionSubtitle}>Bersihkan cache app</Text>
            </Pressable>
            
            <Pressable
              style={({ pressed }) => [
                styles.actionCard,
                pressed && styles.actionPressed,
              ]}
              onPress={() => openDNDSettings()}
            >
              <MaterialIcons name="do-not-disturb-on" size={24} color={theme.colors.warning} />
              <Text style={styles.actionTitle}>Do Not Disturb</Text>
              <Text style={styles.actionSubtitle}>Block notifikasi</Text>
            </Pressable>
          </View>
          
          <View style={styles.actionsGrid}>
            <Pressable
              style={({ pressed }) => [
                styles.actionCard,
                pressed && styles.actionPressed,
              ]}
              onPress={() => setTutorialType('cache')}
            >
              <MaterialIcons name="help-outline" size={24} color={theme.colors.textSecondary} />
              <Text style={styles.actionTitle}>Tutorial Cache</Text>
              <Text style={styles.actionSubtitle}>Cara manual</Text>
            </Pressable>
            
            <Pressable
              style={({ pressed }) => [
                styles.actionCard,
                pressed && styles.actionPressed,
              ]}
              onPress={() => setTutorialType('overlay')}
            >
              <MaterialIcons name="bubble-chart" size={24} color={theme.colors.textSecondary} />
              <Text style={styles.actionTitle}>Tutorial Bubble</Text>
              <Text style={styles.actionSubtitle}>Enable overlay</Text>
            </Pressable>
          </View>
        </View>
        
        {/* Boost Control */}
        <View style={styles.section}>
          <BoostControl
            isBoosting={isBoosting}
            isLoading={isLoading}
            selectedCount={selectedApps.length}
            onBoost={handleBoost}
            onStop={handleStopBoost}
          />
        </View>
        
        {/* Selected Apps */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aplikasi Dipilih</Text>
            <Pressable 
              onPress={() => setShowAddModal(true)}
              style={styles.addButton}
            >
              <MaterialIcons name="add" size={20} color={theme.colors.primary} />
              <Text style={styles.addButtonText}>Tambah</Text>
            </Pressable>
          </View>
          
          {selectedApps.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="apps" size={48} color={theme.colors.textMuted} />
              <Text style={styles.emptyText}>Belum ada aplikasi dipilih</Text>
              <Text style={styles.emptySubtext}>
                Tap tombol Tambah untuk pilih aplikasi
              </Text>
            </View>
          ) : (
            selectedApps.map(app => (
              <AppCard
                key={app.id}
                app={app}
                isSelected={false}
                onToggle={() => {}}
                onRemove={() => removeApp(app.id)}
                showRemove
              />
            ))
          )}
        </View>
      </ScrollView>
      
      {/* Add App Modal */}
      <AddAppModal
        visible={showAddModal}
        apps={apps}
        selectedApps={selectedApps}
        onToggle={toggleApp}
        onClose={() => setShowAddModal(false)}
      />
      
      {/* Floating Bubble - Only show when boosting */}
      {isBoosting && (
        <FloatingBubble
          onToggleBoost={handleStopBoost}
          onNavigateDashboard={() => router.push('/(tabs)')}
        />
      )}
      
      {/* Tutorial Modal */}
      <TutorialModal
        visible={tutorialType !== null}
        type={tutorialType}
        onClose={() => setTutorialType(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  greeting: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.textMuted,
  },
  statusDotActive: {
    backgroundColor: theme.colors.success,
  },
  statusText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  scanButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  addButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  actionPressed: {
    opacity: 0.7,
  },
  actionTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
