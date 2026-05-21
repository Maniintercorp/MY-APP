import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { vi } from 'vitest';

vi.mock('../hooks', () => ({
  useLoginMutation: () => ({
    isPending: false,
    mutate: vi.fn()
  })
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Link: (props: any) => <a href={props.to}>{props.children}</a>
  };
});

describe('LoginPage', () => {
  it('renders all fields and submit button', () => {
    render(<BrowserRouter><LoginPage /></BrowserRouter>);
    expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByText(/don\'t have an account/i)).toBeInTheDocument();
  });

  it('shows validation errors on submit', async () => {
    render(<BrowserRouter><LoginPage /></BrowserRouter>);
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(await screen.findByText(/username or email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('shows password min length error', async () => {
    render(<BrowserRouter><LoginPage /></BrowserRouter>);
    fireEvent.change(screen.getByLabelText(/username or email/i), { target: { value: 'foo' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(await screen.findByText(/at least 6 characters/i)).toBeInTheDocument();
  });

  it('calls login mutate if validation passes', async () => {
    const mutate = vi.fn();
    vi.mocked(require('../hooks')).useLoginMutation.mockReturnValue({ mutate, isPending: false });
    render(<BrowserRouter><LoginPage /></BrowserRouter>);
    fireEvent.change(screen.getByLabelText(/username or email/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith({ usernameOrEmail: 'testuser', password: 'password' });
    });
  });
});
