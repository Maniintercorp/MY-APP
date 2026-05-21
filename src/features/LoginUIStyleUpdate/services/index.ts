import api from '@/lib/api';
import { LoginRequest, LoginResponse } from '../types';

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/api/auth/login', request);
  return response.data;
}
