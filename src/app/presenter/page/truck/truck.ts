import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../../component/data-table/data-table.component';
import { ColumnConfig } from '../../component/data-table/types';

@Component({
  selector: 'app-truck',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './truck.html',
  styleUrls: ['./truck.sass']
})
export class Truck {
  title = 'Trucks';

  // Dados de exemplo para os trucks com todas as colunas solicitadas
  trucks = [
    {
      id: 1,
      name: 'Vehicle A',
      faultStatus: 'OK',
      kmh: 83,
      motorRpm: 1200,
      motorTc: 78,
      oilPsi: 45,
      brakes: 'Good',
      fuel: 85,
      tirePsi: 32,
      battery: 12.6,
      alternator: 'OK',
      turbocharger: 'Normal',
      j1939Network: 'Connected',
      datetime: '2024-12-10 14:30:15'
    },
    {
      id: 2,
      name: 'Vehicle B',
      faultStatus: 'Warning',
      kmh: 65,
      motorRpm: 1100,
      motorTc: 72,
      oilPsi: 42,
      brakes: 'Good',
      fuel: 62,
      tirePsi: 30,
      battery: 12.4,
      alternator: 'OK',
      turbocharger: 'Normal',
      j1939Network: 'Connected',
      datetime: '2024-12-10 14:28:42'
    },
    {
      id: 3,
      name: 'Vehicle C',
      faultStatus: 'OK',
      kmh: 87,
      motorRpm: 1300,
      motorTc: 80,
      oilPsi: 44,
      brakes: 'Good',
      fuel: 78,
      tirePsi: 33,
      battery: 12.8,
      alternator: 'OK',
      turbocharger: 'Normal',
      j1939Network: 'Connected',
      datetime: '2024-12-10 14:32:18'
    },
    {
      id: 4,
      name: 'Vehicle D',
      faultStatus: 'Critical',
      kmh: 0,
      motorRpm: 0,
      motorTc: 0,
      oilPsi: 0,
      brakes: 'Fault',
      fuel: 15,
      tirePsi: 28,
      battery: 11.8,
      alternator: 'Fault',
      turbocharger: 'Error',
      j1939Network: 'Disconnected',
      datetime: '2024-12-10 14:15:33'
    },
    {
      id: 5,
      name: 'Vehicle E',
      faultStatus: 'OK',
      kmh: 109,
      motorRpm: 1500,
      motorTc: 85,
      oilPsi: 48,
      brakes: 'Good',
      fuel: 92,
      tirePsi: 34,
      battery: 13.1,
      alternator: 'OK',
      turbocharger: 'Normal',
      j1939Network: 'Connected',
      datetime: '2024-12-10 14:35:07'
    },
    {
      id: 6,
      name: 'Vehicle F',
      faultStatus: 'OK',
      kmh: 4,
      motorRpm: 800,
      motorTc: 65,
      oilPsi: 40,
      brakes: 'Good',
      fuel: 55,
      tirePsi: 31,
      battery: 12.5,
      alternator: 'OK',
      turbocharger: 'Normal',
      j1939Network: 'Connected',
      datetime: '2024-12-10 14:20:51'
    },
    {
      id: 7,
      name: 'Vehicle G',
      faultStatus: 'Warning',
      kmh: 111,
      motorRpm: 1600,
      motorTc: 88,
      oilPsi: 50,
      brakes: 'Good',
      fuel: 38,
      tirePsi: 29,
      battery: 12.3,
      alternator: 'OK',
      turbocharger: 'High',
      j1939Network: 'Connected',
      datetime: '2024-12-10 14:37:22'
    },
    {
      id: 8,
      name: 'Vehicle H',
      faultStatus: 'OK',
      kmh: 6,
      motorRpm: 850,
      motorTc: 68,
      oilPsi: 41,
      brakes: 'Good',
      fuel: 71,
      tirePsi: 32,
      battery: 12.7,
      alternator: 'OK',
      turbocharger: 'Normal',
      j1939Network: 'Connected',
      datetime: '2024-12-10 14:25:14'
    }
  ];

  // Configuração das colunas conforme solicitado
  columns: ColumnConfig[] = [
    { key: 'id', label: 'ID', sortable: true, filterable: true, widthPx: 80 },
    { key: 'name', label: 'Name', sortable: true, filterable: true, widthPx: 120 },
    { key: 'faultStatus', label: 'Fault Status', sortable: true, filterable: true, widthPx: 120 },
    { key: 'kmh', label: 'Km/h', sortable: true, filterable: true, widthPx: 80 },
    { key: 'motorRpm', label: 'Motor RPM', sortable: true, filterable: true, widthPx: 100 },
    { key: 'motorTc', label: 'Motor °C', sortable: true, filterable: true, widthPx: 90 },
    { key: 'oilPsi', label: 'Oil psi', sortable: true, filterable: true, widthPx: 80 },
    { key: 'brakes', label: 'Brakes', sortable: true, filterable: true, widthPx: 80 },
    { key: 'fuel', label: 'Fuel', sortable: true, filterable: true, widthPx: 70 },
    { key: 'tirePsi', label: 'Tire psi', sortable: true, filterable: true, widthPx: 80 },
    { key: 'battery', label: 'Battery', sortable: true, filterable: true, widthPx: 80 },
    { key: 'alternator', label: 'Alternator', sortable: true, filterable: true, widthPx: 100 },
    { key: 'turbocharger', label: 'Turbocharger', sortable: true, filterable: true, widthPx: 120 },
    { key: 'j1939Network', label: 'J1939 Network', sortable: true, filterable: true, widthPx: 120 },
    { key: 'datetime', label: 'Datetime', sortable: true, filterable: true, widthPx: 150 }
  ];

  // Método chamado quando uma linha é clicada
  onRowNavigated(row: any) {
    console.log('Truck row clicked:', row);
    console.log(`Navegando para detalhes do truck ID: ${row.id}, Nome: ${row.name}`);
  }

  // Métodos para outros eventos da tabela
  onSortChanged(event: {key: string, dir: string}) {
    console.log('Sort changed:', event);
  }

  onFilterChanged(filters: Record<string, string>) {
    console.log('Filters changed:', filters);
  }

  onPageChanged(event: {pageIndex: number, pageSize: number}) {
    console.log('Page changed:', event);
  }
}