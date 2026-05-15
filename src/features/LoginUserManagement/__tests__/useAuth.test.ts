import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { AuthService } from '../services';
import { vi } from 'vitest';

vi.mock('../services');

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>{children}</AuthProvider>
  </QueryClientProvider>
);

describe('useAuth hook', () => {
  it('calls login and returns no error on success', async () => {
    const loginData = { username: 'user', password: 'pass' };
    (AuthService.login as jest.Mock).mockResolvedValueOnce({ data: { token: 'fakeToken' } });
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login(loginData);
    });

    expect(AuthService.login).toHaveBeenCalledWith(loginData);
  });

  it('calls registerUser and returns no error on success', async () => {
    const registerData = { username: 'newuser', password: 'pass', email: 'email@test.com' };
    (AuthService.register as jest.Mock).mockResolvedValueOnce({ data: { userId: 1, message: 'success' } });
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.registerUser(registerData);
    });

    expect(AuthService.register).toHaveBeenCalledWith(registerData);
  });
});
