import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from '@expo-google-fonts/inter';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { supabase } from '@/services/supabase';
import { useBoundStore } from '@/store';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Host } from 'react-native-portalize';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
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

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  const setSession = useBoundStore((state) => state.setSession);
  const session = useBoundStore((state) => state.session);

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
