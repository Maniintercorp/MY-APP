import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginComponent } from '../components/LoginComponent';
import { useLogin } from '../hooks/useLogin';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

jest.mock('../hooks/useLogin');

const server = setupServer(
  rest.post('/api/login', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ token: 'fake-token', message: 'Login successful.' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('LoginComponent', () => {
  it('renders the login form', () => {
    render(<LoginComponent />);
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('appears disabled when form inputs are empty', () => {
    render(<LoginComponent />);
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('All fields are required.');
  });

  it('triggers login mutation on submit', async () => {
    const mockMutate = jest.fn();
    (useLogin as jest.Mock).mockReturnValue({ mutate: mockMutate, isLoading: false });

    render(<LoginComponent />);

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({ username: 'testuser', password: 'password123' });
    });
  });

  it('displays loading state', async () => {
    (useLogin as jest.Mock).mockReturnValue({ mutate: jest.fn(), isLoading: true });

    render(<LoginComponent />);

    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
  });

  it('displays success message on login success', async () => {
    (useLogin as jest.Mock).mockReturnValue({ mutate: jest.fn(), isLoading: false, isSuccess: true, message: 'Login successful.' });

    render(<LoginComponent />);

    expect(screen.getByText('Login successful.')).toBeInTheDocument();
  });

  it('displays error message on login failure', async () => {
    (useLogin as jest.Mock).mockReturnValue({ mutate: jest.fn(), isLoading: false, error: 'Login failed' });

    render(<LoginComponent />);

    expect(screen.getByText('Error: Login failed')).toBeInTheDocument();
  });
});