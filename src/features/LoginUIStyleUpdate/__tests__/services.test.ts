import { login } from '../services';
import api from '@/lib/api';
import type { LoginRequest, LoginResponse } from '../types';
import { vi } from 'vitest';

vi.mock('@/lib/api');

const mockedApi = api as jest.Mocked<typeof api>;

describe('login service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls api.post with correct params and returns response data', async () => {
    const form: LoginRequest = { email: 'a@b.com', password: 'x' };
    const apiRes: { data: LoginResponse } = {
      data: {
        token: 't',
        user: { id: '1', name: 'Anna', email: 'a@b.com' },
        error: null
      }
    };
    mockedApi.post.mockResolvedValueOnce(apiRes as any);
    const res = await login(form);
    expect(mockedApi.post).toHaveBeenCalledWith('/api/auth/login', form);
    expect(res).toEqual(apiRes.data);
  });

  it('throws on api error', async () => {
    const form: LoginRequest = { email: 'fail@b.com', password: 'nope' };
    mockedApi.post.mockRejectedValueOnce(new Error('API Down!'));
    await expect(login(form)).rejects.toThrow('API Down!');
  });
});
