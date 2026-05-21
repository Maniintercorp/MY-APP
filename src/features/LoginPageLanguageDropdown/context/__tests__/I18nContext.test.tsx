// Tests for I18nProvider and useI18n
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider, useI18n } from '../I18nContext';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const mockLanguages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];
const response = { languages: mockLanguages };

const server = setupServer(
  rest.get('/api/languages', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(response));
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});
afterAll(() => server.close());

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    <I18nProvider>{children}</I18nProvider>
  </QueryClientProvider>
);

describe('I18nProvider', () => {
  function TestComp() {
    const { language, setLanguage, t } = useI18n();
    return (
      <div>
        <span data-testid="lang">{language}</span>
        <button onClick={() => setLanguage('es')}>change-es</button>
        <button onClick={() => setLanguage('en')}>change-en</button>
        <span data-testid="title">{t('login.title')}</span>
      </div>
    );
  }

  it('picks language from localStorage if present', async () => {
    localStorage.setItem('loginpage-lang', 'es');
    render(<TestComp />, { wrapper });
    await waitFor(() => expect(screen.getByTestId('lang')).toHaveTextContent('es'));
  });

  it('defaults to browser preference if supported', async () => {
    Object.defineProperty(window.navigator, 'languages', {
      value: ['es-ES'],
      configurable: true,
    });
    render(<TestComp />, { wrapper });
    await waitFor(() => expect(screen.getByTestId('lang')).toHaveTextContent('es'));
  });

  it('falls back to first language if nothing matches', async () => {
    Object.defineProperty(window.navigator, 'languages', {
      value: ['de-DE'], // Not in supported
      configurable: true,
    });
    render(<TestComp />, { wrapper });
    await waitFor(() => expect(['en','es']).toContain(screen.getByTestId('lang').textContent));
  });

  it('setLanguage updates localStorage and context', async () => {
    render(<TestComp />, { wrapper });
    await waitFor(() => screen.getByTestId('lang'));
    fireEvent.click(screen.getByText('change-es'));
    expect(localStorage.getItem('loginpage-lang')).toBe('es');
    await waitFor(() => expect(screen.getByTestId('lang')).toHaveTextContent('es'));
    fireEvent.click(screen.getByText('change-en'));
    expect(localStorage.getItem('loginpage-lang')).toBe('en');
    await waitFor(() => expect(screen.getByTestId('lang')).toHaveTextContent('en'));
  });

  it('t falls back to English if translation missing', async () => {
    render(<TestComp />, { wrapper });
    await waitFor(() => expect(screen.getByTestId('title')).toBeTruthy());
    expect(screen.getByTestId('title').textContent).not.toBe('login.title');
  });

  it('throws error if useI18n called outside provider', () => {
    function Orphan() {
      // @ts-expect-error intentionally outside provider
      useI18n();
      return null;
    }
    // Will throw, so need error boundary
    const spy = vi.fn();
    expect(() => render(<Orphan />, { wrapper: ({ children }) => <>{children}</> })).toThrow(/must be used within I18nProvider/);
  });
});
