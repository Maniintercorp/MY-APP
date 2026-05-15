import { renderHook, act } from '@testing-library/react-hooks';
import useUser from '../hooks/useUser';

test('should create a user', async () => {
  const { result } = renderHook(() => useUser());
  await act(async () => {
    await result.current.createUser({ email: 'test@example.com', password: 'securepassword' });
  });
  expect(result.current.user.email).toBe('test@example.com');
});