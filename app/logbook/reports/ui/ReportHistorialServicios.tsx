"use client";

import React, { useEffect, useState } from "react";
import { getHistorialServiciosPorVehiculo } from "@/app/actions/report";
import { getVehicleById } from "@/app/actions/vehicle";
import { HistorialServicio } from "@/types/report";
import {
  Box,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface Props {
  vehicleId: number;
  startDate: string;
  endDate: string;
}

const tipoServicioTraducido = (type: string): string => {
  switch (type) {
    case "repair":
      return "Reparación";
    case "maintenance":
      return "Mantención";
    default:
      return type;
  }
};

export default function ReportHistorialServicios({ vehicleId, startDate, endDate }: Props) {
  const [data, setData] = useState<HistorialServicio[]>([]);
  const [vehicleName, setVehicleName] = useState<string>("");

  const fetchHistorial = async () => {
    try {
      const [result, vehicle] = await Promise.all([
        getHistorialServiciosPorVehiculo({ vehicleId, startDate, endDate }),
        getVehicleById(vehicleId),
      ]);

      if (Array.isArray(result)) {
        setData(result);
        setVehicleName(vehicle?.name || "Vehículo");
      } else {
        console.error("Error al obtener el historial", result?.error);
        setData([]);
      }
    } catch (error) {
      console.error("Error al obtener el historial", error);
      setData([]);
    }
  };

  useEffect(() => {
    if (vehicleId && startDate && endDate) {
      fetchHistorial();
    }
  }, [vehicleId, startDate, endDate]);

  const totalCosto = data.reduce((sum, s) => sum + (s.cost || 0), 0);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Historial de Servicios
      </Typography>
      <Typography variant="subtitle1">
        Vehículo: <strong>{vehicleName}</strong>
      </Typography>
      <Typography variant="subtitle2">
        Rango: {startDate} a {endDate}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {data.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No se encontraron servicios en el rango especificado.
        </Typography>
      ) : (
        <TableContainer >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell>Kilometraje</TableCell>
                <TableCell align="right">Costo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{new Date(s.date).toLocaleDateString("es-CL")}</TableCell>
                  <TableCell>{tipoServicioTraducido(s.type)}</TableCell>
                  <TableCell>{s.provider || "Interno"}</TableCell>
                  <TableCell>{s.mileage.toLocaleString()}</TableCell>
                  <TableCell align="right">{s.cost.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4}><strong>Total</strong></TableCell>
                <TableCell align="right"><strong>{totalCosto.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</strong></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
