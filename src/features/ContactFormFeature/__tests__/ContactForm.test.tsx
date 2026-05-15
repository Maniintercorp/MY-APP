import { render, screen, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { QueryClient, QueryClientProvider } from 'react-query';
import ContactForm from '../components/ContactForm';

const server = setupServer(
  rest.post('/api/contacts', (req, res, ctx) => {
    return res(ctx.json({ success: true, message: 'Form submitted successfully.' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const queryClient = new QueryClient();

const renderWithProvider = (ui) => {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

test('renders the contact form', () => {
  renderWithProvider(<ContactForm />);
  expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
});

test('submits the form successfully', async () => {
  renderWithProvider(<ContactForm />);

  fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } });
  fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello World!' } });

  fireEvent.click(screen.getByText(/Submit/i));

  expect(await screen.findByText(/Your message has been sent/i)).toBeInTheDocument();
});

test('handles server error gracefully', async () => {
  server.use(
    rest.post('/api/contacts', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  renderWithProvider(<ContactForm />);

  fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } });
  fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello World!' } });

  fireEvent.click(screen.getByText(/Submit/i));

  expect(await screen.findByText(/failed to submit/i)).toBeInTheDocument();
});