"use client";

import React, { useState, useEffect } from "react";
import { Box, Dialog } from "@mui/material";
import moment from "moment-timezone";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";

import { Vehicle } from "@/types/vehicle";
import { getAllVehicles, softDeleteVehicle } from "@/app/actions/vehicle";
import AppDataGrid from "@/components/appDataGrid";
import CreateVehicleForm from "./ui/CreateVehicleForm";
import UpdateVehicleForm from "./ui/UpdateVehicleForm";
import { DeleteDialog } from "@/components/deleteDialog/DeleteDialog";
import { useAlertContext } from "@/context/AlertContext";

export default function Page() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [rowData, setRowData] = useState<Vehicle | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { showAlert } = useAlertContext();

  const fetchVehicles = async () => {
    const data = await getAllVehicles();
    setVehicles(data);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const columns = [
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 80,
      getActions: (params: any) => [
        <GridActionsCellItem
          icon={<Edit sx={{fontSize: '1rem'}}/>}
          label="Editar"
          onClick={() => {
            setRowData(params.row);
            setOpenEditDialog(true);
          }}
        />,
        <GridActionsCellItem
          icon={<Delete sx={{fontSize: '1rem'}}/>}
          label="Eliminar"
          onClick={() => {
            setRowData(params.row);
            setOpenDeleteDialog(true);
          }}
        />,
      ],
    },
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Nombre interno", flex: 1 },
    { field: "plate", headerName: "Patente", flex: 1 },
    { field: "engineNumber", headerName: "N° Motor", flex: 1 },
    { field: "brand", headerName: "Marca", flex: 1 },
    { field: "model", headerName: "Modelo", flex: 1 },
    { field: "year", headerName: "Año", flex: .5,},
    {
      field: "createdAt",
      headerName: "Registrado",
      flex: 1,
      valueFormatter: (params: any) =>
        moment(params).tz("America/Santiago").format("YYYY-MM-DD HH:mm"),
    },
   
  ];

  return (
    <>
      <Box sx={{ p: 2 }}>
        <AppDataGrid
          rows={vehicles}
          columns={columns}
          title="Vehículos"
          height="80vh"
          FormComponent={({ afterSubmit }) => (
            <CreateVehicleForm
              afterSubmit={() => {
                afterSubmit();
                fetchVehicles();
              }}
            />
          )}
          refresh={fetchVehicles}
        />
      </Box>

      {/* Diálogo de eliminación */}
      <DeleteDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setRowData(null);
        }}
        message={`¿Estás seguro de que deseas eliminar el vehículo "${rowData?.plate}"?`}
        submit={async () => {
          if (!rowData) return;
          try {
            await softDeleteVehicle(rowData.id);
            showAlert("Vehículo eliminado correctamente", "success");
            fetchVehicles();
          } catch (err) {
            showAlert("Error al eliminar el vehículo", "error");
          } finally {
            setOpenDeleteDialog(false);
            setRowData(null);
          }
        }}
      />

      {/* Diálogo de edición */}
      <Dialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setRowData(null);
        }}
        fullWidth
        maxWidth="sm"
      >
        <Box sx={{ p: 2 }}>
          {rowData && (
            <UpdateVehicleForm
              initialData={rowData}
              afterSubmit={() => {
                fetchVehicles();
                setOpenEditDialog(false);
                setRowData(null);
              }}
            />
          )}
        </Box>
      </Dialog>
    </>
  );
}
