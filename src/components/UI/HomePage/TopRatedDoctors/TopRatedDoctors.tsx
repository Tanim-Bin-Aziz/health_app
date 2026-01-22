import { Box, Button, Container, Typography, Chip } from "@mui/material";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import Link from "next/link";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { CalendarMonth } from "@mui/icons-material";

type Doctor = {
  id: string;
  name: string;
  qualification: string;
  designation: string;
  address: string;
  experience?: number;
  rating?: number;
  profilePhoto?: string | null;
};

const TopRatedDoctors = async () => {
  const res = await fetch(
    "http://localhost:5000/api/v1/doctor?page=1&limit=3",
    {
      cache: "no-store",
    },
  );

  const { data: doctors }: { data: Doctor[] } = await res.json();

  return (
    <Box sx={{ py: 10, background: "linear-gradient(#f0f9ff, #fff)" }}>
      <Container>
        {/* Header */}
        <Box textAlign="center" mb={8}>
          <Typography variant="h4" fontWeight={800}>
            Meet Our Expert Doctors
          </Typography>
          <Typography color="text.secondary" mt={1}>
            Highly qualified specialists dedicated to your health
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {doctors.map((doctor) => {
            const imgSrc =
              doctor.profilePhoto?.trim() || "/assets/doctor-image1.png";

            const rating =
              doctor.rating ?? (4.5 + Math.random() * 0.4).toFixed(1);
            const experience =
              doctor.experience ?? Math.floor(Math.random() * 10) + 6;

            return (
              <Grid item md={4} xs={12} key={doctor.id}>
                <Box
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,.1)",
                    transition: ".3s",
                    "&:hover": { transform: "translateY(-8px)" },
                  }}
                >
                  {/* Image */}
                  <Box position="relative" height={240}>
                    <Image
                      src={imgSrc}
                      alt={doctor.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <Chip
                      icon={<StarIcon color="warning" />}
                      label={rating}
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        fontWeight: 700,
                        background: "rgba(255,255,255,.9)",
                      }}
                    />
                  </Box>

                  {/* Content */}
                  <Box p={3}>
                    <Typography variant="h6" fontWeight={700}>
                      {doctor.name}
                    </Typography>

                    <Typography color="#35c4b2" fontWeight={600}>
                      {doctor.designation}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {doctor.qualification}
                    </Typography>

                    {/* Stats */}
                    {/* Stats (compact version) */}
                    <Box display="flex" gap={1} mt={2}>
                      {/* Experience */}
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        px={1.5}
                        py={0.5}
                        borderRadius={2}
                        bgcolor="#e3f2fd"
                      >
                        <Typography
                          fontWeight={700}
                          variant="body2"
                          color="#35c4b2"
                        >
                          {experience}+
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          yrs
                        </Typography>
                      </Box>

                      {/* Patients */}
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        px={1.5}
                        py={0.5}
                        borderRadius={2}
                        bgcolor="#e0f7fa"
                      >
                        <Typography
                          fontWeight={700}
                          variant="body2"
                          color="#35c4b2"
                        >
                          1K+
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          patients
                        </Typography>
                      </Box>
                    </Box>

                    {/* Address */}
                    <Box display="flex" alignItems="center" gap={1} mt={2}>
                      <LocationOnIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {doctor.address}
                      </Typography>
                    </Box>

                    {/* Buttons */}
                    {/* Buttons (compact version) */}
                    <Box display="flex" gap={1} mt={2}>
                      <Button
                        size="small"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          color: "#fff",
                          background: "#35c4b2",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          boxShadow: "0 5px 15px rgba(187, 142, 208, 0.35)",
                          transition: "0.3s ease",
                          "&:hover": {
                            background: "#35c4b2",
                            boxShadow: "0 7px 20px rgba(187, 142, 208, 0.5)",
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        <CalendarMonth sx={{ fontSize: 16 }} />
                        Book
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          color: "#35c4b2",
                          borderColor: "#35c4b2",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          "&:hover": {
                            borderColor: "#35c4b2",
                          },
                        }}
                      >
                        Profile
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>

        {/* View All */}
        <Box textAlign="center" mt={8}>
          <Button component={Link} href="/doctors" variant="outlined">
            View All Doctors
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default TopRatedDoctors;
