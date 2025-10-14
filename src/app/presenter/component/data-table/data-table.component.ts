import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnConfig, RowNavigate, SortDir } from './types';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.sass']
})
export class DataTableComponent {
  @Input() set data(value: any[]) {
    // Sempre atualiza o dataMap, mesmo quando o array está vazio
    const map = new Map<any, any>();
    if (Array.isArray(value)) {
      for (const row of value) {
        const id = row[this.keyField] || row.id;
        map.set(id, row);
      }
    }
    this.dataMap.set(map);
    // Ao trocar os dados, volta para a primeira página
    this.pageIndex.set(0);
    
    // Detecta colunas automaticamente apenas quando houver dados
    if (!this.columnConfig?.length && Array.isArray(value) && value.length > 0) {
      this.autoDetectColumns(value[0]);
    }
  }
  
  @Input() columnConfig?: ColumnConfig[];
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [10, 20, 50];
  @Input() rowNavigate?: RowNavigate;
  @Input() keyField = 'id';
  @Input() rowClass?: (row: any) => string | Record<string, boolean>;

  @Output() sortChanged = new EventEmitter<{key: string; dir: SortDir}>();
  @Output() filterChanged = new EventEmitter<Record<string, string>>();
  @Output() pageChanged = new EventEmitter<{pageIndex: number; pageSize: number}>();
  @Output() rowNavigated = new EventEmitter<any>();
  @Output() cellNavigated = new EventEmitter<{row: any; key: string}>();

  // Internal signals
  dataMap = signal<Map<any, any>>(new Map());
  sortKey = signal<string>('');
  sortDir = signal<SortDir>('none');
  filters = signal<Record<string, string>>({});
  pageIndex = signal<number>(0);
  pageSizeSignal = signal<number>(this.pageSize);
  
  // Computed values
  allData = computed(() => Array.from(this.dataMap().values()));
  
  filteredData = computed(() => {
    const data = this.allData();
    const filters = this.filters();
    const filterKeys = Object.keys(filters);
    
    if (!filterKeys.length) return data;
    
    return data.filter(row => {
      return filterKeys.every(key => {
        const filterValue = filters[key]?.toLowerCase();
        if (!filterValue) return true;
        
        const cellValue = String(row[key] || '').toLowerCase();
        return cellValue.includes(filterValue);
      });
    });
  });
  
  sortedData = computed(() => {
    const data = [...this.filteredData()];
    const key = this.sortKey();
    const dir = this.sortDir();
    
    if (key && dir !== 'none') {
      data.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        
        // Handle different data types
        if (typeof valA === 'string' && typeof valB === 'string') {
          return dir === 'asc' 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
        }
        
        // Numeric comparison
        const numA = Number(valA);
        const numB = Number(valB);
        
        if (!isNaN(numA) && !isNaN(numB)) {
          return dir === 'asc' ? numA - numB : numB - numA;
        }
        
        // Fallback for mixed types
        return dir === 'asc' 
          ? String(valA).localeCompare(String(valB)) 
          : String(valB).localeCompare(String(valA));
      });
    }
    
