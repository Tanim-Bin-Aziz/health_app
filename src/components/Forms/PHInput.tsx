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
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void; // ✅ FIXED
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
              const target = e.target as HTMLInputElement;
              const file = target.files?.[0] ?? null;
              field.onChange(file);
            } else {
              field.onChange(e.target.value);
            }

            onChange?.(e); // Works safely now
          }}
          value={type === "file" ? undefined : field.value ?? ""}
          inputProps={type === "file" ? { accept: "image/*" } : {}}
        />
      )}
    />
  );
};

export default PHInput;
