import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import UserProfile from '../components/UserProfile';
import { QueryClient, QueryClientProvider } from 'react-query';

const server = setupServer(
  rest.get('/api/users/profile', (req, res, ctx) => {
    return res(ctx.json({ username: 'existinguser', email: 'user@example.com' }));
  }),
  rest.put('/api/users/profile', (req, res, ctx) => {
    return res(ctx.json({ message: 'Profile updated successfully' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderWithQueryClient = (ui) => {
  const queryClient = new QueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

test('displays user profile details', async () => {
  renderWithQueryClient(<UserProfile />);
  expect(await screen.findByDisplayValue('existinguser')).toBeInTheDocument();
  expect(screen.getByDisplayValue('user@example.com')).toBeInTheDocument();
});

test('updates profile successfully', async () => {
  renderWithQueryClient(<UserProfile />);
  fireEvent.change(await screen.findByDisplayValue('existinguser'), {
    target: { value: 'newuser' },
  });
  fireEvent.change(screen.getByDisplayValue('user@example.com'), {
    target: { value: 'newuser@example.com' },
  });
  fireEvent.click(screen.getByRole('button', { name: /update profile/i }));
  await screen.findByText('Profile updated successfully');
});
