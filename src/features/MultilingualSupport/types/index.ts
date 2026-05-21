export type LanguageDirection = 'ltr' | 'rtl';

export type TranslationNamespace = 'common' | 'navigation' | 'validation' | 'errors' | 'multilingualSupport';

export type TranslationPrimitive = string | number | boolean | null;

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

export interface SupportedLocale {
  code: string;
  displayName: string;
  nativeName: string;
  isDefault: boolean;
  isEnabled: boolean;
  direction: LanguageDirection;
}

export interface SupportedLocalesResponse {
  locales: SupportedLocale[];
  defaultLocale: string;
}

export interface TranslationResourcesResponse {
  locale: string;
  fallbackLocale: string;
  namespaces: Partial<Record<TranslationNamespace, TranslationDictionary>>;
}

export interface UserLanguagePreferenceResponse {
  userId: string;
  preferredLanguageCode: string;
  effectiveLanguageCode: string;
  updatedAt: string;
  message?: string;
}

export interface UpdateLanguagePreferenceRequest {
  languageCode: string;
}

export interface TranslateOptions {
  ns?: TranslationNamespace;
  defaultValue?: string;
  values?: Record<string, TranslationPrimitive | Date | undefined>;
}

export interface LanguageState {
  currentLanguage: string;
  fallbackLanguage: string;
  availableLanguages: SupportedLocale[];
  isLoading: boolean;
  isChangingLanguage: boolean;
  error: unknown;
  changeLanguage: (languageCode: string) => Promise<void>;
}
