import { colors } from '@/styles/colors';
import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

export default function TabsLayout() {
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
