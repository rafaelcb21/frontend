import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../component/data-table/data-table.component';
import { ColumnConfig, RowNavigate } from '../../component/data-table/types';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent],
  templateUrl: './report.html',
  styleUrls: ['./report.sass']
})
export class Report {
  title = 'Relatórios';

  // Filtro de data
  startDateFilter = ''; // formato yyyy-MM-dd vindo do input type="date"
  endDateFilter = '';

  // Configuração das colunas solicitadas
  columns: ColumnConfig[] = [
    { key: 'id', label: 'ID', sortable: true, filterable: true, widthPx: 80 },
    { key: 'name', label: 'NAME', sortable: true, filterable: true, widthPx: 160 },
    { key: 'fails', label: 'FAILS', sortable: true, filterable: true, widthPx: 120 },
    { key: 'dtcs', label: 'DTCs', sortable: true, filterable: true, widthPx: 120 },
    { key: 'startDate', label: 'START DATE', sortable: true, filterable: true, widthPx: 160, cellTemplate: (v: string) => this.formatDateBR(v) },
    { key: 'endDate', label: 'END DATE', sortable: true, filterable: true, widthPx: 160, cellTemplate: (v: string) => this.formatDateBR(v) }
  ];

  // Navegação ao clicar na linha para página de detalhe
  rowNavigate: RowNavigate = {
    route: '/dashboard/report/:id',
    params: (row: any) => ({ id: row.id }),
    query: (row: any) => ({ name: row.name })
  };

  // Dados de exemplo
  rows = [
    { id: 1, name: 'Vehicle A', fails: 100, dtcs: 100, startDate: '2024-07-30', endDate: '2024-10-26' },
    { id: 2, name: 'Vehicle B', fails: 100, dtcs: 100, startDate: '2024-07-29', endDate: '2024-10-26' },
    { id: 3, name: 'Vehicle C', fails: 100, dtcs: 100, startDate: '2024-07-29', endDate: '2024-10-26' },
    { id: 4, name: 'Vehicle D', fails: 100, dtcs: 100, startDate: '2024-07-29', endDate: '2024-10-26' },
    { id: 5, name: 'Vehicle E', fails: 100, dtcs: 100, startDate: '2024-07-29', endDate: '2024-10-26' },
    { id: 6, name: 'Vehicle F', fails: 100, dtcs: 100, startDate: '2024-07-29', endDate: '2024-10-25' },
    { id: 7, name: 'Vehicle G', fails: 100, dtcs: 100, startDate: '2024-07-29', endDate: '2024-10-26' },
    { id: 8, name: 'Vehicle H', fails: 100, dtcs: 100, startDate: '2024-07-29', endDate: '2024-10-26' },
    { id: 9, name: 'Vehicle I', fails: 100, dtcs: 100, startDate: '2024-07-28', endDate: '2024-10-24' },
    { id: 10, name: 'Vehicle J', fails: 100, dtcs: 100, startDate: '2024-07-27', endDate: '2024-10-23' }
  ];

  filteredRows = [...this.rows];

  buscarPorData() {
    const start = this.parseDate(this.startDateFilter);
    const end = this.parseDate(this.endDateFilter);
    // Inclusivo: considera todo o dia do End Date
    const endInclusive = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1) : null;

    this.filteredRows = this.rows.filter(r => {
      const s = this.parseDate(r.startDate) ?? new Date(1970, 0, 1);
      const e = this.parseDate(r.endDate) ?? new Date(9999, 11, 31);

      // Sem filtros, mantém tudo
      if (!start && !endInclusive) return true;
      if (start && endInclusive) return s >= start && e < endInclusive;
      if (start) return s >= start;
      if (endInclusive) return e < endInclusive;
      return true;
    });
  }

  resetarFiltros(dt: DataTableComponent) {
    this.startDateFilter = '';
    this.endDateFilter = '';
    this.filteredRows = [...this.rows];
    // Limpa filtros de colunas, ordenação e paginação
    dt.clearAllFilters();
  }

  private parseDate(v: string): Date | null {
    if (!v) return null;
    // Parse como data local para evitar deslocamentos de fuso horário
    const m = v.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/);
    if (m) {
      const year = Number(m[1]);
      const month = Number(m[2]) - 1; // 0-based
      const day = Number(m[3]);
      return new Date(year, month, day);
    }
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }

  private formatDateBR(v: string): string {
    const d = this.parseDate(v);
    if (!d) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }
}