import { renderHook, act } from '@testing-library/react';
import useUser from '../hooks/useUser';
import { server } from '../../../mocks/server';
import { rest } from 'msw';

describe('useUser hook', () => {
  it('should register a user', async () => {
    server.use(
      rest.post('/api/register', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ message: 'User registered' }));
      })
    );
    const { result } = renderHook(() => useUser());
    await act(async () => {
      const response = await result.current.register({ username: 'test', email: 'test@example.com', password: 'password123' });
      expect(response.message).toBe('User registered');
    });
  });

  it('should handle register error', async () => {
    server.use(
      rest.post('/api/register', (req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ error: 'Invalid data' }));
      })
    );
    const { result } = renderHook(() => useUser());
    await act(async () => {
      try {
        await result.current.register({ username: 'test', email: 'test@example.com', password: 'password123' });
      } catch (error) {
        expect(error).toEqual('Invalid data');
      }
    });
  });
});