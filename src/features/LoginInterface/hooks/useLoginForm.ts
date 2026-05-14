import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../services/authService';

interface FormValues {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
}

export const useLoginForm = () => {
  const [values, setValues] = useState<FormValues>({ username: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});

  const mutation = useMutation(loginUser, {
    onSuccess: (data) => {
      console.log('Login successful:', data);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!values.username) newErrors.username = 'Username is required';
    if (!values.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate(values);
  };

  return { handleChange, handleSubmit, values, errors };
};
