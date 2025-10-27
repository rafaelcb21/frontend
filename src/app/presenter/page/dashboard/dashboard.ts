import { Component, AfterViewInit, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { GaugeChart, LineChart } from 'echarts/charts';
import { TooltipComponent, TitleComponent, GridComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { DataTableComponent } from '../../component/data-table/data-table.component';
import { ColumnConfig } from '../../component/data-table/types';
import * as L from 'leaflet';
import { ThemeService } from '@infra/theme/theme.service';

echarts.use([GaugeChart, LineChart, TooltipComponent, TitleComponent, GridComponent, LegendComponent, CanvasRenderer]);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective, DataTableComponent],
  providers: [ provideEchartsCore({ echarts }) ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.sass'
})
export class Dashboard implements AfterViewInit {
  title = 'Dashboard';
  truckId: string | null = null;
  truckName: string | null = null;
  // Paleta dinâmica (lida das variáveis CSS do tema)
  private textColor = '#e0e0e0';
  private gridColor = '#444';
  private primary = '#4a6cf7';
  private accent = '#4a6cf7';

  // Gráficos
  turboOilLine: any;
  intakeAirLine: any;
  boostGauge: any;
  rpmGauge: any;
  oilPressureGauge: any;
  batteryAmperLine: any;
  batteryVoltageGauge: any;
  batterySocGauge: any;
  batteryTempGauge: any;
  batterySohGauge: any;
  alternatorAmperLine: any;
  alternatorVoltageGauge: any;
  alternatorTempGauge: any;

  private readonly themeService = inject(ThemeService);

  constructor(private route: ActivatedRoute, private router: Router) {
    const qp = this.route.snapshot.queryParamMap;
    this.truckId = qp.get('id');
    this.truckName = qp.get('name');

    if (!this.truckId) {
      // acesso direto sem contexto: redireciona para a lista de caminhões
      this.router.navigateByUrl('/dashboard/truck');
    } else {
      this.title = this.truckName
        ? `Dashboard — ${this.truckName} (#${this.truckId})`
        : `Dashboard — Caminhão #${this.truckId}`;
    }

    // Inicializa paleta e gráficos conforme tema atual
    this.updatePalette();
    this.rebuildCharts();

    // Reage à troca de tema
    effect(() => {
      this.themeService.theme();
      this.updatePalette();
      this.rebuildCharts();
    });
  }

  // Leaflet map
  private map?: L.Map;
  private readonly defaultCoords: L.LatLngExpression = [-23.55052, -46.633308]; // São Paulo

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const container = document.getElementById('truckMap');
    if (!container) return;

    this.map = L.map(container, {
      center: this.defaultCoords,
      zoom: 16,
      zoomControl: true
    });

    // CartoDB Positron (cinza claro), combina bem com tema escuro sem ficar preto
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; Carto',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);

