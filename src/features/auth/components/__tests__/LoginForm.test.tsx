// Tests for the LoginForm component
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '../index';
import { useLogin } from '../../hooks/useLogin';

jest.mock('../../hooks/useLogin');

const mockUseLogin = useLogin as jest.Mock;

const setup = () => {
  const utils = render(<LoginForm />);
  const emailInput = screen.getByLabelText(/email address/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const loginButton = screen.getByRole('button', { name: /login/i });
  return {
    emailInput,
    passwordInput,
    loginButton,
    ...utils,
  };
};

describe('LoginForm', () => {
  beforeEach(() => {
    mockUseLogin.mockReturnValue({
      email: '',
      password: '',
      setEmail: jest.fn(),
      setPassword: jest.fn(),
      handleSubmit: jest.fn(),
      error: '',
      isLoading: false,
    });
  });

  it('renders form elements', () => {
    setup();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('calls setEmail and setPassword on input change', () => {
    const { emailInput, passwordInput } = setup();
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    expect(mockUseLogin().setEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockUseLogin().setPassword).toHaveBeenCalledWith('password');
  });

  it('displays error message', () => {
    mockUseLogin.mockReturnValueOnce({
      email: '',
      password: '',
      setEmail: jest.fn(),
      setPassword: jest.fn(),
      handleSubmit: jest.fn(),
      error: 'Invalid credentials',
      isLoading: false,
    });
    setup();
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('disables login button during loading', () => {
    mockUseLogin.mockReturnValueOnce({
      email: '',
      password: '',
      setEmail: jest.fn(),
      setPassword: jest.fn(),
      handleSubmit: jest.fn(),
      error: '',
      isLoading: true,
    });
    const { loginButton } = setup();
    expect(loginButton).toBeDisabled();
  });
});
