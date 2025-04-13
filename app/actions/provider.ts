"use server";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

import {
  Provider,
  CreateProviderDto,
  UpdateProviderDto,
} from "@/types/provider";

// Obtener todos los proveedores (activos)
export async function getAllProviders(): Promise<Provider[]> {
  const res = await fetch(`${backendUrl}/providers`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!res.ok) throw new Error("Error al obtener los proveedores");
  return await res.json();
}

// Obtener proveedor por ID
export async function getProviderById(id: number): Promise<Provider> {
  const res = await fetch(`${backendUrl}/providers/${id}`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!res.ok) throw new Error("Proveedor no encontrado");
  return await res.json();
}

// Crear proveedor
export async function createProvider(
  dto: CreateProviderDto
): Promise<Provider | { error: string }> {
  const res = await fetch(`${backendUrl}/providers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const error = await res.json();
    return { error: error.message || "Error al crear proveedor" };
  }

  return await res.json();
}

// Actualizar proveedor
export async function updateProvider(
  id: number,
  dto: UpdateProviderDto
): Promise<Provider | { error: string }> {
  const res = await fetch(`${backendUrl}/providers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const error = await res.json();
    return { error: error.message || "Error al actualizar proveedor" };
  }

  return await res.json();
}

// Eliminar proveedor (soft delete)
export async function softDeleteProvider(id: number): Promise<boolean> {
  const res = await fetch(`${backendUrl}/providers/${id}`, {
    method: "DELETE",
    cache: "no-store",
    next: { revalidate: 0 },
  });

  return res.ok;
}
