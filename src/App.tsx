import React, { useEffect, useState } from "react";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from '@mui/material/Grid';
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import ButtonBase from '@mui/material/ButtonBase';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import FullScreenLoader from './components/FullScreenLoader';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { MobileMenuProvider, useMobileMenu } from './contexts/MobileMenuContext';
import { signInWithGoogle, auth, signOutUser } from "./firebase";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AppsIcon from '@mui/icons-material/Apps';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MovieIcon from '@mui/icons-material/Movie';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { GamesView, SeriesView } from './views/SharedViews';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { onAuthStateChanged, User } from "firebase/auth";

function LogoSVG({ width = 48, height }: { width?: number | string; height?: number | string }) {
  const boxStyles: any = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'primary.main',
  };

  if (typeof width === 'number') boxStyles.width = width;
  else boxStyles.width = width;

  if (height === undefined) boxStyles.height = boxStyles.width;
  else boxStyles.height = height;

  return (
    <Box sx={boxStyles}>
      <ReceiptLongIcon sx={{ fontSize: typeof boxStyles.width === 'number' ? Math.min(Number(boxStyles.width) * 0.75, 72) : 36 }} />
    </Box>
  );
}

function HeaderMenuToggler() {
  const { open, setOpen } = useMobileMenu();
  // we show the hamburger only when menu is closed; hide while open per your spec
  return (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="open menu"
      sx={{ mr: 1, display: { xs: 'inline-flex', md: 'none' } }}
      onClick={() => setOpen(true)}
    >
      <MenuIcon />
    </IconButton>
  );
}

