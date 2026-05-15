import { render, screen } from '@testing-library/react';
import UserComponent from '../components/UserComponent';
test('renders user component', () => {
  render(<UserComponent />);
  expect(screen.getByText(/User List/i)).toBeInTheDocument();
});