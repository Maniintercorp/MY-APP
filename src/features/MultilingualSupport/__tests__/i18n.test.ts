import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_LANGUAGE, FALLBACK_LANGUAGE, I18N_OPTIONS, STATIC_SUPPORTED_LOCALES, SUPPORTED_NAMESPACES, i18n } from '@/features/MultilingualSupport/i18n';
import { LANGUAGE_STORAGE_KEY } from '@/features/MultilingualSupport/services';

describe('i18n', () => {
  beforeEach(async () => {
    window.localStorage.clear();
    await i18n.changeLanguage('en');
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('exposes the expected default configuration', () => {
    expect(DEFAULT_LANGUAGE).toBe('en');
    expect(FALLBACK_LANGUAGE).toBe('en');
    expect(I18N_OPTIONS.defaultNamespace).toBe('common');
    expect(SUPPORTED_NAMESPACES).toEqual(['common', 'navigation', 'validation', 'errors', 'multilingualSupport']);
    expect(STATIC_SUPPORTED_LOCALES.map((locale) => locale.code)).toEqual(['en', 'es', 'fr']);
  });

  it('translates namespaced and default-namespace keys', () => {
    expect(i18n.t('common:buttons.save')).toBe('Save');
    expect(i18n.t('buttons.cancel')).toBe('Cancel');
    expect(i18n.t('navigation:languageSettings')).toBe('Language settings');
  });

  it('interpolates primitive and Date values', () => {
    expect(i18n.t('validation:required', { values: { field: 'Email' } })).toBe('Email is required.');

    i18n.loadResourceBundle({
      locale: 'en',
      fallbackLocale: 'en',
      namespaces: {
        common: {
          dates: {
            savedAt: 'Saved at {{savedAt}}',
          },
        },
      },
    });

    expect(i18n.t('common:dates.savedAt', { values: { savedAt: new Date('2024-01-01T00:00:00.000Z') } })).toBe(
      'Saved at 2024-01-01T00:00:00.000Z'
    );
  });

  it('changes language, persists the selection, updates document attributes, and notifies subscribers', async () => {
    const listener = vi.fn();
    const unsubscribe = i18n.subscribe(listener);

    await i18n.changeLanguage('es');

    expect(i18n.language).toBe('es');
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('es');
    expect(document.documentElement.lang).toBe('es');
    expect(document.documentElement.dir).toBe('ltr');
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    await i18n.changeLanguage('fr');

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('falls back to the fallback language when changing to an unsupported language', async () => {
    await i18n.changeLanguage('de');

    expect(i18n.language).toBe('en');
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
  });

  it('merges dynamically loaded resource bundles into existing translations', () => {
    i18n.loadResourceBundle({
      locale: 'en',
      fallbackLocale: 'en',
      namespaces: {
        multilingualSupport: {
          selector: {
            helper: 'Helper text',
          },
          dynamic: {
            message: 'Dynamic {{value}}',
          },
        },
      },
    });

    expect(i18n.t('multilingualSupport:selector.label')).toBe('Choose language');
    expect(i18n.t('multilingualSupport:selector.helper')).toBe('Helper text');
    expect(i18n.t('multilingualSupport:dynamic.message', { values: { value: 42 } })).toBe('Dynamic 42');
  });

  it('uses fallback language translations when the active language is missing a key', async () => {
    i18n.loadResourceBundle({
      locale: 'en',
      fallbackLocale: 'en',
      namespaces: {
        common: {
          fallbackOnly: {
            message: 'Only in English',
          },
        },
      },
    });

    await i18n.changeLanguage('es');

    expect(i18n.t('common:fallbackOnly.message')).toBe('Only in English');
  });

  it('returns defaultValue or the key and warns when a translation is missing', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(i18n.t('common:not.present', { defaultValue: 'Default copy' })).toBe('Default copy');
    expect(i18n.t('common:still.not.present')).toBe('common:still.not.present');
    expect(warnSpy).toHaveBeenCalledWith('Missing translation key: common:not.present');
    expect(warnSpy).toHaveBeenCalledWith('Missing translation key: common:still.not.present');
  });
});
