import api from '@/lib/api';

export const loginUser = (data: LoginRequest) => api.post<LoginResponse>('/api/auth/login', data).then((response) => response.data);

export const registerUser = (data: RegisterRequest) => api.post<RegisterResponse>('/api/auth/register', data).then((response) => response.data);