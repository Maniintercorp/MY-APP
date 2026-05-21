import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import type { ForgotPasswordRequest, LoginRequest, LoginResponse } from '@/features/LoginPageRedesign/types';

vi.mock('@/lib/api', async () => {
  const axios = await import('axios');

  return {
    default: axios.default.create({ baseURL: 'http://localhost' }),
  };
});

const loginResponse: LoginResponse = {
  accessToken: 'access-token-123',
  refreshToken: 'refresh-token-456',
  expiresAt: '2030-01-01T00:00:00.000Z',
  user: {
    id: 'user-1',
    email: 'user@example.com',
    displayName: 'Example User',
    roles: ['Admin'],
  },
};

let loginPayloads: LoginRequest[] = [];
let forgotPasswordPayloads: ForgotPasswordRequest[] = [];

const server = setupServer(
  http.post('http://localhost/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginRequest;
    loginPayloads.push(body);

    return HttpResponse.json(loginResponse);
  }),
  http.post('http://localhost/api/auth/forgot-password', async ({ request }) => {
    const body = (await request.json()) as ForgotPasswordRequest;
    forgotPasswordPayloads.push(body);

    return HttpResponse.json({ message: 'Password reset instructions sent.' });
  })
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(() => {
  loginPayloads = [];
  forgotPasswordPayloads = [];
});

describe('LoginPageRedesign services', () => {
  it('loginUser posts credentials to the login endpoint and returns response data', async () => {
    const { loginUser } = await import('@/features/LoginPageRedesign/services');
    const payload: LoginRequest = {
      email: 'user@example.com',
      password: 'correct-password',
      rememberMe: true,
    };

    const result = await loginUser(payload);

    expect(result).toEqual(loginResponse);
    expect(loginPayloads).toEqual([payload]);
  });

  it('requestPasswordReset posts the email to the forgot password endpoint and returns response data', async () => {
    const { requestPasswordReset } = await import('@/features/LoginPageRedesign/services');
    const payload: ForgotPasswordRequest = { email: 'user@example.com' };

    const result = await requestPasswordReset(payload);

    expect(result).toEqual({ message: 'Password reset instructions sent.' });
    expect(forgotPasswordPayloads).toEqual([payload]);
  });

  it('loginUser rejects with the HTTP error when the API returns a failure', async () => {
    server.use(
      http.post('http://localhost/api/auth/login', () => {
        return HttpResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
      })
    );

    const { loginUser } = await import('@/features/LoginPageRedesign/services');

    await expect(
      loginUser({ email: 'user@example.com', password: 'wrong-password', rememberMe: false })
    ).rejects.toMatchObject({
      response: expect.objectContaining({ status: 401 }),
    });
  });
});
