import axios from 'axios';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, ProfileRequest, ProfileResponse } from '../types';

const API_URL = '/api/auth';

export const registerUser = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await axios.post<RegisterResponse>(`${API_URL}/register`, data);
  return response.data;
};

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/login`, data);
  return response.data;
};

export const updateUserProfile = async (data: ProfileRequest): Promise<ProfileResponse> => {
  const response = await axios.put<ProfileResponse>('/api/users/profile', data);
  return response.data;
};
