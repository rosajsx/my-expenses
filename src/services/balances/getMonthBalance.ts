import { getAllMonthsOfYear } from '@/utils';
import { supabase } from '../supabase';

type Balance =
  | {
      amount: number;
      type: number;
      created_at: string;
    }[]
  | null;

const calcBalance = (data: Balance, currentYear?: number) => {
  return data?.reduce(
    (acc, item) => {
      const date = new Date(item.created_at);
      const year = date.getFullYear();

      if (currentYear && currentYear < year) {
        return acc;
      }

      if (item.type === 1) {
        acc.income += item.amount;
        acc.total += item.amount;
      } else {
        acc.outcome += item.amount;
        acc.total -= item.amount;
      }

      return acc;
    },
    { income: 0, outcome: 0, total: 0 },
  );
};

export const getMonthBalance = async (
  user_id: string,
  currentMonth: number,
  currentYear: number,
) => {
  const response = await supabase
    .from('transactions')
    .select('amount, type, created_at')
    .eq('user_id', user_id)
    .gte('date', `${currentYear}-${currentMonth}-1`)
    .lt('date', `${currentYear}-${currentMonth + 1}-1`);

  const fixedTransactionsResponse = await supabase
    .from('transactions')
    .select('amount, type, created_at')
    .eq('is_fixed', true)
    .eq('user_id', user_id);

  const data = calcBalance(response?.data);
  const fixedBalanceData = calcBalance(fixedTransactionsResponse?.data, currentYear);

  console.log('data', data);
  console.log('fixedBalanceData', fixedBalanceData);

  return {
    total: (data?.total || 0) + (fixedBalanceData?.total || 0),
    income: (data?.income || 0) + (fixedBalanceData?.income || 0),
    outcome: (data?.outcome || 0) + (fixedBalanceData?.outcome || 0),
  };
};

export const getAllMonthBalances = async (user_id: string) => {
  const currentYear = new Date().getFullYear();
  const response = await supabase
    .from('transactions')
    .select('date, type, amount')
    .eq('user_id', user_id)
    .eq('is_fixed', false)
    .throwOnError();

  const months = getAllMonthsOfYear();

  const responseFixed = await supabase
    .from('transactions')
    .select('created_at, amount, type')
    .eq('user_id', user_id)
    .eq('is_fixed', true)
    .throwOnError();

  const fixedTransactions = responseFixed?.data || [];

  const grouped = response?.data?.reduce(
    (acc, item) => {
      const date = new Date(item.date!);
      const year = date.getFullYear();
      const month = months[date.getMonth()]?.value;

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

  fixedTransactions.forEach((fixedItem) => {
    const creationDate = new Date(fixedItem.created_at!);
    const creationYear = creationDate.getFullYear();
    const creationMonthIndex = creationDate.getMonth();
    const fixedValue = fixedItem.type === 1 ? fixedItem.amount : -fixedItem.amount;

    for (let year = creationYear; year <= currentYear + 5; year++) {
      if (!grouped[year]) {
        grouped[year] = {};
      }

      for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
        if (year === creationYear && monthIndex < creationMonthIndex) {
          continue;
        }

        const monthName = months[monthIndex]?.value;
        const monthLabel = months[monthIndex]?.value;

        if (!grouped[year][monthName]) {
          grouped[year][monthName] = { value: 0, label: monthLabel };
        }
        grouped[year][monthName].value += fixedValue;
      }
    }
  });

  const formattedData = Object.entries(grouped)
    .map(([year, monthsData]) => {
      const data = Object.entries(monthsData)
        .map(([monthName, monthValueData]) => ({
          month: monthName,
          value: monthValueData.value,
          label: monthValueData.label,
        }))
        .sort((a, b) => {
          const monthOrder = months.map((m) => m.value);
          return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
        });

      return {
        year: parseInt(year),
        data: data,
      };
    })
    .sort((a, b) => a.year - b.year);
  const total = formattedData.reduce((accYear, yearItem) => {
    return accYear + yearItem.data.reduce((accMonth, monthItem) => accMonth + monthItem.value, 0);
  }, 0);

  return {
    monthData: formattedData,
    total: total || 0,
  };
};
