import React from 'react';
import styles from '@/components/tables/CustomTable.module.css';

export interface TableColumn<T> {
  header: string;
  render: (item: T) => React.ReactNode;
}


interface CustomTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
}

export function CustomTable<T>({ columns, data }: CustomTableProps<T>) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index} className={styles.tableHeader}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, rowIndex) => (
          <tr key={rowIndex} className={styles.tableRow}>
            {columns.map((col, colIndex) => (
              <td key={colIndex} className={styles.tableCell}>
                {col.render(item)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
