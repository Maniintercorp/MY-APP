import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import api from '@/lib/api';
import { authService, clearPersistedAuthToken, getStoredAuthToken, persistAuthToken, setAuthHeader } from '@/features/LoginRegistrationPage/services';

const server = setupServer();

const user = {
  id: 'user-1',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  createdAtUtc: '2026-01-01T00:00:00.000Z',
};

const authResponse = {
  accessToken: 'jwt-token',
  tokenType: 'Bearer',
  expiresIn: 3600,
  user,
};

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  window.localStorage.clear();
  setAuthHeader(null);
});
afterAll(() => server.close());

describe('auth token persistence helpers', () => {
  it('persists token to localStorage and applies Authorization header', () => {
    persistAuthToken('abc.123');

    expect(getStoredAuthToken()).toBe('abc.123');
    expect(api.defaults.headers.common.Authorization).toBe('Bearer abc.123');
  });

  it('clears token from localStorage and removes Authorization header', () => {
    persistAuthToken('abc.123');

    clearPersistedAuthToken();

    expect(getStoredAuthToken()).toBeNull();
    expect(api.defaults.headers.common.Authorization).toBeUndefined();
  });
});

describe('authService', () => {
  it('posts login payload and returns auth response data', async () => {
    server.use(
      http.post('http://localhost:5000/api/auth/login', async ({ request }) => {
        const body = await request.json();
        expect(body).toEqual({ email: 'jane@example.com', password: 'password123' });
        return HttpResponse.json(authResponse);
      })
    );

    await expect(authService.login({ email: 'jane@example.com', password: 'password123' })).resolves.toEqual(authResponse);
  });

  it('posts registration payload and returns auth response data', async () => {
    server.use(
      http.post('http://localhost:5000/api/auth/register', async ({ request }) => {
        const body = await request.json();
        expect(body).toEqual({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!',
        });
        return HttpResponse.json(authResponse, { status: 201 });
      })
    );

    await expect(
      authService.register({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      })
    ).resolves.toEqual(authResponse);
  });

  it('gets the current authenticated user', async () => {
    server.use(http.get('http://localhost:5000/api/auth/me', () => HttpResponse.json(user)));

    await expect(authService.getCurrentUser()).resolves.toEqual(user);
  });

  it('normalizes API error responses with message, errors, and status code', async () => {
    server.use(
      http.post('http://localhost:5000/api/auth/login', () =>
        HttpResponse.json(
          { message: 'Validation failed.', errors: { email: ['Email is required.'] }, statusCode: 400 },
          { status: 400 }
        )
      )
    );

    await expect(authService.login({ email: '', password: '' })).rejects.toEqual({
      message: 'Validation failed.',
      errors: { email: ['Email is required.'] },
      statusCode: 400,
    });
  });

  it('normalizes generic axios errors when response has no message', async () => {
    server.use(http.get('http://localhost:5000/api/auth/me', () => HttpResponse.json({}, { status: 500 })));

    await expect(authService.getCurrentUser()).rejects.toEqual({
      message: 'Unable to complete the request. Please try again.',
      statusCode: 500,
    });
  });

  it('clears persisted token after logout succeeds', async () => {
    persistAuthToken('jwt-token');
    server.use(
      http.post('http://localhost:5000/api/auth/logout', () =>
        HttpResponse.json({ success: true, message: 'Logged out successfully.' })
      )
    );

    await expect(authService.logout()).resolves.toEqual({ success: true, message: 'Logged out successfully.' });
    expect(getStoredAuthToken()).toBeNull();
    expect(api.defaults.headers.common.Authorization).toBeUndefined();
  });

  it('clears persisted token after logout fails', async () => {
    persistAuthToken('jwt-token');
    server.use(http.post('http://localhost:5000/api/auth/logout', () => HttpResponse.json({}, { status: 500 })));

    await expect(authService.logout()).rejects.toMatchObject({ statusCode: 500 });
    expect(getStoredAuthToken()).toBeNull();
    expect(api.defaults.headers.common.Authorization).toBeUndefined();
  });
});
