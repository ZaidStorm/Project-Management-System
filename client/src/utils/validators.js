export const validateEmail = (email) => {
  if (!email) return true; // optional
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isNonEmptyString = (str) => {
  return typeof str === 'string' && str.trim().length > 0;
};

export const isPositiveNumber = (num) => {
  return !isNaN(num) && Number(num) >= 0;
};
