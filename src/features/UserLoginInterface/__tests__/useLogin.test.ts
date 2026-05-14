import { renderHook, act } from '@testing-library/react-hooks';
import { useLogin } from '../hooks/useLogin';
import { loginUser } from '../services/authService';

jest.mock('../services/authService');

const mockLoginUser = loginUser as jest.MockedFunction<typeof loginUser>;

describe('useLogin', () => {
  it('successfully logs in a user', async () => {
    mockLoginUser.mockResolvedValue({ token: 'fake-token', message: 'Login successful.' });

    const { result, waitFor } = renderHook(() => useLogin());

    act(() => {
      result.current.mutate({ username: 'testuser', password: 'password123' });
    });

    await waitFor(() => result.current.isSuccess);

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
  });

  it('fails to log in a user', async () => {
    mockLoginUser.mockRejectedValue(new Error('Login failed'));

    const { result, waitFor } = renderHook(() => useLogin());

    act(() => {
      result.current.mutate({ username: 'testuser', password: 'wrongpassword' });
    });

    await waitFor(() => result.current.error);

    expect(result.current.error.message).toBe('Login failed');
  });
});