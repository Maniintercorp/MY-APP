import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import UserRegistrationForm from '../components/UserRegistrationForm';
import { QueryClient, QueryClientProvider } from 'react-query';

const server = setupServer(
  rest.post('/api/users/register', (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ userId: '1234' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderWithQueryClient = (ui) => {
  const queryClient = new QueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

test('renders form with inputs and submit button', () => {
  renderWithQueryClient(<UserRegistrationForm />);
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
});

test('submits the form successfully', async () => {
  renderWithQueryClient(<UserRegistrationForm />);

  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });

  fireEvent.click(screen.getByRole('button', { name: /register/i }));

  await screen.findByText('User registered with ID 1234');
});

test('displays error message on registration failure', async () => {
  server.use(
    rest.post('/api/users/register', (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ message: 'Registration failed' }));
    })
  );

  renderWithQueryClient(<UserRegistrationForm />);
  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });

  fireEvent.click(screen.getByRole('button', { name: /register/i }));

  await screen.findByText('Error: Registration failed');
});
