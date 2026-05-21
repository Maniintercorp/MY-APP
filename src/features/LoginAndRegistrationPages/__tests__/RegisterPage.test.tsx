import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RegisterPage } from '../pages/RegisterPage';
import { vi } from 'vitest';

vi.mock('../hooks', () => ({
  useRegisterMutation: () => ({
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

describe('RegisterPage', () => {
  it('renders all fields and submit button', () => {
    render(<BrowserRouter><RegisterPage /></BrowserRouter>);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    render(<BrowserRouter><RegisterPage /></BrowserRouter>);
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/confirm your password/i)).toBeInTheDocument();
  });

  it('catches invalid email and password mismatch', async () => {
    render(<BrowserRouter><RegisterPage /></BrowserRouter>);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'foo' } });
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'notanemail' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'abc12' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'abc34' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/at least 6 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('calls register mutation if valid', async () => {
    const mutate = vi.fn();
    vi.mocked(require('../hooks')).useRegisterMutation.mockReturnValue({ mutate, isPending: false });
    render(<BrowserRouter><RegisterPage /></BrowserRouter>);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'foo' } });
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'foo@test.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'pass123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith({
        username: 'foo', email: 'foo@test.com', password: 'pass123', confirmPassword: 'pass123'
      });
    });
  });
});
