import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser, requestPasswordReset } from '@/features/LoginPageRedesign/services';
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
} from '@/features/LoginPageRedesign/types';

const persistAuthSession = (data: LoginResponse, rememberMe: boolean) => {
  if (typeof window === 'undefined') return;

  window.localStorage.removeItem('accessToken');
  window.localStorage.removeItem('refreshToken');
  window.localStorage.removeItem('expiresAt');
  window.sessionStorage.removeItem('accessToken');
  window.sessionStorage.removeItem('refreshToken');
  window.sessionStorage.removeItem('expiresAt');

  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  storage.setItem('accessToken', data.accessToken);
  storage.setItem('refreshToken', data.refreshToken);
  storage.setItem('expiresAt', data.expiresAt);
  window.localStorage.setItem('rememberMe', String(rememberMe));
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: loginUser,
    onSuccess: (data, variables) => {
      persistAuthSession(data, variables.rememberMe);
      queryClient.setQueryData(['auth', 'user'], data.user);
      queryClient.setQueryData(['auth', 'session'], data);
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation<ForgotPasswordResponse, unknown, ForgotPasswordRequest>({
    mutationFn: requestPasswordReset,
  });
};
