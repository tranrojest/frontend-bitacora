"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Stack,
  Autocomplete,
  Button,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
import { getAllVehicles } from "@/app/actions/vehicle";
import { Vehicle } from "@/types/vehicle";
import ReportHistorialServicios from "@/app/logbook/reports/ui/ReportHistorialServicios";
import ReportServiciosPorProveedor from "@/app/logbook/reports/ui/ReportServiciosPorProveedor";
import ReportCostoPorVehiculo from "@/app/logbook/reports/ui/ReportCostoPorVehiculo";
import ReportResumenMensualVehiculo from "./ui/ReportResumenMensualVehiculo";
import ReportHistorialCombustible from "./ui/ReportHistorialCombustible";
import ReportResumenMensualCombustible from "./ui/ReportResumenMensualCombustible";
import ReportPromedioPorLitro from "./ui/ReportPromedioPorLitro";
import ReportResumenMensualTotal from "./ui/ReportResumenMensualTotal";

const reportOptionsByType: Record<
  string,
  {
    value: string;
    label: string;
    requires: { vehicle?: boolean; dates?: boolean; month?: boolean };
  }[]
> = {
  service: [
    {
      value: "historial",
      label: "Historial de Servicios por Vehículo",
      requires: { vehicle: true, dates: true },
    },
    {
      value: "porProveedor",
      label: "Servicios Realizados por Proveedor",
      requires: { dates: true },
    },
    {
      value: "costoPorVehiculo",
      label: "Costos Acumulados por Vehículo",
      requires: { dates: true },
    },
    {
      value: "resumenMensualPorVehiculo",
      label: "Resumen Mensual por Vehículo",
      requires: { vehicle: true, month: true },
    },
  ],
  fuel: [
    {
      value: "historial",
      label: "Historial de Carga de Combustible",
      requires: { vehicle: true, dates: true },
    },
    {
      value: "resumenMensual",
      label: "Resumen Mensual de Combustible",
      requires: { month: true },
    },
    {
      value: "promedioPorLitro",
      label: "Promedio de Precio por Litro",
      requires: { dates: true },
    },
  ],
  both: [
    {
      value: "resumenMensualTotal",
      label: "Resumen Mensual General",
      requires: { month: true },
    },
  ],
};

export default function ReportsPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [reportType, setReportType] = useState("");
  const [report, setReport] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "Reporte de Bitácora - " + new Date().toLocaleDateString(),
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      const res = await getAllVehicles();
      if (!("error" in res)) setVehicles(res);
    };
    fetchVehicles();
  }, []);

  const currentReport = reportOptionsByType[reportType]?.find(
    (r) => r.value === report
  );
  const requires = currentReport?.requires || {};

  const clearFilters = () => {
    setSelectedVehicle(null);
    setSelectedMonth("");
    setStartDate("");
    setEndDate("");
  };

  const renderReportComponent = () => {
    if (
      report === "historial" &&
      reportType === "service" &&
      selectedVehicle &&
      startDate &&
      endDate
    ) {
      return (
        <ReportHistorialServicios
          vehicleId={selectedVehicle.id}
          startDate={startDate}
          endDate={endDate}
        />
      );
    }
    if (
      report === "porProveedor" &&
      reportType === "service" &&
      startDate &&
      endDate
    ) {
      return (
        <ReportServiciosPorProveedor startDate={startDate} endDate={endDate} />
      );
    }

    if (
      report === "costoPorVehiculo" &&
      reportType === "service" &&
      startDate &&
      endDate
    ) {
      return <ReportCostoPorVehiculo startDate={startDate} endDate={endDate} />;
    }

    if (
      report === "resumenMensualPorVehiculo" &&
      reportType === "service" &&
      selectedVehicle &&
      selectedMonth
    ) {
      return (
        <ReportResumenMensualVehiculo
          vehicleId={selectedVehicle.id}
          month={selectedMonth}
        />
      );
    }

    if (
        report === "historial" &&
        reportType === "fuel" &&
        selectedVehicle &&
        startDate &&
        endDate
      ) {
        return (
          <ReportHistorialCombustible
            vehicleId={selectedVehicle.id}
            startDate={startDate}
            endDate={endDate}
          />
        );
      }

      if (report === "resumenMensual" && reportType === "fuel" && selectedMonth) {
        return <ReportResumenMensualCombustible month={selectedMonth} />;
      }


      if (report === "promedioPorLitro" && reportType === "fuel" && startDate && endDate) {
        return <ReportPromedioPorLitro startDate={startDate} endDate={endDate} />;
      }

      if (
        report === "resumenMensualTotal" &&
        reportType === "both" &&
        selectedMonth
      ) {
        return <ReportResumenMensualTotal month={selectedMonth} />;
      }

    return (
      <Typography variant="body2" color="text.secondary">
        Selecciona un tipo de reporte y parámetros para visualizar aquí el
        resultado.
      </Typography>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Centro de Reportes
      </Typography>

      <Grid container spacing={2}>
        {/* 🎛️ Filtros */}
        <Grid item xs={12} md={3}>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                label="Tipo"
                value={reportType}
                onChange={(e) => {
                  setReportType(e.target.value);
                  setReport("");
                  clearFilters();
                }}
              >
                <MenuItem value="service">Servicios</MenuItem>
                <MenuItem value="fuel">Combustible</MenuItem>
                <MenuItem value="both">Ambos</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Reporte</InputLabel>
              <Select
                label="Reporte"
                value={report}
                onChange={(e) => {
                  setReport(e.target.value);
                  clearFilters();
                }}
                disabled={!reportType}
              >
                {reportOptionsByType[reportType]?.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Fecha Inicio"
              type="date"
              size="small"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setSelectedMonth("");
              }}
              disabled={!requires.dates}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label="Fecha Término"
              type="date"
              size="small"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setSelectedMonth("");
              }}
              disabled={!requires.dates}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label="Mes"
              type="month"
              size="small"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setStartDate("");
                setEndDate("");
              }}
              disabled={!requires.month}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <Autocomplete
              options={vehicles}
              getOptionLabel={(v) => v.name + " - " + v.plate}
              value={selectedVehicle}
              onChange={(_, value) => setSelectedVehicle(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Vehículo"
                  size="small"
                />
              )}
              disabled={!requires.vehicle}
            />

            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={() => handlePrint()}
                color="primary"
                disabled={!report}
              >
                <PrintIcon />
              </IconButton>
              <Button onClick={clearFilters} size="small" color="inherit">
                Limpiar filtros
              </Button>
            </Stack>
          </Stack>
        </Grid>

        {/* 📊 Contenido del Reporte (Se imprimirá esto) */}
        <Grid item xs={12} md={9}>
          {/* <Typography variant="h6" gutterBottom>
            {currentReport?.label || "Reporte"}
          </Typography> */}

          <Box
            ref={contentRef}
            sx={{
              p: 2,

              backgroundColor: "#fff",
            }}
          >
            {renderReportComponent()}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
