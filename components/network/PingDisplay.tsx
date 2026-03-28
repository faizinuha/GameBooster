import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

export const PingDisplay = () => {
  const [ping, setPing] = useState<number | null>(null);
  const [status, setStatus] = useState<'good' | 'average' | 'poor'>('good');
  const timerRef = useRef<any>(null);

  const checkPing = async () => {
    try {
      const start = Date.now();
      // Melakukan fetch ringan ke endpoint publik yang reliable
      const response = await fetch('https://www.google.com/generate_204', {
        method: 'HEAD',
        cache: 'no-store',
      });
      
      const end = Date.now();
      const latency = end - start;
      
      setPing(latency);
      
      if (latency < 100) setStatus('good');
      else if (latency < 250) setStatus('average');
      else setStatus('poor');
      
    } catch (error) {
      setPing(null);
    }
  };

  useEffect(() => {
    checkPing();
    timerRef.current = setInterval(checkPing, 3000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'good': return theme.colors.success;
      case 'average': return theme.colors.warning;
      case 'poor': return theme.colors.danger;
      default: return theme.colors.textMuted;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'good': return 'Lancar';
      case 'average': return 'Stabil';
      case 'poor': return 'Lag';
      default: return 'Checking...';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pingRow}>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
        <MaterialIcons name="speed" size={16} color={theme.colors.textSecondary} />
        <Text style={styles.pingText}>
          {ping !== null ? `${ping} ms` : '-- ms'}
        </Text>
      </View>
      <Text style={[styles.statusLabel, { color: getStatusColor() }]}>
        {getStatusLabel()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 140,
  },
  pingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pingText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
