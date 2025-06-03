import { colors } from '@/styles/colors';
import { Pressable, StyleSheet, View } from 'react-native';
import { Typography } from '../Typography';

interface InputSwitchProps {
  value: string | number;
  options: {
    value: string | number;
    label: string;
  }[];
  onChange: (value: string | number) => void;
}

export const InputSwitch = ({ onChange, options, value }: InputSwitchProps) => {
  return (
    <View style={styles.inputTypeContainer}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          style={[styles.inputTypeItem, value === option.value && styles.inputTypeItemSelected]}
          onPress={() => onChange(option.value)}>
          <Typography variant="body/md-500" color={value === option.value ? 'white' : 'text'}>
            {option.label}
          </Typography>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  inputTypeContainer: {
    flexDirection: 'row',
  },
  inputTypeItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },

  inputTypeItemSelected: {
    backgroundColor: colors.primary,
  },
});
