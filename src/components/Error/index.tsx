import LottieView from 'lottie-react-native';
import { StyleSheet, View } from 'react-native';
import { Button } from '../Button';
import { Typography } from '../Typography';

interface ErrorProps {
  message?: string;
  onTryAgain?: () => void;
}

export const Error = ({
  message = 'Ocorreu um erro inesperado! Por favor tente novamente.',
  onTryAgain,
}: ErrorProps) => {
  return (
    <View style={styles.center}>
      <LottieView
        autoPlay
        loop={false}
        style={styles.icon}
        source={require('../../../assets/animations/error.json')}
      />
      <Typography variant="heading/md" color="text" align="center">
        {message}
      </Typography>

      {onTryAgain && <Button title="Tentar novamente" />}
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: {
    width: 200,
    height: 200,
  },
});
