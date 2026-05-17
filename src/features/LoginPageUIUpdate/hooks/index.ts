import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser } from '../services';
import { LoginRequest, LoginResponse } from '../types';

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
    },
  });
};
