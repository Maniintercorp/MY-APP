import '@testing-library/jest-dom/vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LoginForm } from '@/features/LoginRegistrationPage/components';

describe('LoginForm', () => {
  it('renders messages and loading state', () => {
    render(
      <LoginForm
        onSubmit={vi.fn()}
        isLoading
        errorMessage="Invalid credentials."
        successMessage="Signed in."
      />
    );

    expect(screen.getByText('Invalid credentials.')).toBeInTheDocument();
    expect(screen.getByText('Signed in.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
  });

  it('validates required fields and prevents submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} isLoading={false} />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('validates email format and minimum password length', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} isLoading={false} />);

    await user.type(screen.getByLabelText(/email address/i), 'not-an-email');
    await user.type(screen.getByLabelText(/^password$/i), 'short');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Password must be at least 8 characters.')).toBeInTheDocument();
  });

  it('clears field-specific validation errors after field changes', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} isLoading={false} />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText('Email is required.')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');

    expect(screen.queryByText('Email is required.')).not.toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} isLoading={false} />);
    const password = screen.getByLabelText(/^password$/i);

    expect(password).toHaveAttribute('type', 'password');
    await user.click(screen.getByRole('button', { name: /show password/i }));
    expect(password).toHaveAttribute('type', 'text');
    await user.click(screen.getByRole('button', { name: /hide password/i }));
    expect(password).toHaveAttribute('type', 'password');
  });

  it('submits trimmed email and password when valid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<LoginForm onSubmit={onSubmit} isLoading={false} />);

    await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ email: 'jane@example.com', password: 'password123' })
    );
  });
});
