import LottieView from 'lottie-react-native';
import { theme } from '../styles/theme';

interface LoadingProps {
  size?: keyof typeof theme.sizes.loading;
}

export function Loading({ size = 'lg' }: LoadingProps) {
  return (
    <LottieView
      autoPlay
      loop={true}
      style={theme.sizes.loading[size]}
      source={require('../../assets/animations/loading.json')}
    />
  );
}
