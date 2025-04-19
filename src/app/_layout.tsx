import { Stack } from 'expo-router';
import { useEffect, Suspense } from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import * as SplashScreen from 'expo-splash-screen';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from '@expo-google-fonts/inter';
import { View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

import { migrateDbIfNeeded } from '../database';
import { Loading } from '../components/Loading';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  useEffect(() => {
    if (loaded || error) {
      LocalAuthentication.authenticateAsync().then((data) => {
        SplashScreen.hideAsync();
      });
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Suspense
      fallback={
        <View>
          <Loading />
        </View>
      }>
      <SQLiteProvider databaseName="my-expenses.db" useSuspense onInit={migrateDbIfNeeded}>
        <GestureHandlerRootView>
          <Stack
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="transactions/create" options={{ presentation: 'modal' }} />
            <Stack.Screen name="transactions/update/[id]" options={{ presentation: 'modal' }} />
          </Stack>
        </GestureHandlerRootView>
      </SQLiteProvider>
    </Suspense>
  );
}
