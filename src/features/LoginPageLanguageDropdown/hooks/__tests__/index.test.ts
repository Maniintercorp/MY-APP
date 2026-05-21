// Tests for useLanguages React Query hook
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLanguages } from '../index';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const languagesResponse = {
  languages: [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
  ],
};

const server = setupServer(
  rest.get('/api/languages', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(languagesResponse));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useLanguages', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
  );

  it('returns languages data on success', async () => {
    const { result } = renderHook(() => useLanguages(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(languagesResponse);
  });

  it('handles loading state', async () => {
    const { result } = renderHook(() => useLanguages(), { wrapper });
    expect(result.current.isLoading || result.current.isPending).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('handles error state', async () => {
    server.use(
      rest.get('/api/languages', (req, res, ctx) => res(ctx.status(500)))
    );
    const { result } = renderHook(() => useLanguages(), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 2000 });
    expect(result.current.error).toBeDefined();
  });
});
