import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { PasswordInput } from '@/features/LoginPageRedesign/components/PasswordInput';

describe('PasswordInput', () => {
  it('renders as a password field by default', () => {
    render(<PasswordInput label="Password" name="password" />);

    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument();
  });

  it('toggles password visibility when the visibility button is clicked', async () => {
    const user = userEvent.setup();
    render(<PasswordInput label="Password" name="password" />);

    const input = screen.getByLabelText('Password');
    const showButton = screen.getByRole('button', { name: /show password/i });

    await user.click(showButton);
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /hide password/i }));
    expect(input).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument();
  });

  it('disables both the input and visibility toggle when disabled is true', async () => {
    const user = userEvent.setup();
    render(<PasswordInput label="Password" name="password" disabled />);

    const input = screen.getByLabelText('Password');
    const toggle = screen.getByRole('button', { name: /show password/i });

    expect(input).toBeDisabled();
    expect(toggle).toBeDisabled();

    await user.click(toggle);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('passes helper text and errors through to the composed FormInput', () => {
    render(<PasswordInput label="Password" helperText="At least 8 characters." error="Password is required." />);

    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('At least 8 characters.')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Password is required.');
  });
});
