import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { GaugeChart } from 'echarts/charts';
import { TooltipComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GaugeChart, TooltipComponent, TitleComponent, CanvasRenderer]);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  providers: [ provideEchartsCore({ echarts }) ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.sass'
})
export class Dashboard {
  title = 'Dashboard';

  option = {
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      pointer: { show: true },
      axisLine: {
        lineStyle: {
          width: 12,
          color: [
            [0.5, '#00FF00'],
            [0.8, '#FFFF00'],
            [1, '#FF0000']
          ]
        }
      },
      detail: { formatter: '{value}' },
      data: [{ value: 50 }]
    }]
  };

  // quando vier update da API/webhook:
  updateValue(newVal: number) {
    const opt = { ...this.option };
    (opt.series as any)[0].data = [{ value: newVal }];
    this.option = opt;
  }
}
