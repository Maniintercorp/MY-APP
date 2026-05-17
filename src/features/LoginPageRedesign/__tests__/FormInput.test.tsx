import React from 'react';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormInput } from '@/features/LoginPageRedesign/components/FormInput';

describe('FormInput', () => {
  it('renders a labeled input and uses the name as the fallback id', () => {
    render(<FormInput label="Email" name="email" placeholder="you@example.com" />);

    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'email');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('placeholder', 'you@example.com');
  });

  it('wires helper text and error text through aria-describedby and aria-invalid', () => {
    render(<FormInput id="login-email" label="Email" helperText="Use your work email." error="Email is required." />);

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'login-email-helper login-email-error');
    expect(screen.getByText('Use your work email.')).toHaveAttribute('id', 'login-email-helper');
    expect(screen.getByRole('alert')).toHaveTextContent('Email is required.');
    expect(screen.getByRole('alert')).toHaveAttribute('id', 'login-email-error');
  });

  it('does not set aria-describedby or aria-invalid when helper text and error are absent', () => {
    render(<FormInput id="display-name" label="Display name" />);

    const input = screen.getByLabelText('Display name');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('renders optional icon and right element content', () => {
    render(
      <FormInput
        label="Search"
        icon={<span data-testid="leading-icon">icon</span>}
        rightElement={<button type="button">Clear</button>}
      />
    );

    expect(screen.getByTestId('leading-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('forwards refs to the underlying input element', () => {
    const ref = React.createRef<HTMLInputElement>();

    render(<FormInput ref={ref} label="Email" name="email" />);

    expect(ref.current).toBe(screen.getByLabelText('Email'));
    ref.current?.focus();
    expect(screen.getByLabelText('Email')).toHaveFocus();
  });

  it('passes disabled and custom className props to the input', () => {
    render(<FormInput label="Email" disabled className="custom-input-class" containerClassName="custom-container" />);

    const input = screen.getByLabelText('Email');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('custom-input-class');
  });
});
