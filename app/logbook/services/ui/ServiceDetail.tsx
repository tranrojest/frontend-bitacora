"use client";

import React from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment-timezone";
import { getServiceById } from "@/app/actions/service";

export default function ServicePrintView({ serviceId }: { serviceId: number }) {
  const [service, setService] = React.useState<any>(null);

  const fetchService = async () => {
    const data = await getServiceById(serviceId);
    setService(data);
  };

  React.useEffect(() => {
    fetchService();
  }, [serviceId]);

  if (!service) return null;

  const serviceCost = service.cost ?? 0;

  const totalCompras = (service.items || []).reduce((acc: number, item: any) => {
    return acc + item.quantity * item.unitPrice;
  }, 0);

  const totalGeneral = serviceCost + totalCompras;

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Detalle del Servicio #{service.id}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Datos Generales</Typography>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={6}>
          <Typography><strong>Vehículo:</strong> {service.vehicle?.name}</Typography>
          <Typography><strong>Patente:</strong> {service.vehicle?.plate}</Typography>
          <Typography><strong>Marca / Modelo:</strong> {service.vehicle?.brand} / {service.vehicle?.model}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography><strong>Realizado por:</strong> {service.performedBy === 'external' ? 'Proveedor externo' : 'Personal interno'}</Typography>
          <Typography><strong>Proveedor:</strong> {service.provider?.name || '-'}</Typography>
          <Typography><strong>Tipo de servicio:</strong> {service.type}</Typography>
        </Grid>
      </Grid>

      <Box mt={2}>
        <Typography><strong>Descripción:</strong></Typography>
        <Typography color="text.secondary">{service.description}</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Resumen</Typography>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={6}>
          <Typography><strong>Kilometraje:</strong> {service.mileage.toLocaleString()} km</Typography>
          <Typography><strong>Fecha:</strong> {moment(service.date).tz("America/Santiago").format("DD-MM-YYYY HH:mm")}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography><strong>Costo del servicio:</strong> {serviceCost.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>Compras</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio Unitario</TableCell>
              <TableCell>Proveedor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(service.items || []).map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unitPrice.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</TableCell>
                <TableCell>{item.provider?.name || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body1"><strong>Total compras:</strong> {totalCompras.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</Typography>
      <Typography variant="h6"><strong>Total general:</strong> {totalGeneral.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</Typography>
    </Box>
  );
}
