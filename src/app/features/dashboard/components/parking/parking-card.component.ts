import { CommonModule, NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { CardGridParkingSpot } from '@app/core/model/sites.models';

@Component({
  selector: 'app-parking',
  imports: [CommonModule, NgClass],
  templateUrl: './parking-card.component.html',
  styleUrl: './parking-card.component.css',
})
export class ParkingCardComponent {
  spot = input<CardGridParkingSpot>();
}
