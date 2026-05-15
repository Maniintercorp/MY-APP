import api from '@/lib/api';
import { SignupRequest, SigninRequest, SocialAuthRequest, AuthResponse, SigninResponse } from '../types';

export const signup = (data: SignupRequest) => api.post<AuthResponse>('/api/auth/signup', data);

export const signin = (data: SigninRequest) => api.post<SigninResponse>('/api/auth/signin', data);

export const socialAuth = (data: SocialAuthRequest) => api.post<AuthResponse>('/api/auth/social', data);
