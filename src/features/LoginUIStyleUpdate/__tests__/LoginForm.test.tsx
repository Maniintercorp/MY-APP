import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { LoginForm } from '../components/LoginForm';
import { useLogin } from '../hooks';
import React from 'react';
import { vi } from 'vitest';

// Mock Input/Button
vi.mock('@/components/ui/Input', () => ({
  Input: React.forwardRef((props: any, ref) => (
    <input data-testid={`input-${props.name}`} ref={ref} {...props} />
  ))
}));
vi.mock('@/components/ui/Button', () => ({
  Button: (props: any) => (
    <button type={props.type} {...props} data-testid="submit-btn">{props.children}</button>
  )
}));

// Custom hook mock
vi.mock('../hooks');

function setup(props?: any) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <LoginForm {...props} />
    </QueryClientProvider>
  );
}

describe('LoginForm', () => {
  let mutate, mockLogin;

  beforeEach(() => {
    mutate = vi.fn();
    mockLogin = { mutate, isPending: false };
    (useLogin as any).mockReturnValue(mockLogin);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders email and password inputs and submit button', () => {
    setup();
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
    expect(screen.getByTestId('submit-btn')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /sign in to/i })).toBeInTheDocument();
  });

  it('shows required validation error for email and password', async () => {
    setup();
    fireEvent.blur(screen.getByTestId('input-email'));
    fireEvent.blur(screen.getByTestId('input-password'));
    expect(await screen.findAllByText(/required/i)).toHaveLength(2);
  });

  it('shows invalid email error', async () => {
    setup();
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'bad', name: 'email' } });
    fireEvent.blur(screen.getByTestId('input-email'));
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });

  it('does not submit when invalid', async () => {
    setup();
    fireEvent.blur(screen.getByTestId('input-email'));
    fireEvent.blur(screen.getByTestId('input-password'));
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(mutate).not.toHaveBeenCalled();
  });

  it('calls mutate with correct form data on submit', async () => {
    setup();
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'z@b.com', name: 'email' } });
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'pa55', name: 'password' } });
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith(
        { email: 'z@b.com', password: 'pa55' },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );
    });
  });

  it('displays error from mutation data.error', async () => {
    let mutateHandler;
    mockLogin.mutate = vi.fn((form, opts) => { mutateHandler = opts.onSuccess; });
    setup();
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'a@b.com', name: 'email' } });
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'bad', name: 'password' } });
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => {
      expect(mockLogin.mutate).toHaveBeenCalled();
    });
    mutateHandler?.({ token: '', user: null, error: 'Invalid login' });
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid login');
  });

  it('triggers onSuccess prop if login succeeds', async () => {
    let mutateHandler;
    mockLogin.mutate = vi.fn((form, opts) => { mutateHandler = opts.onSuccess; });
    const onSuccess = vi.fn();
    setup({ onSuccess });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'aaa@x.com', name: 'email' } });
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'p', name: 'password' } });
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => {
      expect(mockLogin.mutate).toHaveBeenCalled();
    });
    mutateHandler?.({ token: 't', user: { id: '1', name: 'n', email: 'aaa@x.com' }, error: null });
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('shows a general error message on mutation error', async () => {
    let mutateHandler;
    mockLogin.mutate = vi.fn((form, opts) => { mutateHandler = opts.onError; });
    setup();
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'x@x.com', name: 'email' } });
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'pw', name: 'password' } });
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => {
      expect(mockLogin.mutate).toHaveBeenCalled();
    });
    mutateHandler?.();
    expect(await screen.findByRole('alert')).toHaveTextContent('An error occurred');
  });

  it('shows loading state when pending', () => {
    mockLogin.isPending = true;
    setup();
    expect(screen.getByTestId('submit-btn')).toBeDisabled();
    expect(screen.getByTestId('submit-btn')).toHaveTextContent('Signing in...');
  });

  it('toggles password visibility', () => {
    setup();
    const pwdInput = screen.getByTestId('input-password');
    const toggleBtn = screen.getByRole('button', { name: /show password/i });
    // Init = type password
    expect(pwdInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleBtn);
    expect(pwdInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleBtn);
    expect(pwdInput).toHaveAttribute('type', 'password');
  });
});
