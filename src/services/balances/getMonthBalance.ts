import { supabase } from '../supabase';

export const getMonthBalance = async (
  user_id: string,
  currentMonth: number,
  currentYear: number,
) => {
  const response = await supabase
    .from('transactions')
    .select('amount, type')
    .eq('user_id', user_id)
    .gte('date', `${currentYear}-${currentMonth}-01`)
    .lt('date', `${currentYear}-${currentMonth + 1}-01`);

  const data = response.data?.reduce(
    (acc, item) => {
      if (item.type === 1) {
        acc.income += item.amount;
      } else {
        acc.outcome += item.amount;
      }

      return acc;
    },
    { income: 0, outcome: 0 },
  );

  return data?.income! - data?.outcome! || 0;
};
