import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import LoginForm from '../components/LoginForm';
import { QueryClient, QueryClientProvider } from 'react-query';

const server = setupServer(
  rest.post('/api/users/login', (req, res, ctx) => {
    return res(ctx.json({ token: 'abcdef' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderWithQueryClient = (ui) => {
  const queryClient = new QueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

test('renders form with inputs and login button', () => {
  renderWithQueryClient(<LoginForm />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});

test('logs in successfully', async () => {
  renderWithQueryClient(<LoginForm />);

  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });

  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  await screen.findByText('Login successful');
});

test('displays error message on login failure', async () => {
  server.use(
    rest.post('/api/users/login', (req, res, ctx) => {
      return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }));
    })
  );

  renderWithQueryClient(<LoginForm />);
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });

  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  await screen.findByText('Error: Invalid credentials');
});
