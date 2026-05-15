import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useContactForm } from '../hooks/useContactForm';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

test('should update form state correctly', () => {
  const { result } = renderHook(() => useContactForm(), { wrapper });

  act(() => {
    result.current.handleChange({
      target: { name: 'name', value: 'John Doe' }
    } as React.ChangeEvent<HTMLInputElement>);
  });

  expect(result.current.formState.name).toBe('John Doe');
});

test('should submit form and reset form state', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useContactForm(), { wrapper });

  act(() => {
    result.current.handleChange({
      target: { name: 'name', value: 'John Doe' }
    } as React.ChangeEvent<HTMLInputElement>);
    result.current.handleChange({
      target: { name: 'email', value: 'john.doe@example.com' }
    } as React.ChangeEvent<HTMLInputElement>);
    result.current.handleChange({
      target: { name: 'message', value: 'Hello World!' }
    } as React.ChangeEvent<HTMLTextAreaElement>);
  });

  act(() => {
    result.current.handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  });

  await waitForNextUpdate();

  expect(result.current.formState.name).toBe('');
  expect(result.current.formState.email).toBe('');
  expect(result.current.formState.message).toBe('');
  expect(result.current.isSuccess).toBe(true);
});