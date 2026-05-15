import { render, screen, fireEvent } from '@testing-library/react';
import { UserRegistration } from '../UserRegistration';
import { server } from '../../../mocks/server';
import { rest } from 'msw';

// Mock server setup
test('should register new user successfully', async () => {
  server.use(
    rest.post('/api/register', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ message: 'User registered successfully!' }));
    })
  );

  render(<UserRegistration />);
  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
  fireEvent.click(screen.getByRole('button', { name: /register/i }));

  const successMessage = await screen.findByText(/User registered successfully!/i);
  expect(successMessage).toBeInTheDocument();
});