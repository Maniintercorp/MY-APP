import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginPage } from '../pages/LoginPage';
import { useLogin } from '../hooks';

jest.mock('../hooks', () => ({
  useLogin: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

const useLoginMock = useLogin as jest.Mock;

describe('LoginPage Component', () => {
  it('should render the login form', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should call mutate on form submit', () => {
    const mutate = jest.fn();
    useLoginMock.mockReturnValue({ mutate, isPending: false });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'user' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(mutate).toHaveBeenCalledWith({ username: 'user', password: 'password' });
  });
});