// types/reports.ts

export interface HistorialServicio {
  id: number;
  date: string; // ISO string
  type: "maintenance" | "repair";
  performedBy: "internal" | "external";
  provider: string; // puede estar vacío si es interno
  mileage: number;
  cost: number;
  itemsCount: number;
}

export interface ReportFilters {
  vehicleId?: number;
  startDate?: string; // formato yyyy-mm-dd
  endDate?: string; // formato yyyy-mm-dd
  month?: string; // formato yyyy-mm
}


export interface ServicioPorProveedor {
  providerId: number;
  providerName: string;
  totalServices: number;
  vehicles: string;
  totalSpent: number;
}

export interface CostoPorVehiculo {
  vehicleId: number;
  vehicleName: string;
  plate: string;
  totalServices: number;
  totalSpent: number;
}


export interface ResumenMensualServicio {
  id: number;
  date: string;
  type: 'maintenance' | 'repair';
  mileage: number;
  cost: number;
  provider: string | null;
}



export interface HistorialCombustible {
  id: number;
  date: string;
  liters: number;
  total: number;
  provider: string | null;
}

export interface HistorialCombustibleParams {
  vehicleId: number;
  startDate: string;
  endDate: string;
}


export interface ResumenMensualCombustible {
  vehicleId: number;
  vehicleName: string;
  totalLiters: number;
  totalSpent: number;
}



export interface PromedioPrecioPorLitro {
  vehicleId: number;
  vehicleName: string;
  totalSpent: number;
  totalLiters: number;
  averagePricePerLiter: number;
}


export interface PromedioPrecioPorLitroParams {
  startDate: string;
  endDate: string;
}



export interface ResumenMensualTotal {
  category: 'Servicios' | 'Combustible';
  total: number;
}
