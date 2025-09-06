"use client";

import { useEffect, useState } from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

// Define the shape of a specialty item
interface Specialty {
  id: string;
  title: string;
  icon: string;
}

// Define the shape of your API response
interface ApiResponse {
  data: Specialty[];
}

const Specialist = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/specialties");
        const json: ApiResponse = await res.json();
        setSpecialties(json.data);
      } catch (error) {
        console.error("Failed to fetch specialties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  return (
    <Container>
      <Box sx={{ margin: "80px 0px", textAlign: "center" }}>
        {/* Heading */}
        <Box sx={{ textAlign: "start" }}>
          <Typography variant="h4" fontWeight={600}>
            Explore Treatments Across Specialties
          </Typography>
          <Typography component="p" fontWeight={300} fontSize={18} mt={1}>
            Experienced Doctors Across All Specialties
          </Typography>
        </Box>

        {/* Specialties grid */}
        <Stack direction="row" gap={4} mt={5} flexWrap="wrap">
          {loading ? (
            <Typography>Loading specialties...</Typography>
          ) : specialties.length === 0 ? (
            <Typography>No specialties found.</Typography>
          ) : (
            specialties.slice(0, 6).map((specialty) => (
              <Box
                key={specialty.id}
                component={Link}
                href={`/doctors?specialties=${specialty.title}`}
                sx={{
                  flex: "1 1 150px",
                  maxWidth: "200px",
                  backgroundColor: "rgba(245, 245, 245,1)",
                  border: "1px solid rgba(250, 250, 250, 1)",
                  borderRadius: "10px",
                  textAlign: "center",
                  padding: "40px 10px",
                  textDecoration: "none",
                  "& img": {
                    width: "50px",
                    height: "50px",
                    margin: "0 auto",
                  },
                  "&:hover": {
                    border: "1px solid rgba(36, 153, 239, 1)",
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "all 0.5s",
                  },
                }}
              >
                <Image
                  src={specialty.icon}
                  width={100}
                  height={100}
                  alt={`${specialty.title} icon`}
                />
                <Typography component="p" fontWeight={600} fontSize={18} mt={2}>
                  {specialty.title}
                </Typography>
              </Box>
            ))
          )}
        </Stack>

        {/* View All Button */}
        <Button variant="outlined" sx={{ marginTop: "20px" }}>
          View ALL
        </Button>
      </Box>
    </Container>
  );
};

export default Specialist;
