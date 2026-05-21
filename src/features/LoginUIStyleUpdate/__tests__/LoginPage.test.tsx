import { render, screen } from '@testing-library/react';
import { LoginPage } from '../pages/LoginPage';
import React from 'react';

vi.mock('../components/LoginForm', () => ({
  LoginForm: () => <div data-testid="login-form-mock">login form</div>,
}));

describe('LoginPage', () => {
  it('renders LoginForm and footer copyright', () => {
    render(<LoginPage />);
    expect(screen.getByTestId('login-form-mock')).toBeInTheDocument();
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
  });
});
