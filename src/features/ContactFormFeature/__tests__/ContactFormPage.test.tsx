import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ContactFormPage } from '../pages/ContactFormPage';
import { server, rest } from '../../../setupTests';

const queryClient = new QueryClient();

const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <ContactFormPage />
    </QueryClientProvider>
  );

describe('ContactFormPage component', () => {
  it('renders the contact form', () => {
    renderComponent();
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
  });

  it('displays success message after submission', async () => {
    server.use(
      rest.post('/api/contacts', (req, res, ctx) => {
        return res(ctx.status(201), ctx.json({ id: 1, createdAt: new Date().toISOString() }));
      })
    );

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello world!' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/Thank you for contacting us!/i)).toBeInTheDocument();
  });
});
