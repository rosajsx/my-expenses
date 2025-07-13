import { getAllMonthsOfYear } from '@/utils';
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
    .gte('date', `${currentYear}-${currentMonth}-1`)
    .lt('date', `${currentYear}-${currentMonth + 1}-1`);

  console.log(response);

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

  return {
    total: data?.income! - data?.outcome! || 0,
    income: data?.income || 0,
    outcome: data?.outcome || 0,
  };
};

export const getAllMonthBalances = async (user_id: string) => {
  const response = await supabase
    .from('transactions')
    .select('date, amount, type')
    .eq('user_id', user_id)
    .throwOnError();

  const months = getAllMonthsOfYear();

  const grouped = response?.data?.reduce(
    (acc, item) => {
      const date = new Date(item.date);
      const year = date.getFullYear();
      const month = months[date.getMonth()]?.value;
      const value = item.type === 1 ? item.amount : -item.amount;

      if (!acc[year]) {
        acc[year] = {
          [month]: {
            value: item.type === 1 ? item.amount : -item.amount,
            label: month,
          },
        };
      } else {
        if (!acc[year][month]) {
          acc[year] = {
            ...acc[year],
            [month]: {
              value: item.type === 1 ? item.amount : -item.amount,
              label: month,
            },
          };
        } else {
          const value = item.type === 1 ? item.amount : -item.amount;
          const currentValue = acc[year][month]?.value || 0;
          acc[year][month].value = currentValue + value;
        }
      }

      return acc;
    },
    {} as {
      [key: number]: {
        [key: string]: {
          value: number;
          label: string;
        };
      };
    },
  );

  const formattedData = Object.entries(grouped).map(([year, months]) => {
    return {
      year: parseInt(year),

      data: Object.entries(months).map(([month, data]) => ({
        month,
        value: data.value,
        label: data.label,
      })),
    };
  });

  const total = response?.data?.reduce((acc, item) => {
    const value = item.type === 1 ? item.amount : -item.amount;

    acc += value;

    return acc;
  }, 0);

  return {
    monthData: formattedData,
    total,
  };
};
