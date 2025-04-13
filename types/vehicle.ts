// types/vehicle.ts

export type Vehicle = {
    id: number;
    plate: string;
    engineNumber: string;
    brand: string;
    model: string;
    year: number;
    name: string;
    notes?: string;
    createdAt?: string;
    deletedAt?: string | null;
  };
  
  export type CreateVehicleDto = {
    plate: string;
    engineNumber: string;
    brand: string;
    model: string;
    year: number;
    name: string;
    notes?: string;
  };
  
  export type UpdateVehicleDto = Partial<CreateVehicleDto>;
  