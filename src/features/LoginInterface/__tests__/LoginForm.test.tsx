import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../components/LoginForm';

jest.mock('../hooks/useLoginForm', () => ({
  useLoginForm: jest.fn().mockReturnValue({
    handleSubmit: jest.fn(),
    handleChange: jest.fn(),
    values: { username: '', password: '' },
    errors: {}
  })
}));

const useLoginForm = require('../hooks/useLoginForm').useLoginForm;

beforeEach(() => {
  (useLoginForm().handleChange as jest.Mock).mockClear();
  (useLoginForm().handleSubmit as jest.Mock).mockClear();
});

describe('LoginForm component', () => {
  it('renders form elements', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('calls handleChange on input change', () => {
    render(<LoginForm />);
    const usernameInput = screen.getByLabelText(/username/i);
    fireEvent.change(usernameInput, { target: { value: 'newUsername' } });

    expect(useLoginForm().handleChange).toHaveBeenCalled();
  });

  it('calls handleSubmit on form submission', () => {
    render(<LoginForm />);
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(useLoginForm().handleSubmit).toHaveBeenCalled();
  });

  it('displays validation errors', () => {
    useLoginForm.mockReturnValueOnce({
      handleSubmit: jest.fn(),
      handleChange: jest.fn(),
      values: { username: '', password: '' },
      errors: { username: 'Username is required' }
    });

    render(<LoginForm />);
    expect(screen.getByText(/username is required/i)).toBeInTheDocument();
  });
});