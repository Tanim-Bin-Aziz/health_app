import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import grid from "../../../../../public/assets/svgs/grid.svg";
import chair from "../../../../../public/assets/chair.png";
import { CalendarMonth } from "@mui/icons-material";

const HeroSection = () => {
  return (
    <Container
      sx={{
        display: "flex",
        direction: "row",
        my: 16,
        gap: 8,
      }}
    >
      <Box sx={{ flex: 1, position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            width: "700px",
            left: "-90px",
            top: "-120px",
          }}
        >
          <Image src={grid} alt="doctor1" />
        </Box>
        <Typography variant="h2" component="h1" fontWeight={600}>
          Welcome to
        </Typography>
        <Typography variant="h2" component="h1" fontWeight={600}>
          Next Dent
        </Typography>
        <Typography
          variant="h2"
          component="h1"
          fontWeight={600}
          color="#BB8ED0"
        >
          Preventive Care
        </Typography>
        <Typography sx={{ my: 4 }}>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit eum
          iusto consequatur eius, doloribus nesciunt facere aliquid eveniet et.
          Rerum maiores saepe cupiditate repellat recusandae atque sed. Saepe,
          vitae id?
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            size="large"
            sx={{
              color: "#fff",
              background: "#BB8ED0",
              px: 3,
              borderRadius: "999px",
              boxShadow: "0 10px 25px rgba(187, 142, 208, 0.45)",
              transition: "0.3s ease",
              "&:hover": {
                background: "#a979c4",
                boxShadow: "0 14px 35px rgba(187, 142, 208, 0.6)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <CalendarMonth sx={{ fontSize: 20, mr: 1 }} />
            Book Appointment
          </Button>

          <Button
            variant="outlined"
            sx={{
              color: "#BB8ED0",
              borderColor: "#BB8ED0",
              px: 3,
              borderRadius: "999px",
              transition: "0.3s ease",
              "&:hover": {
                background: "rgba(187, 142, 208, 0.12)",
                borderColor: "#a979c4",
              },
            }}
          >
            Contact us
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          p: 1,
          flex: 1,
          display: "flex",
          justifyContent: "center",
          position: "relative",
          mt: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Image src={chair} width={600} height={380} alt="chair" />
        </Box>
      </Box>
    </Container>
  );
};

export default HeroSection;
