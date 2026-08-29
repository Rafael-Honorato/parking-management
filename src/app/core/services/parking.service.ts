import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ParkingService {
  http = inject(HttpClient);

  getSitesByClientId(id: number) {
    return this.http.get(`${environment.BASE_URL}GetSitesByClientId?id=${id}`);
  }
}
