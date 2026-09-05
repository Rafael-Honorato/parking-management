import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ParkingService } from '@app/core/services/parking.service';
import {
  CardGridParkingSpot,
  DataBuilding,
  DataFloor,
  DataParking,
  DataSites,
  kpiDataParkingSpot,
} from '@app/core/model/sites.models';
import { ParkingCardComponent } from '../../components/parking/parking-card.component';
import { filter, switchMap, tap } from 'rxjs';
import { KpiComponent } from '../../components/kpi/kpi.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    ParkingCardComponent,
    KpiComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  pkService = inject(ParkingService);
  fb = inject(FormBuilder);
  sites = signal<DataSites[]>([]);
  buildings = signal<DataBuilding[]>([]);
  floors = signal<DataFloor[]>([]);
  selectedFloor = signal<DataFloor | undefined>(undefined);
  parkings = signal<DataParking[]>([]);
  destroyRef = inject(DestroyRef);
  isParkingLoading = signal(false);

  qual = signal('SwitchMap');

  kpi = [1, 2, 3, 4];

  form = this.fb.nonNullable.group({
    sitesId: '',
    buildingsId: '',
    floorsId: '',
  });

  ngOnInit(): void {
    this.loadSites();
    this.setupCascadingDropdwons();
  }

  loadSites(): void {
    this.pkService
      .getSitesByClientId()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (r) => this.sites.set(r.data),
        error: (err) => console.log(err),
      });
  }

  setupCascadingDropdwons(): void {
    this.form.controls.sitesId.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.form.controls.buildingsId.reset('', { emitEvent: false });
          this.form.controls.floorsId.reset('', { emitEvent: false });
          this.buildings.set([]);
          this.floors.set([]);
          this.parkings.set([]);
        }),
        filter(Boolean),
        switchMap((siteId) =>
          this.pkService.getBuildingBySiteId(Number(siteId)),
        ),
      )
      .subscribe({
        next: (res) => this.buildings.set(res.data),
      });

    this.form.controls.buildingsId.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.form.controls.floorsId.reset('', { emitEvent: false });
          this.form.controls.floorsId.reset('', { emitEvent: false });
          this.floors.set([]);
          this.parkings.set([]);
        }),
        filter(Boolean),
        switchMap((buildingId) =>
          this.pkService.GetFloorsByBuildingId(Number(buildingId)),
        ),
      )
      .subscribe({
        next: (res) => this.floors.set(res.data),
      });

    this.form.controls.floorsId.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(Boolean),
        tap((floorId) => {
          const id = Number(floorId);
          this.isParkingLoading.set(true);
          this.selectedFloor.set(
            this.floors().find((flor) => flor.floorId === id),
          );
        }),
        switchMap((floorId) => this.pkService.GetAllParkingByFloor(+floorId)),
      )
      .subscribe({
        next: (res) => {
          this.parkings.set(res.data);
          this.isParkingLoading.set(false);
        },
      });
  }

  getGridParkingSpot = computed<CardGridParkingSpot[]>(() => {
    const floor = this.selectedFloor();
    const ocupadoList = this.parkings();

    if (!floor || !floor?.totalParkingSpots) {
      return [];
    }

    const grid: CardGridParkingSpot[] = [];

    for (let i = 1; i <= floor.totalParkingSpots; i++) {
      const parkingData = ocupadoList.find((p) => p.parkSpotNo === i);

      const spot: CardGridParkingSpot = {
        spotNumber: i,
        parkigData: parkingData,
        isOcupied: !!parkingData,
      };

      grid.push(spot);
    }

    return grid;
  });

  getKpiParkingSpot = computed<kpiDataParkingSpot>(() => {
    const gridData = this.getGridParkingSpot();
    const ocupiedCount = gridData.reduce(
      (ac, a) => ac + (a.isOcupied ? 1 : 0),
      0,
    );
    const totalCount = gridData.length;

    return {
      ocupied: ocupiedCount,
      free: totalCount - ocupiedCount,
      total: totalCount,
      mantainence: 0,
      reerved: 0,
    };
  });
}

//////////// BACKKKKKP ////////////////////////////

// import { Component, computed, inject, OnInit, signal } from '@angular/core';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import {
//   AbstractControl,
//   FormBuilder,
//   FormsModule,
//   ReactiveFormsModule,
// } from '@angular/forms';
// import { MatSelectModule } from '@angular/material/select';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { KpiComponent } from '../../components/kpi/kpi.component';
// import { ParkingService } from '@app/core/services/parking.service';
// import {
//   ApiResult,
//   DataBuilding,
//   DataFloor,
//   DataParking,
//   DataSites,
//   TypeFormControlName,
// } from '@app/core/model/sites.models';
// import { ParkingSkeletonComponent } from '../../components/parking-skeleton/parking-skeleton.component';
// import { ParkingCardComponent } from '../../components/parking/parking-card.component';
// import { takeUntil } from 'rxjs';

