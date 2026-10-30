export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return 'PKR 0';
  const num = Number(amount);
  return `PKR ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num)}`;
};

export const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};
