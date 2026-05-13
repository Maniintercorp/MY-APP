import axios from 'axios';

export const AuthService = {
  register: async ({ username, email, password }: { username: string; email: string; password: string }) => {
    const response = await axios.post('/api/users/register', { username, email, password });
    return response.data;
  },

  login: async ({ email, password }: { email: string; password: string }) => {
    const response = await axios.post('/api/users/login', { email, password });
    return response.data;
  },

  fetchUserProfile: async () => {
    const response = await axios.get('/api/users/profile');
    return response.data;
  },

  updateProfile: async ({ userId, username, email, password }: { userId: string; username: string; email: string; password?: string }) => {
    const response = await axios.put('/api/users/profile', { userId, username, email, password });
    return response.data;
  }
};