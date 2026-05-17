import api from '@/lib/api';
import { LoginRequest, LoginResponse } from '../types';

export const loginUser = (data: LoginRequest) =>
  api.post<LoginResponse>('/api/auth/login', data).then((response) => response.data);
