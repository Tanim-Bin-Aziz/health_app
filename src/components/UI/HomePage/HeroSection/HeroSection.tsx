"use client";
import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import assets from "@/assets";

const HeroSection = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" }, // ✅ stack on mobile
        alignItems: "center",
        justifyContent: "space-between",
        gap: { xs: 6, md: 0 },
        my: { xs: 8, md: 16 }, // ✅ smaller margin for mobile
      }}
    >
      {/* Left Side - Text */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          textAlign: { xs: "center", md: "left" },
        }}
      >
        {/* Background Grid (hidden on mobile for simplicity) */}
        <Box
          sx={{
            position: "absolute",
            width: { xs: "100%", md: "700px" },
            left: { xs: 0, md: "-90px" },
            top: { xs: "-50px", md: "-120px" },
            opacity: { xs: 0.2, md: 1 }, // ✅ subtle background on mobile
          }}
        >
          <Image src={assets.svgs.grid} alt="grid" />
        </Box>

        <Typography
          variant="h3"
          fontWeight={600}
          sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
        >
          Healthier Hearts
        </Typography>
        <Typography
          variant="h3"
          fontWeight={600}
          sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
        >
          Come From
        </Typography>
        <Typography
          variant="h3"
          fontWeight={600}
          color="primary.main"
          sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
        >
          Preventive Care
        </Typography>

        <Typography sx={{ my: 4, fontSize: { xs: "0.9rem", md: "1rem" } }}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit eum
          iusto consequatur eius, doloribus nesciunt facere aliquid eveniet et.
          Rerum maiores saepe cupiditate repellat recusandae atque sed.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <Button size="large">Make appointment</Button>
          <Button size="large" variant="outlined">
            Contact us
          </Button>
        </Box>
      </Box>

      {/* Right Side - Images */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          mt: { xs: 4, md: 0 },
        }}
      >
        {/* Arrow (hidden on small) */}
        <Box
          sx={{
            position: "absolute",
            left: { xs: "auto", md: "200px" },
            top: { xs: "auto", md: "-30px" },
            display: { xs: "none", md: "block" },
          }}
        >
          <Image src={assets.svgs.arrow} width={100} height={100} alt="arrow" />
        </Box>

        {/* Main Doctors */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box mt={{ xs: 0, md: 4 }}>
            <Image
              src={assets.images.doctor1}
              width={200}
              height={320}
              alt="doctor1"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Box>
          <Box>
            <Image
              src={assets.images.doctor2}
              width={200}
              height={300}
              alt="doctor2"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Box>
        </Box>

        {/* Floating doctor (hidden on very small screens) */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: "auto", md: "220px" },
            left: { xs: "auto", md: "150px" },
            display: { xs: "none", sm: "block" },
          }}
        >
          <Image
            src={assets.images.doctor3}
            width={200}
            height={200}
            alt="doctor3"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Box>

        {/* Stethoscope (only show on md+) */}
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: "-30px", md: "-50px" },
            right: 0,
            zIndex: -1,
            display: { xs: "none", md: "block" },
          }}
        >
          <Image
            src={assets.images.stethoscope}
            width={150}
            height={150}
            alt="stethoscope"
          />
        </Box>
      </Box>
    </Container>
  );
};

export default HeroSection;
