"use client";

import React, { useState } from "react";
import { BaseUpdateForm } from "@/components/appForm/UpdateBaseForm";
import { UpdateUserDto, User } from "@/types/user";
import { updateUser } from "@/app/actions/user";
import { useAlertContext } from "@/context/AlertContext";

interface Props {
  initialData: User;
  afterSubmit?: () => void;
}

export default function UpdateUserForm({ initialData, afterSubmit }: Props) {
  const { showAlert } = useAlertContext();
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: UpdateUserDto) => {
    setIsSubmitting(true);
    setErrors([]);

    const result = await updateUser(initialData.id, {
        email: values.email,
        name: values.name,
    });

    if ("error" in result) {
      setErrors([result.error]);
      showAlert(result.error, "error");
    } else {
      showAlert("Usuario actualizado correctamente", "success");
      afterSubmit?.();
    }

    setIsSubmitting(false);
  };

  const fields = [
    { name: "name", label: "Nombre", type: "text" as const, required: true },
    {
      name: "email",
      label: "Correo electrónico",
      type: "email" as const,
      required: true, // 👈 Bloqueado si no quieres que lo editen
    },
  ];

  return (
    <BaseUpdateForm
      fields={fields}
      initialState={initialData}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      errors={errors}
      title="Usuario"
    />
  );
}
