/**
 * Extract error message from error object
 * @param {Error|Object} error - Error object
 * @returns {string} Error message
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // Handle different error formats
  if (typeof error === 'string') return error;
  
  if (error.message) return error.message;
  
  if (error.response?.data?.message) return error.response.data.message;
  
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    if (typeof errors === 'object') {
      return Object.values(errors).flat().join(', ');
    }
    return errors;
  }
  
  if (error.response?.statusText) return error.response.statusText;
  
  return 'An unknown error occurred';
};

/**
 * Check if error is a network error
 * @param {Error|Object} error - Error object
 * @returns {boolean} True if network error
 */
export const isNetworkError = (error) => {
  return !error.response && error.message?.includes('Network Error');
};

/**
 * Check if error is a validation error
 * @param {Error|Object} error - Error object
 * @returns {boolean} True if validation error
 */
export const isValidationError = (error) => {
  return error.response?.status === 422;
};

/**
 * Check if error is an authentication error
 * @param {Error|Object} error - Error object
 * @returns {boolean} True if authentication error
 */
export const isAuthError = (error) => {
  return error.response?.status === 401;
};
