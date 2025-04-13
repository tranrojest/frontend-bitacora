"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import moment from "moment";
import { useAlertContext } from "@/context/AlertContext";
import { updatePassword } from "@/app/actions/user"; // ✅ actual action importada
import { User } from "@/types/user";
import { signOut } from "next-auth/react";

type Props = {
  user: User;
};

const UserInfoForm = ({ user }: Props) => {
  const { showAlert } = useAlertContext();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword) {
      showAlert("Debes ingresar tu contraseña actual", "warning");
      return;
    }

    if (oldPassword !== user.pass) {
      showAlert("La contraseña actual ingresada no es correcta", "error");
      return;
    }

    setLoading(true);

    const result = await updatePassword(user.id, newPassword);

    if ("error" in result) {
      showAlert(result.error, "error");
    } else {
      showAlert("Contraseña actualizada correctamente", "success");
      setNewPassword("");
      setOldPassword("");

      // Cierra sesión después de 1 segundo
      setTimeout(() => {
        signOut({ callbackUrl: "/" });
      }, 1000);
    }

    setLoading(false);
  };

  return (
    <Box p={1}>
      <Typography variant="h6" gutterBottom>
        Información de Usuario
      </Typography>

      {/* Info del usuario */}
      <Grid container spacing={1} direction="column">
        <Grid item xs={12}>
          <TextField
            label="Nombre"
            value={user.name}
            InputProps={{ readOnly: true }}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Correo"
            value={user.email}
            InputProps={{ readOnly: true }}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Fecha de creación"
            value={moment(user.createdAt).format("DD/MM/YYYY HH:mm")}
            InputProps={{ readOnly: true }}
            fullWidth
            size="small"
          />
        </Grid>
      </Grid>

      {/* Cambio de contraseña */}
      <Box component="form" onSubmit={handleSubmit} mt={4}>
        <Typography variant="subtitle1" gutterBottom>
          Actualizar contraseña
        </Typography>

        <Grid container direction="column" spacing={1}>
          <Grid item>
            <TextField
              label="Contraseña actual"
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              fullWidth
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      edge="end"
                    >
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item>
            <TextField
              label="Nueva contraseña"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item textAlign="right">
            <Button
              type="submit"
              variant="contained"
              disabled={!newPassword || !oldPassword || loading}
            >
              {loading ? "Cambiando..." : "Actualizar contraseña"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default UserInfoForm;
