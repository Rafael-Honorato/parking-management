import { Component, input } from '@angular/core';

@Component({
  selector: 'app-kpi',
  imports: [],
  templateUrl: './kpi.component.html',
  styleUrl: './kpi.component.css',
})
export class KpiComponent {
  titulo = input<string>('');
  qtd = input<number>(0);
  icon = input<string>('');
}
