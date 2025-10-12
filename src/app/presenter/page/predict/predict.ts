import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-predict',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './predict.html',
  styleUrls: ['./predict.sass']
})
export class Predict {
  title = 'Previsões';
}