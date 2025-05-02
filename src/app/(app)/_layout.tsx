import { Loading } from '@/components/Loading';
import { useBoundStore } from '@/store';
import { router, Stack } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import { AppState, View } from 'react-native';
import { migrateDbIfNeeded } from '@/database';
import * as LocalAuthentication from 'expo-local-authentication';
import { theme } from '@/styles/theme';

export default function AppLayout() {
  const appState = useRef(AppState.currentState);
  const { verifyIfHaveAuthHash } = useBoundStore(
    useShallow((state) => ({
      verifyIfHaveAuthHash: state.verifyIfHaveAuthHash,
    })),
  );

  useLayoutEffect(() => {
    (async () => {
      const haveHash = await verifyIfHaveAuthHash();
      if (!haveHash) {
        router.replace('/sign-in');
      } else {
      }
    })();
  }, []);

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
          <View>
            <Loading />
          </View>
        }>
        <SQLiteProvider databaseName="my-expenses.db" useSuspense onInit={migrateDbIfNeeded}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="transactions/[id]" options={{ presentation: 'modal' }} />
            <Stack.Screen name="transactions/create" />
            <Stack.Screen name="transactions/update/[id]" />
          </Stack>
        </SQLiteProvider>
      </Suspense>
    </View>
  );
}
