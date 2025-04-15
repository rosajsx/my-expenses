export function formatCurrency(valueInCents: number) {
  const value = (valueInCents / 100).toFixed(2);
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value));
}

export function parseCurrencyToCents(value: string) {
  const numeric = value.replace(/\D/g, '');

  const limited = numeric.slice(0, 12);

  const cents = parseInt(limited || '0', 10);

  return cents;
}

export function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: '2-digit',
    year: '2-digit',
  };

  return new Date(date).toLocaleDateString('pt-BR', options || defaultOptions);
}
