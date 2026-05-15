import { render, screen, fireEvent } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';
import RegistrationPage from '../pages/RegistrationPage';
import { vi } from 'vitest';

vi.mock('../hooks/useAuth');

const mockRegisterUser = vi.fn();

describe('RegistrationPage', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ registerUser: mockRegisterUser });
    render(<RegistrationPage />);
  });

  it('renders form with username, password, and email fields', () => {
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('displays error messages when fields are submitted empty', async () => {
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(await screen.findByText(/username is required/i)).toBeVisible();
    expect(await screen.findByText(/password is required/i)).toBeVisible();
    expect(await screen.findByText(/email is required/i)).toBeVisible();
  });

  it('calls registerUser function with correct data when form is submitted', async () => {
    fireEvent.input(screen.getByLabelText('Username'), { target: { value: 'newuser' } });
    fireEvent.input(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.input(screen.getByLabelText('Email'), { target: { value: 'email@example.com' } });
    fireEvent.submit(screen.getByRole('button', { name: /register/i }));
    expect(mockRegisterUser).toHaveBeenCalledWith({ username: 'newuser', password: 'password123', email: 'email@example.com' });
  });
});
