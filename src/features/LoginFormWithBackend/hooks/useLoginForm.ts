import { useState } from 'react';
import { useMutation } from 'react-query';
import { login } from '../services/authService';
import { LoginFormType } from '../types';

export const useForm = () => {
  const [form, setForm] = useState<LoginFormType>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<LoginFormType>>({});

  const mutation = useMutation(login, {
    onSuccess: (data) => {
      console.log('Login successful:', data);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const validate = (): boolean => {
    const currentErrors: Partial<LoginFormType> = {};
    if (!form.email) currentErrors.email = 'Email is required';
    if (!form.password) currentErrors.password = 'Password is required';
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      mutation.mutate(form);
    }
  };

  return { form, errors, handleChange, handleSubmit };
};
