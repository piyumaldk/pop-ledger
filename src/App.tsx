import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import { signInWithGoogle, auth, signOutUser } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";

function LogoSVG() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="4" fill="#1976d2" />
      <path d="M6 12h12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 8h12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [firebaseOk, setFirebaseOk] = useState(true);

  useEffect(() => {
    // If Firebase isn't initialized, onAuthStateChanged may be undefined. Guard against that.
    try {
      // @ts-ignore - auth can be null when Firebase not configured; onAuthStateChanged will throw then
      const unsub = onAuthStateChanged(auth as any, (u) => {
        setUser(u);
      });
      return () => unsub();
    } catch (err) {
      // Firebase not configured
      // eslint-disable-next-line no-console
      console.warn("Firebase not initialized; auth features disabled.", err);
      setFirebaseOk(false);
      return () => {};
    }
  }, []);

  const handleSignIn = async () => {
    try {
      if (!firebaseOk) throw new Error("Firebase not configured");
      await signInWithGoogle();
    } catch (err) {
      // show a user-friendly error
      // eslint-disable-next-line no-console
      console.error("Sign in failed", err);
      setErrorMessage(String(err));
      setErrorOpen(true);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Sign out failed", err);
    } finally {
      handleMenuClose();
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {user ? (
        <>
          <AppBar position="static">
            <Toolbar>
              <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                <Box sx={{ mr: 1 }}>
                  <LogoSVG />
                </Box>
                <Typography variant="h6" component="div">
                  POP LEDGER
                </Typography>
              </Box>

              <Button
                color="inherit"
                onClick={handleMenuOpen}
                startIcon={
                  <Avatar
                    src={user.photoURL ?? undefined}
                    alt={user.displayName ?? "User"}
                    sx={{ width: 32, height: 32 }}
                  />
                }
              >
                {user.displayName ?? user.email}
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem disabled>Delete my data</MenuItem>
                <MenuItem onClick={handleSignOut}>Log out</MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>

          <Container maxWidth="md" sx={{ marginTop: 4 }}>
            <Typography variant="h4" component="h1" align="center">
              Welcome to POP LEDGER
            </Typography>
          </Container>
        </>
      ) : (
        // Logged out view: only show centered sign-in
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LogoSVG />
            </Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Welcome to POP LEDGER
            </Typography>
            <Button variant="contained" color="primary" onClick={handleSignIn} sx={{ px: 4, py: 1.5 }}>
              {/* Inline Google SVG icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: 8 }}
              >
                <path fill="#EA4335" d="M12 11.5v2.9h5.1c-.2 1.2-.8 2.2-1.6 2.9l2.6 2c1.6-1.5 2.6-3.8 2.6-6.4 0-.8-.1-1.6-.4-2.3H12z" />
                <path fill="#34A853" d="M6.4 14.4c-.4-1.1-.4-2.3 0-3.4L3.7 8.7C2.6 10.8 2.6 13.2 3.7 15.3l2.7-0.9z" />
                <path fill="#4A90E2" d="M12 6.5c1.4 0 2.6.5 3.5 1.3l2.6-2.6C16.9 3.1 14.6 2 12 2 9.6 2 7.5 3.1 6.2 4.9l2.7 2.6C9.1 6.6 10.4 6.5 12 6.5z" />
                <path fill="#FBBC05" d="M3.7 8.7l2.7 0.9c.6-1.1 1.9-2.1 3.6-2.1 1.6 0 2.9 1 3.5 2.1l2.7-2.6C16.9 3.1 14.6 2 12 2 8.9 2 6.4 4 5.4 6.8L3.7 8.7z" />
              </svg>
              Sign in with Google
            </Button>
          </Box>
        </Box>
      )}

      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={() => setErrorOpen(false)} message={errorMessage} />
    </Box>
  );
}
