export interface ApiResult<T> {
  message: string;
  result: boolean;
  data: T[];
}

export interface DataSites {
  siteId: number;
  clientId: number;
  siteName: string;
  siteCity: string;
  siteAddress: string;
  sitePinCode: string;
  totalBuildings: number;
  createdDate: string;
}

export interface DataBuilding {
  buildingId: number;
  siteId: number;
  buildingName: string;
  buildingManagerName: string;
  contactNo: string;
  siteName: string;
}

export interface DataFloor {
  floorId: number;
  buildingId: number;
  floorNo: string;
  isOperational: boolean;
  totalParkingSpots: number;
}

export interface DataParking {
  parkId: number;
  custName: any;
  custMobileNo: string;
  vehicleNo: string;
  parkDate: string;
  parkSpotNo: number;
  inTime: string;
  outTime: string;
  amount: number;
  extraCharge: number;
  floorNo: string;
  buildingName: string;
  siteName: string;
  parkingNo: string;
  clientName: any;
}

export type TypeFormControlName = 'sites' | 'buldings' | 'floors';

export interface CardGridParkingSpot {
  spotNumber: number;
  parkigData?: DataParking;
  isOcupied: boolean;
}

export interface kpiDataParkingSpot {
  ocupied: number;
  free: number;
  total: number;
  mantainence: number;
  reerved: number;
}
