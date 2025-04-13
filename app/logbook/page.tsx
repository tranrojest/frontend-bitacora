"use client";

import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Autocomplete,
  TextField,
  Box,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { createService } from "@/app/actions/service";
import { getAllVehicles } from "@/app/actions/vehicle";
import { getAllProviders } from "@/app/actions/provider";
import {
  CreateServicePayload,
  ExecutionType,
  ServiceType,
  Vehicle,
  Provider,
} from "@/types/service";
import ItemsTable from "./ui/itemsTable";
import { useAlertContext } from "@/context/AlertContext";
import { useUserContext } from "@/context/UserContext";

const serviceTypes = [
  { id: "maintenance", name: "Mantenimiento" },
  { id: "repair", name: "Reparación" },
];

const executionTypes = [
  { id: "internal", name: "Personal interno" },
  { id: "external", name: "Proveedor externo" },
];

const itemTypes = [
  { id: "part", name: "Repuesto" },
  { id: "supply", name: "Insumo" },
  { id: "accessory", name: "Accesorio" },
  { id: "other", name: "Otro" },
];

export default function Page() {
  const { showAlert } = useAlertContext();
  const { user } = useUserContext();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [km, setKm] = useState("");
  const [serviceType, setServiceType] = useState<any>(null);
  const [executionType, setExecutionType] = useState<any>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [cost, setCost] = useState("");
  const [note, setNote] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newItem, setNewItem] = useState({
    name: "",
    type: "part",
    quantity: 1,
    unitPrice: "",
    providerId: "",
  });

  useEffect(() => {
    (async () => {
      const [vehicleData, providerData] = await Promise.all([
        getAllVehicles(),
        getAllProviders(),
      ]);

      if (!("error" in vehicleData)) setVehicles(vehicleData);
      if (!("error" in providerData)) {
        const filtered = providerData.filter(
          (prov) =>
            prov.type?.toLowerCase() !== "fuel" &&
            prov.type?.toLowerCase() !== "combustible"
        );
        setProviders(filtered);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    if (!vehicle || !serviceType || !executionType) {
      showAlert("Debes completar los campos requeridos", "warning");
      return;
    }

    const payload: CreateServicePayload = {
      vehicleId: vehicle.id,
      mileage: Number(km),
      description: note,
      type: serviceType.id as ServiceType,
      performedBy: executionType.id as ExecutionType,
      providerId: executionType.id === "external" ? provider?.id : undefined,
      cost:
        executionType.id === "external"
          ? Number(cost.replace(/[^\d]/g, ""))
          : 0,
      userId: user?.id || 0,
      items: items.map((item) => ({
        ...item,
        type: item.type.toLowerCase(),
        unitPrice: Number(item.unitPrice.toString().replace(/[^\d]/g, "")),
      })),
    };

    //console.log("Payload:", payload);

    setIsSubmitting(true);
    try {
      const response = await createService(payload);
      if ("error" in response) {
        showAlert(response.error, "error");
      } else {
        showAlert("Servicio guardado correctamente", "success");
        setVehicle(null);
        setServiceType(null);
        setExecutionType(null);
        setProvider(null);
        setKm("");
        setCost("");
        setNote("");
        setItems([]);
      }
    } catch (err) {
      console.error(err);
      showAlert("Ocurrió un error inesperado", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddItem = () => {
    setItems((prev) => [...prev, newItem]);
    setItemDialogOpen(false);
    setNewItem({
      name: "",
      type: "part",
      quantity: 1,
      unitPrice: "",
      providerId: "",
    });
  };

  return (
    <Box p={2}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h6">Nuevo Servicio</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Autocomplete
                options={vehicles}
                getOptionLabel={(option) => option.name}
                value={vehicle}
                onChange={(_, value) => setVehicle(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Vehículo" fullWidth size="small" />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={serviceTypes}
                getOptionLabel={(option) => option.name}
                value={serviceType}
                onChange={(_, value) => setServiceType(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Tipo de servicio" fullWidth size="small" />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Kilometraje"
                type="number"
                value={km}
                onChange={(e) => setKm(e.target.value)}
                fullWidth
                size="small"
                autoComplete="off"
                InputProps={{
                  endAdornment: <InputAdornment position="end">km</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={executionTypes}
                getOptionLabel={(option) => option.name}
                value={executionType}
                onChange={(_, value) => setExecutionType(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Realizado por" fullWidth size="small" />
                )}
              />
            </Grid>
            {executionType?.id === "external" && (
              <>
                <Grid item xs={12}>
                  <Autocomplete
                    options={providers}
                    getOptionLabel={(option) => option.name}
                    value={provider}
                    onChange={(_, value) => setProvider(value)}
                    renderInput={(params) => (
                      <TextField {...params} label="Proveedor" fullWidth size="small" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Costo del servicio"
                    type="text"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    onBlur={() => {
                      if (cost !== "") {
                        const num = parseFloat(cost.replace(/[^\d]/g, ""));
                        setCost(
                          num.toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                          })
                        );
                      }
                    }}
                    fullWidth
                    size="small"
                    autoComplete="off"
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField
                label="Observaciones"
                multiline
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                fullWidth
                size="small"
                autoComplete="off"
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ height: "100%", border: "1px solid #ccc", padding: 2, borderRadius: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Compras</Typography>
                <IconButton color="primary" onClick={() => setItemDialogOpen(true)}>
                  <AddIcon />
                </IconButton>
              </Grid>
              <Grid item xs={12}>
                <ItemsTable
                  items={items}
                  onDelete={(index) => setItems((prev) => prev.filter((_, i) => i !== index))}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} textAlign="right">
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </Grid>
      </Grid>

      <Dialog open={itemDialogOpen} onClose={() => setItemDialogOpen(false)} fullWidth>
        <DialogTitle>Agregar ítem</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            fullWidth
            size="small"
            sx={{ mb: 1, mt: 1 }}
            value={newItem.name}
            autoComplete="off"
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <Autocomplete
            options={itemTypes}
            getOptionLabel={(opt) => opt.name}
            value={itemTypes.find((t) => t.id === newItem.type) || null}
            onChange={(_, val) =>
              setNewItem({ ...newItem, type: val?.id || "part" })
            }
            renderInput={(params) => (
              <TextField {...params} label="Tipo" size="small" sx={{ mb: 1 }} />
            )}
          />
          <TextField
            label="Cantidad"
            type="number"
            fullWidth
            size="small"
            sx={{ mb: 1 }}
            value={newItem.quantity}
            autoComplete="off"
            onChange={(e) =>
              setNewItem({ ...newItem, quantity: Number(e.target.value) })
            }
          />
          <TextField
            label="Precio unitario"
            type="text"
            fullWidth
            size="small"
            sx={{ mb: 1 }}
            value={newItem.unitPrice}
            autoComplete="off"
            onChange={(e) => setNewItem({ ...newItem, unitPrice: e.target.value })}
            onBlur={() => {
              if (newItem.unitPrice !== "") {
                const num = parseFloat(newItem.unitPrice.toString().replace(/[^\d]/g, ""));
                setNewItem({
                  ...newItem,
                  unitPrice: num.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  }),
                });
              }
            }}
          />
          <Autocomplete
            options={providers}
            getOptionLabel={(opt) => opt.name}
            value={providers.find((p) => p.id === Number(newItem.providerId)) || null}
            onChange={(_, val) =>
              setNewItem({
                ...newItem,
                providerId: val?.id ? String(val.id) : "",
              })
            }
            renderInput={(params) => (
              <TextField {...params} label="Proveedor" size="small" />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setItemDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddItem}>
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
