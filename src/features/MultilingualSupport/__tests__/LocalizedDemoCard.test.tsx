import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('lucide-react', () => ({
  AlertCircle: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="alert-icon" {...props} />,
  CheckCircle: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="success-icon" {...props} />,
}));

const languageState = {
  currentLanguage: 'en',
  fallbackLanguage: 'en',
  availableLanguages: [],
  isLoading: false,
  isChangingLanguage: false,
  error: null,
  changeLanguage: vi.fn(),
};

const t = vi.fn((key: string, options?: { values?: Record<string, unknown> }) => {
  const dictionary: Record<string, string> = {
    'multilingualSupport:demo.title': 'Localized UI preview',
    'multilingualSupport:demo.description': 'These examples update immediately.',
    'multilingualSupport:demo.date': 'Date',
    'multilingualSupport:demo.number': 'Number',
    'multilingualSupport:demo.currency': 'Currency',
    'multilingualSupport:demo.validationSuccess': 'The localized form was submitted successfully.',
    'common:forms.email': 'Email',
    'common:buttons.submit': 'Submit',
    'validation:required': `${options?.values?.field ?? 'Field'} is required.`,
    'validation:email': 'Enter a valid email address.',
  };
  return dictionary[key] ?? key;
});

vi.mock('@/features/MultilingualSupport/hooks', () => ({
  useLocalizedText: () => ({ language: languageState.currentLanguage, t }),
  useLanguage: () => languageState,
}));

vi.mock('@/features/MultilingualSupport/utils/formatters', () => ({
  formatDate: vi.fn(() => 'Friday, March 15, 2024'),
  formatNumber: vi.fn(() => '1,284,567.89'),
  formatCurrency: vi.fn(() => '$2,499.99'),
}));

import { LocalizedDemoCard } from '@/features/MultilingualSupport/components/LocalizedDemoCard';
import { formatCurrency, formatDate, formatNumber } from '@/features/MultilingualSupport/utils/formatters';

describe('LocalizedDemoCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    languageState.currentLanguage = 'en';
  });

  it('renders localized headings, formatted examples, and the email form', () => {
    render(<LocalizedDemoCard />);

    expect(screen.getByRole('heading', { name: 'Localized UI preview' })).not.toBeNull();
    expect(screen.getByText('These examples update immediately.')).not.toBeNull();
    expect(screen.getByText('Friday, March 15, 2024')).not.toBeNull();
    expect(screen.getByText('1,284,567.89')).not.toBeNull();
    expect(screen.getByText('$2,499.99')).not.toBeNull();
    expect(screen.getByLabelText('Email')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Submit' })).not.toBeNull();
  });

  it('passes the active language and currency to formatter utilities', () => {
    languageState.currentLanguage = 'fr';

    render(<LocalizedDemoCard />);

    expect(formatDate).toHaveBeenCalledWith(expect.any(Date), 'fr', { dateStyle: 'full' });
    expect(formatNumber).toHaveBeenCalledWith(1284567.89, 'fr');
    expect(formatCurrency).toHaveBeenCalledWith(2499.99, 'EUR', 'fr');
  });

  it('shows a required validation message when submitting an empty email', () => {
    render(<LocalizedDemoCard />);

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByRole('alert').textContent).toContain('Email is required.');
    expect((screen.getByLabelText('Email') as HTMLInputElement).getAttribute('aria-invalid')).toBe('true');
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('shows an email validation message for invalid email input', () => {
    render(<LocalizedDemoCard />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'not-an-email' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByRole('alert').textContent).toContain('Enter a valid email address.');
  });

  it('clears validation errors when the email changes', () => {
    render(<LocalizedDemoCard />);

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByRole('alert')).not.toBeNull();

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'person@example.com' } });

    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('submits successfully with a valid email and renders a localized success status', () => {
    render(<LocalizedDemoCard />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'person@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    const status = screen.getByRole('status');
    expect(status.textContent).toContain('The localized form was submitted successfully.');
    expect(screen.getByTestId('success-icon')).not.toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
