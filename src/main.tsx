import React from "react";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import App from "./App";

const theme = createTheme({
  palette: {
    primary: {
      main: '#0f766e',
    },
    // Secondary brand color (soft grey) used for secondary text in About dialog
    secondary: {
      main: '#6b7280',
    },
  },
  typography: {
    // Default body font — keep the app readable
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    h6: {
      fontFamily: "'Pacifico', 'Brush Script MT', cursive",
    },
    body1: { fontSize: '9pt' },
    button: {
      fontFamily: "'Pacifico', 'Brush Script MT', cursive",
      textTransform: 'none',
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
