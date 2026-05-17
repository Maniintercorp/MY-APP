import '@testing-library/jest-dom/vitest';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LoginPage } from '@/features/LoginPageRedesign/pages/LoginPage';

vi.mock('@/features/LoginPageRedesign/components', async () => {
  const React = await import('react');

  return {
    AuthLayout: ({ children }: { children: React.ReactNode }) =>
      React.createElement('div', { 'data-testid': 'auth-layout' }, children),
    LoginCard: () => React.createElement('div', { 'data-testid': 'login-card' }, 'Login card'),
  };
});

describe('LoginPage', () => {
  it('composes AuthLayout and LoginCard', () => {
    render(<LoginPage />);

    const layout = screen.getByTestId('auth-layout');
    expect(layout).toBeInTheDocument();
    expect(within(layout).getByTestId('login-card')).toHaveTextContent('Login card');
  });
});
