import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { login } from '../services/authService';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation(login, {
    onSuccess: (data) => {
      // Here you can handle the successful login, e.g., store tokens
      console.log('Login successful', data);
    },
    onError: (error: any) => {
      setError(error?.response?.data?.message || 'An error occurred');
    }
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    mutation.mutate({ email, password });
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    handleSubmit,
    error,
    isLoading: mutation.isLoading
  };
};
