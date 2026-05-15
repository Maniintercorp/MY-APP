import { render, screen } from '@testing-library/react';
import DashboardPage from '../pages/DashboardPage';

describe('DashboardPage', () => {
  it('renders welcome message', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Welcome to your dashboard!')).toBeVisible();
  });
  it('renders dashboard heading', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });
});
