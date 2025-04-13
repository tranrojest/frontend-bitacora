"use client";

import React from "react";
import {
  Drawer,
  Box,
  Typography,
  MenuItem,
  List,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const AppName = "Bitácora";
const AppVersion = "v1.0.0";

interface SideBarProps {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
}

export default function SideBar({ open, toggleDrawer }: SideBarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    toggleDrawer(false); // cierra el drawer
    await signOut({
      callbackUrl: "/", // redirige al login después de cerrar sesión
    });
  };

  return (
    <Drawer anchor="left" open={open} onClose={() => toggleDrawer(false)}>
      <Box sx={{ width: 250, padding: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {AppName}
        </Typography>

        <Typography
          variant="body2"
          align="center"
          color="textSecondary"
          paragraph
        >
          {AppVersion}
        </Typography>

        <List>
          <MenuItem
            onClick={() => {
              router.push("/logbook/");
              toggleDrawer(false);
            }}
          >
            Nuevo Servicio
          </MenuItem>

          <MenuItem
            onClick={() => {
              router.push("/logbook/fuelLoad");
              toggleDrawer(false);
            }}
          >
           Carga de combustible
          </MenuItem>

          <MenuItem
            onClick={() => {
              router.push("/logbook/vehicles");
              toggleDrawer(false);
            }}
          >
           Vehículos
          </MenuItem>

          <MenuItem
            onClick={() => {
              router.push("/logbook/providers");
              toggleDrawer(false);
            }}
          >
            Proveedores
          </MenuItem>

          <MenuItem
            onClick={() => {
              router.push("/logbook/services");
              toggleDrawer(false);
            }}
          >
            Servicios
          </MenuItem>

          <MenuItem
            onClick={() => {
              router.push("/logbook/fuel");
              toggleDrawer(false);
            }}
          >
            Combustibles
          </MenuItem>
          <MenuItem
            onClick={() => {
              router.push("/logbook/reports");
              toggleDrawer(false);
            }}
          >
            Reportes
          </MenuItem>


          <MenuItem
            onClick={() => {
              router.push("/logbook/users");
              toggleDrawer(false);
            }}
          >
            Usuarios
          </MenuItem>

          <Divider sx={{ my: 1 }} />

          <MenuItem onClick={handleLogout}>
            Cerrar sesión
          </MenuItem>
        </List>
      </Box>
    </Drawer>
  );
}
