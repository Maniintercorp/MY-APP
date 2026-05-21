// Tests for LanguageDropdown component
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageDropdown } from '../LanguageDropdown';
import { I18nProvider } from '../../context/I18nContext';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const languagesResp = {
  languages: [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
  ],
};

const server = setupServer(
  rest.get('/api/languages', (req, res, ctx) => res(ctx.json(languagesResp)))
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});
afterAll(() => server.close());

function setup(customClass = '') {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <I18nProvider>
        <LanguageDropdown className={customClass} />
      </I18nProvider>
    </QueryClientProvider>
  );
}

describe('LanguageDropdown', () => {
  it('renders loading state initially', async () => {
    server.use(
      rest.get('/api/languages', (req, res, ctx) =>
        res(ctx.delay(500), ctx.json(languagesResp))
      )
    );
    setup();
    expect(screen.getByText('...')).toBeInTheDocument();
    await waitFor(() => screen.getByLabelText('Language'));
  });

  it('renders error message if API fails', async () => {
    server.use(
      rest.get('/api/languages', (req, res, ctx) => res(ctx.status(500)))
    );
    setup('custom-class');
    await waitFor(() => screen.getByText(/Unable to load languages/));
    expect(screen.getByText(/Unable to load languages/)).toHaveClass('text-red-400');
    // Error element uses custom class too
    expect(screen.getByText(/Unable to load languages/).parentElement).toHaveClass('custom-class');
  });

  it('renders language options from API', async () => {
    setup('special');
    await waitFor(() => screen.getByLabelText('Language'));
    const select = screen.getByLabelText('Language');
    expect(select).toBeInTheDocument();
    expect(select).toHaveClass('block w-full');
    languagesResp.languages.forEach((lang) => {
      expect(screen.getByText(lang.label)).toBeInTheDocument();
      expect(screen.getByRole('option', { name: lang.label })).toHaveValue(lang.code);
    });
    // Parent className propagation
    expect(screen.getByLabelText('Language').closest('div.special')).toBeTruthy();
  });

  it('selecting option calls setLanguage on provider', async () => {
    setup();
    await waitFor(() => screen.getByLabelText('Language'));
    const select = screen.getByLabelText('Language') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'fr' } });
    expect(select.value).toBe('fr');
    // Also updates localStorage
    expect(localStorage.getItem('loginpage-lang')).toBe('fr');
  });

  it('has ChevronDown icon', async () => {
    setup();
    await waitFor(() => screen.getByLabelText('Language'));
    expect(screen.getByTestId(/chevron/i)).toBeDefined;
  });

  // Custom render check for className
  it('applies passed custom className in container', async () => {
    setup('my-extra');
    await waitFor(() => screen.getByLabelText('Language'));
    expect(screen.getByLabelText('Language').closest('div.my-extra')).toBeTruthy();
  });
});
