"use client";

import { ThemeProvider } from "@mui/material";
import { theme } from "../theme/theme";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {children}
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default Providers;
