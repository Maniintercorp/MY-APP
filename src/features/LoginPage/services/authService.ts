import axios from 'axios';
import { LoginRequest, LoginResponse } from '../types';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>('/api/auth/login', credentials);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data;
};
