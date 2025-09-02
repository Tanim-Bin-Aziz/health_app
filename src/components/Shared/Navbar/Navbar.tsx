"use client";

// import useUserInfo from "@/hooks/useUserInfo";
// import { logoutUser } from "@/services/actions/logoutUser";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  //   const userInfo = useUserInfo();
  const router = useRouter();

  const handleLogOut = () => {
    // logoutUser(router);
  };

  return (
    <Box
      sx={{
        bgcolor: "",
      }}
    >
      <Container>
        <Stack
          py={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4" component={Link} href="/" fontWeight={600}>
            P
            <Box component="span" color="primary.main">
              H
            </Box>{" "}
            Health Care
          </Typography>
          <Stack direction="row" justifyContent="space-between" gap={4}>
            <Typography
              component={Link}
              href="/consultation"
              color="secondary.main"
            >
              Consultation
            </Typography>

            <Typography color="secondary.main">Diagnostics</Typography>
            <Typography component={Link} href="/doctors" color="secondary.main">
              Doctors
            </Typography>

            <Typography
              component={Link}
              href="/dashboard"
              color="secondary.main"
            >
              Dashboard
            </Typography>
          </Stack>
          <Button color="error" onClick={handleLogOut} sx={{ boxShadow: 0 }}>
            Logout
          </Button>
          <Button component={Link} href="/login">
            Login
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default Navbar;
