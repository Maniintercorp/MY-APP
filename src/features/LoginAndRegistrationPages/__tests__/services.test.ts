import { register, login } from '../services';
import api from '@/lib/api';
import { vi } from 'vitest';

describe('auth API services', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('register calls POST /api/auth/register', async () => {
    const input = { username: 'foo', email: 'e@test.com', password: 'Abc12345', confirmPassword: 'Abc12345' };
    const output = { userId: 'id', username: 'foo', email: 'e@test.com' };
    vi.spyOn(api, 'post').mockResolvedValueOnce({ data: output });
    await expect(register(input)).resolves.toEqual(output);
    expect(api.post).toHaveBeenCalledWith('/api/auth/register', input);
  });
  it('login calls POST /api/auth/login', async () => {
    const input = { usernameOrEmail: 'foo', password: 'Abc12345' };
    const output = { token: 'tok', userId: 'id', username: 'foo', email: 'e@test.com' };
    vi.spyOn(api, 'post').mockResolvedValueOnce({ data: output });
    await expect(login(input)).resolves.toEqual(output);
    expect(api.post).toHaveBeenCalledWith('/api/auth/login', input);
  });
});
