import { SxProps, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export type TInputProps = {
  name: string;
  label?: string;
  type?: string;
  size?: "small" | "medium";
  fullWidth?: boolean;
  sx?: SxProps;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PHInput = ({
  name,
  label,
  type = "text",
  size = "small",
  fullWidth,
  sx,
  required,
  disabled,
  onChange,
}: TInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          type={type}
          label={label}
          fullWidth={fullWidth}
          size={size}
          required={required}
          disabled={disabled}
          placeholder={label}
          error={!!error?.message}
          helperText={error?.message}
          sx={sx}
          onChange={(e) => {
            if (type === "file") {
              const file = e.target.files?.[0];
              field.onChange(file); // ⭐ file object sent to RHF
            } else {
              field.onChange(e.target.value);
            }

            onChange?.(e);
          }}
          value={type === "file" ? undefined : field.value ?? ""}
          inputProps={type === "file" ? { accept: "image/*" } : {}}
        />
      )}
    />
  );
};

export default PHInput;
