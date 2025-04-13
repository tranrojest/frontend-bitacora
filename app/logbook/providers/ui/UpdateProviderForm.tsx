"use client";

import React, { useState } from "react";
import { BaseUpdateForm } from "@/components/appForm/UpdateBaseForm";
import { Provider, UpdateProviderDto } from "@/types/provider";
import { updateProvider } from "@/app/actions/provider";
import { useAlertContext } from "@/context/AlertContext";
import { providerTypeOptions } from "@/types/provider";

interface Props {
  initialData: Provider;
  afterSubmit?: () => void;
}
export function formatRut(value: string): string {
  let clean = value.replace(/[^0-9kK]/g, "").toUpperCase();
  clean = clean.slice(0, 9);
  if (clean.length < 2) return clean;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  return `${body}-${dv}`;
}
export default function UpdateProviderForm({
  initialData,
  afterSubmit,
}: Props) {
  const { showAlert } = useAlertContext();
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: UpdateProviderDto) => {
    setIsSubmitting(true);
    setErrors([]);

    // Enviar solo los campos válidos
    const result = await updateProvider(initialData.id, {
      name: values.name,
      identifier: values.identifier,
      type: values.type,
      phone: values.phone,
      email: values.email,
      address: values.address,
      notes: values.notes,
    });

    if ("error" in result) {
      setErrors([result.error]);
      showAlert(result.error, "error");
    } else {
      showAlert("Proveedor actualizado correctamente", "success");
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
      options: Array.from(providerTypeOptions),
      required: true,
    },
    {
      name: "phone",
      label: "Teléfono",
      type: "text" as const,
      required: false,
    },
    {
      name: "email",
      label: "Correo electrónico",
      type: "email" as const,
      required: false,
    },
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
    <BaseUpdateForm
      fields={fields}
      initialState={initialData}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      errors={errors}
      title="Proveedor"
    />
  );
}
