import React, { useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import App from "./App";
import { ThemeModeProvider } from './contexts/ThemeModeContext';

const globalAnimations = (
  <GlobalStyles styles={{
    '@keyframes floatOrb1': {
      '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
      '33%': { transform: 'translate(40px, -60px) scale(1.06)' },
      '66%': { transform: 'translate(-25px, 25px) scale(0.94)' },
    },
    '@keyframes floatOrb2': {
      '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
      '33%': { transform: 'translate(-50px, 35px) scale(1.1)' },
      '66%': { transform: 'translate(25px, -45px) scale(0.92)' },
    },
    '@keyframes floatOrb3': {
      '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
      '50%': { transform: 'translate(20px, -30px) scale(1.04)' },
    },
    '@keyframes fadeInUp': {
      from: { opacity: 0, transform: 'translateY(32px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    '@keyframes shimmerSlide': {
      '0%': { backgroundPosition: '200% 0' },
      '100%': { backgroundPosition: '-200% 0' },
    },
    '@keyframes spinLoader': {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
    '@keyframes pulseGlow': {
      '0%, 100%': { boxShadow: '0 0 20px rgba(34,211,238,0.3)' },
      '50%': { boxShadow: '0 0 40px rgba(34,211,238,0.6)' },
    },
    '@keyframes subtlePulse': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.6 },
    },
    '*': { boxSizing: 'border-box' },
  }} />
);

function Root() {
  const theme = useMemo(() => createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#22d3ee',
        light: '#67e8f9',
        dark: '#06b6d4',
      },
      secondary: {
        main: '#6b7280',
      },
      background: {
        default: '#020617',
        paper: '#0f172a',
      },
      text: {
        primary: '#f1f5f9',
        secondary: '#94a3b8',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", Helvetica, Arial, sans-serif',
      h1: { fontWeight: 800, letterSpacing: '-0.04em' },
      h2: { fontWeight: 700, letterSpacing: '-0.03em' },
      h3: { fontWeight: 700, letterSpacing: '-0.02em' },
      h4: { fontWeight: 700, letterSpacing: '-0.01em' },
      h5: { fontWeight: 600 },
      h6: { fontFamily: '"Inter", "Roboto", Helvetica, Arial, sans-serif', fontWeight: 700 },
      body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
      body2: { fontSize: '0.875rem', lineHeight: 1.5 },
      button: {
        fontFamily: '"Inter", "Roboto", Helvetica, Arial, sans-serif',
        fontWeight: 600,
        letterSpacing: '0.01em',
        textTransform: 'none',
      },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            background: 'rgba(15,23,42,0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(34,211,238,0.12)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            backgroundColor: 'rgba(2,6,23,0.88)',
            borderBottom: '1px solid rgba(34,211,238,0.12)',
            boxShadow: 'none',
            color: '#f1f5f9',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            fontWeight: 600,
            textTransform: 'none',
            transition: 'all 0.2s ease',
          },
          contained: {
            boxShadow: '0 0 20px rgba(34,211,238,0.25)',
            '&:hover': {
              boxShadow: '0 0 32px rgba(34,211,238,0.45)',
              transform: 'translateY(-1px)',
            },
          },
          outlined: {
            '&:hover': { transform: 'translateY(-1px)' },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
            background: 'rgba(15,23,42,0.96)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(34,211,238,0.15)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.7)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': { borderRadius: 10 },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'translateY(-1px)' },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
            background: 'rgba(15,23,42,0.98)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(34,211,238,0.12)',
          },
        },
      },
    },
  }), []);

  useEffect(() => {
    try {
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', '#020617');
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalAnimations}
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
