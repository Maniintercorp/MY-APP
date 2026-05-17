import React from 'react';
import { useLanguages } from '../hooks';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

interface LanguageDropdownProps {
  className?: string;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ className = '' }) => {
  const { data, isPending, isError } = useLanguages();
  const { language, setLanguage } = useI18n();

  if (isPending) {
    return (
      <div className={`flex items-center mb-6 ${className}`}>
        <div className="animate-pulse text-gray-400">...</div>
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div className={`flex items-center mb-6 ${className}`}>
        <span className="text-red-400 text-sm">Unable to load languages</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full mb-6 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="language-select">
        {/** "Select Language" is NOT localized, because the dropdown provides language context for rest of UI */}
        Language
      </label>
      <div className="relative">
        <select
          id="language-select"
          className="block w-full appearance-none bg-white border border-gray-300 text-gray-700 rounded-md py-2 pl-3 pr-8 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {data.languages.map((lang) => (
            <option value={lang.code} key={lang.code}>{lang.label}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
          <ChevronDown size={18} />
        </span>
      </div>
    </div>
  );
};
export default LanguageDropdown;
