
  // app/actions/reports.ts
'use server';

import { HistorialServicio, ServicioPorProveedor, CostoPorVehiculo, ResumenMensualServicio, HistorialCombustible, HistorialCombustibleParams, ResumenMensualCombustible, PromedioPrecioPorLitroParams, PromedioPrecioPorLitro, ResumenMensualTotal } from '@/types/report';

interface HistorialServiciosParams {
  vehicleId: number;
  startDate: string;
  endDate: string;
}

export async function getHistorialServiciosPorVehiculo({
    vehicleId,
    startDate,
    endDate,
  }: HistorialServiciosParams): Promise<HistorialServicio[] | { error: string }> {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/reports/historial-servicios?vehicleId=${vehicleId}&startDate=${startDate}&endDate=${endDate}`;
  
      const res = await fetch(url, {
        method: "GET",
        next: { revalidate: 0 },
      });
  
      if (!res.ok) throw new Error("Error al obtener el historial");
  
      return await res.json();
    } catch (error: any) {
      return { error: error.message || "Error desconocido" };
    }
  }
  


  export async function getServiciosPorProveedor({ startDate, endDate }: { startDate: string; endDate: string }): Promise<ServicioPorProveedor[] | { error: string }> {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reports/servicios-por-proveedor?startDate=${startDate}&endDate=${endDate}`);
      if (!res.ok) throw new Error("Error al obtener servicios por proveedor");
      return await res.json();
    } catch (error: any) {
      return { error: error.message };
    }
  }
  

  export async function getCostoPorVehiculo({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }): Promise<CostoPorVehiculo[] | { error: string }> {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reports/costo-vehiculo?startDate=${startDate}&endDate=${endDate}`);
      if (!res.ok) throw new Error('Error al obtener el reporte');
      return await res.json();
    } catch (error: any) {
      return { error: error.message };
    }
  }



  export async function getResumenMensualPorVehiculo({
    vehicleId,
    month,
  }: {
    vehicleId: number;
    month: string;
  }): Promise<ResumenMensualServicio[] | { error: string }> {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/reports/resumen-mensual-por-vehiculo?vehicleId=${vehicleId}&month=${month}`
      );
      if (!res.ok) throw new Error('Error al obtener resumen mensual');
      return await res.json();
    } catch (error: any) {
      return { error: error.message || 'Error desconocido' };
    }
  }
  

  export async function getHistorialCombustiblePorVehiculo({
    vehicleId,
    startDate,
    endDate,
  }: HistorialCombustibleParams): Promise<HistorialCombustible[] | { error: string }> {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reports/historial-combustible?vehicleId=${vehicleId}&startDate=${startDate}&endDate=${endDate}`);
      if (!res.ok) throw new Error('Error al obtener historial de combustible');
      return await res.json();
    } catch (error: any) {
      return { error: error.message || 'Error desconocido' };
    }
  }


  export async function getResumenMensualCombustible(month: string): Promise<ResumenMensualCombustible[] | { error: string }> {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reports/resumen-mensual-combustible?month=${month}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Error al obtener resumen mensual');
      return await res.json();
    } catch (error: any) {
      return { error: error.message || 'Error desconocido' };
    }
  }



  export async function getPromedioPrecioPorLitro(
    params: PromedioPrecioPorLitroParams
  ): Promise<PromedioPrecioPorLitro[] | { error: string }> {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reports/promedio-litro?startDate=${params.startDate}&endDate=${params.endDate}`);
      if (!res.ok) throw new Error('Error al obtener promedio de precio por litro');
      return await res.json();
    } catch (error: any) {
      return { error: error.message || 'Error desconocido' };
    }
  }


  export async function getResumenMensualTotal(month: string): Promise<ResumenMensualTotal[] | { error: string }> {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reports/resumen-mensual-total?month=${month}`, {
        method: 'GET',
        next: { revalidate: 0 },
      });
  
      if (!res.ok) throw new Error("Error al obtener el resumen mensual total");
      return await res.json();
    } catch (error: any) {
      return { error: error.message };
    }
  }
  