"use server";

import { CreateServicePayload, Service } from "@/types/service";

// URL base del backend (puedes usar variable de entorno)
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

// Crear un nuevo servicio con ítems
export async function createService(data: CreateServicePayload): Promise<Service | { error: string }> {
  try {
    const res = await fetch(`${BASE_URL}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Error al crear el servicio" };
    }

    return await res.json();
  } catch (err) {
    return { error: "Error de red o del servidor" };
  }
}

// Obtener todos los servicios
export async function getAllServices(): Promise<Service[] | { error: string }> {
  try {
    const res = await fetch(`${BASE_URL}/services`, {
      next: { revalidate: 60 }, // ISR opcional
    });

    if (!res.ok) return { error: "Error al obtener servicios" };

    return await res.json();
  } catch (err) {
    return { error: "Error de red o del servidor" };
  }
}

// Obtener un servicio por ID
export async function getServiceById(id: number): Promise<Service | { error: string }> {
  try {
    const res = await fetch(`${BASE_URL}/services/${id}`);
    if (!res.ok) return { error: "Servicio no encontrado" };
    return await res.json();
  } catch (err) {
    return { error: "Error de red o del servidor" };
  }
}

// Eliminar un servicio (soft delete)
export async function deleteService(id: number): Promise<{ message?: string; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Error al eliminar el servicio" };
    }

    return await res.json();
  } catch (err) {
    return { error: "Error de red o del servidor" };
  }
}
