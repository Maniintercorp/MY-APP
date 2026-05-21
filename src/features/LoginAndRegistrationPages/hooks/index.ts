import { useMutation } from '@tanstack/react-query';
import { register, login } from '../services';
import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
} from '../types';
import { queryClient } from '@/lib/queryClient';

export function useRegisterMutation(options?: {
  onSuccess?: (data: RegisterResponse) => void;
  onError?: (err: any) => void;
}) {
  return useMutation<RegisterResponse, any, RegisterRequest>({
    mutationFn: register,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useLoginMutation(options?: {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (err: any) => void;
}) {
  return useMutation<LoginResponse, any, LoginRequest>({
    mutationFn: login,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
