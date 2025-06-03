import { useFocusEffect, useNavigation } from 'expo-router';
import { useCallback } from 'react';
import { styles } from '../app/private/(tabs)/_layout';
export const useHideTabBar = () => {
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      navigation?.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });

      return () => {
        navigation?.getParent()?.setOptions({
          tabBarStyle: [styles.tabBarStyle, { display: 'flex' }],
        });
      };
    }, []),
  );
};
