"use client";

import { Box, Card, CardContent, Typography, Avatar } from "@mui/material";
import { useEffect, useState } from "react";

export type Doctor = {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  profilePhoto?: string | null;
};

type Props = {
  selectedDate: boolean;
  selectedDoctor: Doctor | null;
  onSelect: (doctor: Doctor) => void;
};

const DoctorSelect = ({ selectedDate, selectedDoctor, onSelect }: Props) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    if (!selectedDate) return;

    fetch("http://localhost:5000/api/v1/doctor?page=1&limit=6")
      .then((res) => res.json())
      .then((res) => setDoctors(res.data));
  }, [selectedDate]);

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(220px,1fr))"
      gap={2}
    >
      {doctors.map((doctor) => (
        <Card
          key={doctor.id}
          onClick={() => onSelect(doctor)}
          sx={{
            cursor: "pointer",
            border:
              selectedDoctor?.id === doctor.id
                ? "2px solid #35c4b2"
                : "1px solid #eee",
          }}
        >
          <CardContent>
            <Avatar
              src={doctor.profilePhoto || "/assets/doctor-image1.png"}
              sx={{ width: 56, height: 56, mb: 1 }}
            />
            <Typography fontWeight={700}>{doctor.name}</Typography>
            <Typography fontSize={14} color="#35c4b2">
              {doctor.designation}
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              {doctor.qualification}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default DoctorSelect;
