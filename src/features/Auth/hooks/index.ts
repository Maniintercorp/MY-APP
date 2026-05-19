import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login, register } from '@/features/Auth/services';
import { AuthResponse, LoginDto, RegisterDto } from '@/features/Auth/types';

const storeAuth = (auth: AuthResponse) => {
  localStorage.setItem('token', auth.token);
  localStorage.setItem('user', JSON.stringify(auth.user));
};

export const useLogin = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (dto: LoginDto) => login(dto),
    onSuccess: (data) => {
      storeAuth(data);
      navigate('/dashboard');
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (dto: RegisterDto) => register(dto),
    onSuccess: (data) => {
      storeAuth(data);
      navigate('/dashboard');
    },
  });
};
