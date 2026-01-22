"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { useState } from "react";
import { Dayjs } from "dayjs";

import CalendarSection from "./CalendarSection";
import DoctorSelect, { Doctor } from "./DoctorSelect";
import SlotSelector from "./SlotSelector";
import PatientForm from "./PatientForm";
import BookingSuccessModal from "./BookingSuccessModal";

const AppointmentPage = () => {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState(false);

  const canBook = date && doctor && slot && name.trim() && phone.trim();

  const handleBooking = async () => {
    console.log({
      date: date?.format("YYYY-MM-DD"),
      doctorId: doctor?.id,
      slot,
      name,
      phone,
    });

    setSuccess(true);
  };

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={800} mb={4}>
        Book Appointment
      </Typography>

      <Box display="grid" gridTemplateColumns="1fr 2fr" gap={4}>
        <CalendarSection
          selectedDate={date}
          onChange={(d) => {
            setDate(d);
            setDoctor(null);
            setSlot(null);
          }}
        />

        <Box display="flex" flexDirection="column" gap={4}>
          <DoctorSelect
            selectedDate={!!date}
            selectedDoctor={doctor}
            onSelect={setDoctor}
          />

          <SlotSelector
            enabled={!!doctor}
            selectedSlot={slot}
            onSelect={setSlot}
          />

          <PatientForm
            name={name}
            phone={phone}
            setName={setName}
            setPhone={setPhone}
          />

          <Button
            size="large"
            variant="contained"
            disabled={!canBook}
            onClick={handleBooking}
          >
            Confirm Appointment
          </Button>
        </Box>
      </Box>

      <BookingSuccessModal open={success} onClose={() => setSuccess(false)} />
    </Container>
  );
};

export default AppointmentPage;
