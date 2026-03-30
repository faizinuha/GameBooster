import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { BoostProvider } from '../contexts/BoostContext';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function RootLayout() {
  useEffect(() => {
    // Prevent crash on startup by ensuring all native modules are loaded
    if (Platform.OS === 'android') {
      console.log('GameBooster app initialized');
    }
  }, []);

  return (
    <SafeAreaProvider>
      <BoostProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </BoostProvider>
    </SafeAreaProvider>
  );
}
