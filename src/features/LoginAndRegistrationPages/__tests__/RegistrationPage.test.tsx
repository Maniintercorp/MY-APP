import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RegistrationPage } from '../pages/RegistrationPage';
import { useRegister } from '../hooks';

jest.mock('../hooks', () => ({
  useRegister: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

const useRegisterMock = useRegister as jest.Mock;

describe('RegistrationPage Component', () => {
  it('should render the registration form', () => {
    render(<RegistrationPage />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('should call mutate on form submit', () => {
    const mutate = jest.fn();
    useRegisterMock.mockReturnValue({ mutate, isPending: false });

    render(<RegistrationPage />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(mutate).toHaveBeenCalledWith({ username: 'newuser', email: 'user@example.com', password: 'password' });
  });
});