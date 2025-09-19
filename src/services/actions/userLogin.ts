/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldValues } from "react-hook-form";
import setAccessToken from "./setAccessToken";

export const userLogin = async (data: FieldValues) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      }
    );

    const userInfo = await res.json();

    // Handle error responses (400, 401, etc.)
    if (!res.ok) {
      // Create error object that matches your frontend error handling
      const error = new Error(userInfo.message || "Login failed");
      (error as any).response = {
        data: {
          message: userInfo.message,
          errorMessages: userInfo.errorMessages || [],
          success: userInfo.success || false,
        },
        status: res.status,
      };
      throw error;
    }

    // Success case
    const passwordChangeRequired = userInfo.data?.needPasswordChange;

    if (userInfo.data?.accessToken) {
      setAccessToken(userInfo.data.accessToken, {
        redirect: "/dashboard",
        passwordChangeRequired,
      });
    }

    return userInfo;
  } catch (error: any) {
    // If it's a network error, wrap it properly
    if (!error.response) {
      const wrappedError = new Error("Network error or server unavailable");
      (wrappedError as any).response = {
        data: {
          message: "Unable to connect to server",
          success: false,
        },
      };
      throw wrappedError;
    }
    throw error;
  }
};
