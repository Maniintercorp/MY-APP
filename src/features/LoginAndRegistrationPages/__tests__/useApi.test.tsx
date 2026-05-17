import { renderHook, act } from '@testing-library/react-hooks';
import { useGet, usePost } from '@/hooks/useApi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import api from '@/lib/api';

jest.mock('@/lib/api');
const apiMock = api as jest.Mocked<typeof api>;

const queryClient = new QueryClient();

const wrapper: React.FC = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useGet hook', () => {
  it('should fetch data successfully', async () => {
    const data = { data: { id: 1, name: 'test' } };
    apiMock.get.mockResolvedValueOnce(data);

    const { result, waitFor } = renderHook(() => useGet('test', '/api/test'), { wrapper });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(data.data);
  });
});

describe('usePost hook', () => {
  it('should post data successfully', async () => {
    const data = { id: 1, name: 'test' };
    apiMock.post.mockResolvedValueOnce({ data });

    const { result, waitFor } = renderHook(() => usePost('test', '/api/test'), { wrapper });

    act(() => {
      result.current.mutate({ name: 'newTest' });
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(data);
  });
});