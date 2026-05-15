import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useContactForm } from '../hooks/useContactForm';
import { server, rest } from '../../../setupTests';

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useContactForm hook', () => {
  afterEach(() => {
    queryClient.clear();
  });

  it('should update formData state on handleChange', () => {
    const { result } = renderHook(() => useContactForm(), { wrapper });

    act(() => {
      result.current.handleChange({ target: { name: 'name', value: 'John Doe' } } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.name).toBe('John Doe');
  });

  it('should call submitContactForm mutation on handleSubmit', async () => {
    server.use(
      rest.post('/api/contacts', (req, res, ctx) => {
        return res(ctx.status(201), ctx.json({ id: 1, createdAt: new Date().toISOString() }));
      })
    );

    const { result, waitFor } = renderHook(() => useContactForm(), { wrapper });

    act(() => {
      result.current.handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.isSuccess).toBe(true);
  });
});