// @Component({
//   selector: 'app-dashboard',
//   imports: [
//     MatFormFieldModule,
//     FormsModule,
//     ReactiveFormsModule,
//     MatSelectModule,
//     MatInputModule,
//     KpiComponent,
//     ParkingSkeletonComponent,
//     ParkingCardComponent,
//   ],
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.css',
// })
// export class DashboardComponentBkp implements OnInit {
//   fb = inject(FormBuilder);
//   pkService = inject(ParkingService);
//   isParkingsLoading = signal(false);
//   qual = signal('Backup');

//   sites = signal<DataSites[]>([]);
//   buldings = signal<DataBuilding[]>([]);
//   floors = signal<DataFloor[]>([]);
//   floor = signal<DataFloor | undefined>(undefined);
//   parking = signal<DataParking[]>([]);

//   kpi = [1, 2, 3, 4];
//   form = this.fb.nonNullable.group({
//     sites: '',
//     buldings: '',
//     floors: '',
//   });

//   ngOnInit(): void {
//     this.loadSies();
//   }

//   private loadSies(): void {
//     this.pkService.getSitesByClientId().subscribe({
//       next: (res: ApiResult<DataSites>) => {
//         this.sites.set(res.data);
//       },
//       error: (err) => console.log(err),
//     });

//     this.setControlValuesChange('sites', ['buldings', 'flors']);
//     this.setControlValuesChange('buldings', ['flors']);
//     this.setControlValuesChange('floors', []);
//   }

//   private setControlValuesChange(
//     formControlNamePai: TypeFormControlName,
//     resetFields: Array<'buldings' | 'flors'>,
//   ) {
//     this.form.get(formControlNamePai)?.valueChanges.subscribe({
//       next: (value: string) => {
//         console.log(formControlNamePai + ' - ' + resetFields);

//         this.resetFields(resetFields, formControlNamePai);
//         this.selectMetod(formControlNamePai, parseInt(value));
//       },
//       error: (err) => console.log(err),
//     });
//   }

//   private getBuildingsById(id: number) {
//     this.pkService.getBuildingBySiteId(id).subscribe({
//       next: (r) => {
//         this.buldings.set(r.data);
//         console.log('Buildings');
//       },
//       error: (err) => console.log(err),
//     });
//   }

//   private getFloorsByBuildingId(id: number) {
//     this.pkService.GetFloorsByBuildingId(id).subscribe({
//       next: (r) => {
//         this.floors.set(r.data);
//       },
//       error: (err) => console.log(err),
//     });
//   }

//   private getAllParkingByFloor(id: number) {
//     this.isParkingsLoading.set(true);

//     this.pkService.GetAllParkingByFloor(id).subscribe({
//       next: (r) => {
//         this.parking.set(r.data);
//         this.floor.set(this.floors().find((m) => m.floorId === id));
//         console.log(this.floor());
//       },
//       error: (err) => console.log(err),
//       complete: () => this.isParkingsLoading.set(false),
//     });
//   }

//   private selectMetod(formControlNamePai: TypeFormControlName, id: number) {
//     if (formControlNamePai === 'sites') {
//       this.getBuildingsById(id);
//     } else if (formControlNamePai === 'buldings') {
//       this.getFloorsByBuildingId(id);
//     } else {
//       this.getAllParkingByFloor(id);
//     }
//   }

//   private resetFields(
//     resetFields: Array<'buldings' | 'flors'>,
//     formControlNamePai: TypeFormControlName,
//   ) {
//     resetFields.forEach((field) => {
//       this.form.get(field)?.reset('', { emitEvent: false });
//     });
//     if (formControlNamePai != 'buldings') {
//       this.buldings.set([]);
//     }
//     this.floors.set([]);
//   }
// }

// FIMMMMM BACKUUUUPPPPPPP ////////////////////////////////////////

////// RESOURCESSSSSSSSS ////////////////////////////////////////////

