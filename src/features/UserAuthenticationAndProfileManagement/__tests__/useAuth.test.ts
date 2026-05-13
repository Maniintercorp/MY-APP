import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from '../hooks/useAuth';

beforeEach(() => {
  localStorage.clear();
});

test('initial token from localStorage', () => {
  localStorage.setItem('token', 'my-token');
  const { result } = renderHook(() => useAuth());
  expect(result.current.token).toBe('my-token');
});

test('saves token to localStorage', () => {
  const { result } = renderHook(() => useAuth());
  act(() => {
    result.current.saveToken('new-token');
  });
  expect(localStorage.getItem('token')).toBe('new-token');
  expect(result.current.token).toBe('new-token');
});

test('removes token on logout', () => {
  localStorage.setItem('token', 'current-token');
  const { result } = renderHook(() => useAuth());
  act(() => {
    result.current.logout();
  });
  expect(localStorage.getItem('token')).toBeNull();
  expect(result.current.token).toBeNull();
});
