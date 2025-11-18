"use client";

import useUserInfo from "@/hooks/useUserInfo";
import { logoutUser } from "@/services/actions/logoutUser";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Logout from "@mui/icons-material/Logout";
import { useState } from "react";

const Navbar = () => {
  const userInfo = useUserInfo();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    logoutUser(router);
    handleMenuClose();
    window.location.reload();
  };

  const getInitials = (name?: string) => {
    if (!name) return "";
    const names = name.split(" ");
    return names.length === 1
      ? names[0].charAt(0).toUpperCase()
      : names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
  };

  const profilePicUrl = () => {
    if (!userInfo?.profilePic) return undefined;
    if (userInfo.profilePic.startsWith("http")) return userInfo.profilePic;
    return `/${userInfo.profilePic}`; // relative to public folder
  };

  return (
    <Box sx={{ bgcolor: "#59AC77" }}>
      <Container>
        <Stack
          py={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Logo */}
          <Typography
            variant="h4"
            onClick={() => router.push("/")}
            fontWeight={600}
            sx={{ color: "#ffffff", textDecoration: "none", cursor: "pointer" }}
          >
            Next Dent
          </Typography>

          {/* Nav Links */}
          <Stack direction="row" justifyContent="space-between" gap={4}>
            <Typography
              onClick={() => router.push("/consultation")}
              color="#ffffff"
              sx={{ cursor: "pointer" }}
            >
              Appointment
            </Typography>
            <Typography color="#ffffff">Treatment</Typography>
            <Typography
              onClick={() => router.push("/doctors")}
              color="#ffffff"
              sx={{ cursor: "pointer" }}
            >
              Doctors
            </Typography>
            {userInfo?.userId && (
              <Typography
                onClick={() => router.push("/dashboard")}
                color="#ffffff"
                sx={{ cursor: "pointer" }}
              >
                Dashboard
              </Typography>
            )}
          </Stack>

          {userInfo?.userId ? (
            <Box>
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar
                  src={profilePicUrl()}
                  alt="Profile"
                  sx={{ width: 36, height: 36, bgcolor: "secondary.main" }}
                >
                  {!profilePicUrl() && getInitials(userInfo.name)}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 160,
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 20,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    router.push("/dashboard");
                  }}
                >
                  Dashboard
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    router.push("/profile");
                  }}
                >
                  Profile
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogOut}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button
              onClick={() => router.push("/login")}
              sx={{
                bgcolor: "#59AC77",
                color: "#ffffff",
                px: 3,
                "&:hover": {
                  bgcolor: "#4e9467",
                  borderColor: "#ffffff",
                },
              }}
            >
              Login
            </Button>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default Navbar;
