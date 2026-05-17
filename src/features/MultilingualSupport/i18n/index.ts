import enCommon from '@/features/MultilingualSupport/locales/en/common.json';
import enNavigation from '@/features/MultilingualSupport/locales/en/navigation.json';
import enValidation from '@/features/MultilingualSupport/locales/en/validation.json';
import enErrors from '@/features/MultilingualSupport/locales/en/errors.json';
import enFeature from '@/features/MultilingualSupport/locales/en/multilingualSupport.json';
import esCommon from '@/features/MultilingualSupport/locales/es/common.json';
import esNavigation from '@/features/MultilingualSupport/locales/es/navigation.json';
import esValidation from '@/features/MultilingualSupport/locales/es/validation.json';
import esErrors from '@/features/MultilingualSupport/locales/es/errors.json';
import esFeature from '@/features/MultilingualSupport/locales/es/multilingualSupport.json';
import frCommon from '@/features/MultilingualSupport/locales/fr/common.json';
import frNavigation from '@/features/MultilingualSupport/locales/fr/navigation.json';
import frValidation from '@/features/MultilingualSupport/locales/fr/validation.json';
import frErrors from '@/features/MultilingualSupport/locales/fr/errors.json';
import frFeature from '@/features/MultilingualSupport/locales/fr/multilingualSupport.json';
import { getStoredAnonymousLanguage, persistAnonymousLanguage } from '@/features/MultilingualSupport/services';
import type {
  SupportedLocale,
  TranslateOptions,
  TranslationDictionary,
  TranslationNamespace,
  TranslationResourcesResponse,
} from '@/features/MultilingualSupport/types';

export const DEFAULT_LANGUAGE = 'en';
export const FALLBACK_LANGUAGE = 'en';
export const DEFAULT_NAMESPACE: TranslationNamespace = 'common';
export const SUPPORTED_NAMESPACES: TranslationNamespace[] = [
  'common',
  'navigation',
  'validation',
  'errors',
  'multilingualSupport',
];

export const I18N_OPTIONS = {
  defaultLanguage: DEFAULT_LANGUAGE,
  fallbackLanguage: FALLBACK_LANGUAGE,
  defaultNamespace: DEFAULT_NAMESPACE,
  namespaces: SUPPORTED_NAMESPACES,
  interpolation: {
    escapeValue: false,
    prefix: '{{',
    suffix: '}}',
  },
};

export const STATIC_SUPPORTED_LOCALES: SupportedLocale[] = [
  { code: 'en', displayName: 'English', nativeName: 'English', isDefault: true, isEnabled: true, direction: 'ltr' },
  { code: 'es', displayName: 'Spanish', nativeName: 'Español', isDefault: false, isEnabled: true, direction: 'ltr' },
  { code: 'fr', displayName: 'French', nativeName: 'Français', isDefault: false, isEnabled: true, direction: 'ltr' },
];

interface I18nSnapshot {
  language: string;
  version: number;
}

type Listener = () => void;

type ResourceStore = Record<string, Partial<Record<TranslationNamespace, TranslationDictionary>>>;

const resources: ResourceStore = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    validation: enValidation,
    errors: enErrors,
    multilingualSupport: enFeature,
  },
  es: {
    common: esCommon,
    navigation: esNavigation,
    validation: esValidation,
    errors: esErrors,
    multilingualSupport: esFeature,
  },
  fr: {
    common: frCommon,
    navigation: frNavigation,
    validation: frValidation,
    errors: frErrors,
    multilingualSupport: frFeature,
  },
};

let currentLanguage = DEFAULT_LANGUAGE;
let version = 0;
const listeners = new Set<Listener>();

const isTranslationNamespace = (value: string): value is TranslationNamespace =>
  SUPPORTED_NAMESPACES.includes(value as TranslationNamespace);

const getBrowserLanguage = (): string | null => {
  if (typeof navigator === 'undefined') return null;
  const detected = navigator.languages?.[0] ?? navigator.language;
  return detected ? detected.split('-')[0] : null;
};

const isSupportedLanguage = (languageCode: string): boolean =>
  STATIC_SUPPORTED_LOCALES.some((locale) => locale.code === languageCode && locale.isEnabled);

