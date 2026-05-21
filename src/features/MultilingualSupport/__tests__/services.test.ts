import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

vi.mock('@/lib/api', () => ({
  default: {
    get: async (url: string, config?: { params?: Record<string, string> }) => {
      const requestUrl = new URL(url, 'http://localhost');
      Object.entries(config?.params ?? {}).forEach(([key, value]) => requestUrl.searchParams.set(key, value));
      const response = await fetch(requestUrl.toString());
      return { data: await response.json() };
    },
    put: async (url: string, body: unknown) => {
      const response = await fetch(new URL(url, 'http://localhost').toString(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return { data: await response.json() };
    },
  },
}));

import {
  LANGUAGE_STORAGE_KEY,
  clearStoredAnonymousLanguage,
  getStoredAnonymousLanguage,
  getSupportedLocales,
  getTranslationResources,
  getUserLanguagePreference,
  persistAnonymousLanguage,
  updateUserLanguagePreference,
} from '@/features/MultilingualSupport/services';

const server = setupServer(
  http.get('http://localhost/api/i18n/locales', () =>
    HttpResponse.json({
      defaultLocale: 'en',
      locales: [
        { code: 'en', displayName: 'English', nativeName: 'English', isDefault: true, isEnabled: true, direction: 'ltr' },
        { code: 'es', displayName: 'Spanish', nativeName: 'Español', isDefault: false, isEnabled: true, direction: 'ltr' },
      ],
    })
  ),
  http.get('http://localhost/api/i18n/translations/:locale', ({ params, request }) => {
    const url = new URL(request.url);
    return HttpResponse.json({
      locale: params.locale,
      fallbackLocale: 'en',
      namespaces: {
        [url.searchParams.get('namespace') ?? 'common']: {
          greeting: 'Hello',
        },
      },
    });
  }),
  http.get('http://localhost/api/users/me/preferences', () =>
    HttpResponse.json({
      userId: 'user-1',
      preferredLanguageCode: 'fr',
      effectiveLanguageCode: 'fr',
      updatedAt: '2024-01-01T00:00:00.000Z',
    })
  ),
  http.put('http://localhost/api/users/me/language', async ({ request }) => {
    const body = (await request.json()) as { languageCode: string };
    return HttpResponse.json({
      userId: 'user-1',
      preferredLanguageCode: body.languageCode,
      effectiveLanguageCode: body.languageCode,
      updatedAt: '2024-01-02T00:00:00.000Z',
      message: 'Updated',
    });
  })
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  window.localStorage.clear();
});
afterAll(() => server.close());

describe('MultilingualSupport services', () => {
  it('loads supported locales from the expected endpoint', async () => {
    const result = await getSupportedLocales();

    expect(result.defaultLocale).toBe('en');
    expect(result.locales).toHaveLength(2);
    expect(result.locales[1]).toMatchObject({ code: 'es', nativeName: 'Español', isEnabled: true });
  });

  it('loads translation resources without a namespace query parameter', async () => {
    const result = await getTranslationResources('es');

    expect(result.locale).toBe('es');
    expect(result.fallbackLocale).toBe('en');
    expect(result.namespaces.common).toEqual({ greeting: 'Hello' });
  });

  it('loads translation resources with a namespace query parameter', async () => {
    const result = await getTranslationResources('fr', 'errors');

    expect(result.locale).toBe('fr');
    expect(result.namespaces.errors).toEqual({ greeting: 'Hello' });
    expect(result.namespaces.common).toBeUndefined();
  });

  it('loads the current user language preference', async () => {
    const result = await getUserLanguagePreference();

    expect(result).toMatchObject({
      userId: 'user-1',
      preferredLanguageCode: 'fr',
      effectiveLanguageCode: 'fr',
    });
  });

  it('updates the current user language preference with the provided payload', async () => {
    const result = await updateUserLanguagePreference({ languageCode: 'es' });

    expect(result).toMatchObject({
      userId: 'user-1',
      preferredLanguageCode: 'es',
      effectiveLanguageCode: 'es',
      message: 'Updated',
    });
  });

  it('persists, reads, and clears anonymous language preferences in localStorage', () => {
    expect(getStoredAnonymousLanguage()).toBeNull();

    persistAnonymousLanguage('fr');

    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('fr');
    expect(getStoredAnonymousLanguage()).toBe('fr');

    clearStoredAnonymousLanguage();

    expect(getStoredAnonymousLanguage()).toBeNull();
  });
});
