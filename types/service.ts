// Enum para tipos de servicio
export type ServiceType = 'maintenance' | 'repair';
export type ExecutionType = 'internal' | 'external';



// export type ItemType = 'PART' | 'SUPPLY' | 'ACCESSORY' | 'OTHER';

export type ItemType = 'part' | 'supply' | 'accessory' | 'other';


// Relacionados
export interface Provider {
  id: number;
  name: string;
}

export interface Vehicle {
  id: number;
  name: string;
  plate?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

// Ítem individual (dentro de un servicio)
export interface Item {
  id: number;
  name: string;
  type: ItemType;
  quantity: number;
  unitPrice: number;
  provider?: Provider;
}

// Servicio completo (cuando haces fetch)
export interface Service {
  id: number;
  mileage: number;
  description: string;
  type: ServiceType;
  performedBy: ExecutionType;
  cost?: number;
  date: string;
  vehicle: Vehicle;
  provider?: Provider;
  user: User;
  updatedBy?: User;
  items: Item[];
}

// Payload para crear un ítem
export interface CreateItemPayload {
  name: string;
  type: ItemType;
  quantity: number;
  unitPrice: number;
  providerId?: string;
}

// Payload para crear un servicio
export interface CreateServicePayload {
  vehicleId: number;
  mileage: number;
  description: string;
  type: ServiceType;
  performedBy: ExecutionType;
  providerId?: number;
  cost?: number;
  userId: number;
  items: CreateItemPayload[];
}
