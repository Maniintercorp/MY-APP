import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginCard } from '@/features/LoginPageRedesign/components/LoginCard';

const mockUseLogin = vi.hoisted(() => vi.fn());

vi.mock('@/features/LoginPageRedesign/hooks', () => ({
  useLogin: mockUseLogin,
}));

type LoginMutationMock = {
  mutate: ReturnType<typeof vi.fn>;
  isPending: boolean;
};

const renderLoginCard = (overrides: Partial<LoginMutationMock> = {}) => {
  const mutation: LoginMutationMock = {
    mutate: vi.fn(),
    isPending: false,
    ...overrides,
  };

  mockUseLogin.mockReturnValue(mutation);

  render(
    <MemoryRouter>
      <LoginCard />
    </MemoryRouter>
  );

  return mutation;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('LoginCard', () => {
  it('renders login form fields, actions, and navigation links', () => {
    renderLoginCard();

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /forgot password/i })).toHaveAttribute('href', '/forgot-password');
    expect(screen.getByRole('link', { name: /create an account/i })).toHaveAttribute('href', '/register');
    expect(screen.getByRole('button', { name: /^sign in$/i })).toBeEnabled();
  });

  it('shows required field validation messages and does not submit empty forms', async () => {
    const user = userEvent.setup();
    const mutation = renderLoginCard();

    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(await screen.findByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
    expect(mutation.mutate).not.toHaveBeenCalled();
  });

  it('validates email format before submitting', async () => {
    const user = userEvent.setup();
    const mutation = renderLoginCard();

    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.type(screen.getByLabelText(/password/i), 'password-123');
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument();
    expect(mutation.mutate).not.toHaveBeenCalled();
  });

  it('submits trimmed email, password, and rememberMe state for valid forms', async () => {
    const user = userEvent.setup();
    const mutation = renderLoginCard();

    await user.type(screen.getByLabelText(/email/i), '  user@example.com  ');
    await user.type(screen.getByLabelText(/password/i), 'password-123');
    await user.click(screen.getByRole('checkbox', { name: /remember me/i }));
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(mutation.mutate).toHaveBeenCalledTimes(1);
    expect(mutation.mutate).toHaveBeenCalledWith(
      {
        email: 'user@example.com',
        password: 'password-123',
        rememberMe: true,
      },
      expect.objectContaining({ onError: expect.any(Function) })
    );
  });

  it('renders a server validation error returned from an axios error response', async () => {
    const user = userEvent.setup();
    const mutate = vi.fn((_variables, options) => {
      options.onError({
        isAxiosError: true,
        response: {
          data: {
            errors: {
              Email: ['Invalid credentials.'],
            },
          },
        },
      });
    });
    renderLoginCard({ mutate });

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrong-password');
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials.');
  });

  it('renders a generic Error message returned from the mutation onError callback', async () => {
    const user = userEvent.setup();
    const mutate = vi.fn((_variables, options) => {
      options.onError(new Error('Network unavailable.'));
    });
    renderLoginCard({ mutate });

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password-123');
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Network unavailable.');
  });

  it('clears field and form errors when the user edits the relevant field', async () => {
    const user = userEvent.setup();
    const mutate = vi.fn((_variables, options) => {
      options.onError(new Error('Unable to sign in.'));
    });
    renderLoginCard({ mutate });

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password-123');
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to sign in.');

    await user.type(screen.getByLabelText(/email/i), 'x');

    await waitFor(() => {
      expect(screen.queryByText('Unable to sign in.')).not.toBeInTheDocument();
    });
  });

  it('disables controls and displays pending state while submitting', () => {
    renderLoginCard({ isPending: true });

    const submitButton = screen.getByRole('button', { name: /signing in/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(screen.getByLabelText(/password/i)).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeDisabled();
  });
});
