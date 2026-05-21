import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useForgotPassword, useLogin } from '@/features/LoginPageRedesign/hooks';
import type { LoginResponse } from '@/features/LoginPageRedesign/types';

const mockLoginUser = vi.hoisted(() => vi.fn());
const mockRequestPasswordReset = vi.hoisted(() => vi.fn());

vi.mock('@/features/LoginPageRedesign/services', () => ({
  loginUser: mockLoginUser,
  requestPasswordReset: mockRequestPasswordReset,
}));

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const createWrapper = (queryClient: QueryClient) => {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

const loginResponse: LoginResponse = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  expiresAt: '2030-01-01T00:00:00.000Z',
  user: {
    id: 'user-1',
    email: 'user@example.com',
    displayName: 'Example User',
    roles: ['User'],
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
  window.sessionStorage.clear();
});

describe('useLogin', () => {
  it('persists tokens in localStorage when rememberMe is true and caches auth data', async () => {
    window.localStorage.setItem('accessToken', 'old-local-token');
    window.sessionStorage.setItem('accessToken', 'old-session-token');
    mockLoginUser.mockResolvedValueOnce(loginResponse);
    const queryClient = createQueryClient();

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync({
        email: 'user@example.com',
        password: 'password-123',
        rememberMe: true,
      });
    });

    expect(mockLoginUser).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password-123',
      rememberMe: true,
    });
    expect(window.localStorage.getItem('accessToken')).toBe('access-token');
    expect(window.localStorage.getItem('refreshToken')).toBe('refresh-token');
    expect(window.localStorage.getItem('expiresAt')).toBe('2030-01-01T00:00:00.000Z');
    expect(window.localStorage.getItem('rememberMe')).toBe('true');
    expect(window.sessionStorage.getItem('accessToken')).toBeNull();
    expect(window.sessionStorage.getItem('refreshToken')).toBeNull();
    expect(window.sessionStorage.getItem('expiresAt')).toBeNull();
    expect(queryClient.getQueryData(['auth', 'user'])).toEqual(loginResponse.user);
    expect(queryClient.getQueryData(['auth', 'session'])).toEqual(loginResponse);
    expect(queryClient.getQueryData(['user'])).toEqual(loginResponse.user);
  });

  it('persists tokens in sessionStorage when rememberMe is false and clears previous local tokens', async () => {
    window.localStorage.setItem('accessToken', 'old-local-access');
    window.localStorage.setItem('refreshToken', 'old-local-refresh');
    window.localStorage.setItem('expiresAt', 'old-local-expiry');
    mockLoginUser.mockResolvedValueOnce(loginResponse);
    const queryClient = createQueryClient();

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync({
        email: 'user@example.com',
        password: 'password-123',
        rememberMe: false,
      });
    });

    expect(window.localStorage.getItem('accessToken')).toBeNull();
    expect(window.localStorage.getItem('refreshToken')).toBeNull();
    expect(window.localStorage.getItem('expiresAt')).toBeNull();
    expect(window.localStorage.getItem('rememberMe')).toBe('false');
    expect(window.sessionStorage.getItem('accessToken')).toBe('access-token');
    expect(window.sessionStorage.getItem('refreshToken')).toBe('refresh-token');
    expect(window.sessionStorage.getItem('expiresAt')).toBe('2030-01-01T00:00:00.000Z');
    expect(queryClient.getQueryData(['auth', 'user'])).toEqual(loginResponse.user);
  });

  it('does not persist or cache data when the login mutation rejects', async () => {
    mockLoginUser.mockRejectedValueOnce(new Error('Invalid credentials'));
    const queryClient = createQueryClient();

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(queryClient),
    });

    await expect(
      act(async () => {
        await result.current.mutateAsync({
          email: 'user@example.com',
          password: 'wrong-password',
          rememberMe: true,
        });
      })
    ).rejects.toThrow('Invalid credentials');

    expect(window.localStorage.getItem('accessToken')).toBeNull();
    expect(window.sessionStorage.getItem('accessToken')).toBeNull();
    expect(queryClient.getQueryData(['auth', 'user'])).toBeUndefined();
  });
});

describe('useForgotPassword', () => {
  it('calls requestPasswordReset and resolves with the service response', async () => {
    mockRequestPasswordReset.mockResolvedValueOnce({ message: 'Check your inbox.' });
    const queryClient = createQueryClient();

    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: createWrapper(queryClient),
    });

    let response: unknown;
    await act(async () => {
      response = await result.current.mutateAsync({ email: 'user@example.com' });
    });

    expect(mockRequestPasswordReset).toHaveBeenCalledWith({ email: 'user@example.com' });
    expect(response).toEqual({ message: 'Check your inbox.' });
  });
});
