export type SortDir = 'asc' | 'desc' | 'none';

export interface ColumnConfig {
  key: string;
  label?: string;
  sortable?: boolean;
  filterable?: boolean;
  widthPx?: number;
  cellTemplate?: (value: any, row: any) => string;
  navigate?: {
    routeTemplate?: string;
    route?: string;
    params?: (row: any) => Record<string, any>;
    query?: (row: any) => Record<string, any>;
  };
}

export interface RowNavigate {
  routeTemplate?: string;
  route?: string;
  params?: (row: any) => Record<string, any>;
  query?: (row: any) => Record<string, any>;
}