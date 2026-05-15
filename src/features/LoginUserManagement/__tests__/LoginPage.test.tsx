import { render, screen, fireEvent } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';
import LoginPage from '../pages/LoginPage';
import { vi } from 'vitest';

vi.mock('../hooks/useAuth');

const mockLogin = vi.fn();

describe('LoginPage', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
    render(<LoginPage />);
  });
  
  it('renders form with username and password fields', () => {
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('displays error messages when fields are submitted empty', async () => {
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(await screen.findByText(/username is required/i)).toBeVisible();
    expect(await screen.findByText(/password is required/i)).toBeVisible();
  });

  it('calls login function with correct data when form is submitted', async () => {
    fireEvent.input(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.input(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.submit(screen.getByRole('button', { name: /login/i }));
    expect(mockLogin).toHaveBeenCalledWith({ username: 'testuser', password: 'password' });
  });
});
