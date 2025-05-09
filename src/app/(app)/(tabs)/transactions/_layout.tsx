import { Stack } from 'expo-router';

export default function TransactionsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" options={{ presentation: 'transparentModal', animation: 'fade' }} />
      <Stack.Screen name="create" />
      <Stack.Screen name="update/[id]" />
    </Stack>
  );
}
