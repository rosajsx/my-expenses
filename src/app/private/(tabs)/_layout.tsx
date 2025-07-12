import { colors } from '@/styles/colors';
import { Tabs, usePathname } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

export default function TabsLayout() {
  const pathname = usePathname();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: [styles.tabBarStyle],
          tabBarIconStyle: {
            display: 'none',
          },
        }}>
        <Tabs.Screen
          name="transactions"
          options={{
            tabBarLabel: ({ focused }) => {
              return (
                <Text style={[styles.label, focused ? styles.active : styles.inactive]}>
                  Transações
                </Text>
              );
            },
          }}
        />
        <Tabs.Screen
          name="balances"
          options={{
            popToTopOnBlur: true,
            tabBarLabel: ({ focused }) => {
              return (
                <Text style={[styles.label, focused ? styles.active : styles.inactive]}>
                  Saldos
                </Text>
              );
            },
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            tabBarLabel: ({ focused }) => {
              return (
                <Text style={[styles.label, focused ? styles.active : styles.inactive]}>Menu</Text>
              );
            },
          }}
        />
      </Tabs>
    </>
  );
}

export const styles = StyleSheet.create({
  tabBarStyle: {
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 24,
    height: 60,
    backgroundColor: colors.backgroundWhite,

    borderTopWidth: 0,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontWeight: 500,
    fontSize: 12,
  },
  inactive: {
    color: colors.textSecondary,
  },
  active: {
    color: colors.primary,
  },
});
