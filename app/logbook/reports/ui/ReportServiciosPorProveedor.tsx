"use client";

import React, { useEffect, useState } from "react";
import { getServiciosPorProveedor } from "@/app/actions/report";
import { ServicioPorProveedor } from "@/types/report";
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

const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
});

export default function ReportServiciosPorProveedor({ startDate, endDate }: Props) {
  const [data, setData] = useState<ServicioPorProveedor[]>([]);

  const fetchData = async () => {
    const res = await getServiciosPorProveedor({ startDate, endDate });
    if (Array.isArray(res)) setData(res);
    else console.error(res.error);
  };

  useEffect(() => {
    if (startDate && endDate) fetchData();
  }, [startDate, endDate]);

  const totalGasto = data.reduce((acc, p) => {
    const gasto = Number(p.totalSpent) || 0;
    return acc + gasto;
  }, 0);
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Servicios Realizados por Proveedor
      </Typography>
      <Typography variant="subtitle2">
        Rango de fechas: {startDate} a {endDate}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <TableContainer >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Proveedor</TableCell>
              <TableCell>Vehículos Atendidos</TableCell>
              <TableCell align="center">Servicios</TableCell>
              <TableCell align="right">Total Gastado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((p) => (
              <TableRow key={p.providerId || `internal-${p.vehicles}`}>
                <TableCell>{p.providerName || "Interno"}</TableCell>
                <TableCell>{p.vehicles || "-"}</TableCell>
                <TableCell align="center">{p.totalServices}</TableCell>
                <TableCell align="right">
                  {currencyFormatter.format(p.totalSpent || 0)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3}><strong>Total</strong></TableCell>
              <TableCell align="right"><strong>{totalGasto.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</strong></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
