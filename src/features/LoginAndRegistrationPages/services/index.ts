import api from '@/lib/api';
import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
} from '../types';

export const register = async (dto: RegisterRequest): Promise<RegisterResponse> => {
  const response = await api.post<{ success: boolean; data: RegisterResponse; message?: string }>('/api/auth/register', dto);
  if (!response.data.success) {
    throw { response: { data: { message: response.data.message || 'Registration failed.' } } };
  }
  return response.data.data;
};

export const login = async (dto: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<{ success: boolean; data: LoginResponse; message?: string }>('/api/auth/login', dto);
  if (!response.data.success) {
    throw { response: { data: { message: response.data.message || 'Login failed.' } } };
  }
  return response.data.data;
};
