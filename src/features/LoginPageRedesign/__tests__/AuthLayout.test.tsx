import '@testing-library/jest-dom/vitest';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthLayout } from '@/features/LoginPageRedesign/components/AuthLayout';

describe('AuthLayout', () => {
  it('renders supplied children inside the sign in form region', () => {
    render(
      <AuthLayout>
        <div>Login form content</div>
      </AuthLayout>
    );

    const formRegion = screen.getByRole('region', { name: /sign in form/i });
    expect(within(formRegion).getByText('Login form content')).toBeInTheDocument();
  });

  it('renders the desktop benefits content with accessible section labeling', () => {
    render(
      <AuthLayout>
        <div>Child</div>
      </AuthLayout>
    );

    const benefitsRegion = screen.getByRole('region', { name: /authentication benefits/i });
    expect(within(benefitsRegion).getByText(/secure saas workspace/i)).toBeInTheDocument();
    expect(within(benefitsRegion).getByRole('heading', { name: /sign in to manage your workspace/i })).toBeInTheDocument();
    expect(within(benefitsRegion).getByText(/protected authentication with persistent sessions/i)).toBeInTheDocument();
    expect(within(benefitsRegion).getByText(/responsive layout optimized/i)).toBeInTheDocument();
  });
});
