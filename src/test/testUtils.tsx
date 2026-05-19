import React, { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
    mutations: { retry: false },
  },
});

export const TestProviders = ({ children, initialEntries = ['/'] }: PropsWithChildren<{ initialEntries?: string[] }>) => {
  const client = createTestQueryClient();
  return (
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

export const renderWithProviders = (ui: React.ReactElement, options?: { initialEntries?: string[] }) =>
  render(ui, {
    wrapper: ({ children }) => <TestProviders initialEntries={options?.initialEntries}>{children}</TestProviders>,
  });
