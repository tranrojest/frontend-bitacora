"use client";
import React, { useState, useEffect } from "react";
import { getAllUsers, softDeleteUser } from "@/app/actions/user";
import { User } from "@/types/user";
import { Box, Dialog } from "@mui/material";
import AppDataGrid from "@/components/appDataGrid";
import moment from "moment-timezone";
import CreateUserForm from "./ui/CreateUserForm";
import UpdateUserForm from "./ui/UpdateUserForm";
import { DeleteDialog } from "@/components/deleteDialog/DeleteDialog";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import { useAlertContext } from "@/context/AlertContext";

export default function page() {
  const [users, setUsers] = useState<User[]>([]);
  const [rowData, setRowData] = useState<User | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { showAlert } = useAlertContext();

  const fetchUsers = async () => {
    const users = await getAllUsers();
    setUsers(users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 80,
      getActions: (params: any) => [
        <GridActionsCellItem
          icon={<Edit sx={{ fontSize: "1rem" }} />}
          label="Editar"
          onClick={() => {
            setRowData(params.row);
            setOpenEditDialog(true);
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
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Nombre", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "createdAt",
      headerName: "Creado",
      flex: 1,
      valueFormatter: (params: any) =>
        moment(params).tz("America/Santiago").format("DD-MM-YYYY HH:mm"),
    },
  ];

  return (
    <>
      <Box sx={{ p: 2 }}>
        <AppDataGrid
          rows={users}
          columns={columns}
          title="Usuarios"
          height="80vh"
          FormComponent={({ afterSubmit }) => (
            <CreateUserForm
              afterSubmit={() => {
                afterSubmit();
                fetchUsers();
              }}
            />
          )}
          refresh={fetchUsers}
        />
      </Box>

      {/* Diálogo de eliminación */}
      <DeleteDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setRowData(null);
        }}
        message={`¿Estás seguro de que deseas eliminar al usuario "${rowData?.name}"?`}
        submit={async () => {
          if (!rowData) return;
          try {
            await softDeleteUser(rowData.id);
            showAlert("Usuario eliminado correctamente", "success");
            fetchUsers();
          } catch (error) {
            showAlert("Error al eliminar el usuario", "error");
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
            <UpdateUserForm
              initialData={rowData}
              afterSubmit={() => {
                fetchUsers();
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
