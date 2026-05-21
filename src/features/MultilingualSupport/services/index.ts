import api from '@/lib/api';
import type {
  SupportedLocalesResponse,
  TranslationNamespace,
  TranslationResourcesResponse,
  UpdateLanguagePreferenceRequest,
  UserLanguagePreferenceResponse,
} from '@/features/MultilingualSupport/types';

export const LANGUAGE_STORAGE_KEY = 'app.language';

export const getSupportedLocales = async (): Promise<SupportedLocalesResponse> => {
  const response = await api.get<SupportedLocalesResponse>('/api/i18n/locales');
  return response.data;
};

export const getTranslationResources = async (
  locale: string,
  namespace?: TranslationNamespace
): Promise<TranslationResourcesResponse> => {
  const response = await api.get<TranslationResourcesResponse>(`/api/i18n/translations/${locale}`, {
    params: namespace ? { namespace } : undefined,
  });
  return response.data;
};

export const getUserLanguagePreference = async (): Promise<UserLanguagePreferenceResponse> => {
  const response = await api.get<UserLanguagePreferenceResponse>('/api/users/me/preferences');
  return response.data;
};

export const updateUserLanguagePreference = async (
  request: UpdateLanguagePreferenceRequest
): Promise<UserLanguagePreferenceResponse> => {
  const response = await api.put<UserLanguagePreferenceResponse>('/api/users/me/language', request);
  return response.data;
};

export const getStoredAnonymousLanguage = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
};

export const persistAnonymousLanguage = (languageCode: string): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
};

export const clearStoredAnonymousLanguage = (): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
};