export default function App() {
  const [page, setPage] = useState<'home' | 'games' | 'series'>(() => {
    try {
      const v = localStorage.getItem('pop-ledger.view');
      return (v as 'home' | 'games' | 'series') ?? 'games';
    } catch (e) {
      return 'games';
    }
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [firebaseOk, setFirebaseOk] = useState(true);
  const [fabOpen, setFabOpen] = useState(false);
  const [resourceCounts, setResourceCounts] = useState<{games?: number | string, series?: number | string}>({});

  useEffect(() => {
    // If Firebase isn't initialized, onAuthStateChanged may be undefined. Guard against that.
    try {
      // @ts-ignore - auth can be null when Firebase not configured; onAuthStateChanged will throw then
      const unsub = onAuthStateChanged(auth as any, (u) => {
        setUser(u);
        setAuthLoading(false);
      });
      return () => unsub();
    } catch (err) {
      // Firebase not configured
      // eslint-disable-next-line no-console
      console.warn("Firebase not initialized; auth features disabled.", err);
      setFirebaseOk(false);
      setAuthLoading(false);
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

  const changePage = (p: 'home' | 'games' | 'series') => {
    try {
      localStorage.setItem('pop-ledger.view', p);
    } catch (e) {
      // ignore
    }
    setPage(p);
  };

  const handleFabOpen = () => setFabOpen(true);

  const handleFabClose = () => setFabOpen(false);

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

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/resources-count.json', { cache: 'no-cache' });
        if (!res.ok) throw new Error('no counts');
        const j = await res.json();
        setResourceCounts({ games: j.games ?? 0, series: j.series ?? 0 });
      } catch (err) {
        setResourceCounts({ games: 'N/A', series: 'N/A' });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (authLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', pt: { xs: '72px', md: '64px' } }}>
      {user ? (
        <>
          <MobileMenuProvider>
            <AppBar position="fixed" sx={{ top: 0, zIndex: (theme) => theme.zIndex.appBar }}>
            <Toolbar>
              {/* Mobile hamburger moved here */}
              {isMobile && (
                <HeaderMenuToggler />
              )}

              <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                <Typography variant="h6" component="div">
                  {isMobile ? `PoPLedger: ${page === 'games' ? 'Games' : page === 'series' ? 'Series' : ''}` : 'POP LEDGER'}
                </Typography>
              </Box>

              <ButtonBase
                onClick={handleMenuOpen}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1,
                  py: 0.5,
                  borderRadius: 2,
                  color: 'common.white',
                  textTransform: 'none',
                }}
                aria-label="Open account menu"
              >
                <Avatar
                  src={user.photoURL ?? undefined}
                  alt={user.displayName ?? "User"}
                  sx={{ width: 36, height: 36, bgcolor: user.photoURL ? undefined : 'grey.700', border: '2px solid', borderColor: 'common.white' }}
                  imgProps={{ crossOrigin: 'anonymous', referrerPolicy: 'no-referrer' }}
                >
                  {!user.photoURL && <AccountCircleIcon sx={{ color: 'common.white', fontSize: 28 }} />}
                </Avatar>
                <Typography sx={{
                  color: 'common.white',
                  fontFamily: "'Pacifico', 'Brush Script MT', cursive",
                  fontSize: 16,
                  lineHeight: '20px',
                  whiteSpace: 'nowrap',
                  display: { xs: 'none', md: 'inline-flex' }
                }}>
                  {user.displayName ?? user.email}
                </Typography>
              </ButtonBase>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                {isMobile && (
                  <MenuItem sx={{ pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary', opacity: 1, bgcolor: 'transparent', py: 1 }}>
                    <Avatar
                      src={user.photoURL ?? undefined}
                      alt={user.displayName ?? 'User'}
                      sx={{ width: 36, height: 36, bgcolor: user.photoURL ? undefined : 'grey.700', border: '2px solid', borderColor: 'divider' }}
                      imgProps={{ crossOrigin: 'anonymous', referrerPolicy: 'no-referrer' }}
                    />
                    <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>{user.displayName ?? user.email}</Typography>
                  </MenuItem>
                )}
                <MenuItem disabled>Delete my data</MenuItem>
                <MenuItem onClick={handleSignOut}>Log out</MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>

          <Container maxWidth={false} sx={{ marginTop: { xs: 0, md: 4 }, px: 2, display: 'flex', justifyContent: 'center' }}>
            {/* Removed desktop top buttons; navigation via SpeedDial now */}

            {/* Render selected view in-page (single page app) */}
            <Box sx={{ width: { xs: '100%', md: '90vw' } }}>
              {page === 'games' && <GamesView />}
              {page === 'series' && <SeriesView />}
            </Box>
          </Container>
          {/* Mobile-only SpeedDial to switch between Games/Series */}
          <SpeedDial
            ariaLabel="Switch view"
            sx={{ position: 'fixed', right: 16, bottom: 16, zIndex: 1400 }}
            icon={<AppsIcon />}
            onOpen={handleFabOpen}
            onClose={handleFabClose}
            open={fabOpen}
            direction="up"
          >
            <SpeedDialAction
              key="games"
              icon={<SportsEsportsIcon />}
              tooltipTitle="Games"
              onClick={() => { changePage('games'); handleFabClose(); }}
            />
            <SpeedDialAction
              key="series"
              icon={<MovieIcon />}
              tooltipTitle="Series"
              onClick={() => { changePage('series'); handleFabClose(); }}
            />
          </SpeedDial>
        </MobileMenuProvider>
        </>
      ) : (
        // Logged out view: only show centered sign-in
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            {/* Constrain logo + button to the same width so they align visually */}
            <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ width: 420, maxWidth: '85vw' }}>
                <Box component="img" src="/resources/images/logo.png" alt="POP LEDGER logo" sx={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
              </Box>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                PoPLedger now lets you track <strong style={{color:'#000'}}>{resourceCounts.games ?? '—'}</strong> games and <strong style={{color:'#000'}}>{resourceCounts.series ?? '—'}</strong> series.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Box sx={{ backgroundColor: 'rgba(0,0,0,0.06)', px: 2, py: 0.6, borderRadius: 1, fontWeight: 700 }}>{resourceCounts.games ?? '—'} games</Box>
                <Box sx={{ backgroundColor: 'rgba(0,0,0,0.06)', px: 2, py: 0.6, borderRadius: 1, fontWeight: 700 }}>{resourceCounts.series ?? '—'} series</Box>
              </Box>
            </Box>
            <Button
              variant="outlined"
              onClick={handleSignIn}
              fullWidth
              sx={{
                width: '360px',
                maxWidth: '90vw',
                py: 1.5,
                backgroundColor: 'white',
                color: 'primary.main',
                borderColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'rgba(15,118,110,0.08)',
                  borderColor: 'primary.dark',
                },
              }}
            >
              {/* Multicolor Google 'G' icon (clear on white) */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: 8 }}
              >
                <g fill="none">
                  <path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6-6C34 6 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.8z" />
                  <path fill="#34A853" d="M6.3 14.6l6.6 4.8C14 16.1 18.6 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6-6C34 6 29.4 4 24 4 16.7 4 10.2 7.8 6.3 14.6z" />
                  <path fill="#FBBC05" d="M24 44c5.4 0 9.9-2.1 13.3-5.6l-6.3-5.2C28.9 34.6 26.6 35.5 24 35.5c-5.3 0-9.8-3.4-11.3-8h-6.6C6.1 37.1 14 44 24 44z" />
                  <path fill="#EA4335" d="M43.6 20.5H42V20H24v8h11.3c-.9 2.6-2.6 4.8-4.7 6.4l6.3 5.2C39.9 37.9 44 30.6 44 24c0-1.3-.1-2.6-.4-3.8z" />
                </g>
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
