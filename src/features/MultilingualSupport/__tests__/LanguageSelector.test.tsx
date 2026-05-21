import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('lucide-react', () => ({
  AlertCircle: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="alert-icon" {...props} />,
  Check: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="check-icon" {...props} />,
  Globe: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="globe-icon" {...props} />,
  Loader2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="loader-icon" {...props} />,
}));

const changeLanguage = vi.fn();
const languageState = {
  currentLanguage: 'en',
  fallbackLanguage: 'en',
  availableLanguages: [
    { code: 'en', displayName: 'English', nativeName: 'English', isDefault: true, isEnabled: true, direction: 'ltr' as const },
    { code: 'es', displayName: 'Spanish', nativeName: 'Español', isDefault: false, isEnabled: true, direction: 'ltr' as const },
  ],
  isLoading: false,
  isChangingLanguage: false,
  error: null as unknown,
  changeLanguage,
};

const t = vi.fn((key: string, options?: { values?: Record<string, unknown> }) => {
  const dictionary: Record<string, string> = {
    'multilingualSupport:selector.label': 'Choose language',
    'multilingualSupport:selector.currentLanguage': `Current language: ${options?.values?.language ?? ''}`,
    'errors:switchLanguage': 'Unable to save the selected language.',
  };
  return dictionary[key] ?? key;
});

vi.mock('@/features/MultilingualSupport/hooks', () => ({
  useLocalizedText: () => ({ language: languageState.currentLanguage, t }),
  useLanguage: () => languageState,
}));

import { LanguageSelector } from '@/features/MultilingualSupport/components/LanguageSelector';

describe('LanguageSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(languageState, {
      currentLanguage: 'en',
      isLoading: false,
      isChangingLanguage: false,
      error: null,
      changeLanguage,
    });
  });

  it('renders a labeled select with full language names and the active language helper', () => {
    render(<LanguageSelector className="custom-class" />);

    const select = screen.getByLabelText('Choose language') as HTMLSelectElement;

    expect(select.value).toBe('en');
    expect(select.disabled).toBe(false);
    expect(screen.getByText('English (English)')).not.toBeNull();
    expect(screen.getByText('Español (Spanish)')).not.toBeNull();
    expect(screen.getByText('Current language: English')).not.toBeNull();
    expect(screen.getByTestId('check-icon')).not.toBeNull();
  });

  it('renders compact options and hides label/helper when requested', () => {
    render(<LanguageSelector compact showLabel={false} />);

    expect(screen.queryByText('Choose language')).toBeNull();
    expect(screen.getByText('EN')).not.toBeNull();
    expect(screen.getByText('ES')).not.toBeNull();
    expect(screen.queryByText('Current language: English')).toBeNull();
  });

  it('calls changeLanguage when the selected option changes', () => {
    render(<LanguageSelector />);

    fireEvent.change(screen.getByLabelText('Choose language'), { target: { value: 'es' } });

    expect(changeLanguage).toHaveBeenCalledWith('es');
  });

  it('disables the select and shows a loader while loading', () => {
    languageState.isLoading = true;

    render(<LanguageSelector />);

    expect((screen.getByLabelText('Choose language') as HTMLSelectElement).disabled).toBe(true);
    expect(screen.getByTestId('loader-icon')).not.toBeNull();
  });

  it('disables the select and shows a loader while changing language', () => {
    languageState.isChangingLanguage = true;

    render(<LanguageSelector />);

    expect((screen.getByLabelText('Choose language') as HTMLSelectElement).disabled).toBe(true);
    expect(screen.getByTestId('loader-icon')).not.toBeNull();
  });

  it('renders a localized alert when an error exists', () => {
    languageState.error = new Error('failed');

    render(<LanguageSelector />);

    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain('Unable to save the selected language.');
    expect(screen.getByTestId('alert-icon')).not.toBeNull();
  });
});
