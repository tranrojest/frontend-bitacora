"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { getAllFuelLoads, deleteFuelLoad } from "@/app/actions/fuelLoad";
import { FuelLoad } from "@/types/fuelLoad";
import AppDataGrid from "@/components/appDataGrid/AppDataGrid";
import moment from "moment-timezone";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Delete } from "@mui/icons-material";
import { DeleteDialog } from "@/components/deleteDialog/DeleteDialog";
import { useAlertContext } from "@/context/AlertContext";

export default function Page() {
  const [fuelLoads, setFuelLoads] = useState<FuelLoad[]>([]);
  const [selectedRow, setSelectedRow] = useState<FuelLoad | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { showAlert } = useAlertContext();

  const fetchFuelLoads = async () => {
    const data = await getAllFuelLoads();
    if (!("error" in data)) {
      const sorted = data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setFuelLoads(sorted);
    }
  };

  useEffect(() => {
    fetchFuelLoads();
  }, []);

  const handleDelete = async () => {
    if (!selectedRow) return;
    try {
      await deleteFuelLoad(selectedRow.id);
      showAlert("Carga eliminada correctamente", "success");
      fetchFuelLoads();
    } catch (error) {
      showAlert("Error al eliminar la carga", "error");
    } finally {
      setOpenDeleteDialog(false);
      setSelectedRow(null);
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
          icon={<Delete sx={{ fontSize: "1rem" }} />}
          label="Eliminar"
          onClick={() => {
            setSelectedRow(params.row);
            setOpenDeleteDialog(true);
          }}
        />,
      ],
    },
    { field: "id", headerName: "ID", width: 80 },
    { field: "vehicle", headerName: "Vehículo", flex: 1 },
    { field: "provider", headerName: "Proveedor", flex: 1 },
    { field: "invoiceNumber", headerName: "Factura", flex: 1 },
    { field: "liters", headerName: "Litros", flex: 1 },
    {
      field: "totalPrice",
      headerName: "Total",
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
    <Box sx={{ p: 2 }}>
      <AppDataGrid
        rows={fuelLoads.map((f) => ({
          ...f,
          vehicle: f.vehicle?.name || "-",
          provider: f.provider?.name || "-",
        }))}
        columns={columns}
        title="Cargas de Combustible"
        height="80vh"
        refresh={fetchFuelLoads}
      />

      <DeleteDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setSelectedRow(null);
        }}
        message={`¿Estás seguro de que deseas eliminar la carga #${selectedRow?.id}?`}
        submit={handleDelete}
      />
    </Box>
  );
}
