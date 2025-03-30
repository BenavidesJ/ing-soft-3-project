import React from 'react';
import { Table } from 'react-bootstrap';

export interface ActionTableColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
}

interface ActionTableProps<T> {
  columns: ActionTableColumn<T>[];
  data: T[];
  rowStyle?: (row: T) => React.CSSProperties;
  action?: () => void;
}

export function ActionTable<T>({
  columns,
  data,
  rowStyle,
  action,
}: ActionTableProps<T>) {
  return (
    <Table bordered responsive>
      <thead className="primary" style={{ borderRadius: '20px' }}>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIdx) => (
          <tr
            key={rowIdx}
            style={rowStyle ? rowStyle(row) : undefined}
            onClick={action}
          >
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
