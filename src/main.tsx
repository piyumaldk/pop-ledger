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
  },
  typography: {
    // Default body font — keep the app readable
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    // Use the Pacifico script for the header and buttons only
    h6: {
      fontFamily: "'Pacifico', 'Brush Script MT', cursive",
    },
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
