import { useMutation } from '@tanstack/react-query';
import { AuthService } from '../services/AuthService';

export const useRegisterUser = () => {
  return useMutation((userData: { username: string; email: string; password: string }) =>
    AuthService.register(userData)
  );
};