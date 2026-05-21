import { beforeEach, describe, expect, it } from 'vitest';
import { i18n } from '@/features/MultilingualSupport/i18n';
import { formatCurrency, formatDate, formatNumber, formatPercent } from '@/features/MultilingualSupport/utils/formatters';

describe('localized formatters', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('formats dates using an explicit locale and options', () => {
    expect(formatDate(new Date('2024-03-15T12:00:00.000Z'), 'en-US', { timeZone: 'UTC', dateStyle: 'medium' })).toBe('Mar 15, 2024');
  });

  it('formats numeric date inputs', () => {
    const timestamp = Date.UTC(2024, 0, 2, 0, 0, 0);

    expect(formatDate(timestamp, 'en-US', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit' })).toBe('01/02/2024');
  });

  it('formats numbers using an explicit locale', () => {
    expect(formatNumber(1284567.89, 'en-US')).toBe('1,284,567.89');
    expect(formatNumber(1284567.89, 'fr-FR')).toContain('1');
  });

  it('formats currencies with default and overridden currency options', () => {
    expect(formatCurrency(2499.99, 'USD', 'en-US')).toBe('$2,499.99');
    expect(formatCurrency(2499.99, 'EUR', 'en-US', { maximumFractionDigits: 0 })).toBe('€2,500');
  });

  it('formats percentages with default and custom options', () => {
    expect(formatPercent(0.1234, 'en-US')).toBe('12.3%');
    expect(formatPercent(0.1234, 'en-US', { maximumFractionDigits: 0 })).toBe('12%');
  });

  it('falls back to the active i18n language when no locale is provided', async () => {
    await i18n.changeLanguage('es');

    expect(formatNumber(1000)).toBe(new Intl.NumberFormat('es').format(1000));
  });
});
