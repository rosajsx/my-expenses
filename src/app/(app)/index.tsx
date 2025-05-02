import { Container } from '@/components/Container';
import { router } from 'expo-router';
import { useLayoutEffect } from 'react';

export default function Index() {
  useLayoutEffect(() => {
    router.replace('/(app)/(tabs)/transactions');
  }, []);
  return <Container></Container>;
}
