import { colors } from '@/styles/colors';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button } from '../Button';
import { Typography } from '../Typography';

interface PageHeaderProps {
  title?: string;
  cancelText?: string;
  actionText?: string;
  isActionButtonDisabled?: boolean;
  isActionButtonLoading?: boolean;

  isCancelButtonDisabled?: boolean;
  onAction?: () => void;
  onCancel?: () => void;
}

export const PageHeader = ({
  cancelText,
  actionText = 'Salvar',
  title,
  onAction,
  onCancel,
  isCancelButtonDisabled,
  isActionButtonDisabled,
  isActionButtonLoading,
}: PageHeaderProps) => {
  return (
    <View style={styles.header}>
      <Button
        variant="ghost"
        onPress={() => (onCancel ? onCancel() : router.back())}
        disabled={isCancelButtonDisabled}
        title={cancelText}>
        {!cancelText && <ChevronLeft color={colors.primary} />}
      </Button>
      {title && <Typography variant="body/lg">{title}</Typography>}
      <Button
        title={!isActionButtonLoading ? actionText : undefined}
        variant="ghost"
        onPress={onAction}
        disabled={isActionButtonDisabled}>
        {isActionButtonLoading && <ActivityIndicator color={colors.primary} />}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
