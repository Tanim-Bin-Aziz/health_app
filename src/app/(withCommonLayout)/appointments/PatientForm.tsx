"use client";

import { Box, TextField } from "@mui/material";

type Props = {
  name: string;
  phone: string;
  setName: (v: string) => void;
  setPhone: (v: string) => void;
};

const PatientForm = ({ name, phone, setName, setPhone }: Props) => {
  return (
    <Box display="flex" gap={2}>
      <TextField
        label="Patient Name"
        fullWidth
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Phone Number"
        fullWidth
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
    </Box>
  );
};

export default PatientForm;
