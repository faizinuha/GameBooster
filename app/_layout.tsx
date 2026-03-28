import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AlertProvider } from '@/template';
import { BoostProvider } from '../contexts/BoostContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <BoostProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </BoostProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