// import {
//   Component,
//   computed,
//   DestroyRef,
//   effect,
//   inject,
//   OnInit,
//   signal,
// } from '@angular/core';
// import {
//   rxResource,
//   takeUntilDestroyed,
//   toSignal,
// } from '@angular/core/rxjs-interop';
// import {
//   AbstractControl,
//   FormBuilder,
//   FormsModule,
//   ReactiveFormsModule,
// } from '@angular/forms';
// import { MatSelectModule } from '@angular/material/select';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { KpiComponent } from '../../components/kpi/kpi.component';
// import { ParkingService } from '@app/core/services/parking.service';
// import {
//   ApiResult,
//   DataBuilding,
//   DataFloor,
//   DataParking,
//   DataSites,
//   TypeFormControlName,
// } from '@app/core/model/sites.models';
// import { ParkingSkeletonComponent } from '../../components/parking-skeleton/parking-skeleton.component';
// import { ParkingCardComponent } from '../../components/parking/parking-card.component';
// import { filter, of, switchMap, takeUntil, tap } from 'rxjs';

// @Component({
//   selector: 'app-dashboard',
//   imports: [
//     MatFormFieldModule,
//     FormsModule,
//     ReactiveFormsModule,
//     MatSelectModule,
//     MatInputModule,
//     KpiComponent,
//     ParkingSkeletonComponent,
//     ParkingCardComponent,
//   ],
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.css',
// })
// export class DashboardComponent {
//   private readonly pkService = inject(ParkingService);
//   private readonly fb = inject(FormBuilder);

//   readonly kpi = [1, 2, 3, 4];
//   qual = signal('Resources');

//   // 1. Formulário (declarado ANTES de ser usado no constructor)
//   readonly form = this.fb.nonNullable.group({
//     sitesId: '',
//     buildingsId: '', // Corrigido typo "buldingsId"
//     floorsId: '',
//   });

//   // 2. Signals derivados do formulário
//   readonly selectedSiteId = toSignal(this.form.controls.sitesId.valueChanges, {
//     initialValue: '',
//   });

//   readonly selectedBuildingId = toSignal(
//     this.form.controls.buildingsId.valueChanges,
//     {
//       initialValue: '',
//     },
//   );

//   readonly selectedFloorId = toSignal(
//     this.form.controls.floorsId.valueChanges,
//     {
//       initialValue: '',
//     },
//   );

//   // 3. Efeitos de Reset (agora após a declaração do form e signals)
//   constructor() {
//     effect(() => {
//       this.selectedSiteId(); // Dependência reativa
//       this.form.controls.buildingsId.setValue('');
//       this.form.controls.floorsId.setValue('');
//     });

//     effect(() => {
//       this.selectedBuildingId(); // Dependência reativa
//       this.form.controls.floorsId.setValue('');
//     });
//   }

//   // 4. Recursos (rxResource)
//   readonly sitesResource = rxResource({
//     // Corrigido typo "sitesResouce"
//     loader: () => this.pkService.getSitesByClientId(),
//   });

//   readonly buildingsResource = rxResource({
//     request: () => this.selectedSiteId(),
//     loader: ({ request: siteId }) => {
//       if (!siteId) {
//         return of<ApiResult<DataBuilding>>({
//           message: '',
//           result: true,
//           data: [],
//         });
//       }
//       return this.pkService.getBuildingBySiteId(Number(siteId));
//     },
//   });

//   readonly floorsResource = rxResource({
//     request: () => this.selectedBuildingId(),
//     loader: ({ request: buildingId }) => {
//       if (!buildingId) {
//         return of<ApiResult<DataFloor>>({
//           message: '',
//           result: true,
//           data: [],
//         });
//       }
//       return this.pkService.GetFloorsByBuildingId(+buildingId);
//     },
//   });

//   readonly parkingsResource = rxResource({
//     request: () => this.selectedFloorId(),
//     loader: ({ request: floorId }) => {
//       if (!floorId) {
//         // ✅ Corrigida a tipagem explícita aqui
//         return of<ApiResult<DataParking>>({
//           message: '',
//           result: true,
//           data: [],
//         });
//       }
//       return this.pkService.GetAllParkingByFloor(+floorId);
//     },
//   });

//   // 5. Computed Signals para o Template
//   readonly sites = computed(() => this.sitesResource.value()?.data ?? []);
//   readonly buildings = computed(
//     () => this.buildingsResource.value()?.data ?? [],
//   );
//   readonly floors = computed(() => this.floorsResource.value()?.data ?? []);
//   readonly parkings = computed(() => this.parkingsResource.value()?.data ?? []);

//   readonly isParkingLoading = this.parkingsResource.isLoading;
// }

//// FIMMMMMMM RESOURCESSSS ////////////////////////////////////////////////////////
