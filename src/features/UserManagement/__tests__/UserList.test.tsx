import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import UserList from '../UserList';

const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json([{
      id: 1,
      username: 'testuser',
      email: 'testuser@example.com'
    }]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders user list from API', async () => {
  render(<UserList />);
  const items = await screen.findAllByRole('listitem');
  expect(items).toHaveLength(1);
  expect(screen.getByText('testuser')).toBeInTheDocument();
});