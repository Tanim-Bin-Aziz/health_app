"use client";

import { Box, Container, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const stats = [
  {
    icon: <LocalHospitalIcon />,
    value: "180+",
    label: "Expert Doctors",
  },
  {
    icon: <MedicalServicesIcon />,
    value: "26+",
    label: "Expert Services",
  },
  {
    icon: <SentimentSatisfiedAltIcon />,
    value: "10K+",
    label: "Happy Patients",
  },
  {
    icon: <EmojiEventsIcon />,
    value: "150+",
    label: "Award Winners",
  },
];

const MotionBox = motion(Box);

const Stats = () => {
  return (
    <Container>
      <MotionBox
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        sx={{
          mt: 6,
          p: { xs: 2.5, md: 3 },
          borderRadius: "18px",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.25)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.15)",
        }}
      >
        <Grid container spacing={2}>
          {stats.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MotionBox
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 200 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 2,
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.05))",
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    color: "#00e5ff",
                    fontSize: 34,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {item.icon}
                </Box>

                {/* Text */}
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ color: "#fff", lineHeight: 1 }}
                  >
                    {item.value}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.75)" }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </MotionBox>
    </Container>
  );
};

export default Stats;
