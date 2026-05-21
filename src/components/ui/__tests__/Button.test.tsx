import { render, fireEvent, screen } from '@testing-library/react';
import { Button } from '../Button';
describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });
  it('renders all variants and sizes', () => {
    render(<>
      <Button variant="primary">A</Button>
      <Button variant="secondary">B</Button>
      <Button variant="danger">C</Button>
      <Button variant="ghost">D</Button>
      <Button size="sm">SM</Button>
      <Button size="lg">LG</Button>
    </>);
    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'B' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'C' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'D' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'SM' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'LG' })).toBeInTheDocument();
  });
  it('shows spinner and disables if loading', () => {
    render(<Button loading>Do it</Button>);
    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
  it('calls onClick', () => {
    const fn = vi.fn();
    render(<Button onClick={fn}>Press</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(fn).toHaveBeenCalled();
  });
});
