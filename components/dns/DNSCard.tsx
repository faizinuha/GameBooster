import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DNSServer } from '../../types';
import { theme } from '../../constants/theme';
import { getLatencyRating } from '../../services/dnsService';

interface DNSCardProps {
  server: DNSServer;
  isRecommended?: boolean;
  onPress: () => void;
}

export const DNSCard = ({ server, isRecommended, onPress }: DNSCardProps) => {
  const rating = server.latency ? getLatencyRating(server.latency) : null;
  
  const getStatusIcon = () => {
    switch (server.status) {
      case 'testing':
        return <MaterialIcons name="hourglass-empty" size={20} color={theme.colors.warning} />;
      case 'success':
        return <MaterialIcons name="check-circle" size={20} color={theme.colors.success} />;
      case 'failed':
        return <MaterialIcons name="error" size={20} color={theme.colors.danger} />;
      default:
        return <MaterialIcons name="dns" size={20} color={theme.colors.textMuted} />;
    }
  };
  
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        isRecommended && styles.recommended,
        pressed && styles.pressed,
      ]}
    >
      {isRecommended && (
        <View style={styles.badge}>
          <MaterialIcons name="star" size={14} color={theme.colors.warning} />
          <Text style={styles.badgeText}>TERBAIK</Text>
        </View>
      )}
      
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="dns" size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.name}>{server.name}</Text>
          <Text style={styles.provider}>{server.provider}</Text>
        </View>
        <View style={styles.statusIcon}>
          {getStatusIcon()}
        </View>
      </View>
      
      <Text style={styles.description}>{server.description}</Text>
      
      <View style={styles.dnsInfo}>
        <View style={styles.dnsRow}>
          <Text style={styles.label}>Primary:</Text>
          <Text style={styles.value}>{server.primary}</Text>
        </View>
        <View style={styles.dnsRow}>
          <Text style={styles.label}>Secondary:</Text>
          <Text style={styles.value}>{server.secondary}</Text>
        </View>
      </View>
      
      {server.latency !== undefined && server.status === 'success' && rating && (
        <View style={styles.latency}>
          <View style={[styles.latencyDot, { backgroundColor: rating.color }]} />
          <Text style={styles.latencyText}>
            {server.latency}ms • {rating.label}
          </Text>
        </View>
      )}
      
      {server.status === 'testing' && (
        <View style={styles.testing}>
          <MaterialIcons name="sync" size={16} color={theme.colors.warning} />
          <Text style={styles.testingText}>Sedang testing...</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  recommended: {
    borderColor: theme.colors.warning,
    borderWidth: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: 12,
    backgroundColor: theme.colors.warning,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    zIndex: 1,
  },
  badgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  provider: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  statusIcon: {
    marginLeft: theme.spacing.sm,
  },
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  dnsInfo: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  dnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  value: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    fontFamily: 'monospace',
  },
  latency: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  latencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  latencyText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  testing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  testingText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.warning,
    fontStyle: 'italic',
  },
});
