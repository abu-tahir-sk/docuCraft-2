/**
 * ============================================================================
 * DocuCraft Utility Functions
 * ============================================================================
 */

/**
 * 1. Number to Words Converter (Indian Numbering System)
 * Converts numbers into words (Lakh, Crore) for Invoice/Quotation Grand Totals.
 * * @param {number} num - The number to convert
 * @returns {string} - The amount in words
 */
export const numberToWords = (num) => {
  if (num === 0 || isNaN(num)) return 'Zero Only';
  
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  // Format number to 9 digits with leading zeros
  const n = ('000000000' + Math.floor(num)).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  
  if (!n) return '';
  
  let str = '';
  str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  
  return str.trim() + ' Only';
};

/**
 * 2. Date Formatter
 * Formats a date string into various formats based on user preference.
 * * @param {string} dateString - Valid date string or Date object
 * @param {string} formatType - "DD/MM/YYYY", "MM/DD/YYYY", or "YYYY-MM-DD"
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, formatType = 'DD/MM/YYYY') => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  switch (formatType) {
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'DD/MM/YYYY':
    default:
      return `${day}/${month}/${year}`;
  }
};

/**
 * 3. Currency Formatter
 * Adds commas to numbers based on the Indian numbering system or standard format.
 * * @param {number} amount - The amount to format
 * @param {string} currencyCode - e.g., 'INR', 'USD'
 * @returns {string} - Formatted string (e.g., 1,00,000.00)
 */
export const formatCurrency = (amount, currencyCode = 'INR') => {
  if (isNaN(amount)) return '0.00';
  
  if (currencyCode === 'INR') {
    return Number(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } else {
    return Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
};

/**
 * 4. Document Status Color Mapper
 * Returns Tailwind CSS color classes for styling status badges.
 * * @param {string} status - Document status (Draft, Paid, Overdue, etc.)
 * @returns {string} - Tailwind CSS class names
 */
export const getStatusBadgeColor = (status) => {
  const normalizedStatus = status?.toLowerCase();
  
  switch (normalizedStatus) {
    case 'paid':
    case 'accepted':
    case 'approved':
      return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      
    case 'unpaid':
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      
    case 'overdue':
    case 'rejected':
    case 'cancelled':
    case 'expired':
      return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      
    case 'signed':
      return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
      
    case 'draft':
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
  }
};

/**
 * 5. Calculate Taxes & Totals (Helper for Dashboard/Listings)
 * Computes subtotal and total taxes for a given array of items.
 * * @param {Array} items - Array of item objects { qty, price, taxRate }
 * @returns {Object} - { subtotal, totalTax, grossTotal }
 */
export const calculateTotals = (items = []) => {
  let subtotal = 0;
  let totalTax = 0;

  items.forEach(item => {
    const itemTotal = (Number(item.qty) || 0) * (Number(item.price) || 0);
    const itemTax = itemTotal * ((Number(item.taxRate) || 0) / 100);
    
    subtotal += itemTotal;
    totalTax += itemTax;
  });

  return {
    subtotal,
    totalTax,
    grossTotal: subtotal + totalTax
  };
};