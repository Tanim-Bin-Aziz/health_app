"use client";

import { useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Avatar,
  Divider,
  TextField,
  IconButton,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

/* ================================
   DENTAL BOOKING – MUI INDUSTRY UI
   Inspired by Calendly / Doctolib
   ================================ */

const doctors = [
  {
    id: 1,
    name: "Dr. Ayesha Rahman",
    designation: "BDS, FCPS (Dentistry)",
    availableDays: [0, 1, 2, 4],
  },
  {
    id: 2,
    name: "Dr. Tanvir Hasan",
    designation: "BDS, DDS",
    availableDays: [0, 2, 3, 5],
  },
];

const slots = [
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
];

export default function DentalBookingMUI() {
  const today = new Date();
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const formattedDate = selectedDate.toDateString();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f8fb", p: 4 }}>
      <Card
        sx={{ maxWidth: 1200, mx: "auto", borderRadius: 4, overflow: "hidden" }}
      >
        <Grid container>
          {/* LEFT PANEL */}
          <Grid item xs={12} md={4} sx={{ bgcolor: "#ffffff", p: 4 }}>
            <Typography variant="h6" fontWeight={700} mb={3}>
              NextDent
            </Typography>

            {doctors.map((doc) => (
              <Card
                key={doc.id}
                onClick={() => {
                  setSelectedDoctor(doc);
                  setSelectedSlot(null);
                }}
                sx={{
                  p: 2,
                  mb: 2,
                  cursor: "pointer",
                  borderRadius: 3,
                  border:
                    selectedDoctor.id === doc.id
                      ? "2px solid #0f766e"
                      : "1px solid #e5e7eb",
                }}
              >
                <Box display="flex" gap={2} alignItems="center">
                  <Avatar />
                  <Box>
                    <Typography fontWeight={600}>{doc.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {doc.designation}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}

            <Divider sx={{ my: 3 }} />
            <Typography variant="body2" color="text.secondary">
              Step 2: Select date & time
            </Typography>
          </Grid>

          {/* RIGHT PANEL */}
          <Grid item xs={12} md={8} sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} mb={3}>
              Select Date & Time
            </Typography>

            {/* DATE PICKER (SIMPLIFIED) */}
            <Box display="flex" alignItems="center" gap={2} mb={4}>
              <IconButton>
                <ArrowBackIos fontSize="small" />
              </IconButton>
              <Typography fontWeight={600}>{formattedDate}</Typography>
              <IconButton>
                <ArrowForwardIos fontSize="small" />
              </IconButton>
            </Box>

            {/* SLOTS */}
            <Grid container spacing={2}>
              {slots.map((slot) => (
                <Grid item xs={6} sm={4} key={slot}>
                  <Button
                    fullWidth
                    variant={selectedSlot === slot ? "contained" : "outlined"}
                    color="success"
                    onClick={() => setSelectedSlot(slot)}
                    sx={{ py: 1.5, borderRadius: 3 }}
                  >
                    {slot}
                  </Button>
                </Grid>
              ))}
            </Grid>

            {/* CONFIRM */}
            {selectedSlot && (
              <Card sx={{ mt: 4, p: 3, borderRadius: 3 }}>
                <Typography fontWeight={600} mb={1}>
                  Confirm Appointment
                </Typography>
                <Typography variant="body2">
                  Doctor: {selectedDoctor.name}
                </Typography>
                <Typography variant="body2">Date: {formattedDate}</Typography>
                <Typography variant="body2">Time: {selectedSlot}</Typography>

                <TextField
                  fullWidth
                  label="Patient Name"
                  size="small"
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  size="small"
                  sx={{ mt: 2 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  sx={{ mt: 3, py: 1.5, borderRadius: 3 }}
                >
                  Book Appointment
                </Button>
              </Card>
            )}
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
