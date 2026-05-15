// Test for useUser Hook
import { renderHook, act } from '@testing-library/react-hooks';
import { useUser } from '../hooks/useUser';

// Mocking API calls using msw can be set up here

describe('useUser hook', () => {
  test('should initialize with default values', () => {
    const { result } = renderHook(() => useUser());
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  test('should update user on login', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useUser());
    
    act(() => {
      result.current.login('testUser', 'password123');
    });
    
    await waitForNextUpdate();
    expect(result.current.user).toEqual({ id: 1, username: 'testUser' });
  });
});