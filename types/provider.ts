// Lista de tipos válidos para un proveedor
export const providerTypeOptions = [
    { id: "fuel", name: "Combustible" },
    { id: "maintenance", name: "Mantenimiento" },
    { id: "parts", name: "Repuestos" },
    { id: "repair", name: "Reparación" },
    { id: "supplies", name: "Insumos" },
    { id: "misc", name: "Varios" },
    { id: "other", name: "Otro" },
  ] as const;
  
  export type ProviderType = typeof providerTypeOptions[number]["id"];
  
  export type Provider = {
    id: number;
    name: string;
    identifier: string;
    type: ProviderType;
    phone: string;
    email: string;
    address: string;
    notes?: string;
    createdAt?: string;
    deletedAt?: string | null;
  };
  
  export type CreateProviderDto = {
    name: string;
    identifier: string;
    type: ProviderType;
    phone: string;
    email: string;
    address: string;
    notes?: string;
  };
  
  export type UpdateProviderDto = Partial<CreateProviderDto>;
  