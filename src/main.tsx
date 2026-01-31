import React, { useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import App from "./App";
import { ThemeModeProvider, useThemeMode } from './contexts/ThemeModeContext';

function Root() {
  const { mode } = useThemeMode();

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        // use a slightly lighter teal in dark mode for better contrast
        main: mode === 'dark' ? '#14b8a6' : '#0f766e',
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
  }), [mode]);

  useEffect(() => {
    try {
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        // set a sensible theme color for mobile UI chrome
        meta.setAttribute('content', mode === 'dark' ? '#000000' : '#1976d2');
      }
    } catch (e) {
      // ignore
    }
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <Root />
    </ThemeModeProvider>
  </React.StrictMode>
);
