import { MenuItem, SxProps, TextField } from "@mui/material";
import { Controller, useFormContext, FieldPath } from "react-hook-form";

export interface ISelectItem {
  label: string;
  value: string | number;
}

interface ISelectProps<T extends Record<string, any>> {
  name: FieldPath<T>;
  label?: string;
  items: ISelectItem[];
  size?: "small" | "medium";
  required?: boolean;
  fullWidth?: boolean;
  sx?: SxProps;
}

const PHSelectField = <T extends Record<string, any>>({
  name,
  label,
  items,
  size = "small",
  required = false,
  fullWidth = true,
  sx,
}: ISelectProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          label={label}
          required={required}
          fullWidth={fullWidth}
          size={size}
          error={!!error}
          helperText={error?.message ?? ""}
          sx={sx}
          value={field.value ?? ""}
          onChange={(e) => field.onChange(e.target.value)}
        >
          {items.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default PHSelectField;
