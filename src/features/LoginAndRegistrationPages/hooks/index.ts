import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser, registerUser } from '../services';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types';

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.userId);
    },
  });
};

export const useRegister = () => {
  return useMutation<RegisterResponse, unknown, RegisterRequest>({
    mutationFn: registerUser,
  });
};