"use client";
import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import assets from "../../../../../public/assets";

const HeroSection = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: { xs: 6, md: 0 },
        my: { xs: 8, md: 16 },
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
        {/* Background Grid */}
        <Box
          sx={{
            position: "absolute",
            width: { xs: "100%", md: "700px" },
            left: { xs: 0, md: "-90px" },
            top: { xs: "-50px", md: "-120px" },
            opacity: { xs: 0.2, md: 1 },
          }}
        >
          <Image src={assets.svgs.grid} alt="grid" width={700} height={700} />
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
        {/* Arrow */}
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
          {/* Doctor 1 */}
          <Box
            sx={{
              position: "relative",
              width: 200,
              height: 320,
              mt: { xs: 0, md: 4 },
            }}
          >
            <Image
              src={assets.images.doctor1}
              alt="doctor1"
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 100vw, 200px"
            />
          </Box>

          {/* Doctor 2 */}
          <Box sx={{ position: "relative", width: 200, height: 300 }}>
            <Image
              src={assets.images.doctor2}
              alt="doctor2"
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 100vw, 200px"
            />
          </Box>
        </Box>

        {/* Floating Doctor */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: "auto", md: "220px" },
            left: { xs: "auto", md: "150px" },
            display: { xs: "none", sm: "block" },
            width: 200,
            height: 200,
          }}
        >
          <Image
            src={assets.images.doctor3}
            alt="doctor3"
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 100vw, 200px"
          />
        </Box>

        {/* Stethoscope */}
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: "-30px", md: "-50px" },
            right: 0,
            zIndex: -1,
            display: { xs: "none", md: "block" },
            width: 150,
            height: 150,
          }}
        >
          <Image
            src={assets.images.stethoscope}
            alt="stethoscope"
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 100vw, 150px"
          />
        </Box>
      </Box>
    </Container>
  );
};

export default HeroSection;
