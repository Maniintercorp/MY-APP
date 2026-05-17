import React, { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage, useLocalizedText } from '@/features/MultilingualSupport/hooks';
import { formatCurrency, formatDate, formatNumber } from '@/features/MultilingualSupport/utils/formatters';

interface FormErrors {
  email?: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LocalizedDemoCard = () => {
  const { t } = useLocalizedText();
  const { currentLanguage } = useLanguage();
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const formattedExamples = useMemo(
    () => ({
      date: formatDate(new Date(), currentLanguage, { dateStyle: 'full' }),
      number: formatNumber(1284567.89, currentLanguage),
      currency: formatCurrency(2499.99, currentLanguage === 'fr' ? 'EUR' : currentLanguage === 'es' ? 'EUR' : 'USD', currentLanguage),
    }),
    [currentLanguage]
  );

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!email.trim()) {
      nextErrors.email = t('validation:required', { values: { field: t('common:forms.email') } });
    } else if (!emailPattern.test(email.trim())) {
      nextErrors.email = t('validation:email');
    }

    return nextErrors;
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setSubmitted(false);
    if (errors.email) setErrors({});
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setSubmitted(Object.keys(nextErrors).length === 0);
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm" aria-labelledby="localized-demo-title">
      <div className="mb-6">
        <h2 id="localized-demo-title" className="text-lg font-semibold text-gray-900">
          {t('multilingualSupport:demo.title')}
        </h2>
        <p className="mt-1 text-sm text-gray-600">{t('multilingualSupport:demo.description')}</p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-gray-50 p-4">
          <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{t('multilingualSupport:demo.date')}</dt>
          <dd className="mt-2 text-sm font-semibold text-gray-900">{formattedExamples.date}</dd>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{t('multilingualSupport:demo.number')}</dt>
          <dd className="mt-2 text-sm font-semibold text-gray-900">{formattedExamples.number}</dd>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{t('multilingualSupport:demo.currency')}</dt>
          <dd className="mt-2 text-sm font-semibold text-gray-900">{formattedExamples.currency}</dd>
        </div>
      </dl>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <label htmlFor="localized-email" className="block text-sm font-medium text-gray-700">
            {t('common:forms.email')}
          </label>
          <input
            id="localized-email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            aria-invalid={errors.email ? 'true' : undefined}
            aria-describedby={errors.email ? 'localized-email-error' : undefined}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="name@example.com"
          />
          {errors.email ? (
            <p id="localized-email-error" className="mt-2 flex items-center gap-2 text-sm text-red-600" role="alert">
              <AlertCircle size={16} aria-hidden="true" />
              {errors.email}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {t('common:buttons.submit')}
        </button>

        {submitted ? (
          <p className="flex items-center gap-2 text-sm text-green-700" role="status">
            <CheckCircle size={16} aria-hidden="true" />
            {t('multilingualSupport:demo.validationSuccess')}
          </p>
        ) : null}
      </form>
    </section>
  );
};
export default LocalizedDemoCard;
