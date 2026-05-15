import { renderHook, act } from '@testing-library/react-hooks';
import useUserManagement from '../useUserManagement';

vi.mock('../api', () => ({
  login: vi.fn(),
  register: vi.fn(),
  refreshToken: vi.fn()
}));

describe('useUserManagement', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useUserManagement());
    act(() => {
      result.current.login('test@example.com', 'password');
    });
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));
  });

  it('should handle login failure', async () => {
    const { result } = renderHook(() => useUserManagement());
    act(() => {
      result.current.login('wrong@example.com', 'wrongpassword');
    });
    await waitFor(() => expect(result.current.error).toBeDefined());
  });
});