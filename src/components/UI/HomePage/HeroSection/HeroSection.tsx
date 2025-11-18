import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import grid from "../../../../../public/assets/svgs/grid.svg";
import chair from "../../../../../public/assets/chair.png";

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
          color="#59AC77"
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
            sx={{
              bgcolor: "#59AC77",
              color: "white",
              "&:hover": {
                bgcolor: "#4e9467",
              },
            }}
          >
            Make appointment
          </Button>
          <Button variant="outlined">Contact us</Button>
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
