import { renderHook } from '@testing-library/react-hooks';
import { useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFetchData } from '../useApi';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/data', (req, res, ctx) => {
    return res(ctx.json({ data: 'test data' }));
  })
);

const queryClient = new QueryClient();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useFetchData', () => {
  it('fetches and returns data successfully', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result, waitFor } = renderHook(() => useFetchData('/api/data'), { wrapper });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual('test data');
  });

  it('handles errors', async () => {
    server.use(
      rest.get('/api/data', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Internal Server Error' }));
      })
    );

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result, waitFor } = renderHook(() => useFetchData('/api/data'), { wrapper });

    await waitFor(() => result.current.isError);

    expect(result.current.error?.message).toBe('Request failed with status code 500');
  });
});