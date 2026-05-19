import { describe, expect, it } from 'vitest';
import { screen, waitFor, renderHook } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Route, Routes, useLocation } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';
import { createTestQueryClient, renderWithProviders } from '@/test/testUtils';
import { App } from '@/App';
import { useApiMutation, useApiQuery } from '@/hooks/useApi';

describe('App routing', () => {
  it('redirects root route to login', async () => {
    const LocationProbe = () => <div data-testid='location'>{useLocation().pathname}</div>;
    renderWithProviders(
      <>
        <App />
        <Routes><Route path='*' element={<LocationProbe />} /></Routes>
      </>,
      { initialEntries: ['/'] }
    );

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/login'));
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
  });

  it('renders dashboard inside layout', () => {
    renderWithProviders(<App />, { initialEntries: ['/dashboard'] });
    expect(screen.getByText('SaaS App')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });
});

describe('useApi hooks', () => {
  it('wraps useQuery with provided query key and function', async () => {
    const client = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
    const queryFn = async () => ({ value: 42 });

    const { result } = renderHook(() => useApiQuery(['answer'], queryFn), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ value: 42 });
  });

  it('wraps useMutation with provided mutation function', async () => {
    const client = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
    const mutationFn = async (value: number) => value * 2;

    const { result } = renderHook(() => useApiMutation(mutationFn), { wrapper });
    result.current.mutate(21);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe(42);
  });
});
