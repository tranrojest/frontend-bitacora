"use client";

import React, { useEffect, useState } from "react";
import { getAllServices, deleteService } from "@/app/actions/service";
import { Service } from "@/types/service";
import AppDataGrid from "@/components/appDataGrid/AppDataGrid";
import moment from "moment-timezone";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Delete, More } from "@mui/icons-material";
import { useAlertContext } from "@/context/AlertContext";
import { DeleteDialog } from "@/components/deleteDialog/DeleteDialog";
import PrintDialog from "@/components/PrintDialog/PrintDialog";
import ServiceDetail from "./ui/ServiceDetail"; // Adjust the path as needed

export default function Page() {
  const [services, setServices] = useState<Service[]>([]);
  const [rowData, setRowData] = useState<Service | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const { showAlert } = useAlertContext();

  const fetchServices = async () => {
    const result = await getAllServices();
    console.log(result);
    if (!("error" in result)) {
      setServices(result);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async () => {
    if (!rowData) return;
    try {
      await deleteService(rowData.id);
      showAlert("Servicio eliminado correctamente", "success");
      fetchServices();
    } catch (error) {
      showAlert("Error al eliminar el servicio", "error");
    } finally {
      setOpenDeleteDialog(false);
      setRowData(null);
    }
  };

  const columns = [
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 80,
      getActions: (params: any) => [
        <GridActionsCellItem
          icon={<More sx={{ fontSize: "1rem" }} />}
          label="Detalle"
          onClick={() => {
            setRowData(params.row);
            setOpenPrintDialog(true);
          }}
        />,
        <GridActionsCellItem
          icon={<Delete sx={{ fontSize: "1rem" }} />}
          label="Eliminar"
          onClick={() => {
            setRowData(params.row);
            setOpenDeleteDialog(true);
          }}
        />,
      ],
    },
    { field: "id", headerName: "Id", width: 80 },
    { field: "vehicle", headerName: "Vehículo", flex: 1 },
    { field: "provider", headerName: "Proveedor", flex: 1 },
    { field: "mileage", headerName: "Kilometraje", flex: 1 },
    { field: "type", headerName: "Tipo", flex: 1 },
    { field: "performedBy", headerName: "Realizado por", flex: 1 },
    {
      field: "cost",
      headerName: "Costo",
      flex: 1,
      valueFormatter: (params: any) =>
        params.toLocaleString("es-CL", { style: "currency", currency: "CLP" }),
    },
    {
      field: "date",
      headerName: "Fecha",
      flex: 1,
      valueFormatter: (params: any) =>
        moment(params).tz("America/Santiago").format("DD-MM-YYYY HH:mm"),
    },
  ];

  return (
    <>
      <Box p={2}>
        <AppDataGrid
          rows={services.map((s) => ({
            ...s,
            vehicle: s.vehicle?.name || "-",
            provider: s.provider ? s.provider.name : "-",
          }))}
          columns={columns}
          title="Servicios"
          height="80vh"
          refresh={fetchServices}
        />
      </Box>
      <DeleteDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setRowData(null);
        }}
        message={`¿Estás seguro de que deseas eliminar el servicio #${rowData?.id}?`}
        submit={handleDelete}
      />

      <PrintDialog
        open={openPrintDialog}
        setOpen={setOpenPrintDialog}
        title={`Detalles del servicio #${rowData?.id}`}
        children={
          rowData?.id !== undefined ? (
            <ServiceDetail serviceId={rowData.id} />
          ) : null
        }
      />
    </>
  );
}
