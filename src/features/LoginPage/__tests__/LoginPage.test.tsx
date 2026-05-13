import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { QueryClient, QueryClientProvider } from 'react-query';
import { LoginPage } from '../index';

const queryClient = new QueryClient();

const server = setupServer(
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { username, password } = req.body as Record<string, string>;
    if (username === 'correct' && password === 'password123') {
      return res(ctx.json({ token: 'abcd1234', expiresIn: 3600 }));
    } else {
      return res(ctx.status(401), ctx.json({ error: 'Invalid username or password' }));
    }
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('LoginPage', () => {
  test('should display a form with username and password fields', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <LoginPage />
      </QueryClientProvider>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('should show an error message when login fails', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <LoginPage />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'wrong' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
    });
  });

  test('should login successfully with correct credentials', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <LoginPage />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'correct' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.queryByText(/invalid username or password/i)).not.toBeInTheDocument();
      expect(localStorage.getItem('token')).toEqual('abcd1234');
    });
  });

  test('should disable the submit button when loading', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <LoginPage />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'correct' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByRole('button', { name: /logging in.../i })).toBeDisabled();

    await waitFor(() => {
      expect(localStorage.getItem('token')).toEqual('abcd1234');
    });
  });
});