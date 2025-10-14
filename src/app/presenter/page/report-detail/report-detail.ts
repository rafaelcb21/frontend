import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableComponent } from '../../component/data-table/data-table.component';
import { ColumnConfig } from '../../component/data-table/types';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './report-detail.html',
  styleUrls: ['./report-detail.sass']
})
export class ReportDetail {
  id: string | null = null;
  name: string | null = null;

  // Títulos
  titleFails = 'Fails Detail Report';
  titleDtcs = 'DTCs Detail Report';

  // Colunas e dados para Fails
  failsColumns: ColumnConfig[] = [
    { key: 'fail', label: 'FAIL', sortable: true, filterable: true, widthPx: 240 },
    { key: 'score', label: 'SCORE', sortable: true, filterable: true, widthPx: 140 },
    { key: 'date', label: 'DATE', sortable: true, filterable: true, widthPx: 160, cellTemplate: (v: string) => this.formatDateBR(v) }
  ];
  failsData: Array<{ fail: string; score: number; date: string }> = [];

  // Colunas e dados para DTCs
  dtcColumns: ColumnConfig[] = [
    { key: 'dtc', label: 'DTC', sortable: true, filterable: true, widthPx: 160 },
    { key: 'message', label: 'MESSAGE', sortable: true, filterable: true, widthPx: 520 },
    { key: 'date', label: 'DATE', sortable: true, filterable: true, widthPx: 160, cellTemplate: (v: string) => this.formatDateBR(v) }
  ];
  dtcData: Array<{ dtc: string; message: string; date: string }> = [];

  constructor(private route: ActivatedRoute, private router: Router) {
    const pm = this.route.snapshot.paramMap;
    const qp = this.route.snapshot.queryParamMap;
    this.id = pm.get('id');
    this.name = qp.get('name');

    // Dados de exemplo; em produção, carregar via serviço usando id
    this.populateExamples(this.id || '');
  }

  voltar() {
    this.router.navigateByUrl('/dashboard/report');
  }

  private formatDateBR(v: string): string {
    if (!v) return '';
    const m = v.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/);
    let d: Date;
    if (m) {
      d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    } else {
      d = new Date(v);
    }
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  private populateExamples(id: string) {
    // Fails: exemplo variando por id apenas para diversidade
    if (id === '2') {
      this.failsData = [
        { fail: 'turbocharger', score: 0.99, date: '2024-08-01' },
        { fail: 'turbocharger', score: 0.07, date: '2024-08-26' },
        { fail: 'battery',      score: 0.26, date: '2024-10-26' },
        { fail: 'turbocharger', score: 0.70, date: '2024-08-19' }
      ];
      this.dtcData = [
        { dtc: 'P0340', message: 'Camshaft Position Sensor Circuit Malfunction', date: '2024-07-30' },
        { dtc: 'P0171', message: 'System Too Lean (Bank 1)', date: '2024-08-17' },
        { dtc: 'P0171', message: 'System Too Lean (Bank 1)', date: '2024-09-22' },
        { dtc: 'P0113', message: 'Intake Air Temperature Sensor 1 Circuit High', date: '2024-08-05' },
        { dtc: 'P0113', message: 'Intake Air Temperature Sensor 1 Circuit High', date: '2024-09-17' },
        { dtc: 'P0171', message: 'System Too Lean (Bank 1)', date: '2024-10-18' }
      ];
      return;
    }

    // Default para outros IDs
    this.failsData = [
      { fail: 'battery',      score: 0.15, date: '2024-07-25' },
      { fail: 'alternator',   score: 0.32, date: '2024-08-12' },
      { fail: 'turbocharger', score: 0.51, date: '2024-09-05' }
    ];
    this.dtcData = [
      { dtc: 'P0406', message: 'Exhaust Gas Recirculation Sensor Circuit High', date: '2024-08-12' },
      { dtc: 'P0440', message: 'Evaporative Emission Control System Malfunction', date: '2024-09-03' }
    ];
  }
}