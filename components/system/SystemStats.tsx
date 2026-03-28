import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { useSystemMonitor } from '../../hooks/useSystemMonitor';

interface SystemStatsProps {
  enabled?: boolean;
}

export const SystemStats = ({ enabled = true }: SystemStatsProps) => {
  const { stats, isMonitoring } = useSystemMonitor(enabled);
  
  const getRAMColor = (percentage: number) => {
    if (percentage < 60) return theme.colors.success;
    if (percentage < 80) return theme.colors.warning;
    return theme.colors.danger;
  };
  
  const getCPUColor = (percentage: number) => {
    if (percentage < 40) return theme.colors.success;
    if (percentage < 70) return theme.colors.warning;
    return theme.colors.danger;
  };
  
  if (!isMonitoring) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>System Monitor</Text>
      
      <View style={styles.statsGrid}>
        {/* RAM Usage */}
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <MaterialIcons name="memory" size={20} color={getRAMColor(stats.ram.percentage)} />
            <Text style={styles.statLabel}>RAM</Text>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${stats.ram.percentage}%`,
                  backgroundColor: getRAMColor(stats.ram.percentage)
                }
              ]} 
            />
          </View>
          
          <View style={styles.statFooter}>
            <Text style={styles.statValue}>{stats.ram.percentage}%</Text>
            <Text style={styles.statDetail}>
              {stats.ram.used}GB / {stats.ram.total}GB
            </Text>
          </View>
        </View>
        
        {/* CPU Usage */}
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <MaterialIcons name="speed" size={20} color={getCPUColor(stats.cpu)} />
            <Text style={styles.statLabel}>CPU</Text>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${stats.cpu}%`,
                  backgroundColor: getCPUColor(stats.cpu)
                }
              ]} 
            />
          </View>
          
          <View style={styles.statFooter}>
            <Text style={styles.statValue}>{stats.cpu}%</Text>
            <Text style={styles.statDetail}>Usage</Text>
          </View>
        </View>
      </View>
      
      {stats.device && (
        <View style={styles.deviceInfo}>
          <MaterialIcons name="smartphone" size={16} color={theme.colors.textMuted} />
          <Text style={styles.deviceText}>
            {stats.device.brand} {stats.device.modelName} • {stats.device.osName} {stats.device.osVersion}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  statFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  statDetail: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  deviceText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
});
