import { Container } from '@/components/Container';
import { Typography } from '@/components/Typography';
import { theme } from '@/styles/theme';
import { Tabs } from 'expo-router';
import { HandCoins } from 'lucide-react-native';
import { SafeAreaView, View } from 'react-native';

export default function TabsLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          popToTopOnBlur: true,
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            paddingTop: theme.spacing.sm,
            display: 'none',
          },
        }}>
        <Tabs.Screen
          name="transactions"
          options={{
            tabBarIcon: ({ color }) => <HandCoins color={color} />,
            tabBarLabel: ({ focused }) => {
              return (
                <Typography variant="label" color={focused ? 'primary' : 'textSecondary'}>
                  Transações
                </Typography>
              );
            },
          }}
        />
      </Tabs>
    </>
  );
}
