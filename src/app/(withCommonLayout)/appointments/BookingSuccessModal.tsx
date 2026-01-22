"use client";

import { Snackbar, Alert } from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
};

const BookingSuccessModal = ({ open, onClose }: Props) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity="success" variant="filled">
        Appointment booked successfully!
      </Alert>
    </Snackbar>
  );
};

export default BookingSuccessModal;
