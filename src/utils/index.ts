export function formatCurrency(valueInCents: number) {
  const value = valueInCents / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: '2-digit',
    year: '2-digit',
  };

  return new Date(date).toLocaleDateString('pt-BR', options || defaultOptions);
}
