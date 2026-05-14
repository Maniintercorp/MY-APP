import axios from 'axios';
import { LoginForm, LoginResponse } from '../types';

export const loginUser = async (form: LoginForm): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>('/api/login', form);
  return response.data;
};
