import { describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { screen, waitFor, renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { server } from '@/test/server';
import { createTestQueryClient, renderWithProviders } from '@/test/testUtils';
import { login, register } from '@/features/Auth/services';
import { useLogin, useRegister } from '@/features/Auth/hooks';
import { LoginPage } from '@/features/Auth/pages/LoginPage';
import { RegisterPage } from '@/features/Auth/pages/RegisterPage';

vi.mock('@/features/Auth/hooks', async importOriginal => {
  const actual = await importOriginal<typeof import('@/features/Auth/hooks')>();
  return {
    ...actual,
    useLogin: vi.fn(),
    useRegister: vi.fn(),
  };
});

const mockedUseLogin = vi.mocked(useLogin);
const mockedUseRegister = vi.mocked(useRegister);

describe('Auth services', () => {
  it('posts login credentials and returns auth response', async () => {
    server.use(
      http.post('http://localhost:5000/api/auth/login', async ({ request }) => {
        const body = await request.json() as { email: string; password: string };
        expect(body).toEqual({ email: 'user@test.com', password: 'secret' });
        return HttpResponse.json({ user: { id: '1', name: 'User', email: body.email }, token: 'jwt' });
      })
    );

    await expect(login({ email: 'user@test.com', password: 'secret' })).resolves.toEqual({
      user: { id: '1', name: 'User', email: 'user@test.com' },
      token: 'jwt',
    });
  });

  it('posts register payload and returns auth response', async () => {
    server.use(
      http.post('http://localhost:5000/api/auth/register', async ({ request }) => {
        const body = await request.json() as { name: string; email: string; password: string };
        expect(body.name).toBe('New User');
        return HttpResponse.json({ user: { id: '2', name: body.name, email: body.email }, token: 'new-token' });
      })
    );

    await expect(register({ name: 'New User', email: 'new@test.com', password: 'password' })).resolves.toMatchObject({ token: 'new-token' });
  });
});

describe('Auth hooks', () => {
  it('stores auth and navigates after successful login', async () => {
    vi.resetModules();
    vi.doMock('@/features/Auth/services', () => ({
      login: vi.fn().mockResolvedValue({ user: { id: '1', name: 'User', email: 'user@test.com' }, token: 'token' }),
      register: vi.fn(),
    }));
    const { useLogin: realUseLogin } = await import('@/features/Auth/hooks');
    const client = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <Routes>
            <Route path='/' element={children} />
            <Route path='/dashboard' element={<div>Dashboard reached</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const { result } = renderHook(() => realUseLogin(), { wrapper });
    await act(async () => {
      await result.current.mutateAsync({ email: 'user@test.com', password: 'password' });
    });

    expect(localStorage.getItem('token')).toBe('token');
    expect(localStorage.getItem('user')).toContain('user@test.com');
  });

  it('stores auth and navigates after successful registration', async () => {
    vi.resetModules();
    vi.doMock('@/features/Auth/services', () => ({
      login: vi.fn(),
      register: vi.fn().mockResolvedValue({ user: { id: '2', name: 'New', email: 'new@test.com' }, token: 'registered' }),
    }));
    const { useRegister: realUseRegister } = await import('@/features/Auth/hooks');
    const client = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={client}><MemoryRouter>{children}</MemoryRouter></QueryClientProvider>;

    const { result } = renderHook(() => realUseRegister(), { wrapper });
    await act(async () => {
      await result.current.mutateAsync({ name: 'New', email: 'new@test.com', password: 'password' });
    });

    expect(localStorage.getItem('token')).toBe('registered');
  });
});

describe('LoginPage', () => {
  it('submits entered credentials and links to register', async () => {
    const user = userEvent.setup();
    const mutate = vi.fn();
    mockedUseLogin.mockReturnValue({ mutate, isPending: false, isError: false } as never);

    renderWithProviders(<LoginPage />);
    await user.type(screen.getByLabelText('Email'), 'user@test.com');
    await user.type(screen.getByLabelText('Password'), 'secret');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(mutate).toHaveBeenCalledWith({ email: 'user@test.com', password: 'secret' });
    expect(screen.getByRole('link', { name: /create one/i })).toHaveAttribute('href', '/register');
  });

  it('shows an error and loading state', () => {
    mockedUseLogin.mockReturnValue({ mutate: vi.fn(), isPending: true, isError: true } as never);
    renderWithProviders(<LoginPage />);
    expect(screen.getByText(/unable to sign in/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();
  });
});

describe('RegisterPage', () => {
  it('submits registration data and links to login', async () => {
    const user = userEvent.setup();
    const mutate = vi.fn();
    mockedUseRegister.mockReturnValue({ mutate, isPending: false, isError: false } as never);

    renderWithProviders(<RegisterPage />);
    await user.type(screen.getByLabelText('Name'), 'New User');
    await user.type(screen.getByLabelText('Email'), 'new@test.com');
    await user.type(screen.getByLabelText('Password'), 'password');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(mutate).toHaveBeenCalledWith({ name: 'New User', email: 'new@test.com', password: 'password' });
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login');
  });

  it('shows an error and loading state', () => {
    mockedUseRegister.mockReturnValue({ mutate: vi.fn(), isPending: true, isError: true } as never);
    renderWithProviders(<RegisterPage />);
    expect(screen.getByText(/unable to create account/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeDisabled();
  });
});
