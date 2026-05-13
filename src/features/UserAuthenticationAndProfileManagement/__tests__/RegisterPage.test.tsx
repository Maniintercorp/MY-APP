import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { QueryClient, QueryClientProvider } from 'react-query';
import RegisterPage from '../pages/RegisterPage';

const queryClient = new QueryClient();
const server = setupServer(
  rest.post('/api/auth/register', (req, res, ctx) => {
    return res(ctx.json({ userId: '1', email: 'test@example.com', username: 'testuser' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('RegisterPage', () => {
  it('renders RegisterPage correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RegisterPage />
      </QueryClientProvider>
    );
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });
  
  it('allows user registration', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RegisterPage />
      </QueryClientProvider>
    );
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });

    fireEvent.click(screen.getByText('Register'));

    const successMessage = await screen.findByText(/Login/i);
    expect(successMessage).toBeInTheDocument();
  });
});
