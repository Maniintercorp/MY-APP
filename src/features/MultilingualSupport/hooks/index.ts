import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FALLBACK_LANGUAGE, STATIC_SUPPORTED_LOCALES, i18n } from '@/features/MultilingualSupport/i18n';
import {
  getSupportedLocales,
  getTranslationResources,
  getUserLanguagePreference,
  persistAnonymousLanguage,
  updateUserLanguagePreference,
} from '@/features/MultilingualSupport/services';
import type {
  LanguageState,
  SupportedLocalesResponse,
  TranslateOptions,
  TranslationResourcesResponse,
  UpdateLanguagePreferenceRequest,
  UserLanguagePreferenceResponse,
} from '@/features/MultilingualSupport/types';

const hasAuthSession = (): boolean => {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.localStorage.getItem('accessToken') ||
      window.localStorage.getItem('authToken') ||
      window.localStorage.getItem('token')
  );
};

export const useLocalizedText = () => {
  const snapshot = useSyncExternalStore(i18n.subscribe, i18n.getSnapshot, i18n.getSnapshot);

  return useMemo(
    () => ({
      language: snapshot.language,
      t: (key: string, options?: TranslateOptions) => i18n.t(key, options),
    }),
    [snapshot.language, snapshot.version]
  );
};

export const useLanguage = (): LanguageState => {
  const queryClient = useQueryClient();
  const snapshot = useSyncExternalStore(i18n.subscribe, i18n.getSnapshot, i18n.getSnapshot);
  const isAuthenticated = hasAuthSession();

  const localesQuery = useQuery<SupportedLocalesResponse>({
    queryKey: ['i18n', 'locales'],
    queryFn: getSupportedLocales,
    retry: 1,
  });

  const translationsQuery = useQuery<TranslationResourcesResponse>({
    queryKey: ['i18n', 'translations', snapshot.language],
    queryFn: () => getTranslationResources(snapshot.language),
    retry: 1,
    enabled: Boolean(snapshot.language),
  });

  const preferencesQuery = useQuery<UserLanguagePreferenceResponse>({
    queryKey: ['users', 'me', 'preferences', 'language'],
    queryFn: getUserLanguagePreference,
    retry: 1,
    enabled: isAuthenticated,
  });

  const preferenceMutation = useMutation<UserLanguagePreferenceResponse, unknown, UpdateLanguagePreferenceRequest>({
    mutationFn: updateUserLanguagePreference,
    onSuccess: (data) => {
      queryClient.setQueryData(['users', 'me', 'preferences', 'language'], data);
      queryClient.invalidateQueries({ queryKey: ['users', 'me', 'preferences'] });
    },
  });

  useEffect(() => {
    if (!translationsQuery.data) return;
    i18n.loadResourceBundle(translationsQuery.data);
  }, [translationsQuery.data]);

  useEffect(() => {
    const preferredLanguage = preferencesQuery.data?.effectiveLanguageCode;
    if (!preferredLanguage || preferredLanguage === snapshot.language) return;

    void i18n.changeLanguage(preferredLanguage);
    persistAnonymousLanguage(preferredLanguage);
  }, [preferencesQuery.data?.effectiveLanguageCode, snapshot.language]);

  const availableLanguages = useMemo(
    () => (localesQuery.data?.locales.filter((locale) => locale.isEnabled) ?? STATIC_SUPPORTED_LOCALES),
    [localesQuery.data?.locales]
  );

  const changeLanguage = useCallback(
    async (languageCode: string): Promise<void> => {
      const requestedLocale = availableLanguages.find((locale) => locale.code === languageCode && locale.isEnabled);
      const fallbackLocale = availableLanguages.find((locale) => locale.code === FALLBACK_LANGUAGE) ?? availableLanguages[0];
      const nextLanguage = requestedLocale?.code ?? fallbackLocale?.code ?? FALLBACK_LANGUAGE;

      await i18n.changeLanguage(nextLanguage);
      persistAnonymousLanguage(nextLanguage);

      if (isAuthenticated) {
        await preferenceMutation.mutateAsync({ languageCode: nextLanguage });
      }
    },
    [availableLanguages, isAuthenticated, preferenceMutation]
  );

  const error = localesQuery.error ?? translationsQuery.error ?? preferencesQuery.error ?? preferenceMutation.error ?? null;

  return {
    currentLanguage: snapshot.language,
    fallbackLanguage: FALLBACK_LANGUAGE,
    availableLanguages,
    isLoading:
      localesQuery.isPending ||
      translationsQuery.isPending ||
      (isAuthenticated && preferencesQuery.isPending),
    isChangingLanguage: preferenceMutation.isPending,
    error,
    changeLanguage,
  };
};
