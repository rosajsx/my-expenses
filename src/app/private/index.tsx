import { Container } from '@/components/Container';
import { router } from 'expo-router';
import { useLayoutEffect } from 'react';

export default function Index() {
  //const logout = useBoundStore((state) => state.logout);

  useLayoutEffect(() => {
    router.replace('/private/(tabs)/transactions');
  }, []);
  return <Container></Container>;
}
