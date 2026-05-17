import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('lucide-react', () => ({
  AlertCircle: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="alert-icon" {...props} />,
  CheckCircle: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="check-circle-icon" {...props} />,
  Globe: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="globe-icon" {...props} />,
}));

vi.mock('@/features/MultilingualSupport/components', () => ({
  LanguageSelector: () => <div data-testid="language-selector">Language selector</div>,
  LocalizedDemoCard: () => <div data-testid="localized-demo-card">Localized demo card</div>,
}));

const languageState = {
  currentLanguage: 'es',
  fallbackLanguage: 'en',
  availableLanguages: [
    { code: 'en', displayName: 'English', nativeName: 'English', isDefault: true, isEnabled: true, direction: 'ltr' as const },
    { code: 'es', displayName: 'Spanish', nativeName: 'Español', isDefault: false, isEnabled: true, direction: 'ltr' as const },
  ],
  isLoading: false,
  isChangingLanguage: false,
  error: null as unknown,
  changeLanguage: vi.fn(),
};

const t = vi.fn((key: string) => {
  const dictionary: Record<string, string> = {
    'multilingualSupport:page.title': 'Multilingual support',
    'multilingualSupport:page.subtitle': 'Switch languages and preview localized formatting.',
    'multilingualSupport:status.activeLanguage': 'Active language',
    'multilingualSupport:status.fallbackLanguage': 'Fallback language',
    'multilingualSupport:status.resourceState': 'Translation resources',
    'multilingualSupport:status.ready': 'Ready',
    'common:buttons.loading': 'Loading...',
    'errors:loadTranslations': 'Unable to load translation resources.',
  };
  return dictionary[key] ?? key;
});

vi.mock('@/features/MultilingualSupport/hooks', () => ({
  useLocalizedText: () => ({ language: languageState.currentLanguage, t }),
  useLanguage: () => languageState,
}));

import { LanguageSettingsPage } from '@/features/MultilingualSupport/pages/LanguageSettingsPage';

describe('LanguageSettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(languageState, {
      currentLanguage: 'es',
      fallbackLanguage: 'en',
      isLoading: false,
      error: null,
    });
  });

  it('renders the page header, selector, status cards, and demo card', () => {
    render(<LanguageSettingsPage />);

    expect(screen.getByRole('heading', { name: 'Multilingual support' })).not.toBeNull();
    expect(screen.getByText('Switch languages and preview localized formatting.')).not.toBeNull();
    expect(screen.getByTestId('language-selector')).not.toBeNull();
    expect(screen.getByText('Active language')).not.toBeNull();
    expect(screen.getByText('Español')).not.toBeNull();
    expect(screen.getByText('Fallback language')).not.toBeNull();
    expect(screen.getByText('EN')).not.toBeNull();
    expect(screen.getByText('Translation resources')).not.toBeNull();
    expect(screen.getByText('Ready')).not.toBeNull();
    expect(screen.getByTestId('check-circle-icon')).not.toBeNull();
    expect(screen.getByTestId('localized-demo-card')).not.toBeNull();
  });

  it('falls back to the language code when the active locale is not found', () => {
    languageState.currentLanguage = 'fr';

    render(<LanguageSettingsPage />);

    expect(screen.getByText('fr')).not.toBeNull();
  });

  it('renders a loading resource state while language data is loading', () => {
    languageState.isLoading = true;

    render(<LanguageSettingsPage />);

    expect(screen.getByText('Loading...')).not.toBeNull();
    expect(screen.queryByText('Ready')).toBeNull();
  });

  it('renders a localized alert when language resources fail to load', () => {
    languageState.error = new Error('translations failed');

    render(<LanguageSettingsPage />);

    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain('Unable to load translation resources.');
    expect(screen.getByTestId('alert-icon')).not.toBeNull();
  });
});
