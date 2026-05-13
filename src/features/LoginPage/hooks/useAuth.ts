import { useState } from 'react';
import { useMutation } from 'react-query';
import { login as loginService, LoginRequest, LoginResponse } from '../services/authService';

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<LoginResponse, Error, LoginRequest>(loginService, {
    onError: (error) => {
      setError(error.message);
    },
    onSuccess: (data) => {
      setError(null);
      localStorage.setItem('token', data.token);
    },
  });

  const login = (credentials: LoginRequest) => {
    setError(null);
    mutation.mutate(credentials);
  };

  return { login, error, isLoading: mutation.isLoading };
};
