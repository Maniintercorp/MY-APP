import '@testing-library/jest-dom/vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const navigateMock = vi.hoisted(() => vi.fn());
const useAuthMock = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('@/features/LoginRegistrationPage/hooks', () => ({
  useAuth: useAuthMock,
}));

import { LoginRegistrationPage } from '@/features/LoginRegistrationPage/pages/LoginRegistrationPage';

const defaultAuthState = {
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  currentUser: null,
  authToken: null,
  isAuthenticated: false,
  isCheckingAuth: false,
  loginError: null,
  registerError: null,
  logoutError: null,
  isLoginPending: false,
  isRegisterPending: false,
  isLogoutPending: false,
};

beforeEach(() => {
  vi.clearAllMocks();
  useAuthMock.mockReturnValue({ ...defaultAuthState, login: vi.fn(), register: vi.fn() });
});

describe('LoginRegistrationPage', () => {
  it('renders the login tab by default and switches to registration', async () => {
    const user = userEvent.setup();
    render(<LoginRegistrationPage />);

    expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /registration/i }));

    expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
  });

  it('switches tabs from footer links and clears feedback by replacing the form', async () => {
    const user = userEvent.setup();
    render(<LoginRegistrationPage />);

    await user.click(screen.getByRole('button', { name: /create an account/i }));
    expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^sign in$/i }));
    expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument();
  });

  it('submits login and navigates to dashboard on success', async () => {
    const user = userEvent.setup();
    const login = vi.fn().mockResolvedValue(undefined);
    useAuthMock.mockReturnValue({ ...defaultAuthState, login, register: vi.fn() });
    render(<LoginRegistrationPage />);

    await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    await waitFor(() => expect(login).toHaveBeenCalledWith({ email: 'jane@example.com', password: 'password123' }));
    expect(navigateMock).toHaveBeenCalledWith('/dashboard', { replace: true });
  });

  it('shows a login error returned by useAuth login', async () => {
    const user = userEvent.setup();
    const login = vi.fn().mockRejectedValue({ message: 'Invalid email or password.' });
    useAuthMock.mockReturnValue({ ...defaultAuthState, login, register: vi.fn() });
    render(<LoginRegistrationPage />);

    await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(await screen.findByText('Invalid email or password.')).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalledWith('/dashboard', { replace: true });
  });

  it('submits registration and navigates to dashboard on success', async () => {
    const user = userEvent.setup();
    const register = vi.fn().mockResolvedValue(undefined);
    useAuthMock.mockReturnValue({ ...defaultAuthState, login: vi.fn(), register });
    render(<LoginRegistrationPage />);

    await user.click(screen.getByRole('button', { name: /registration/i }));
    await user.type(screen.getByLabelText(/first name/i), 'Jane');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() =>
      expect(register).toHaveBeenCalledWith({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })
    );
    expect(navigateMock).toHaveBeenCalledWith('/dashboard', { replace: true });
  });

  it('redirects immediately when already authenticated', () => {
    useAuthMock.mockReturnValue({ ...defaultAuthState, login: vi.fn(), register: vi.fn(), isAuthenticated: true });

    render(<LoginRegistrationPage />);

    expect(navigateMock).toHaveBeenCalledWith('/dashboard', { replace: true });
  });
});
