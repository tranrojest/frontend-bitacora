"use client";
import React, { useEffect, useState } from "react";
import { getResumenMensualCombustible } from "@/app/actions/report";
import { ResumenMensualCombustible } from "@/types/report";
import {
  Box, Typography, Divider, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";

interface Props { month: string; }

export default function ReportResumenMensualCombustible({ month }: Props) {
  const [data, setData] = useState<ResumenMensualCombustible[]>([]);

  useEffect(() => {
    if (month) {
      getResumenMensualCombustible(month).then((res) => {
        if (Array.isArray(res)) setData(res);
        else console.error(res.error);
      });
    }
  }, [month]);

  const totalLitros = data.reduce((acc, d) => acc + (Number(d.totalLiters) || 0), 0);
  const totalGasto = data.reduce((acc, d) => acc + (Number(d.totalSpent) || 0), 0);

  return (
    <Box>
      <Typography variant="h6">Resumen Mensual de Combustible</Typography>
      <Typography variant="subtitle2">Mes: {month}</Typography>
      <Divider sx={{ my: 2 }} />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Vehículo</TableCell>
              <TableCell align="right">Litros</TableCell>
              <TableCell align="right">Gasto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((d) => (
              <TableRow key={d.vehicleId}>
                <TableCell>{d.vehicleName}</TableCell>
                <TableCell align="right">{d.totalLiters.toLocaleString("es-CL")}</TableCell>
                <TableCell align="right">{d.totalSpent.toLocaleString("es-CL", { style: 'currency', currency: 'CLP' })}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell><strong>Total</strong></TableCell>
              <TableCell align="right"><strong>{totalLitros.toLocaleString("es-CL")}</strong></TableCell>
              <TableCell align="right"><strong>{totalGasto.toLocaleString("es-CL", { style: 'currency', currency: 'CLP' })}</strong></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
