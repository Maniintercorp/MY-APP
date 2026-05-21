import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import { LoginPage } from '../pages/LoginPage';
import { useLogin } from '../hooks';

jest.mock('../hooks');

const handlers = [
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(ctx.json({
      token: 'fake-token',
      expiresIn: 3600,
      user: { id: 'user123', name: 'Test User' }
    }));
  })
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockUseLogin = (overrides) => {
  const mutate = jest.fn();
  const mock = { mutate, ...overrides };
  useLogin.mockReturnValue(mock);
  return mock;
};

describe('LoginPage', () => {
  test('renders LoginPage correctly', () => {
    render(<LoginPage />);
    expect(screen.getByText('LOGIN')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  test('handles form submission correctly', () => {
    const mockMutate = mockUseLogin().mutate;
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(mockMutate).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password', rememberMe: false });
  });

  test('toggles Remember Me checkbox correctly', () => {
    render(<LoginPage />);
    const checkbox = screen.getByLabelText(/remember me/i);
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});