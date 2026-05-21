import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../Modal';
describe('Modal', () => {
  it('does not render if not open', () => {
    const { container } = render(<Modal open={false} onClose={() => {}}>Hidden</Modal>);
    expect(container).toBeEmptyDOMElement();
  });
  it('renders children and title if open', () => {
    render(<Modal open={true} onClose={() => {}} title="Title">Text Body</Modal>);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Text Body')).toBeInTheDocument();
  });
  it('calls onClose if background clicked', () => {
    const fn = vi.fn();
    render(<Modal open={true} onClose={fn} title="T">X</Modal>);
    fireEvent.click(screen.getByRole('dialog').parentElement!);
    expect(fn).toHaveBeenCalled();
  });
  it('prevents propagation on dialog', () => {
    const fn = vi.fn();
    render(<Modal open={true} onClose={fn}>Body</Modal>);
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: screen.getByRole('dialog'), writable: false });
    screen.getByRole('dialog').dispatchEvent(event);
    expect(fn).not.toHaveBeenCalled();
  });
});
