import React from 'react';
import { AlertCircle, Check, Globe, Loader2 } from 'lucide-react';
import { useLanguage, useLocalizedText } from '@/features/MultilingualSupport/hooks';

interface LanguageSelectorProps {
  compact?: boolean;
  className?: string;
  showLabel?: boolean;
}

export const LanguageSelector = ({ compact = false, className = '', showLabel = true }: LanguageSelectorProps) => {
  const { t } = useLocalizedText();
  const { currentLanguage, availableLanguages, isLoading, isChangingLanguage, error, changeLanguage } = useLanguage();
  const activeLanguage = availableLanguages.find((locale) => locale.code === currentLanguage) ?? availableLanguages[0];

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    void changeLanguage(event.target.value);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel ? (
        <label htmlFor="language-selector" className="block text-sm font-medium text-gray-700">
          {t('multilingualSupport:selector.label')}
        </label>
      ) : null}

      <div className="relative flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500">
        <Globe size={18} className="text-gray-500" aria-hidden="true" />
        <select
          id="language-selector"
          value={currentLanguage}
          onChange={handleLanguageChange}
          disabled={isLoading || isChangingLanguage}
          aria-label={t('multilingualSupport:selector.label')}
          className="w-full appearance-none bg-transparent text-sm font-medium text-gray-900 outline-none disabled:cursor-not-allowed disabled:text-gray-500"
        >
          {availableLanguages.map((language) => (
            <option key={language.code} value={language.code}>
              {compact ? language.code.toUpperCase() : `${language.nativeName} (${language.displayName})`}
            </option>
          ))}
        </select>
        {isChangingLanguage || isLoading ? (
          <Loader2 size={18} className="animate-spin text-indigo-600" aria-hidden="true" />
        ) : (
          <Check size={18} className="text-green-600" aria-hidden="true" />
        )}
      </div>

      {!compact && activeLanguage ? (
        <p className="text-xs text-gray-600">
          {t('multilingualSupport:selector.currentLanguage', {
            values: { language: activeLanguage.nativeName },
          })}
        </p>
      ) : null}

      {error ? (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>{t('errors:switchLanguage')}</span>
        </div>
      ) : null}
    </div>
  );
};
export default LanguageSelector;
