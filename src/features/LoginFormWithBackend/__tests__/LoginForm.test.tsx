import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '../components/LoginForm';
import { vi } from 'vitest';
import { useForm } from '../hooks/useLoginForm';

vi.mock('../hooks/useLoginForm');

const mockedUseForm = useForm as jest.Mock;

mockedUseForm.mockReturnValue({
  form: { email: '', password: '' },
  errors: {},
  handleChange: jest.fn(),
  handleSubmit: jest.fn((e) => e.preventDefault()),
});

describe('LoginForm', () => {
  test('renders login form inputs and button', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('handles input changes correctly', () => {
    const { handleChange } = mockedUseForm.mock.results[0].value;
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@mail.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  test('submits form successfully', () => {
    const { handleSubmit } = mockedUseForm.mock.results[0].value;
    render(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(handleSubmit).toHaveBeenCalled();
  });

  test('displays validation errors', () => {
    mockedUseForm.mockReturnValueOnce({
      form: { email: '', password: '' },
      errors: { email: 'Email is required', password: 'Password is required' },
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
    });
    render(<LoginForm />);
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });
});
