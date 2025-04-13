"use client";

import React, { useState } from "react";
import { CreateVehicleDto } from "@/types/vehicle";
import { BaseForm } from "@/components/appForm/CreateBaseForm";
import { createVehicle } from "@/app/actions/vehicle";
import { useAlertContext } from "@/context/AlertContext";

interface Props {
  afterSubmit?: () => void;
}

const initialForm: CreateVehicleDto = {
  plate: "",
  engineNumber: "",
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  name: "",
  notes: "",
};

export default function CreateVehicleForm({ afterSubmit }: Props) {
  const { showAlert } = useAlertContext();
  const [formData, setFormData] = useState<CreateVehicleDto>(initialForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors([]);

    const result = await createVehicle(formData);

    if ("error" in result) {
      setErrors([result.error]);
      showAlert(result.error, "error");
    } else {
      showAlert("Vehículo creado correctamente", "success");
      afterSubmit?.();
      setFormData(initialForm);
    }

    setIsSubmitting(false);
  };

  const fields = [
    { name: "name", label: "Nombre interno", type: "text" as const, required: true },
    { name: "plate", label: "Patente", type: "text" as const, required: true },
    { name: "engineNumber", label: "N° Motor", type: "text" as const, required: true },
    { name: "brand", label: "Marca", type: "text" as const, required: true },
    { name: "model", label: "Modelo", type: "text" as const, required: true },
    { name: "year", label: "Año", type: "number" as const, required: true },
    { name: "notes", label: "Observaciones", type: "textarea" as const, rows: 3  , multiline: true },
  ];

  return (
    <BaseForm
      title="Vehículo"
      fields={fields}
      values={formData}
      onChange={(field, value) =>
        setFormData((prev) => ({ ...prev, [field]: value }))
      }
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      errors={errors}
      submitLabel="Crear vehículo"
    />
  );
}
