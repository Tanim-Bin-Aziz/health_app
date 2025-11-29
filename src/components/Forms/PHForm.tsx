"use client";

import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
  UseFormProps,
} from "react-hook-form";
import React from "react";

type TFormConfig<T extends FieldValues> = {
  resolver?: UseFormProps<T>["resolver"];
  defaultValues?: UseFormProps<T>["defaultValues"];
};

type PHFormProps<T extends FieldValues> = {
  children: React.ReactNode;
  onSubmit: SubmitHandler<T>;
} & TFormConfig<T>;

const PHForm = <T extends FieldValues>({
  children,
  onSubmit,
  resolver,
  defaultValues,
}: PHFormProps<T>) => {
  const methods = useForm<T>({
    resolver,
    defaultValues,
  });

  const { handleSubmit, reset, getValues } = methods;

  const handleFormSubmit: SubmitHandler<T> = async (data) => {
    await onSubmit(data);

    // ⭐ FIX: reset using current values (TS safe)
    reset(getValues());
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>{children}</form>
    </FormProvider>
  );
};

export default PHForm;
