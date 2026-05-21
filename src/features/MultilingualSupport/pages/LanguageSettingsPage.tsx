import { AlertCircle, CheckCircle, Globe } from 'lucide-react';
import { LanguageSelector, LocalizedDemoCard } from '@/features/MultilingualSupport/components';
import { useLanguage, useLocalizedText } from '@/features/MultilingualSupport/hooks';

export const LanguageSettingsPage = () => {
  const { t } = useLocalizedText();
  const { currentLanguage, availableLanguages, fallbackLanguage, isLoading, error } = useLanguage();
  const activeLanguage = availableLanguages.find((language) => language.code === currentLanguage);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <Globe size={28} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('multilingualSupport:page.title')}</h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">{t('multilingualSupport:page.subtitle')}</p>
            </div>
          </div>
          <div className="w-full sm:w-80">
            <LanguageSelector />
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">{t('multilingualSupport:status.activeLanguage')}</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">{activeLanguage?.nativeName ?? currentLanguage}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">{t('multilingualSupport:status.fallbackLanguage')}</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">{fallbackLanguage.toUpperCase()}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">{t('multilingualSupport:status.resourceState')}</p>
          <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-gray-900">
            {isLoading ? (
              t('common:buttons.loading')
            ) : (
              <>
                <CheckCircle size={18} className="text-green-600" aria-hidden="true" />
                {t('multilingualSupport:status.ready')}
              </>
            )}
          </p>
        </div>
      </section>

      {error ? (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>{t('errors:loadTranslations')}</span>
        </div>
      ) : null}

      <LocalizedDemoCard />
    </div>
  );
};
export default LanguageSettingsPage;
