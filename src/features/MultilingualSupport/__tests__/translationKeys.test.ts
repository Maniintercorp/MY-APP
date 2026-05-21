import { describe, expect, it } from 'vitest';
import { translationKeyConventions, translationKeys } from '@/features/MultilingualSupport/types/translationKeys';

describe('translation key conventions', () => {
  it('defines stable namespaced keys for supported namespaces', () => {
    expect(translationKeys.common.buttons.save).toBe('common:buttons.save');
    expect(translationKeys.navigation.languageSettings).toBe('navigation:languageSettings');
    expect(translationKeys.validation.unsupportedLanguage).toBe('validation:unsupportedLanguage');
    expect(translationKeys.errors.switchLanguage).toBe('errors:switchLanguage');
    expect(translationKeys.multilingualSupport.pageTitle).toBe('multilingualSupport:page.title');
  });

  it('documents every supported namespace with examples that follow namespace:path format', () => {
    const namespaces = translationKeyConventions.map((convention) => convention.namespace);

    expect(namespaces).toEqual(['common', 'navigation', 'validation', 'errors', 'multilingualSupport']);

    translationKeyConventions.forEach((convention) => {
      expect(convention.usage.length).toBeGreaterThan(20);
      expect(convention.examples.length).toBeGreaterThan(0);
      convention.examples.forEach((example) => {
        expect(example.startsWith(`${convention.namespace}:`)).toBe(true);
        expect(example.split(':')[1].length).toBeGreaterThan(0);
      });
    });
  });
});
