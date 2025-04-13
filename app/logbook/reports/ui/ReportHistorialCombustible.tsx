"use client";
import React, { useEffect, useState } from "react";
import { getHistorialCombustiblePorVehiculo } from "@/app/actions/report";
import { getVehicleById } from "@/app/actions/vehicle";
import { HistorialCombustible } from "@/types/report";
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
import moment from "moment-timezone";

interface Props {
  vehicleId: number;
  startDate: string;
  endDate: string;
}

export default function ReportHistorialCombustible({ vehicleId, startDate, endDate }: Props) {
  const [data, setData] = useState<HistorialCombustible[]>([]);
  const [vehicleName, setVehicleName] = useState<string>("");

  const fetchData = async () => {
    const [res, vehicle] = await Promise.all([
      getHistorialCombustiblePorVehiculo({ vehicleId, startDate, endDate }),
      getVehicleById(vehicleId),
    ]);

    if (Array.isArray(res)) {
      setData(res);
      setVehicleName(vehicle?.name || "Vehículo");
    } else {
      console.error(res.error);
    }
  };

  useEffect(() => {
    if (vehicleId && startDate && endDate) fetchData();
  }, [vehicleId, startDate, endDate]);

  const totalLitros = data.reduce((sum, row) => sum + (Number(row.liters) || 0), 0);
  const totalPesos = data.reduce((sum, row) => sum + (Number(row.total) || 0), 0);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Historial de Combustible
      </Typography>
      <Typography variant="subtitle1">
        Vehículo: <strong>{vehicleName}</strong>
      </Typography>
      <Typography variant="subtitle2">
        Rango de fechas: {startDate} a {endDate}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Litros</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{moment(row.date).tz("America/Santiago").format("DD-MM-YYYY HH:mm")}</TableCell>
                <TableCell>{row.liters.toLocaleString("es-CL")}</TableCell>
                <TableCell>{row.provider || "N/A"}</TableCell>
                <TableCell align="right">{row.total.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={1}><strong>Total</strong></TableCell>
              <TableCell><strong>{totalLitros.toLocaleString("es-CL")}</strong></TableCell>
              <TableCell></TableCell>
              <TableCell align="right"><strong>{totalPesos.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</strong></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}