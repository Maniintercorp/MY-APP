import axios from 'axios';
import { LoginRequest, LoginResponse } from '../types';

const API_URL = '/api/auth/login';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(API_URL, credentials);
  return response.data;
};