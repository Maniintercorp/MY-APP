import { renderHook, act } from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from '../hooks/useAuth';

// Test useAuth hook
describe('useAuth hook', () => {
  it('should initialize with null token', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    expect(result.current.token).toBeNull();
  });

  it('should set token on login', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    act(() => {
      result.current.login('dummy-token');
    });
    expect(result.current.token).toBe('dummy-token');
  });

  it('should clear token on logout', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    act(() => {
      result.current.login('dummy-token');
      result.current.logout();
    });
    expect(result.current.token).toBeNull();
  });
});