import { Loading } from '@/components/Loading';
import { View } from 'react-native';

export default function NotFound() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Loading />
    </View>
  );
}
