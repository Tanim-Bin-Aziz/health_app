"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogOut = () => {
    // logoutUser(router);
  };

  const toggleDrawer = (state: boolean) => {
    setOpen(state);
  };

  // Links array for easier mapping
  const navLinks = [
    { label: "Consultation", href: "/consultation" },
    { label: "Diagnostics", href: "/diagnostics" },
    { label: "Doctors", href: "/doctors" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  return (
    <Box sx={{ bgcolor: "" }}>
      <Container>
        <Stack
          py={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Logo */}
          <Typography
            variant="h5"
            component={Link}
            href="/"
            fontWeight={600}
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            Next Dent
          </Typography>

          {/* Desktop Menu */}
          <Stack
            direction="row"
            gap={4}
            sx={{
              display: { xs: "none", md: "flex" },
            }}
          >
            {navLinks.map((link) => (
              <Typography
                key={link.href}
                component={Link}
                href={link.href}
                color="secondary.main"
                sx={{ textDecoration: "none" }}
              >
                {link.label}
              </Typography>
            ))}
          </Stack>

          {/* Buttons for Desktop */}
          <Stack
            direction="row"
            gap={2}
            sx={{
              display: { xs: "none", md: "flex" },
            }}
          >
            <Button color="error" onClick={handleLogOut} sx={{ boxShadow: 0 }}>
              Logout
            </Button>
            <Button component={Link} href="/login">
              Login
            </Button>
          </Stack>

          {/* Mobile Menu Icon */}
          <IconButton
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Stack>
      </Container>

      {/* Drawer for Mobile */}
      <Drawer anchor="right" open={open} onClose={() => toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            p: 2,
          }}
          role="presentation"
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight={600}>
              Next Dent
            </Typography>
            <IconButton onClick={() => toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <List>
            {navLinks.map((link) => (
              <ListItem
                key={link.href}
                component={Link}
                href={link.href}
                onClick={() => toggleDrawer(false)}
              >
                <ListItemText primary={link.label} />
              </ListItem>
            ))}

            <ListItem>
              <Button
                fullWidth
                color="error"
                onClick={handleLogOut}
                sx={{ boxShadow: 0 }}
              >
                Logout
              </Button>
            </ListItem>

            <ListItem>
              <Button fullWidth component={Link} href="/login">
                Login
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Navbar;
