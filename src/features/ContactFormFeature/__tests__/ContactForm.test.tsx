import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ContactForm } from '../components/ContactForm';

const queryClient = new QueryClient();

const server = setupServer(
  rest.post('/api/contacts', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ success: true, message: 'Contact form submitted successfully.' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ContactForm Component', () => {
  it('renders correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ContactForm />
      </QueryClientProvider>
    );
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('displays error messages if required fields are empty upon submission', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ContactForm />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText(/submit/i));
    expect(await screen.findByText(/all fields are required/i)).toBeInTheDocument();
  });

  it('submits form data successfully', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ContactForm />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hello there!' } });

    fireEvent.click(screen.getByText(/submit/i));

    expect(await screen.findByText(/your message was sent successfully/i)).toBeInTheDocument();
  });

  it('displays an error message on submission failure', async () => {
    server.use(
      rest.post('/api/contacts', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <ContactForm />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hello there!' } });

    fireEvent.click(screen.getByText(/submit/i));

    expect(await screen.findByText(/an error occurred/i)).toBeInTheDocument();
  });
});
