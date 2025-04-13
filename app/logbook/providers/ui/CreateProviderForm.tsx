"use client";

import React, { useState } from "react";
import { BaseForm } from "@/components/appForm/CreateBaseForm";
import { CreateProviderDto } from "@/types/provider";
import { createProvider } from "@/app/actions/provider";
import { useAlertContext } from "@/context/AlertContext";
import { providerTypeOptions } from "@/types/provider";

interface Props {
  afterSubmit?: () => void;
}

const initialForm: CreateProviderDto = {
  name: "",
  identifier: "",
  type: "fuel",
  phone: "",
  email: "",
  address: "",
  notes: "",
};

export function formatRut(value: string): string {
  let clean = value.replace(/[^0-9kK]/g, "").toUpperCase();
  clean = clean.slice(0, 9);
  if (clean.length < 2) return clean;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  return `${body}-${dv}`;
}

export default function CreateProviderForm({ afterSubmit }: Props) {
  const { showAlert } = useAlertContext();
  const [formData, setFormData] = useState<CreateProviderDto>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors([]);

    const result = await createProvider(formData);

    if ("error" in result) {
      setErrors([result.error]);
      showAlert(result.error, "error");
    } else {
      showAlert("Proveedor creado correctamente", "success");
      setFormData(initialForm);
      afterSubmit?.();
    }

    setIsSubmitting(false);
  };

  const fields = [
    { name: "name", label: "Nombre", type: "text" as const, required: true },
    {
      name: "identifier",
      label: "Rut",
      type: "text" as const,
      required: false,
      formatFn: formatRut,
    },
    {
      name: "type",
      label: "Tipo de proveedor",
      type: "autocomplete" as const,
      options: [...providerTypeOptions],
      required: true,
    },
    {
      name: "phone",
      label: "Teléfono",
      type: "text" as const,
      required: false,
    },
    { name: "email", label: "Correo", type: "email" as const, required: false },
    {
      name: "address",
      label: "Dirección",
      type: "text" as const,
      required: false,
    },
    {
      name: "notes",
      label: "Observaciones",
      type: "textarea" as const,
      rows: 3,
      multiline: true,
    },
  ];

  return (
    <BaseForm
      title="Proveedor"
      fields={fields}
      values={formData}
      onChange={(field, value) => setFormData({ ...formData, [field]: value })}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      errors={errors}
      submitLabel="Crear proveedor"
    />
  );
}
