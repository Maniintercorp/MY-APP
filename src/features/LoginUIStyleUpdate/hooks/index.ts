import { useMutation } from '@tanstack/react-query';
import { login } from '../services';
import { LoginRequest, LoginResponse } from '../types';

export const useLogin = () => {
  return useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: login,
  });
};
