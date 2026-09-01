import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { kpiDataParkingSpot } from '@app/core/model/sites.models';

@Component({
  selector: 'app-kpi',
  imports: [MatProgressSpinnerModule],
  templateUrl: './kpi.component.html',
  styleUrl: './kpi.component.css',
})
export class KpiComponent {
  kpi = input<kpiDataParkingSpot>();
  isLoading = input<Boolean>(false);
}
