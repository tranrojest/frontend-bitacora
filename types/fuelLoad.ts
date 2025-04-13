// types/fuelLoad.ts

export interface FuelLoad {
    id: number;
    date: string; // formato ISO string
    invoiceNumber: string;
    liters: number;
    totalPrice: number;
    vehicle: {
      id: number;
      name: string;
      plate: string;
      brand: string;
      model: string;
    };
    provider: {
      id: number;
      name: string;
      type: string;
    };
    user: {
      id: number;
      name: string;
      email: string;
    };
  }
  
  export interface CreateFuelLoadPayload {
    vehicleId: number;
    providerId: number;
    invoiceNumber: string;
    liters: number;
    totalPrice: number;
    userId: number;
  }
  
  export interface UpdateFuelLoadPayload {
    invoiceNumber?: string;
    liters?: number;
    totalPrice?: number;
    providerId?: number;
    vehicleId?: number;
  }
  