import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { renderWithProviders } from '@/test/testUtils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Table, TableColumn } from '@/components/ui/Table';
import { Layout } from '@/components/Layout';

describe('Button', () => {
  it('renders children, handles clicks, and applies disabled loading state', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithProviders(<Button loading onClick={onClick}>Save</Button>);

    const button = screen.getByRole('button', { name: /save/i });
    expect(button).toBeDisabled();
    expect(screen.getByText('...')).toBeInTheDocument();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('supports variants, sizes, custom classes and refs', () => {
    const ref = { current: null as HTMLButtonElement | null };
    renderWithProviders(<Button ref={ref} variant='danger' size='lg' className='custom-class'>Delete</Button>);
    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toHaveClass('bg-red-600');
    expect(button).toHaveClass('px-6');
    expect(button).toHaveClass('custom-class');
    expect(ref.current).toBe(button);
  });
});

describe('Input', () => {
  it('renders label, input value and error message', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(<Input label='Email' name='email' error='Required' value='' onChange={onChange} />);

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('id', 'email');
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(input).toHaveClass('border-red-300');
    await user.type(input, 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('uses explicit id when provided', () => {
    renderWithProviders(<Input id='custom-id' label='Name' name='name' />);
    expect(screen.getByLabelText('Name')).toHaveAttribute('id', 'custom-id');
  });
});

describe('Modal', () => {
  it('does not render when closed', () => {
    renderWithProviders(<Modal open={false} title='Hidden' onClose={vi.fn()}>Body</Modal>);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('renders in a portal and closes with close button, backdrop, and Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<Modal open title='Create item' onClose={onClose}>Modal body</Modal>);

    expect(screen.getByRole('heading', { name: 'Create item' })).toBeInTheDocument();
    expect(screen.getByText('Modal body')).toBeInTheDocument();
    await user.click(screen.getByLabelText('Close modal'));
    await user.click(screen.getByLabelText('Close modal backdrop'));
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(3);
  });
});

describe('Table', () => {
  type Row = { id: string; name: string; status: string };
  const columns: TableColumn<Row>[] = [
    { key: 'name', header: 'Name' },
    { key: 'status', header: 'Status', render: row => <strong>{row.status}</strong> },
  ];

  it('renders headers and rows', () => {
    renderWithProviders(<Table columns={columns} data={[{ id: '1', name: 'Portal', status: 'Active' }]} getRowKey={row => row.id} />);
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByText('Portal')).toBeInTheDocument();
    expect(screen.getByText('Active').tagName).toBe('STRONG');
  });

  it('renders custom empty message', () => {
    renderWithProviders(<Table columns={columns} data={[]} getRowKey={row => row.id} emptyMessage='Nothing here' />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });
});

describe('Layout', () => {
  it('renders navigation, highlights active link, outlet content, and toggles sidebar', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route element={<Layout />}>
          <Route path='/dashboard' element={<div>Dashboard child</div>} />
        </Route>
      </Routes>,
      { initialEntries: ['/dashboard'] }
    );

    expect(screen.getByText('SaaS App')).toBeInTheDocument();
    expect(screen.getByText('Dashboard child')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveClass('bg-indigo-600');

    await user.click(screen.getByLabelText('Close sidebar'));
    expect(screen.queryByText('SaaS App')).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('Toggle sidebar'));
    expect(screen.getByText('SaaS App')).toBeInTheDocument();
  });
});
