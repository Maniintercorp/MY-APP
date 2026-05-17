import { i18n } from '@/features/MultilingualSupport/i18n';

const resolveLocale = (locale?: string): string => locale ?? i18n.language;

export const formatDate = (
  value: Date | string | number,
  locale?: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }
): string => {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(resolveLocale(locale), options).format(date);
};

export const formatNumber = (
  value: number,
  locale?: string,
  options: Intl.NumberFormatOptions = {}
): string => new Intl.NumberFormat(resolveLocale(locale), options).format(value);

export const formatCurrency = (
  value: number,
  currency = 'USD',
  locale?: string,
  options: Intl.NumberFormatOptions = {}
): string =>
  new Intl.NumberFormat(resolveLocale(locale), {
    style: 'currency',
    currency,
    ...options,
  }).format(value);

export const formatPercent = (
  value: number,
  locale?: string,
  options: Intl.NumberFormatOptions = { maximumFractionDigits: 1 }
): string =>
  new Intl.NumberFormat(resolveLocale(locale), {
    style: 'percent',
    ...options,
  }).format(value);
