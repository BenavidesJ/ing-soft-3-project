import React from 'react';
import { Table } from 'react-bootstrap';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
}

interface ReusableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowStyle?: (row: T) => React.CSSProperties;
}

export function SimpleTable<T>({
  columns,
  data,
  rowStyle,
}: ReusableTableProps<T>) {
  return (
    <Table bordered responsive style={{ borderRadius: '20px' }}>
      <thead className="primary">
        <tr>
          {columns.map((col, idx) => (
            <th key={idx}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIdx) => (
          <tr key={rowIdx} style={rowStyle ? rowStyle(row) : undefined}>
            {columns.map((col, colIdx) => {
              let cell;
              if (typeof col.accessor === 'string') {
                cell = row[col.accessor];
              } else if (typeof col.accessor === 'function') {
                cell = col.accessor(row);
              }
              return <td key={colIdx}>{cell as React.ReactNode}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
