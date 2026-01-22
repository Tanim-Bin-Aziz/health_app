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
    return `/${userInfo.profilePic}`;
  };

  const navItemStyle = {
    color: "#fff",
    cursor: "pointer",
    position: "relative",
    fontWeight: 500,
    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      bottom: -5,
      width: "0%",
      height: "2px",
      backgroundColor: "#ffffff",
      transition: "0.3s",
    },
    "&:hover::after": {
      width: "100%",
    },
  };

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1300,
        backdropFilter: "blur(12px)",
        background: "#35c4b2",
        boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
      }}
    >
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
            sx={{
              color: "#ffffff",
              cursor: "pointer",
              textShadow: "0 2px 10px rgba(255,255,255,0.4)",
            }}
          >
            Next Dent
          </Typography>

          {/* Nav Links */}
          <Stack direction="row" gap={4}>
            <Typography
              sx={navItemStyle}
              onClick={() => router.push("/appointments")}
            >
              Appointment
            </Typography>
            <Typography
              sx={navItemStyle}
              onClick={() => router.push("/treatments")}
            >
              Treatment
            </Typography>
            <Typography
              sx={navItemStyle}
              onClick={() => router.push("/doctors")}
            >
              Doctors
            </Typography>

            {userInfo?.userId && (
              <Typography
                sx={navItemStyle}
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </Typography>
            )}
          </Stack>

          {/* Profile / Login */}
          {userInfo?.userId ? (
            <Box>
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar
                  src={profilePicUrl()}
                  alt="Profile"
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "secondary.main",
                    border: "2px solid rgba(255,255,255,0.6)",
                  }}
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
                    backdropFilter: "blur(10px)",
                    background: "rgba(255,255,255,0.85)",
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 20,
                      width: 10,
                      height: 10,
                      bgcolor: "rgba(255,255,255,0.85)",
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
                color: "#ffffff",
                px: 3,
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.6)",
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                transition: "0.3s ease",
                "&:hover": {
                  background: "rgba(255,255,255,0.28)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
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
