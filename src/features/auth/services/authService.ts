import axios from 'axios';
import { LoginRequest, LoginResponse } from '../types';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>('/api/auth/login', data);
  return response.data;
};
