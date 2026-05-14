import { act, renderHook } from '@testing-library/react-hooks';
import { useForm } from '../hooks/useLoginForm';
import { login } from '../services/authService';
import { vi } from 'vitest';

vi.mock('../services/authService');

const mockLogin = login as jest.Mock;

beforeEach(() => {
  mockLogin.mockClear();
});

describe('useLoginForm hook', () => {
  test('initializes form state correctly', () => {
    const { result } = renderHook(() => useForm());
    expect(result.current.form).toEqual({ email: '', password: '' });
    expect(result.current.errors).toEqual({});
  });

  test('handles form input changes', () => {
    const { result } = renderHook(() => useForm());
    act(() => {
      result.current.handleChange({ target: { name: 'email', value: 'test@mail.com' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.form.email).toBe('test@mail.com');
  });

  test('validates form fields correctly', () => {
    const { result } = renderHook(() => useForm());
    act(() => {
      result.current.handleSubmit({ preventDefault() {} } as React.FormEvent);
    });
    expect(result.current.errors).toEqual({ email: 'Email is required', password: 'Password is required' });
  });

  test('submits form successfully when valid', async () => {
    mockLogin.mockResolvedValue({ token: 'fake-token', userId: '123' });

    const { result } = renderHook(() => useForm());
    act(() => {
      result.current.handleChange({ target: { name: 'email', value: 'valid@mail.com' } } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleChange({ target: { name: 'password', value: 'validPass' } } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault() {} } as React.FormEvent);
    });

    expect(mockLogin).toHaveBeenCalledWith({ email: 'valid@mail.com', password: 'validPass' });
  });
});
