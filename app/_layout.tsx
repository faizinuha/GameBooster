import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { BoostProvider } from '../contexts/BoostContext';

export default function RootLayout() {
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
