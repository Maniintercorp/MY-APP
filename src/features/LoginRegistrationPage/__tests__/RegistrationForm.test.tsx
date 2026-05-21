import '@testing-library/jest-dom/vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RegistrationForm } from '@/features/LoginRegistrationPage/components';

describe('RegistrationForm', () => {
  it('renders messages and loading state', () => {
    render(
      <RegistrationForm
        onSubmit={vi.fn()}
        isLoading
        errorMessage="Email already exists."
        successMessage="Account created."
      />
    );

    expect(screen.getByText('Email already exists.')).toBeInTheDocument();
    expect(screen.getByText('Account created.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled();
  });

  it('validates required fields and prevents submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<RegistrationForm onSubmit={onSubmit} isLoading={false} />);

    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText('First name is required.')).toBeInTheDocument();
    expect(screen.getByText('Last name is required.')).toBeInTheDocument();
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
    expect(screen.getByText('Please confirm your password.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('validates email, password length, and password confirmation', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm onSubmit={vi.fn()} isLoading={false} />);

    await user.type(screen.getByLabelText(/first name/i), 'Jane');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email address/i), 'bad-email');
    await user.type(screen.getByLabelText(/^password$/i), 'short');
    await user.type(screen.getByLabelText(/confirm password/i), 'different');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Password must be at least 8 characters.')).toBeInTheDocument();
    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
  });

  it('toggles password and confirm-password visibility independently', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm onSubmit={vi.fn()} isLoading={false} />);
    const password = screen.getByLabelText(/^password$/i);
    const confirmPassword = screen.getByLabelText(/confirm password/i);

    expect(password).toHaveAttribute('type', 'password');
    expect(confirmPassword).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: /^show password$/i }));
    expect(password).toHaveAttribute('type', 'text');
    expect(confirmPassword).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: /show confirm password/i }));
    expect(confirmPassword).toHaveAttribute('type', 'text');
  });

  it('submits trimmed values when valid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<RegistrationForm onSubmit={onSubmit} isLoading={false} />);

    await user.type(screen.getByLabelText(/first name/i), 'Jane');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })
    );
  });
});
