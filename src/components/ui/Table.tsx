import React from 'react';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string | number;
  emptyMessage?: string;
}

export const Table = <T,>({ columns, data, getRowKey, emptyMessage = 'No records found.' }: TableProps<T>) => (
  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column) => (
            <th key={String(column.key)} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 ${column.className || ''}`}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {data.length === 0 ? (
          <tr>
            <td className="px-4 py-8 text-center text-sm text-gray-500" colSpan={columns.length}>{emptyMessage}</td>
          </tr>
        ) : (
          data.map((row) => (
            <tr key={getRowKey(row)} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={String(column.key)} className={`px-4 py-3 text-sm text-gray-700 ${column.className || ''}`}>
                  {column.render ? column.render(row) : String(row[column.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
export default Table;
