import { ScreenStateEnum } from '@/enums/screenStates';
import { theme } from '@/styles/theme';
import LottieView from 'lottie-react-native';
import { StyleSheet, View } from 'react-native';
import { Button } from '../Button';
import { Loading } from '../Loading';
import { Typography } from '../Typography';

interface EmptyComponentProps {
  transactionsState: keyof typeof ScreenStateEnum;
  handleGetTransactions: () => void;
}

export const EmptyComponent = ({
  transactionsState,
  handleGetTransactions,
}: EmptyComponentProps) => {
  return (
    <>
      {transactionsState === ScreenStateEnum.LOADING && (
        <View style={styles.emptyLoading}>
          <Loading />
        </View>
      )}

      {transactionsState === ScreenStateEnum.ERROR && (
        <View style={styles.error}>
          <LottieView
            autoPlay
            style={theme.sizes.errorTransation}
            source={{
              uri: 'error-animation',
            }}
            loop={false}
          />
          <Typography variant="section" style={styles.errorText}>
            Ocorreu um erro inesperado, por favor, tente novamente.
          </Typography>

          <Button title="Recarregar" onPress={handleGetTransactions} />
        </View>
      )}

      {transactionsState === ScreenStateEnum.DEFAULT && (
        <View style={styles.empty}>
          <LottieView
            autoPlay
            style={theme.sizes.emptyTransaction}
            source={require('../../../assets/animations/empty.json')}
            loop={false}
          />
          <Typography variant="section">Nenhuma despesa encontrada.</Typography>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  emptyLoading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    textAlign: 'center',
  },
  error: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
});
