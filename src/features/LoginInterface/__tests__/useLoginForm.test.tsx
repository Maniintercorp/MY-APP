import { renderHook, act } from '@testing-library/react-hooks';
import { useLoginForm } from '../hooks/useLoginForm';
import { loginUser } from '../services/authService';
jest.mock('../services/authService');

const mockLoginUser = loginUser as jest.MockedFunction<typeof loginUser>;

describe('useLoginForm hook', () => {
  beforeEach(() => {
    mockLoginUser.mockReset();
  });

  it('should handle input changes', () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleChange({ target: { name: 'username', value: 'testuser' } } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.values.username).toBe('testuser');
  });

  it('should validate the form and submit', async () => {
    mockLoginUser.mockResolvedValue({ token: 'fake-token', expiration: 'fake-date' });
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleChange({ target: { name: 'username', value: 'testuser' } } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleChange({ target: { name: 'password', value: 'testpass' } } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent);
    });

    expect(result.current.errors).toEqual({});
    expect(mockLoginUser).toHaveBeenCalledWith({ username: 'testuser', password: 'testpass' });
  });

  it('should set errors on validation fail', async () => {
    const { result } = renderHook(() => useLoginForm());

    await act(async () => {
      result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent);
    });

    expect(result.current.errors).toEqual({ username: 'Username is required', password: 'Password is required' });
  });
});