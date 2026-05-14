import axios from 'axios';
import { LoginRequest, LoginResponse } from '../types';

export const login = async (loginData: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>('/api/auth/login', loginData);
  return response.data;
};
