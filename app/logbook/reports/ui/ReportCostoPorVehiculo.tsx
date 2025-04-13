"use client";

import React, { useEffect, useState } from "react";
import { getCostoPorVehiculo } from "@/app/actions/report";
import { CostoPorVehiculo } from "@/types/report";
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
  startDate: string;
  endDate: string;
}

export default function ReportCostoPorVehiculo({ startDate, endDate }: Props) {
  const [data, setData] = useState<CostoPorVehiculo[]>([]);

  const fetchData = async () => {
    const res = await getCostoPorVehiculo({ startDate, endDate });
    if (Array.isArray(res)) setData(res);
    else console.error(res.error);
  };

  useEffect(() => {
    if (startDate && endDate) fetchData();
  }, [startDate, endDate]);

  const totalGasto = data.reduce((acc, v) => acc + (Number(v.totalSpent) || 0), 0);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Costos Acumulados por Vehículo
      </Typography>
      <Typography variant="subtitle2">
        Rango de fechas: {startDate} a {endDate}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Vehículo</TableCell>
              <TableCell>Patente</TableCell>
              <TableCell align="center">Servicios</TableCell>
              <TableCell align="right">Total Gastado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((v) => (
              <TableRow key={v.vehicleId}>
                <TableCell>{v.vehicleName}</TableCell>
                <TableCell>{v.plate}</TableCell>
                <TableCell align="center">{v.totalServices}</TableCell>
                <TableCell align="right">
                  {Number(v.totalSpent).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3}><strong>Total</strong></TableCell>
              <TableCell align="right">
                <strong>{totalGasto.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
