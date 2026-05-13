import { useMutation } from '@tanstack/react-query';
import { AuthService } from '../services/AuthService';
import { useAuth } from './useAuth';

export const useLoginUser = () => {
  const { saveToken } = useAuth();

  return useMutation(
    (credentials: { email: string; password: string }) => AuthService.login(credentials),
    {
      onSuccess: (data) => {
        saveToken(data.token);
      },
    }
  );
};