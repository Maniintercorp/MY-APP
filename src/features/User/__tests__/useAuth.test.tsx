import { renderHook, act } from '@testing-library/react-hooks';
import useAuth from '../useAuth';
import { server } from '../../mocks/server';  // msw setup
import { rest } from 'msw';

describe('useAuth hook', () => {
  it('should login successfully', async () => {
    server.use(
      rest.post('/api/login', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ token: 'fake-token' }));
      })
    );
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login('user', 'password');
    });
    expect(result.current.isAuthenticated).toBe(true);
  });
});