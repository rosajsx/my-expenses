import { Loading } from '@/components/Loading';
import { migrateDbIfNeeded } from '@/database';
import { theme } from '@/styles/theme';
import * as LocalAuthentication from 'expo-local-authentication';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense, useEffect, useRef } from 'react';
import { AppState, View } from 'react-native';

export default function AppLayout() {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        await LocalAuthentication.authenticateAsync();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  //Storage.clear();

  return (
    <View style={{ backgroundColor: theme.colors.background, width: '100%', height: '100%' }}>
      <Suspense
        fallback={
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Loading />
          </View>
        }>
        <SQLiteProvider databaseName="my-expenses.db" useSuspense onInit={migrateDbIfNeeded}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="(tabs)"
              options={{
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="user"
              options={{ presentation: 'transparentModal', animation: 'fade' }}
            />
          </Stack>
        </SQLiteProvider>
      </Suspense>
    </View>
  );
}
