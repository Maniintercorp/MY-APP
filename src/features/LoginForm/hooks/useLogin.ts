import { useMutation } from '@tanstack/react-query';
import { login } from '../services/authService';
import { LoginRequest, LoginResponse } from '../types';

export const useLogin = () => {
  return useMutation<LoginResponse, unknown, LoginRequest>(
    (credentials: LoginRequest) => login(credentials)
  );
};