// Tests for the useLogin hook
import { renderHook, act } from '@testing-library/react-hooks';
import { useLogin } from '../hooks/useLogin';
import { login } from '../services/authService';

jest.mock('../services/authService');

const mockedLogin = login as jest.Mock;

mockedLogin.mockResolvedValue({ token: 'fake-token', expiresIn: 3600, refreshToken: 'fake-refresh' });

describe('useLogin', () => {
  it('should update email and password', () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setEmail('test@example.com');
      result.current.setPassword('password');
    });

    expect(result.current.email).toBe('test@example.com');
    expect(result.current.password).toBe('password');
  });

  it('should call login service on submit', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useLogin());

    act(() => {
      result.current.setEmail('test@example.com');
      result.current.setPassword('password');
      result.current.handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    });

    await waitForNextUpdate();

    expect(mockedLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password'
    });
  });

  it('should set error message on login error', async () => {
    mockedLogin.mockRejectedValueOnce(new Error('Login failed'));

    const { result, waitForNextUpdate } = renderHook(() => useLogin());

    act(() => {
      result.current.setEmail('test@example.com');
      result.current.setPassword('password');
      result.current.handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    });

    await waitForNextUpdate();

    expect(result.current.error).toBe('An error occurred');
  });
});
