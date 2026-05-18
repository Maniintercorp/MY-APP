import { renderHook, act } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useLogin } from '../hooks';
import * as service from '../services';
import type { LoginRequest, LoginResponse } from '../types';

import { vi } from 'vitest';

describe('useLogin', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
  );

  it('calls login service with correct args and resolves', async () => {
    const mockLogin = vi.spyOn(service, 'login').mockResolvedValue({
      token: 't',
      user: { id: '1', name: 'A', email: 'a@b.com' },
      error: null
    });
    const { result } = renderHook(() => useLogin(), { wrapper });
    await act(async () => {
      await result.current.mutateAsync({ email: 'a@b.com', password: 'pw' });
    });
    expect(mockLogin).toHaveBeenCalledWith({ email: 'a@b.com', password: 'pw' });
    mockLogin.mockRestore();
  });

  it('handles error when login service rejects', async () => {
    const mockLogin = vi.spyOn(service, 'login').mockRejectedValue(new Error('API Down!'));
    const { result } = renderHook(() => useLogin(), { wrapper });
    let error;
    await act(async () => {
      try {
        await result.current.mutateAsync({ email: 'x', password: 'y' });
      } catch (e) {
        error = e;
      }
    });
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toContain('API Down');
    mockLogin.mockRestore();
  });
});
