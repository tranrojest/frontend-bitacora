"use client";

import React, { useState } from "react";
import { Vehicle, UpdateVehicleDto } from "@/types/vehicle";
import { updateVehicle } from "@/app/actions/vehicle";
import { useAlertContext } from "@/context/AlertContext";
import { BaseUpdateForm } from "@/components/appForm/UpdateBaseForm";

interface Props {
  initialData: Vehicle;
  afterSubmit?: () => void;
}

export default function UpdateVehicleForm({ initialData, afterSubmit }: Props) {
  const { showAlert } = useAlertContext();
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: UpdateVehicleDto) => {
    setIsSubmitting(true);
    setErrors([]);

    // ⚠️ Asegurarse de enviar solo los campos válidos
    const {
      plate,
      engineNumber,
      brand,
      model,
      year,
      name,
      notes,
    } = values;

    const result = await updateVehicle(initialData.id, {
      plate,
      engineNumber,
      brand,
      model,
      year,
      name,
      notes,
    });

    if ("error" in result) {
      setErrors([result.error]);
      showAlert(result.error, "error");
    } else {
      showAlert("Vehículo actualizado correctamente", "success");
      afterSubmit?.();
    }

    setIsSubmitting(false);
  };

  const fields = [
    { name: "name", label: "Nombre interno", type: "text" as const, required: true },
    { name: "plate", label: "Patente", type: "text" as const, required: true },
    { name: "engineNumber", label: "N° Motor", type: "text" as const, required: false},
    { name: "brand", label: "Marca", type: "text" as const, required: false },
    { name: "model", label: "Modelo", type: "text" as const, required: false },
    { name: "year", label: "Año", type: "number" as const, required: false },
    { name: "notes", label: "Observaciones", type: "textarea" as const, rows: 3,  multiline: true },
  ];

  return (
    <BaseUpdateForm
      title="Vehículo"
      fields={fields}
      initialState={initialData}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      errors={errors}
    />
  );
}
