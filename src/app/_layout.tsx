import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from '@expo-google-fonts/inter';
import * as ExpoDevice from 'expo-device';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useSyncQueriesExternal } from 'react-query-external-sync';

import NetInfo from '@react-native-community/netinfo';
import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import type { AppStateStatus } from 'react-native';
import { AppState, Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Host } from 'react-native-portalize';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

import { useAuth } from '@/hooks/features/useAuth';
import { Stack } from 'expo-router';
import pkgConfig from '../../package.json';
// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 24,
    },
  },
});

const Auth = () => {
  const { session } = useAuth(true);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-up" />
      </Stack.Protected>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="private" />
      </Stack.Protected>
      <Stack.Screen name="index" />
    </Stack>
  );
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  useSyncQueriesExternal({
    queryClient,
    socketURL: 'http://localhost:42831',
    deviceName: Platform?.OS || 'web',
    platform: Platform?.OS || 'web',
    deviceId: Platform?.OS || 'web',
    isDevice: ExpoDevice.isDevice,
    extraDeviceInfo: {
      appVersion: pkgConfig.version,
    },
    enableLogs: true,
    envVariables: {
      NODE_ENV: process.env.NODE_ENV,
    },
  });

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <Host>
          <Auth />
        </Host>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});