    const truckIcon = L.divIcon({
      className: 'truck-marker',
      html: '🚚',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    L.marker(this.defaultCoords, { icon: truckIcon }).addTo(this.map);
  }

  // Dados de gráficos serão criados dinamicamente em rebuildCharts()

  // Helpers
  private lineOptions(label: string, data: number[], unit?: string) {
    return {
      backgroundColor: 'transparent',
      textStyle: { color: this.textColor },
      tooltip: { trigger: 'axis' },
      legend: { show: true, top: 8, textStyle: { color: this.textColor } },
      grid: { left: 50, right: 24, top: 40, bottom: 40 },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: Array.from({ length: data.length }, (_, i) => i + 1),
        axisLine: { lineStyle: { color: this.gridColor } },
        axisLabel: { color: this.textColor },
        name: 'Tempo',
        nameLocation: 'middle',
        nameGap: 28,
        nameTextStyle: { color: this.textColor }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: this.gridColor } },
        splitLine: { lineStyle: { color: this.gridColor } },
        axisLabel: {
          color: this.textColor,
          formatter: unit ? (val: number) => `${val} ${unit}` : undefined
        },
        name: unit ? `${label} (${unit})` : label,
        nameLocation: 'middle',
        nameGap: 40,
        nameTextStyle: { color: this.textColor }
      },
      series: [{
        name: label,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: this.primary, width: 2 },
        itemStyle: { color: this.accent },
        areaStyle: { color: this.hexToRgba(this.primary, 0.15) },
        data
      }]
    };
  }

  private gaugeOptions(label: string, unit: string, min: number, max: number, value: number) {
    return {
      backgroundColor: 'transparent',
      textStyle: { color: this.textColor },
      tooltip: { formatter: `{a} <br/>{c} ${unit}` },
      legend: {
        show: true,
        bottom: 6,
        textStyle: { color: this.textColor },
        formatter: (name: string) => `${name} (${unit})`
      },
      series: [{
        name: label,
        type: 'gauge',
        min,
        max,
        splitNumber: 6,
        axisLine: {
          lineStyle: {
            width: 10,
            color: [
              [0.5, '#00c853'],
              [0.8, '#ffd600'],
              [1, '#ff1744']
            ]
          }
        },
        axisLabel: {
          color: this.textColor,
          fontSize: 12,
          distance: 8,
          formatter: (v: number) => v.toFixed(1)
        },
        splitLine: { length: 10, lineStyle: { color: this.gridColor } },
        axisTick: { length: 6 },
        pointer: { show: true },
        detail: {
          formatter: `{value} ${unit}`,
          color: this.textColor,
          fontSize: 22,
          offsetCenter: [0, '75%']
        },
        title: { show: true, color: this.textColor },
        data: [{ value }]
      }]
    };
  }

  private updatePalette(): void {
    const text = this.themeService.getCssVar('--text') || this.themeService.getCssVar('--text-color') || '#1a1a1a';
    const border = this.themeService.getCssVar('--border') || this.themeService.getCssVar('--border-color') || '#e0e0e0';
    const primary = this.themeService.getCssVar('--primary') || this.themeService.getCssVar('--primary-color') || '#4a6cf7';

    this.textColor = text;
    this.gridColor = border;
    this.primary = primary;
    this.accent = primary;
  }

  private rebuildCharts(): void {
    // Turbocharger
    this.turboOilLine = this.lineOptions('Oil', [70, 72, 71, 73, 75, 74, 76, 77, 78, 80, 79, 81], '°C');
    this.intakeAirLine = this.lineOptions('Intake Air', [30, 32, 31, 33, 35, 34, 36, 37, 38, 40, 39, 41], '°C');
    this.boostGauge = this.gaugeOptions('Boost Pressure', 'bar', 0, 3, 1.2);
    this.rpmGauge = this.gaugeOptions('RPM', 'rpm', 0, 4000, 1800);
    this.oilPressureGauge = this.gaugeOptions('Oil Pressure', 'psi', 0, 100, 45);

    // Battery
    this.batteryAmperLine = this.lineOptions('Amper', [10, 15, 12, 18, 20, 17, 16, 14, 19, 22, 21, 18], 'A');
    this.batteryVoltageGauge = this.gaugeOptions('Voltage', 'V', 0, 16, 12.6);
    this.batterySocGauge = this.gaugeOptions('SoC', '%', 0, 100, 82);
    this.batteryTempGauge = this.gaugeOptions('Battery Temp', '°C', -20, 80, 32);
    this.batterySohGauge = this.gaugeOptions('SoH', '%', 0, 100, 91);

    // Alternator
    this.alternatorAmperLine = this.lineOptions('Amper', [5, 7, 6, 8, 10, 9, 11, 10, 9, 8, 7, 6], 'A');
    this.alternatorVoltageGauge = this.gaugeOptions('Voltage', 'V', 0, 16, 13.8);
    this.alternatorTempGauge = this.gaugeOptions('Alternator Temp', '°C', -20, 120, 65);
  }

  private hexToRgba(hex: string, alpha: number): string {
    const cleaned = hex.replace('#', '');
    const full = cleaned.length === 3 ? cleaned.split('').map(c => c + c).join('') : cleaned;
    const bigint = parseInt(full, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // DTC table data and columns
  dtcColumnConfig: ColumnConfig[] = [
    { key: 'dtc', label: 'DTC', sortable: true, filterable: true, widthPx: 180 },
    { key: 'message', label: 'Message', sortable: true, filterable: true },
    { key: 'date', label: 'Date', sortable: true, filterable: true, widthPx: 180 }
  ];

  dtcData = [
    { id: 1, dtc: 'P0113', message: 'Intake Air Temperature Sensor 1 Circuit High', date: '16/08/2025' },
    { id: 2, dtc: 'P0300', message: 'Random/Multiple Cylinder Misfire Detected', date: '11/01/2025' },
    { id: 3, dtc: 'P0113', message: 'Intake Air Temperature Sensor 1 Circuit High', date: '09/02/2024' },
    { id: 4, dtc: 'P0128', message: 'Coolant Thermostat Below Regulating Temperature', date: '17/06/2025' },
    { id: 5, dtc: 'P0335', message: 'Crankshaft Position Sensor A Circuit Malfunction', date: '01/12/2023' }
  ];
}
