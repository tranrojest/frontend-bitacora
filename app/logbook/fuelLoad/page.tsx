"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Autocomplete,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { getAllVehicles } from "@/app/actions/vehicle";
import { getAllProviders } from "@/app/actions/provider";
import { createFuelLoad } from "@/app/actions/fuelLoad";
import { useUserContext } from "@/context/UserContext";
import { useAlertContext } from "@/context/AlertContext";

export default function Page() {
  const { user } = useUserContext();
  const { showAlert } = useAlertContext();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);

  const [vehicle, setVehicle] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [invoice, setInvoice] = useState("");
  const [liters, setLiters] = useState("");
  const [total, setTotal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const [v, p] = await Promise.all([getAllVehicles(), getAllProviders()]);
      if (!("error" in v)) setVehicles(v);
      if (!("error" in p)) {
        setProviders(
          p.filter((prov: any) => prov.type?.toLowerCase() === "fuel")
        );
      }
    })();
  }, []);

  const handleSubmit = async () => {
    if (!vehicle || !provider || !invoice || !liters || !total) {
      showAlert("Todos los campos son obligatorios", "warning");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      vehicleId: vehicle.id,
      providerId: provider.id,
      invoiceNumber: invoice,
      liters: parseFloat(liters),
      totalPrice: Number(total.replace(/[^.\d]/g, "")),
      userId: user?.id || 0,
    };

    try {
      const res = await createFuelLoad(payload);
      if (!("error" in res)) {
        showAlert("Carga de combustible registrada correctamente", "success");
        setVehicle(null);
        setProvider(null);
        setInvoice("");
        setLiters("");
        setTotal("");
      } else {
        showAlert(res.error, "error");
      }
    } catch (e) {
      console.error(e);
      showAlert("Error inesperado al registrar la carga", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2} direction={"column"}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Carga de Combustible
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            options={vehicles}
            getOptionLabel={(opt) => opt.name}
            value={vehicle}
            onChange={(_, val) => setVehicle(val)}
            renderInput={(params) => (
              <TextField {...params} label="Vehículo" size="small" fullWidth />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            options={providers}
            getOptionLabel={(opt) => opt.name}
            value={provider}
            onChange={(_, val) => setProvider(val)}
            renderInput={(params) => (
              <TextField {...params} label="Proveedor" size="small" fullWidth />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="N° Factura"
            value={invoice}
            onChange={(e) => setInvoice(e.target.value)}
            fullWidth
            size="small"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Litros"
            type="number"
            value={liters}
            onChange={(e) => setLiters(e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">L</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Total"
            type="text"
            value={total}
            onChange={(e) => {
              // Guardamos solo dígitos para total
              const cleaned = e.target.value.replace(/\D/g, "");
              setTotal(cleaned);
            }}
            onBlur={() => {
              if (total !== "") {
                // Convertimos el string limpio a número
                const amount = Number(total);
                setTotal(
                  amount.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })
                );
              }
            }}
            fullWidth
            size="small"
          />
        </Grid>

        <Grid item xs={12} textAlign={"right"}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
