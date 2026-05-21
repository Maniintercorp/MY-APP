import '@testing-library/jest-dom/vitest';
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthCard, AuthLayout } from '@/features/LoginRegistrationPage/components';

describe('AuthLayout', () => {
  it('renders marketing content, benefits, and children', () => {
    render(
      <AuthLayout>
        <button>Child action</button>
      </AuthLayout>
    );

    expect(screen.getByText('Secure SaaS Authentication')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /welcome to a cleaner way/i })).toBeInTheDocument();
    expect(screen.getByText('Secure JWT-based access for your workspace')).toBeInTheDocument();
    expect(screen.getByText('Fast onboarding with a clean user profile')).toBeInTheDocument();
    expect(screen.getByText('Responsive experience across desktop and mobile')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Child action' })).toBeInTheDocument();
  });
});

describe('AuthCard', () => {
  it('renders title, subtitle, children, brand mark, and optional footer', () => {
    render(
      <AuthCard title="Sign in" subtitle="Continue to your workspace" footer={<a href="/register">Register</a>}>
        <form aria-label="auth form" />
      </AuthCard>
    );

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByText('Continue to your workspace')).toBeInTheDocument();
    expect(screen.getByRole('form', { name: 'auth form' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Register' })).toBeInTheDocument();
  });

  it('does not render a footer container when footer is omitted', () => {
    const { container } = render(
      <AuthCard title="Title" subtitle="Subtitle">
        <span>Body</span>
      </AuthCard>
    );

    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(within(container).queryByText(/register/i)).not.toBeInTheDocument();
  });
});
