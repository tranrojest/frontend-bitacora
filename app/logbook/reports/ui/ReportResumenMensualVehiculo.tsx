"use client";

import React, { useEffect, useState } from "react";
import { getResumenMensualPorVehiculo } from "@/app/actions/report";
import { getVehicleById } from "@/app/actions/vehicle";
import { ResumenMensualServicio } from "@/types/report";
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
  month: string;
}

export default function ReportResumenMensualVehiculo({ vehicleId, month }: Props) {
  const [data, setData] = useState<ResumenMensualServicio[]>([]);
  const [vehicleName, setVehicleName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [res, vehicle] = await Promise.all([
        getResumenMensualPorVehiculo({ vehicleId, month }),
        getVehicleById(vehicleId),
      ]);

      if (Array.isArray(res)) {
        setData(res);
        setVehicleName(vehicle?.name || "Vehículo");
      } else {
        console.error(res.error);
        setData([]);
      }
    };

    if (vehicleId && month) fetchData();
  }, [vehicleId, month]);

  const total = data.reduce((sum, s) => sum + (s.cost || 0), 0);

  const traducirTipo = (type: string) =>
    type === "maintenance" ? "Mantención" : type === "repair" ? "Reparación" : type;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Resumen Mensual por Vehículo
      </Typography>
      <Typography variant="subtitle1">
        Vehículo: <strong>{vehicleName}</strong>
      </Typography>
      <Typography variant="subtitle2">Mes: {month}</Typography>

      <Divider sx={{ my: 2 }} />

      {data.length === 0 ? (
        <Typography color="text.secondary">No hay servicios en este mes.</Typography>
      ) : (
        <TableContainer>
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
                  <TableCell>{traducirTipo(s.type)}</TableCell>
                  <TableCell>{s.provider || "Interno"}</TableCell>
                  <TableCell>{s.mileage.toLocaleString("es-CL")}</TableCell>
                  <TableCell align="right">
                    {s.cost.toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                    })}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4}>
                  <strong>Total</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>
                    {total.toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                    })}
                  </strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
