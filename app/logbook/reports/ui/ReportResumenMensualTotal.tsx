"use client";

import React, { useEffect, useState } from "react";
import { getResumenMensualTotal } from "@/app/actions/report";
import { ResumenMensualTotal } from "@/types/report";
import {
  Box,
  Typography,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from "@mui/material";

interface Props {
  month: string;
}

export default function ReportResumenMensualTotal({ month }: Props) {
  const [data, setData] = useState<ResumenMensualTotal[]>([]);

  useEffect(() => {
    if (month) {
      getResumenMensualTotal(month).then((res) => {
        if (Array.isArray(res)) setData(res);
        else console.error(res.error);
      });
    }
  }, [month]);

  const total = data.reduce((acc, row) => acc + (Number(row.total) || 0), 0);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Resumen Mensual General
      </Typography>
      <Typography variant="subtitle2">Mes: {month}</Typography>
      <Divider sx={{ my: 2 }} />

      <TableContainer >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Categoría</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.category}</TableCell>
                <TableCell align="right">{Number(row.total).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell><strong>Total Global</strong></TableCell>
              <TableCell align="right">
                <strong>{total.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
