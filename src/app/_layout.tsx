import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from '@expo-google-fonts/inter';
import * as ExpoDevice from 'expo-device';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useSyncQueriesExternal } from 'react-query-external-sync';

import { supabase } from '@/services/supabase';
import { useAuth } from '@/store/auth/auth.hook';
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

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  const { session, setSession } = useAuth();

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
    enableLogs: false,
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
      supabase.auth.getSession().then(({ data }) => {
        setSession(data.session);
        if (!data.session) {
          console.log('User is not logged in, navigating to sign-in');
          router.replace('/sign-in');
        } else {
          console.log('User is logged in, navigating to transactions 1');
          router.replace('/private');
        }
      });
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (session) {
          console.log('User is logged in, navigating to transactions 2');
          router.replace('/sign-in');
        } else {
          console.log('User is logged in, navigating to transactions 2');
          router.replace('/private');
        }
      });
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
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
            }}>
            <Stack.Protected guard={!session}>
              <Stack.Screen name="sign-in" />
            </Stack.Protected>
            <Stack.Protected guard={!!session}>
              <Stack.Screen name="private" />
            </Stack.Protected>
          </Stack>
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
