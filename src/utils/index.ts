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
  console.log(date);
  console.log(new Date(date).getMonth());
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  };

  return new Date(date).toLocaleDateString('pt-BR', options || defaultOptions);
}

export function getAllMonthsOfYear() {
  const format = new Intl.DateTimeFormat('pt-BR', { month: 'long' });
  const months = [];
  const year = new Date().getFullYear();

  for (let i = 0; i < 12; i++) {
    months.push({
      id: i,
      value: format.format(new Date(year, i)),
    });
  }

  return months;
}

export function getLast5Years() {
  const format = new Intl.DateTimeFormat('pt-BR', { year: 'numeric' });
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let i = 5; i > 0; i--) {
    years.push(currentYear - i);
  }

  years.push(currentYear);

  return years.reverse();
}

export function formatDateForSQLite(date = new Date()) {
  const pad = (n) => n.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // meses são 0-indexados
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
