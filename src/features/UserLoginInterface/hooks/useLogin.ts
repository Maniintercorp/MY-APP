import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../services/authService';
import { LoginForm, LoginResponse } from '../types';

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginForm>(loginUser, {
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
    },
  });
};
