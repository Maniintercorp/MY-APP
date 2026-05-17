import api from '@/lib/api';
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
} from '@/features/LoginPageRedesign/types';

export const loginUser = (data: LoginRequest) =>
  api.post<LoginResponse>('/api/auth/login', data).then((response) => response.data);

export const requestPasswordReset = (data: ForgotPasswordRequest) =>
  api.post<ForgotPasswordResponse>('/api/auth/forgot-password', data).then((response) => response.data);
