import { renderHook, act } from '@testing-library/react-hooks';
import { useRegistrationForm } from '../hooks/useRegistrationForm';

describe('useRegistrationForm', () => {
  test('should initialize with empty values', () => {
    const { result } = renderHook(() => useRegistrationForm());
    expect(result.current.values).toEqual({
      email: '',
      password: '',
      confirmPassword: '',
    });
  });

  test('should update values on handleChange', () => {
    const { result } = renderHook(() => useRegistrationForm());

    act(() => {
      result.current.handleChange({ target: { name: 'email', value: 'test@test.com' } });
    });

    expect(result.current.values.email).toBe('test@test.com');
  });

  test('should validate required fields', () => {
    const { result } = renderHook(() => useRegistrationForm());

    act(() => {
      result.current.handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    });

    expect(result.current.errors).toEqual({
      email: 'Email is required',
      password: 'Password is required',
    });
  });

  test('should validate password match', () => {
    const { result } = renderHook(() => useRegistrationForm());

    act(() => {
      result.current.handleChange({ target: { name: 'password', value: 'password1' } });
      result.current.handleChange({ target: { name: 'confirmPassword', value: 'password2' } });
    });

    act(() => {
      result.current.handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    });

    expect(result.current.errors.confirmPassword).toBe('Passwords do not match');
  });
});
