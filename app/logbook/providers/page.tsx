"use client";

import React, { useState, useEffect } from "react";
import { Box, Dialog } from "@mui/material";
import moment from "moment-timezone";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";

import { Provider } from "@/types/provider";
import { getAllProviders, softDeleteProvider } from "@/app/actions/provider";
import AppDataGrid from "@/components/appDataGrid";
import CreateProviderForm from "./ui/CreateProviderForm";
import UpdateProviderForm from "./ui/UpdateProviderForm";
import { DeleteDialog } from "@/components/deleteDialog/DeleteDialog";
import { useAlertContext } from "@/context/AlertContext";

export default function Page() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [rowData, setRowData] = useState<Provider | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { showAlert } = useAlertContext();

  const fetchProviders = async () => {
    const data = await getAllProviders();
    setProviders(data);
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const columns = [
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 80,
      getActions: (params: any) => [
        <GridActionsCellItem
          icon={<Edit  sx={{fontSize: '1rem'}}/>}
          label="Editar"
          onClick={() => {
            setRowData(params.row);
            setOpenEditDialog(true);
          }}
        />,
        <GridActionsCellItem
          icon={<Delete  sx={{fontSize: '1rem'}}/>}
          label="Eliminar"
          onClick={() => {
            setRowData(params.row);
            setOpenDeleteDialog(true);
          }}
        />,
      ],
    },
    { field: "id", headerName: "Id", flex: 0.5 },
    { field: "name", headerName: "Nombre", flex: 1 },
    { field: "identifier", headerName: "Identificador", flex: 1 },
    { field: "type", headerName: "Tipo", flex: 1 },
    { field: "phone", headerName: "Teléfono", flex: 1 },
    { field: "email", headerName: "Correo", flex: 1 },
    { field: "address", headerName: "Dirección", flex: 1 },
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
          rows={providers}
          columns={columns}
          title="Proveedores"
          height="80vh"
          FormComponent={({ afterSubmit }) => (
            <CreateProviderForm
              afterSubmit={() => {
                afterSubmit();
                fetchProviders();
              }}
            />
          )}
          refresh={fetchProviders}
        />
      </Box>

      {/* Diálogo de eliminación */}
      <DeleteDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setRowData(null);
        }}
        message={`¿Estás seguro de que deseas eliminar al proveedor "${rowData?.name}"?`}
        submit={async () => {
          if (!rowData) return;
          try {
            await softDeleteProvider(rowData.id);
            showAlert("Proveedor eliminado correctamente", "success");
            fetchProviders();
          } catch (err) {
            showAlert("Error al eliminar el proveedor", "error");
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
            <UpdateProviderForm
              initialData={rowData}
              afterSubmit={() => {
                fetchProviders();
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
