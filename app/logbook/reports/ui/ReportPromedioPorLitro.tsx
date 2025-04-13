"use client";

import React, { useEffect, useState } from "react";
import { getPromedioPrecioPorLitro } from "@/app/actions/report";
import { PromedioPrecioPorLitro } from "@/types/report";
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

export default function ReportPromedioPorLitro({ startDate, endDate }: Props) {
  const [data, setData] = useState<PromedioPrecioPorLitro[]>([]);

  useEffect(() => {
    if (startDate && endDate) {
      getPromedioPrecioPorLitro({ startDate, endDate }).then((res) => {
        if (Array.isArray(res)) setData(res);
        else console.error(res.error);
      });
    }
  }, [startDate, endDate]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Promedio de Precio por Litro
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
              <TableCell align="right">Litros Totales</TableCell>
              <TableCell align="right">Total Gastado</TableCell>
              <TableCell align="right">Promedio $/L</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.vehicleId}>
                <TableCell>{row.vehicleName}</TableCell>
                <TableCell align="right">{Number(row.totalLiters).toLocaleString("es-CL")}</TableCell>
                <TableCell align="right">{Number(row.totalSpent).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</TableCell>
                <TableCell align="right">{Number(row.averagePricePerLiter).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
