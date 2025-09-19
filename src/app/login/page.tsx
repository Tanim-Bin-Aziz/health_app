/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";
import adminlogo from "../../../public/assets/images/loginlogo.png";
import Link from "next/link";
import { FieldValues } from "react-hook-form";
import { userLogin } from "@/services/actions/userLogin";
import { storeUserInfo } from "@/services/auth.services";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PHForm from "../../components/Forms/PHForm";
import PHInput from "../../components/Forms/PHInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export const validationSchema = z.object({
  email: z.string().email("Please enter a valid email address!"),
  password: z.string().min(6, "Must be at least 6 characters"),
});

const LoginPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (values: FieldValues) => {
    setIsLoading(true);
    setError(""); // Clear previous errors

    try {
      const res = await userLogin(values);

      if (res?.success && res?.data?.accessToken) {
        toast.success(res?.message || "Login successful!");
        storeUserInfo({ accessToken: res?.data?.accessToken });
        router.push("/dashboard");
      } else {
        // Handle unexpected success response format
        setError("Login failed. Please try again.");
        toast.error("Login failed. Please try again.");
      }
    } catch (err: any) {
      console.log("Login error details:", err);

      // Extract error message with fallback chain
      let errorMsg = "Something went wrong!";

      if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err?.response?.data?.errorMessages?.[0]?.message) {
        errorMsg = err.response.data.errorMessages[0].message;
      } else if (err?.message) {
        errorMsg = err.message;
      }

      // Special handling for common error messages
      if (errorMsg.toLowerCase().includes("user does not exist")) {
        errorMsg = "User does not exist. Please check your email address.";
      } else if (errorMsg.toLowerCase().includes("password")) {
        errorMsg = "Invalid password. Please try again.";
      } else if (
        errorMsg.toLowerCase().includes("network") ||
        errorMsg.toLowerCase().includes("server")
      ) {
        errorMsg = "Unable to connect to server. Please try again later.";
      }

      setError(errorMsg);
      toast.error(errorMsg);

      // Auto-clear error after 8 seconds
      setTimeout(() => setError(""), 8000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Stack
        sx={{
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 600,
            width: "100%",
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow:
              "0 4px 30px rgba(0,0,0,0.2), 0 -4px 30px rgba(0,0,0,0.2), 4px 0 30px rgba(0,0,0,0.2), -4px 0 30px rgba(0,0,0,0.2)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <Stack justifyContent="center" alignItems="center">
            <Box>
              <Image src={adminlogo} width={200} height={200} alt="logo" />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Next Dent Login
              </Typography>
            </Box>
          </Stack>

          {error && (
            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{
                  backgroundColor: "#f44336",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "14px",
                  border: "1px solid #d32f2f",
                  boxShadow: "0 2px 4px rgba(244, 67, 54, 0.3)",
                }}
              >
                {error}
              </Typography>
            </Box>
          )}

          <Box>
            <PHForm
              onSubmit={handleLogin}
              resolver={zodResolver(validationSchema)}
              defaultValues={{
                email: "",
                password: "",
              }}
            >
              <Grid container spacing={2} my={1}>
                <Grid item xs={12}>
                  <PHInput
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth={true}
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <PHInput
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth={true}
                    disabled={isLoading}
                  />
                </Grid>
              </Grid>

              <Link href={"/forgot-password"}>
                <Typography
                  mb={1}
                  textAlign="end"
                  component="p"
                  fontWeight={300}
                  sx={{
                    textDecoration: "underline",
                    color: isLoading ? "#ccc" : "inherit",
                    pointerEvents: isLoading ? "none" : "auto",
                  }}
                >
                  Forgot Password?
                </Typography>
              </Link>

              <Button
                fullWidth
                type="submit"
                disabled={isLoading}
                sx={{
                  mt: 2,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 600,
                  background: isLoading
                    ? "#ccc"
                    : "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                  color: "white",
                  textTransform: "none",
                  "&:hover": {
                    background: isLoading
                      ? "#ccc"
                      : "linear-gradient(135deg, #5b0eb0 0%, #1f65db 100%)",
                    boxShadow: isLoading
                      ? "none"
                      : "0 0 15px rgba(37,117,252,0.6)",
                  },
                  "&:disabled": {
                    color: "white",
                    cursor: "not-allowed",
                  },
                }}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <Typography component="p" fontWeight={300} mt={1}>
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  style={{
                    color: isLoading ? "#ccc" : "inherit",
                    pointerEvents: isLoading ? "none" : "auto",
                  }}
                >
                  Create an account
                </Link>
              </Typography>
            </PHForm>
          </Box>
        </Box>
      </Stack>
    </Container>
  );
};

export default LoginPage;
