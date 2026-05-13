import { act, renderHook } from '@testing-library/react-hooks';
import { createWrapper } from 'react-query/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useAuth } from '../hooks/useAuth';

const server = setupServer(
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { username, password } = req.body as Record<string, string>;
    if (username === 'correct' && password === 'password123') {
      return res(ctx.json({ token: 'abcd1234', expiresIn: 3600 }));
    } else {
      return res(ctx.status(401), ctx.json({ error: 'Invalid username or password' }));
    }
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useAuth hook', () => {
  test('should return error on invalid login', async () => {
    const { result, waitFor } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    act(() => {
      result.current.login({ username: 'wrong', password: 'password123' });
    });

    await waitFor(() => result.current.error !== null);

    expect(result.current.error).toEqual('Invalid username or password');
  });

  test('should set token on successful login', async () => {
    const { result, waitFor } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    act(() => {
      result.current.login({ username: 'correct', password: 'password123' });
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(localStorage.getItem('token')).toEqual('abcd1234');
    });
  });

  test('should set loading state during login process', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    act(() => {
      result.current.login({ username: 'correct', password: 'password123' });
    });

    expect(result.current.isLoading).toBeTruthy();

    await waitForNextUpdate();

    expect(result.current.isLoading).toBeFalsy();
  });
});