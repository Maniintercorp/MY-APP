import axios from 'axios';
import api from '@/lib/api';
import type {
  ApiErrorResponse,
  AuthResponse,
  LoginRequest,
  LogoutResponse,
  RegisterRequest,
  UserDto,
} from '@/features/LoginRegistrationPage/types';

const AUTH_TOKEN_KEY = 'loginRegistrationPage.accessToken';

const normalizeApiError = (error: unknown): ApiErrorResponse => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const responseData = error.response?.data;

    if (responseData?.message) {
      return {
        message: responseData.message,
        errors: responseData.errors,
        statusCode: responseData.statusCode ?? error.response?.status,
      };
    }

    return {
      message: error.response?.status === 401 ? 'Invalid email or password.' : 'Unable to complete the request. Please try again.',
      statusCode: error.response?.status,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: 'Something went wrong. Please try again.' };
};

export const getStoredAuthToken = (): string | null => {
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthHeader = (token: string | null): void => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
};

export const persistAuthToken = (token: string): void => {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  setAuthHeader(token);
};

export const clearPersistedAuthToken = (): void => {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  setAuthHeader(null);
};

setAuthHeader(getStoredAuthToken());

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/login', payload);
      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/register', payload);
      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async getCurrentUser(): Promise<UserDto> {
    try {
      const response = await api.get<UserDto>('/api/auth/me');
      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async logout(): Promise<LogoutResponse> {
    try {
      const response = await api.post<LogoutResponse>('/api/auth/logout');
      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    } finally {
      clearPersistedAuthToken();
    }
  },
};
