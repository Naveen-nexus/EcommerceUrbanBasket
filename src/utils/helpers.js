/**
 * Utility / helper functions used throughout the application.
 */

/** Format a number as USD currency */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

/** Calculate discount percentage between original and current price */
export const getDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

/** Render star rating as an array of 'full', 'half', 'empty' */
export const getStarArray = (rating) => {
  const stars = [];
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  for (let i = 0; i < full; i++) stars.push('full');
  if (hasHalf) stars.push('half');
  while (stars.length < 5) stars.push('empty');
  return stars;
};

/** Truncate text to a max length with ellipsis */
export const truncate = (text, maxLength = 80) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
};

/** Simulate async delay (for loading states) */
export const sleep = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));
