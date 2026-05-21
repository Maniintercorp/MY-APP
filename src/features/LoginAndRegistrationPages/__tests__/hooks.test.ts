import { renderHook, act } from '@testing-library/react';
import { useLoginMutation, useRegisterMutation } from '../hooks';
import * as services from '../services';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';

describe('useLoginMutation', () => {
  it('calls login on mutate', async () => {
    const mockLogin = vi.spyOn(services, 'login').mockResolvedValue({ token: 'tok', userId: 'id', username: 'foo', email: 'e' });
    const client = new QueryClient();
    const wrapper = ({ children }: any) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useLoginMutation({ onSuccess }), { wrapper });
    await act(async () => {
      result.current.mutate({ usernameOrEmail: 'foo', password: 'bar' }, { onSuccess });
    });
    expect(mockLogin).toHaveBeenCalledWith({ usernameOrEmail: 'foo', password: 'bar' });
  });
});

describe('useRegisterMutation', () => {
  it('calls register on mutate', async () => {
    const mockRegister = vi.spyOn(services, 'register').mockResolvedValue({ userId: 'id', username: 'foo', email: 'bar' });
    const client = new QueryClient();
    const wrapper = ({ children }: any) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useRegisterMutation({ onSuccess }), { wrapper });
    await act(async () => {
      result.current.mutate({ username: 'foo', email: 'bar', password: 'Abc12345', confirmPassword: 'Abc12345' }, { onSuccess });
    });
    expect(mockRegister).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });
});
