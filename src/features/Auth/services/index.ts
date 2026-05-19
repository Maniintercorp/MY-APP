import api from '@/lib/api';
import { AuthResponse, LoginDto, RegisterDto } from '@/features/Auth/types';

export const login = async (dto: LoginDto): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/login', dto);
  return response.data;
};

export const register = async (dto: RegisterDto): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/register', dto);
  return response.data;
};
