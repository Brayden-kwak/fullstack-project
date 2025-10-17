import api from './api';

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },
};
