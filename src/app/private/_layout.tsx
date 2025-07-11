import { colors } from '@/styles/colors';
import * as LocalAuthentication from 'expo-local-authentication';
import { Stack, usePathname } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState, View } from 'react-native';

export default function AppLayout() {
  const appState = useRef(AppState.currentState);
  const path = usePathname();

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

  return (
    <View style={{ backgroundColor: colors.backgroundWhite, width: '100%', height: '100%' }}>
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
    </View>
  );
}
