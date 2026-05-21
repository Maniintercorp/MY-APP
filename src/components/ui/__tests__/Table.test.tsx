import { render, screen } from '@testing-library/react';
import { Table } from '../Table';

describe('Table', () => {
  const columns = [
    { title: 'Col1', render: (row: any) => row.a },
    { title: 'Col2', render: (row: any) => row.b },
  ];
  it('renders header and rows', () => {
    render(<Table columns={columns} data={[{ a: 1, b: 2, id: 1 }]} keyField="id" />);
    expect(screen.getByText(/col1/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
  it('renders empty text if no data', () => {
    render(<Table columns={columns} data={[]} keyField="a" emptyText="Nope" />);
    expect(screen.getByText('Nope')).toBeInTheDocument();
  });
});
