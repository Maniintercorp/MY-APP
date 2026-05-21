import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const serviceMocks = vi.hoisted(() => ({
  login: vi.fn(),
  register: vi.fn(),
  getCurrentUser: vi.fn(),
  logout: vi.fn(),
  getStoredAuthToken: vi.fn(),
  persistAuthToken: vi.fn(),
  clearPersistedAuthToken: vi.fn(),
}));

vi.mock('@/features/LoginRegistrationPage/services', () => ({
  authService: {
    login: serviceMocks.login,
    register: serviceMocks.register,
    getCurrentUser: serviceMocks.getCurrentUser,
    logout: serviceMocks.logout,
  },
  getStoredAuthToken: serviceMocks.getStoredAuthToken,
  persistAuthToken: serviceMocks.persistAuthToken,
  clearPersistedAuthToken: serviceMocks.clearPersistedAuthToken,
}));

import { authQueryKeys, useAuth } from '@/features/LoginRegistrationPage/hooks';

const user = {
  id: 'user-1',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  createdAtUtc: '2026-01-01T00:00:00.000Z',
};

const authResponse = {
  accessToken: 'jwt-token',
  tokenType: 'Bearer',
  expiresIn: 3600,
  user,
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { wrapper, queryClient };
};

beforeEach(() => {
  vi.clearAllMocks();
  serviceMocks.getStoredAuthToken.mockReturnValue(null);
});

describe('useAuth', () => {
  it('starts unauthenticated when no stored token exists and does not fetch current user', () => {
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.authToken).toBeNull();
    expect(result.current.currentUser).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(serviceMocks.getCurrentUser).not.toHaveBeenCalled();
  });

  it('fetches current user when a stored token exists', async () => {
    serviceMocks.getStoredAuthToken.mockReturnValue('stored-token');
    serviceMocks.getCurrentUser.mockResolvedValue(user);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.authToken).toBe('stored-token');
    await waitFor(() => expect(result.current.currentUser).toEqual(user));
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('logs in, persists token, and stores user query data', async () => {
    serviceMocks.login.mockResolvedValue(authResponse);
    const { wrapper, queryClient } = createWrapper();
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({ email: 'jane@example.com', password: 'password123' });
    });

    expect(serviceMocks.login).toHaveBeenCalledWith({ email: 'jane@example.com', password: 'password123' });
    expect(serviceMocks.persistAuthToken).toHaveBeenCalledWith('jwt-token');
    expect(queryClient.getQueryData(authQueryKeys.me)).toEqual(user);
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));
  });

  it('registers, persists token, and stores user query data', async () => {
    serviceMocks.register.mockResolvedValue(authResponse);
    const { wrapper, queryClient } = createWrapper();
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });
    });

    expect(serviceMocks.register).toHaveBeenCalledTimes(1);
    expect(serviceMocks.persistAuthToken).toHaveBeenCalledWith('jwt-token');
    expect(queryClient.getQueryData(authQueryKeys.me)).toEqual(user);
  });

  it('clears token and current-user cache when logout succeeds', async () => {
    serviceMocks.getStoredAuthToken.mockReturnValue('stored-token');
    serviceMocks.getCurrentUser.mockResolvedValue(user);
    serviceMocks.logout.mockResolvedValue({ success: true, message: 'Logged out.' });
    const { wrapper, queryClient } = createWrapper();
    queryClient.setQueryData(authQueryKeys.me, user);
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(serviceMocks.clearPersistedAuthToken).toHaveBeenCalled();
    expect(queryClient.getQueryData(authQueryKeys.me)).toBeUndefined();
    await waitFor(() => expect(result.current.isAuthenticated).toBe(false));
  });

  it('also clears token and current-user cache when logout fails', async () => {
    serviceMocks.getStoredAuthToken.mockReturnValue('stored-token');
    serviceMocks.getCurrentUser.mockResolvedValue(user);
    serviceMocks.logout.mockRejectedValue({ message: 'Network error.' });
    const { wrapper, queryClient } = createWrapper();
    queryClient.setQueryData(authQueryKeys.me, user);
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await expect(result.current.logout()).rejects.toEqual({ message: 'Network error.' });
    });

    expect(serviceMocks.clearPersistedAuthToken).toHaveBeenCalled();
    expect(queryClient.getQueryData(authQueryKeys.me)).toBeUndefined();
    await waitFor(() => expect(result.current.isAuthenticated).toBe(false));
  });
});
