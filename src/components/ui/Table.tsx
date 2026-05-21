import React from 'react';

interface TableColumn<T> {
  title: string;
  render: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyField: keyof T;
  emptyText?: string;
}

export function Table<T>({ columns, data, keyField, emptyText = 'No data' }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length ? (
            data.map((row, i) => (
              <tr key={String(row[keyField])} className="hover:bg-gray-50">
                {columns.map((col, j) => (
                  <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{col.render(row)}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-6 text-center text-sm text-gray-400">{emptyText}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
export default Table;