const resolveInitialLanguage = (): string => {
  const storedLanguage = getStoredAnonymousLanguage();
  if (storedLanguage && isSupportedLanguage(storedLanguage)) return storedLanguage;

  const browserLanguage = getBrowserLanguage();
  if (browserLanguage && isSupportedLanguage(browserLanguage)) return browserLanguage;

  return DEFAULT_LANGUAGE;
};

const notify = (): void => {
  listeners.forEach((listener) => listener());
};

const updateDocumentLanguage = (languageCode: string): void => {
  if (typeof document === 'undefined') return;
  const locale = STATIC_SUPPORTED_LOCALES.find((item) => item.code === languageCode);
  document.documentElement.lang = languageCode;
  document.documentElement.dir = locale?.direction ?? 'ltr';
};

const getNestedValue = (dictionary: TranslationDictionary | undefined, key: string): string | undefined => {
  if (!dictionary) return undefined;
  const segments = key.split('.');
  let current: string | TranslationDictionary | undefined = dictionary;

  for (const segment of segments) {
    if (typeof current === 'string') return undefined;
    current = current[segment];
    if (current === undefined) return undefined;
  }

  return typeof current === 'string' ? current : undefined;
};

const interpolate = (template: string, values?: TranslateOptions['values']): string => {
  if (!values) return template;

  return Object.entries(values).reduce((result, [key, value]) => {
    const replacement = value instanceof Date ? value.toISOString() : String(value ?? '');
    return result.replaceAll(`{{${key}}}`, replacement);
  }, template);
};

const parseTranslationKey = (key: string, namespace?: TranslationNamespace): { namespace: TranslationNamespace; path: string } => {
  const [possibleNamespace, ...pathParts] = key.split(':');

  if (pathParts.length > 0 && isTranslationNamespace(possibleNamespace)) {
    return { namespace: possibleNamespace, path: pathParts.join(':') };
  }

  return { namespace: namespace ?? DEFAULT_NAMESPACE, path: key };
};

const mergeDictionary = (target: TranslationDictionary, source: TranslationDictionary): TranslationDictionary => {
  const merged: TranslationDictionary = { ...target };

  Object.entries(source).forEach(([key, value]) => {
    const currentValue = merged[key];
    if (typeof value === 'string') {
      merged[key] = value;
      return;
    }

    if (typeof currentValue === 'string' || currentValue === undefined) {
      merged[key] = value;
      return;
    }

    merged[key] = mergeDictionary(currentValue, value);
  });

  return merged;
};

export const i18n = {
  init: (): void => {
    currentLanguage = resolveInitialLanguage();
    updateDocumentLanguage(currentLanguage);
  },

  get language(): string {
    return currentLanguage;
  },

  getSnapshot: (): I18nSnapshot => ({ language: currentLanguage, version }),

  subscribe: (listener: Listener): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  changeLanguage: async (languageCode: string): Promise<void> => {
    const nextLanguage = isSupportedLanguage(languageCode) ? languageCode : FALLBACK_LANGUAGE;
    currentLanguage = nextLanguage;
    persistAnonymousLanguage(nextLanguage);
    updateDocumentLanguage(nextLanguage);
    version += 1;
    notify();
  },

  loadResourceBundle: (response: TranslationResourcesResponse): void => {
    const localeResources = resources[response.locale] ?? {};

    Object.entries(response.namespaces).forEach(([namespace, dictionary]) => {
      if (!isTranslationNamespace(namespace) || !dictionary) return;
      const existingDictionary = localeResources[namespace] ?? {};
      localeResources[namespace] = mergeDictionary(existingDictionary, dictionary);
    });

    resources[response.locale] = localeResources;
    version += 1;
    notify();
  },

  t: (key: string, options: TranslateOptions = {}): string => {
    const { namespace, path } = parseTranslationKey(key, options.ns);
    const activeValue = getNestedValue(resources[currentLanguage]?.[namespace], path);
    const fallbackValue = getNestedValue(resources[FALLBACK_LANGUAGE]?.[namespace], path);
    const template = activeValue ?? fallbackValue ?? options.defaultValue ?? key;

    if (!activeValue && !fallbackValue && typeof console !== 'undefined') {
      console.warn(`Missing translation key: ${namespace}:${path}`);
    }

    return interpolate(template, options.values);
  },
};

i18n.init();
