import axios from 'axios';
import type { LoginRequest, RegisterRequest, RefreshTokenRequest, LoginResponse, RegisterResponse, RefreshTokenResponse } from '../types';

const API_URL = '/api/auth';

export const AuthService = {
  login: (data: LoginRequest) => {
    return axios.post<LoginResponse>(`${API_URL}/login`, data);
  },
  register: (data: RegisterRequest) => {
    return axios.post<RegisterResponse>(`${API_URL}/register`, data);
  },
  refreshToken: (data: RefreshTokenRequest) => {
    return axios.post<RefreshTokenResponse>(`${API_URL}/refresh-token`, data);
  },
};
