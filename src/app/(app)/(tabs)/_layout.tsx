import { Typography } from '@/components/Typography';
import { theme } from '@/styles/theme';
import { Tabs } from 'expo-router';
import { HandCoins, Wallet } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            paddingTop: theme.spacing.sm,
          },
        }}>
        <Tabs.Screen
          name="transactions"
          options={{
            tabBarIcon: ({ color }) => <Wallet color={color} />,
            tabBarLabel: ({ focused }) => {
              return (
                <Typography variant="label" color={focused ? 'primary' : 'textSecondary'}>
                  Transações
                </Typography>
              );
            },
          }}
        />
        <Tabs.Screen
          name="balances"
          options={{
            tabBarIcon: ({ color }) => <HandCoins color={color} />,
            tabBarLabel: ({ focused }) => {
              return (
                <Typography variant="label" color={focused ? 'primary' : 'textSecondary'}>
                  Saldos
                </Typography>
              );
            },
          }}
        />
      </Tabs>
    </>
  );
}
