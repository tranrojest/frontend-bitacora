"use client";

import React, { useState } from "react";
import { BaseForm } from "@/components/appForm/CreateBaseForm";
import { createUser } from "@/app/actions/user";
import { useAlertContext } from "@/context/AlertContext";
import { CreateUserDto } from "@/types/user";

interface Props {
  afterSubmit?: () => void;
}

export default function CreateUserForm({ afterSubmit }: Props) {
  const { showAlert } = useAlertContext();

  const [values, setValues] = useState<CreateUserDto>({
    name: "",
    email: "",
    pass: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (field: string, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors([]);

    const result = await createUser(values);

    if ("error" in result) {
      setErrors([result.error]);
      showAlert(result.error, "error");
    } else {
      showAlert("Usuario creado con éxito", "success");
      setValues({ name: "", email: "", pass: "" });
      afterSubmit?.(); // 👈 llamada opcional al callback
    }

    setIsSubmitting(false);
  };

  const fields = [
    { name: "name", label: "Nombre", type: "text" as const, required: true },
    { name: "email", label: "Correo", type: "email" as const, required: true },
    { name: "pass", label: "Contraseña", type: "password" as const, required: true },
  ];

  return (
    <BaseForm
      fields={fields}
      values={values}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      errors={errors}
      title="Usuario"
      submitLabel="Crear Usuario"
    />
  );
}
