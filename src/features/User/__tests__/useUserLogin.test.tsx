// Import necessary hooks and utilities
import { renderHook, act } from '@testing-library/react-hooks';
import { useUserLogin } from '../hooks/useUserLogin';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Mock server setup
const server = setupServer(
  rest.post('/api/users/login', (req, res, ctx) => {
    return res(ctx.json({ token: 'fakeToken', userId: 1 }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useUserLogin hook', () => {
  it('should login a user and return a token', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useUserLogin());

    act(() => {
      result.current.login('user', 'password');
    });

    await waitForNextUpdate();

    expect(result.current.token).toBe('fakeToken');
    expect(result.current.userId).toBe(1);
  });

  it('should handle login failure', async () => {
    server.use(
      rest.post('/api/users/login', (req, res, ctx) => {
        return res(ctx.status(401), ctx.json({ message: 'Unauthorized' }));
      })
    );

    const { result, waitForNextUpdate } = renderHook(() => useUserLogin());

    act(() => {
      result.current.login('user', 'wrong-password');
    });

    await waitForNextUpdate();

    expect(result.current.error).toBe('Unauthorized');
  });
});