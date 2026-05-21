import { render, fireEvent, screen } from '@testing-library/react';
import { Input } from '../Input';
describe('Input', () => {
  it('renders label and input', () => {
    render(<Input label="Test label" name="test" value="hello" onChange={() => {}} />);
    expect(screen.getByLabelText(/test label/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument();
  });
  it('shows error', () => {
    render(<Input label="Test" name="t" value="" error="Something wrong" onChange={() => {}} />);
    expect(screen.getByText(/something wrong/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
  });
  it('forwards rest props and calls onChange', () => {
    const onChange = vi.fn();
    render(<Input label="Blah" name="x" value="abc" onChange={onChange} type="password" />);
    fireEvent.change(screen.getByLabelText(/blah/i), { target: { value: '123' } });
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByLabelText(/blah/i)).toHaveAttribute('type', 'password');
  });
});
