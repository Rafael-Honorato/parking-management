import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { KpiComponent } from '../../components/kpi/kpi.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    KpiComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  fb = inject(FormBuilder);
  kpi = [1, 2, 3, 4];

  form = this.fb.group({
    cliente: '',
    empresa: '',
    piso: '',
  });
}
