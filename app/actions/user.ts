"use server";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

import { CreateUserDto, UpdateUserDto, User } from "@/types/user";

// Obtener todos los usuarios
export async function getAllUsers(): Promise<User[]> {
  const res = await fetch(`${backendUrl}/users`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return await res.json();
}

// Obtener usuario por ID
export async function getUserById(id: number): Promise<User> {
  const res = await fetch(`${backendUrl}/users/${id}`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error("Usuario no encontrado");
  return await res.json();
}

// Obtener usuario por email (POST → /users/by-email)
export async function getUserByEmail(email: string): Promise<User | null> {
  const res = await fetch(`${backendUrl}/users/by-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!res.ok) return null;
  return await res.json();
}

// Crear usuario
export async function createUser(dto: CreateUserDto): Promise<User | { error: string }> {
  const res = await fetch(`${backendUrl}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const error = await res.json();
    return { error: error.message || "Error al crear usuario" };
  }

  return await res.json();
}

// Actualizar usuario
export async function updateUser(id: number, dto: UpdateUserDto): Promise<User | { error: string }> {
  const res = await fetch(`${backendUrl}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const error = await res.json();
    return { error: error.message || "Error al actualizar usuario" };
  }

  return await res.json();
}

// Cambiar contraseña
export async function updatePassword(id: number, newPass: string): Promise<User | { error: string }> {
  const res = await fetch(`${backendUrl}/users/password/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newPass }),
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const error = await res.json();
    return { error: error.message || "Error al cambiar la contraseña" };
  }

  return await res.json();
}

// Eliminación lógica del usuario
export async function softDeleteUser(id: number): Promise<boolean> {
  const res = await fetch(`${backendUrl}/users/${id}`, {
    method: "DELETE",
    cache: "no-store",
    next: { revalidate: 0 },
  });

  return res.ok;
}
