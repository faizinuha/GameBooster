import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { theme } from '../../constants/theme';
import { commonStyles } from '../../constants/styles';
import { useDNS } from '../../hooks/useDNS';
import { DNSCard } from '../../components/dns/DNSCard';
import { DNSGuideModal } from '../../components/dns/DNSGuideModal';
import { DNSServer } from '../../types';
import { Button } from '../../components/ui/Button';

export default function NetworkScreen() {
  const insets = useSafeAreaInsets();
  const { servers, isTesting, recommended, testAllServers, resetTests } = useDNS();
  const [selectedDNS, setSelectedDNS] = useState<DNSServer | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  
  const handleDNSPress = (dns: DNSServer) => {
    setSelectedDNS(dns);
    setShowGuide(true);
  };
  
  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Network Optimizer</Text>
            <Text style={styles.subtitle}>Optimasi DNS untuk gaming lebih lancar</Text>
          </View>
          <View style={styles.iconContainer}>
            <MaterialIcons name="network-check" size={32} color={theme.colors.primary} />
          </View>
        </View>
        
        {/* Info Card */}
        <View style={styles.infoCard}>
          <MaterialIcons name="info" size={24} color={theme.colors.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Apa itu DNS?</Text>
            <Text style={styles.infoText}>
              DNS (Domain Name System) menerjemahkan nama domain menjadi IP address. 
              DNS yang cepat = koneksi game lebih responsif dan loading lebih cepat.
            </Text>
          </View>
        </View>
        
        {/* Recommendation */}
        {recommended && (
          <View style={styles.recommendation}>
            <View style={styles.recommendationHeader}>
              <MaterialIcons name="emoji-events" size={24} color={theme.colors.warning} />
              <Text style={styles.recommendationTitle}>DNS Tercepat</Text>
            </View>
            <Text style={styles.recommendationText}>
              Berdasarkan test, <Text style={styles.bold}>{recommended.name}</Text> adalah 
              yang tercepat untuk koneksi Anda dengan latency {recommended.latency}ms
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.recommendationButton,
                pressed && styles.pressed,
              ]}
              onPress={() => handleDNSPress(recommended)}
            >
              <Text style={styles.recommendationButtonText}>Gunakan DNS Ini</Text>
              <MaterialIcons name="arrow-forward" size={20} color={theme.colors.text} />
            </Pressable>
          </View>
        )}
        
        {/* Test Controls */}
        <View style={styles.controls}>
          <Button
            title={isTesting ? 'Sedang Testing...' : 'Test Semua DNS'}
            onPress={testAllServers}
            disabled={isTesting}
            icon={isTesting ? 'sync' : 'speed'}
            variant="primary"
            style={styles.testButton}
          />
          
          {servers.some(s => s.latency !== undefined) && !isTesting && (
            <Pressable
              style={({ pressed }) => [
                styles.resetButton,
                pressed && styles.pressed,
              ]}
              onPress={resetTests}
            >
              <MaterialIcons name="refresh" size={20} color={theme.colors.textSecondary} />
            </Pressable>
          )}
        </View>
        
        {/* DNS List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DNS Populer untuk Gaming</Text>
          {servers.map(server => (
            <DNSCard
              key={server.id}
              server={server}
              isRecommended={recommended?.id === server.id}
              onPress={() => handleDNSPress(server)}
            />
          ))}
        </View>
        
        {/* Tips */}
        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>💡 Tips Optimasi Network</Text>
          
          <View style={styles.tip}>
            <MaterialIcons name="check-circle" size={20} color={theme.colors.success} />
            <Text style={styles.tipText}>
              Gunakan WiFi 5GHz untuk latency lebih rendah
            </Text>
          </View>
          
          <View style={styles.tip}>
            <MaterialIcons name="check-circle" size={20} color={theme.colors.success} />
            <Text style={styles.tipText}>
              Restart router setiap minggu untuk performa optimal
            </Text>
          </View>
          
          <View style={styles.tip}>
            <MaterialIcons name="check-circle" size={20} color={theme.colors.success} />
            <Text style={styles.tipText}>
              Tutup aplikasi background yang pakai internet
            </Text>
          </View>
          
          <View style={styles.tip}>
            <MaterialIcons name="check-circle" size={20} color={theme.colors.success} />
            <Text style={styles.tipText}>
              Posisikan device dekat router untuk signal terbaik
            </Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Guide Modal */}
      <DNSGuideModal
        visible={showGuide}
        dns={selectedDNS}
        onClose={() => {
          setShowGuide(false);
          setSelectedDNS(null);
        }}
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
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    gap: theme.spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  recommendation: {
    backgroundColor: theme.colors.warning,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  recommendationTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.background,
  },
  recommendationText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.background,
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
  bold: {
    fontWeight: theme.fontWeight.bold,
  },
  recommendationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  recommendationButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  pressed: {
    opacity: 0.7,
  },
  controls: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  testButton: {
    flex: 1,
  },
  resetButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  tips: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tipsTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});
