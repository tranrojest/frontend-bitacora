// app/actions/fuelLoad.ts

"use server";

import { CreateFuelLoadPayload, FuelLoad, UpdateFuelLoadPayload } from "@/types/fuelLoad";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getAllFuelLoads(): Promise<FuelLoad[] | { error: string }> {
  try {
    const res = await fetch(`${BASE_URL}/fuel-loads`);
    if (!res.ok) throw new Error("Error al obtener las cargas de combustible");
    return await res.json();
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getFuelLoadById(id: number): Promise<FuelLoad | { error: string }> {
  try {
    const res = await fetch(`${BASE_URL}/fuel-loads/${id}`);
    if (!res.ok) throw new Error("Carga de combustible no encontrada");
    return await res.json();
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createFuelLoad(data: CreateFuelLoadPayload): Promise<FuelLoad | { error: string }> {
  try {
    const res = await fetch(`${BASE_URL}/fuel-loads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear la carga de combustible");
    return await res.json();
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateFuelLoad(id: number, data: UpdateFuelLoadPayload): Promise<FuelLoad | { error: string }> {
  try {
    const res = await fetch(`${BASE_URL}/fuel-loads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar la carga de combustible");
    return await res.json();
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteFuelLoad(id: number): Promise<{ success: boolean } | { error: string }> {
  try {
    const res = await fetch(`${BASE_URL}/fuel-loads/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar la carga de combustible");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
