import LottieView from 'lottie-react-native';

const sizes = {
  lg: {
    width: 200,
    height: 200,
  },
  md: {
    width: 100,
    height: 100,
  },
  sm: {
    width: 50,
    height: 50,
  },
};

interface LoadingProps {
  size?: keyof typeof sizes;
}

export function Loading({ size = 'lg' }: LoadingProps) {
  return (
    <LottieView
      autoPlay
      loop={true}
      style={sizes[size]}
      source={require('../../assets/animations/loading.json')}
    />
  );
}
