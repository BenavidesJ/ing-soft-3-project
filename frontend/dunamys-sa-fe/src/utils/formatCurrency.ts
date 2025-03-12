export const formatCurrency = (value: any) => {
  if (value === null || value === undefined || value === '') return '';
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 2,
  }).format(Number(value));
};
