import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, shareReplay, tap } from 'rxjs';
import {
  ApiResult,
  DataBuilding,
  DataFloor,
  DataParking,
  DataSites,
} from '../model/sites.models';
import { AuthService } from '@app/features/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ParkingService {
  private http = inject(HttpClient);

  private sitesCache$!: Observable<ApiResult<DataSites>>;

  getSitesByClientId(): Observable<ApiResult<DataSites>> {
    if (!this.sitesCache$) {
      this.sitesCache$ = this.http
        .get<
          ApiResult<DataSites>
        >(`${environment.BASE_URL}GetSitesByClientId?id=20`)
        .pipe(shareReplay(1));
    }
    return this.sitesCache$;
  }

  updateSitesCache(): void {
    this.sitesCache$ = this.http
      .get<
        ApiResult<DataSites>
      >(`${environment.BASE_URL}GetSitesByClientId?id=2`)
      .pipe(shareReplay(1));
  }

  getBuildingBySiteId(siteId: number): Observable<ApiResult<DataBuilding>> {
    return this.http.get<ApiResult<DataBuilding>>(
      `${environment.BASE_URL}GetBuildingBySiteId?id=${siteId}`,
    );
  }

  GetFloorsByBuildingId(buildingId: number): Observable<ApiResult<DataFloor>> {
    return this.http.get<ApiResult<DataFloor>>(
      `${environment.BASE_URL}GetFloorsByBuildingId?id=${buildingId}`,
    );
  }

  GetAllParkingByFloor(floorId: number): Observable<ApiResult<DataParking>> {
    return this.http.get<ApiResult<DataParking>>(
      `${environment.BASE_URL}GetAllParkingByFloor?id=${floorId}`,
    );
  }
}
