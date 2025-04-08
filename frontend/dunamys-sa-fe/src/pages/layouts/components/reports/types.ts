import React from 'react';

export interface ReportFilter {
  name: string;
  label: string;
  type: 'text' | 'date' | 'select';
  options?: { value: string; label: string }[];
}

export interface ReportColumn {
  header: string;
  accessor: string | ((row: any) => React.ReactNode);
}

export interface ReportConfig {
  id: string;
  label: string;
  filters: ReportFilter[];
  tableColumns: ReportColumn[];
  pdfTemplate: React.FC<{ data: any[] }>;
  fetchData: (filters: any) => Promise<any[]>;
}
