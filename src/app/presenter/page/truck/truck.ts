import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-truck',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './truck.html',
  styleUrls: ['./truck.sass']
})
export class Truck {
  title = 'Caminhões';
}