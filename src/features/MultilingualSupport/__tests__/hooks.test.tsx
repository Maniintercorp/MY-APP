import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const persistedLanguages: string[] = [];

vi.mock('@/features/MultilingualSupport/services', () => ({
  LANGUAGE_STORAGE_KEY: 'app.language',
  getStoredAnonymousLanguage: vi.fn(() => window.localStorage.getItem('app.language')),
  persistAnonymousLanguage: vi.fn((languageCode: string) => {
    persistedLanguages.push(languageCode);
    window.localStorage.setItem('app.language', languageCode);
  }),
  clearStoredAnonymousLanguage: vi.fn(() => window.localStorage.removeItem('app.language')),
  getSupportedLocales: vi.fn(),
  getTranslationResources: vi.fn(),
  getUserLanguagePreference: vi.fn(),
  updateUserLanguagePreference: vi.fn(),
}));

import { i18n } from '@/features/MultilingualSupport/i18n';
import { useLanguage, useLocalizedText } from '@/features/MultilingualSupport/hooks';
import {
  getSupportedLocales,
  getTranslationResources,
  getUserLanguagePreference,
  persistAnonymousLanguage,
  updateUserLanguagePreference,
} from '@/features/MultilingualSupport/services';

const locales = [
  { code: 'en', displayName: 'English', nativeName: 'English', isDefault: true, isEnabled: true, direction: 'ltr' as const },
  { code: 'es', displayName: 'Spanish', nativeName: 'Español', isDefault: false, isEnabled: true, direction: 'ltr' as const },
  { code: 'fr', displayName: 'French', nativeName: 'Français', isDefault: false, isEnabled: true, direction: 'ltr' as const },
  { code: 'de', displayName: 'German', nativeName: 'Deutsch', isDefault: false, isEnabled: false, direction: 'ltr' as const },
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  return ({ children }: PropsWithChildren) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('MultilingualSupport hooks', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    persistedLanguages.length = 0;
    window.localStorage.clear();
    await i18n.changeLanguage('en');

    vi.mocked(getSupportedLocales).mockResolvedValue({ defaultLocale: 'en', locales });
    vi.mocked(getTranslationResources).mockImplementation(async (locale: string) => ({
      locale,
      fallbackLocale: 'en',
      namespaces: {
        common: { dynamicHookValue: `Dynamic ${locale}` },
      },
    }));
    vi.mocked(getUserLanguagePreference).mockResolvedValue({
      userId: 'user-1',
      preferredLanguageCode: 'es',
      effectiveLanguageCode: 'es',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });
    vi.mocked(updateUserLanguagePreference).mockImplementation(async ({ languageCode }) => ({
      userId: 'user-1',
      preferredLanguageCode: languageCode,
      effectiveLanguageCode: languageCode,
      updatedAt: '2024-01-02T00:00:00.000Z',
    }));
  });

  it('useLocalizedText returns the active language and translates keys', async () => {
    const { result } = renderHook(() => useLocalizedText());

    expect(result.current.language).toBe('en');
    expect(result.current.t('common:buttons.save')).toBe('Save');

    await act(async () => {
      await i18n.changeLanguage('fr');
    });

    expect(result.current.language).toBe('fr');
    expect(result.current.t('common:buttons.save')).toBe('Enregistrer');
  });

  it('useLanguage loads locales and translations for anonymous users', async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(getSupportedLocales).toHaveBeenCalledTimes(1);
    expect(getTranslationResources).toHaveBeenCalledWith('en');
    expect(getUserLanguagePreference).not.toHaveBeenCalled();
    expect(result.current.currentLanguage).toBe('en');
    expect(result.current.fallbackLanguage).toBe('en');
    expect(result.current.availableLanguages.map((locale) => locale.code)).toEqual(['en', 'es', 'fr']);
    expect(result.current.error).toBeNull();
  });

  it('useLanguage changes language locally for anonymous users and avoids preference mutation', async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.changeLanguage('es');
    });

    expect(result.current.currentLanguage).toBe('es');
    expect(persistAnonymousLanguage).toHaveBeenCalledWith('es');
    expect(window.localStorage.getItem('app.language')).toBe('es');
    expect(updateUserLanguagePreference).not.toHaveBeenCalled();
  });

  it('useLanguage falls back when an unavailable language is requested', async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.changeLanguage('de');
    });

    expect(result.current.currentLanguage).toBe('en');
    expect(persistAnonymousLanguage).toHaveBeenCalledWith('en');
  });

  it('useLanguage applies authenticated preferences and persists server-side updates', async () => {
    window.localStorage.setItem('accessToken', 'token');

    const { result } = renderHook(() => useLanguage(), { wrapper: createWrapper() });

    await waitFor(() => expect(getUserLanguagePreference).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(result.current.currentLanguage).toBe('es'));

    await act(async () => {
      await result.current.changeLanguage('fr');
    });

    expect(updateUserLanguagePreference).toHaveBeenCalledWith({ languageCode: 'fr' });
    expect(result.current.currentLanguage).toBe('fr');
  });

  it('useLanguage exposes query errors', async () => {
    const error = new Error('locales failed');
    vi.mocked(getSupportedLocales).mockRejectedValue(error);

    const { result } = renderHook(() => useLanguage(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe(error);
  });
});
