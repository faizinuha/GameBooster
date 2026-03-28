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

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { apps, selectedApps, toggleApp, removeApp } = useApps();
  const { isBoosting, isLoading, stats, startBoost, stopBoost, loadStats } = useBoostContext();
  const [showAddModal, setShowAddModal] = useState(false);
  
  useEffect(() => {
    loadStats();
  }, [loadStats]);
  
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
            <Text style={styles.greeting}>Game Booster</Text>
            <Text style={styles.subtitle}>Optimasi performa maksimal</Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, isBoosting && styles.statusDotActive]} />
            <Text style={styles.statusText}>
              {isBoosting ? 'Aktif' : 'Standby'}
            </Text>
          </View>
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
});
