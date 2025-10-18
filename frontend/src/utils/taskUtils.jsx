import { CheckCircle, Clock, Hourglass } from 'lucide-react';

/**
 * Get status icon component
 * @param {string} status - Task status
 * @param {number} size - Icon size
 * @returns {JSX.Element} Status icon component
 */
export const getStatusIcon = (status, size = 16) => {
  switch (status) {
    case 'completed':
      return <CheckCircle size={size} color="#16a34a" />;
    case 'in_progress':
      return <Hourglass size={size} color="#1e40af" />;
    case 'pending':
    default:
      return <Clock size={size} color="#6b7280" />;
  }
};

/**
 * Get status text
 * @param {string} status - Task status
 * @returns {string} Formatted status text
 */
export const getStatusText = (status) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'in_progress':
      return 'In Progress';
    case 'pending':
    default:
      return 'Pending';
  }
};

/**
 * Get status options for dropdowns
 * @returns {Array} Array of status options
 */
export const getStatusOptions = () => [
  { value: 'pending', label: 'Pending', icon: 'pending' },
  { value: 'in_progress', label: 'In Progress', icon: 'in_progress' },
  { value: 'completed', label: 'Completed', icon: 'completed' },
];

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatTaskDate = (date) => {
  return new Date(date).toLocaleDateString();
};

/**
 * Generate unique temporary ID for optimistic updates
 * @returns {string} Unique temporary ID
 */
export const generateTempId = () => {
  return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
