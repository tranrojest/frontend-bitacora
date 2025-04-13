//app/actions/vehicle.ts
"use server";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

import { CreateVehicleDto, UpdateVehicleDto, Vehicle } from "@/types/vehicle";

// Obtener todos los vehículos (sin eliminados)
export async function getAllVehicles(): Promise<Vehicle[]> {
  const res = await fetch(`${backendUrl}/vehicles`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!res.ok) throw new Error("Error al obtener los vehículos");
  return await res.json();
}

// Obtener vehículo por ID
export async function getVehicleById(id: number): Promise<Vehicle> {
  const res = await fetch(`${backendUrl}/vehicles/${id}`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!res.ok) throw new Error("Vehículo no encontrado");
  return await res.json();
}

// Crear vehículo
export async function createVehicle(
  dto: CreateVehicleDto
): Promise<Vehicle | { error: string }> {
  const res = await fetch(`${backendUrl}/vehicles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const error = await res.json();
    return { error: error.message || "Error al crear vehículo" };
  }

  return await res.json();
}

// Actualizar vehículo
export async function updateVehicle(
  id: number,
  dto: UpdateVehicleDto
): Promise<Vehicle | { error: string }> {
  const res = await fetch(`${backendUrl}/vehicles/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const error = await res.json();
    return { error: error.message || "Error al actualizar vehículo" };
  }

  return await res.json();
}

// Soft delete de vehículo
export async function softDeleteVehicle(id: number): Promise<boolean> {
  const res = await fetch(`${backendUrl}/vehicles/${id}`, {
    method: "DELETE",
    cache: "no-store",
    next: { revalidate: 0 },
  });

  return res.ok;
}