    return data;
  });
  
  pagedData = computed(() => {
    const data = this.sortedData();
    const pageSize = this.pageSizeSignal();
    const startIndex = this.pageIndex() * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  });
  
  totalPages = computed(() => {
    return Math.ceil(this.filteredData().length / this.pageSizeSignal());
  });
  
  constructor(private router: Router) {}
  
  // Public methods for updating data
  updateData(rows: any[]) {
    const map = new Map(this.dataMap());
    
    for (const row of rows) {
      const id = row[this.keyField] || row.id;
      const prev = map.get(id) || {};
      map.set(id, { ...prev, ...row });
    }
    
    this.dataMap.set(new Map(map));
  }
  
  // Sorting methods
  toggleSort(key: string) {
    let newDir: SortDir = 'asc';
    
    if (this.sortKey() === key) {
      // Cycle through sort directions
      if (this.sortDir() === 'asc') newDir = 'desc';
      else if (this.sortDir() === 'desc') newDir = 'none';
    }
    
    this.sortKey.set(key);
    this.sortDir.set(newDir);
    this.sortChanged.emit({ key, dir: newDir });
  }
  
  // Filter methods
  applyFilter(key: string, value: string) {
    const currentFilters = { ...this.filters() };
    
    if (value) {
      currentFilters[key] = value;
    } else {
      delete currentFilters[key];
    }
    
    this.filters.set(currentFilters);
    this.pageIndex.set(0); // Reset to first page
    this.filterChanged.emit(currentFilters);
  }

  // Limpa todos os filtros, ordenação e reseta a paginação
  clearAllFilters() {
    this.filters.set({});
    this.sortKey.set('');
    this.sortDir.set('none');
    this.pageIndex.set(0);
    this.filterChanged.emit({});
    this.sortChanged.emit({ key: '', dir: 'none' });
  }
  
  // Pagination methods
  prevPage() {
    if (this.pageIndex() > 0) {
      this.pageIndex.update(val => val - 1);
      this.emitPageChange();
    }
  }
  
  nextPage() {
    if (this.pageIndex() < this.totalPages() - 1) {
      this.pageIndex.update(val => val + 1);
      this.emitPageChange();
    }
  }
  
  setPageSize(size: number) {
    this.pageSizeSignal.set(size);
    this.pageIndex.set(0); // Reset to first page
    this.emitPageChange();
  }
  
  private emitPageChange() {
    this.pageChanged.emit({
      pageIndex: this.pageIndex(),
      pageSize: this.pageSizeSignal()
    });
  }
  
  // Navigation methods
  navigateToRow(row: any) {
    if (!this.rowNavigate) return;
    
    const route = this.buildRoute(this.rowNavigate, row);
    if (route) {
      this.router.navigateByUrl(route);
      this.rowNavigated.emit(row);
    }
  }
  
  navigateToCell(row: any, key: string, config?: ColumnConfig) {
    if (!config?.navigate) return;
    
    const route = this.buildRoute(config.navigate, row);
    if (route) {
      this.router.navigateByUrl(route);
      this.cellNavigated.emit({ row, key });
    }
  }
  
  // Click handler for table cells: only stop propagation when cell has its own navigation
  onCellClick(event: MouseEvent, row: any, key: string, config?: ColumnConfig) {
    if (config?.navigate) {
      event.stopPropagation();
      this.navigateToCell(row, key, config);
    }
    // If no navigate config, allow event to bubble to row click
  }
  
  private buildRoute(
    navConfig: RowNavigate | ColumnConfig['navigate'], 
    row: any
  ): string | null {
    if (!navConfig) return null;
    
    // Use routeTemplate with placeholders
    if (navConfig.routeTemplate) {
      return navConfig.routeTemplate.replace(/{(\w+)}/g, (_, key) => {
        return row[key] !== undefined ? encodeURIComponent(row[key]) : '';
      });
    }
    
    // Use route with params and query
    if (navConfig.route) {
      let url = navConfig.route;
      
      // Add params
      if (navConfig.params) {
        const params = navConfig.params(row);
        Object.entries(params).forEach(([key, value]) => {
          url = url.replace(`:${key}`, encodeURIComponent(String(value)));
        });
      }
      
      // Add query params
      if (navConfig.query) {
        const query = navConfig.query(row);
        const queryParams = new URLSearchParams();
        Object.entries(query).forEach(([key, value]) => {
          queryParams.append(key, String(value));
        });
        
        const queryString = queryParams.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
      }
      
      return url;
    }
    
    return null;
  }
  
  // Helper methods
  private autoDetectColumns(firstRow: any) {
    if (!firstRow) return;
    
    this.columnConfig = Object.keys(firstRow)
      .filter(key => key !== 'id' && !key.startsWith('_'))
      .map(key => ({
        key,
        label: this.formatLabel(key),
        sortable: true,
        filterable: true
      }));
  }
  
  private formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  }
  
  // TrackBy function for ngFor
  trackById(_: number, row: any): any {
    return row[this.keyField] || row.id;
  }
}