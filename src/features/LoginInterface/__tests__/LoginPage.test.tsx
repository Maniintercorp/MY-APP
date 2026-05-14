import { render, screen } from '@testing-library/react';
import LoginPage from '../pages/LoginPage';

jest.mock('../components/LoginForm', () => () => (<div>Mocked Login Form</div>));

describe('LoginPage component', () => {
  it('renders the login form', () => {
    render(<LoginPage />);
    expect(screen.getByText('Mocked Login Form')).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });
});