import { render, screen } from '@testing-library/react';
import { AuthErrorMessage } from '../components/AuthErrorMessage';

describe('AuthErrorMessage', () => {
  it('renders nothing if no error', () => {
    const { container } = render(<AuthErrorMessage />);
    expect(container).toBeEmptyDOMElement();
  });
  it('shows error message', () => {
    render(<AuthErrorMessage error="Invalid credentials" />);
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});
