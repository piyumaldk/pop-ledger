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
import Card from '@mui/material/Card';
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
import SummarizeIcon from '@mui/icons-material/Summarize';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeMode } from './contexts/ThemeModeContext';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { GamesView, SeriesView } from './views/SharedViews';
import SummaryDialog from './views/SummaryDialog';
import AboutDialog from './views/AboutDialog';
import firestoreApi from './services/firestoreService';
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
  const [logoLoaded, setLogoLoaded] = useState(false);
  const { mode, toggle } = useThemeMode();

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

  const [summaryOpen, setSummaryOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [navigateSelection, setNavigateSelection] = useState<{ page: 'games' | 'series'; id?: string } | null>(null);
  const handleFabOpen = () => setFabOpen(true);

  const handleFabClose = () => setFabOpen(false);
  const openSummary = () => setSummaryOpen(true);
  const closeSummary = () => setSummaryOpen(false);
  const openAbout = () => setAboutOpen(true);
  const closeAbout = () => setAboutOpen(false);

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

  useEffect(() => {
    // Set a CSS variable for dynamic viewport height to avoid mobile 100vh issues
    const setVh = () => {
      try {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      } catch (e) {
        // ignore in non-browser environments
      }
    };
    setVh();

    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);
    // Prefer visualViewport if available for more accurate heights
    if ((window as any).visualViewport) {
      (window as any).visualViewport.addEventListener('resize', setVh);
    }

    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
      if ((window as any).visualViewport) {
        (window as any).visualViewport.removeEventListener('resize', setVh);
      }
    };
  }, []);

  if (authLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Box sx={{ height: 'calc(var(--vh, 1vh) * 100)', display: 'flex', flexDirection: 'column', pt: { xs: user ? '72px' : '24px', md: user ? '64px' : '24px' }, overflow: 'hidden' }}>
      {user ? (
        <>
          <MobileMenuProvider>
            <AppBar position="fixed" sx={{ top: 0, zIndex: (theme) => theme.zIndex.appBar }}>
            <Toolbar>
              {isMobile && (
                <HeaderMenuToggler />
              )}

              <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                <Typography variant="h6" component="div">
                  {isMobile ? `PoPLedger: ${page === 'games' ? 'Games' : page === 'series' ? 'Series' : ''}` : 'POP LEDGER'}
                </Typography>
              </Box>

              {/* Theme switcher */}
              <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                <IconButton color="inherit" onClick={() => toggle()} sx={{ mr: 1 }} aria-label="Toggle light/dark theme">
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>

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
                  <MenuItem sx={{ pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: 1, color: 'secondary.main', opacity: 1, bgcolor: 'transparent', py: 1 }}>
                    <Avatar
                      src={user.photoURL ?? undefined}
                      alt={user.displayName ?? 'User'}
                      sx={{ width: 36, height: 36, bgcolor: user.photoURL ? undefined : 'grey.700', border: '2px solid', borderColor: 'divider' }}
                      imgProps={{ crossOrigin: 'anonymous', referrerPolicy: 'no-referrer' }}
                    />
                    <Typography sx={{ fontWeight: 600, color: 'secondary.main' }}>{user.displayName ?? user.email}</Typography>
                  </MenuItem>
                )}
                <MenuItem sx={{ color: 'secondary.main' }} onClick={() => { setAboutOpen(true); handleMenuClose(); }}>About Us</MenuItem>
                <MenuItem sx={{ color: 'secondary.main' }} onClick={() => { window.open('https://github.com/piyumaldk/pop-ledger', '_blank', 'noopener,noreferrer'); handleMenuClose(); }}>Source Code</MenuItem>
                <MenuItem sx={{ color: 'secondary.main' }} onClick={() => { setDeleteOpen(true); handleMenuClose(); }}>Delete my data</MenuItem>
                <MenuItem sx={{ color: 'secondary.main' }} onClick={handleSignOut}>Log out</MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>

          <Container maxWidth={false} sx={{ marginTop: { xs: 0, md: 4 }, px: 2, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: { xs: '100%', md: '90vw' } }}>
              {page === 'games' && (
                <GamesView
                  initialSelectedIdOverride={navigateSelection?.page === 'games' ? navigateSelection.id : undefined}
                  clearInitialSelection={() => setNavigateSelection(null)}
                />
              )}
              {page === 'series' && (
                <SeriesView
                  initialSelectedIdOverride={navigateSelection?.page === 'series' ? navigateSelection.id : undefined}
                  clearInitialSelection={() => setNavigateSelection(null)}
                />
              )}
            </Box>
          </Container>
          {/* Mobile-only SpeedDial to switch between Games/Series */}
          <SpeedDial
            ariaLabel="Switch view"
            sx={{ position: 'fixed', right: 16, bottom: 16, zIndex: theme.zIndex.modal + 50 }}
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
              onClick={() => { if (summaryOpen) closeSummary(); if (aboutOpen) closeAbout(); changePage('games'); handleFabClose(); }}
            />
            <SpeedDialAction
              key="series"
              icon={<MovieIcon />}
              tooltipTitle="Series"
              onClick={() => { if (summaryOpen) closeSummary(); if (aboutOpen) closeAbout(); changePage('series'); handleFabClose(); }}
            />
            <SpeedDialAction
              key="summary"
              icon={<SummarizeIcon />}
              tooltipTitle="Summary"
              onClick={() => { if (aboutOpen) closeAbout(); if (!summaryOpen) openSummary(); else closeSummary(); handleFabClose(); }}
            />
          </SpeedDial>
          <SummaryDialog
            open={summaryOpen}
            onClose={closeSummary}
            onNavigate={(p, id) => {
              if (summaryOpen) closeSummary();
              changePage(p);
              if (id) setNavigateSelection({ page: p, id });
            }}
          />

          <AboutDialog
            open={aboutOpen}
            onClose={closeAbout}
            onNavigate={(p) => {
              if (aboutOpen) closeAbout();
              changePage(p);
            }}
            onOpenSummary={() => { if (aboutOpen) closeAbout(); openSummary(); }}
          />

          {/* Delete my data confirmation dialog */}
          <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} fullWidth maxWidth="xs">
            <DialogTitle>Delete my data</DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                This will permanently remove all your data (games, series and the user account) and cannot be recovered. To confirm, type your email address below.
              </Typography>
              <TextField
                label="Type your email to confirm"
                value={confirmEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmEmail(e.target.value)}
                fullWidth
                size="small"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { setDeleteOpen(false); setConfirmEmail(''); }} disabled={deleteLoading}>Cancel</Button>
              <Button
                variant="contained"
                color="error"
                disabled={deleteLoading || confirmEmail.trim() !== (user?.email ?? '')}
                onClick={async () => {
                  if (!user) return;
                  setDeleteLoading(true);
                  try {
                    await firestoreApi.deleteAllUserData(user.uid);
                    try {
                      if (auth?.currentUser) {
                        // best-effort: attempt to delete the auth account (may fail if re-auth required)
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        await auth.currentUser.delete();
                      }
                    } catch (err) {
                      // ignore — we still sign out the user below
                      console.error('Failed to delete auth account', err);
                    }

                    await signOutUser();
                    setErrorMessage('All your data has been deleted. You have been signed out.');
                    setErrorOpen(true);
                  } catch (err) {
                    console.error('Failed to delete user data', err);
                    setErrorMessage('Failed to delete data. Please try again.');
                    setErrorOpen(true);
                  } finally {
                    setDeleteLoading(false);
                    setDeleteOpen(false);
                    setConfirmEmail('');
                  }
                }}
              >
                Go ahead
              </Button>
            </DialogActions>
          </Dialog>

        </MobileMenuProvider>
        </>
      ) : (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
          <Box sx={{ width: '100%', maxWidth: 920 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 0.5, md: 4 }, alignItems: 'center', justifyContent: 'center', py: { xs: 2, md: 0 }, minHeight: { xs: 'auto', md: 'calc(var(--vh, 1vh) * 100 - 64px)' } }}>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', mb: { xs: 0.5, md: 0 } }}>
                <Box sx={{ width: { xs: 320, md: 340 }, height: { xs: 'auto', md: 220 }, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                  {/* shimmer placeholder while logo loads */}
                  {!logoLoaded && (
                    <Box sx={{
                      position: 'absolute', inset: 0, borderRadius: 2,
                      background: 'linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0.04) 100%)',
                      backgroundSize: '200% 100%',
                      '@keyframes shimmer': {
                        '0%': { backgroundPosition: '200% 0' },
                        '100%': { backgroundPosition: '-200% 0' }
                      },
                      animation: 'shimmer 1.6s linear infinite'
                    }} />
                  )}

                  <Box component="img" src="/resources/images/logo.png" alt="POP LEDGER logo" sx={{
                    width: '100%', height: 'auto', objectFit: 'contain', opacity: logoLoaded ? 1 : 0,
                    transition: 'opacity 600ms ease, filter 800ms ease',
                    filter: logoLoaded ? 'grayscale(0%) saturate(100%)' : 'grayscale(100%) saturate(0%)'
                  }} onLoad={() => setLogoLoaded(true)} />
                </Box>
              </Box>

              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ textAlign: 'center', maxWidth: 560, px: { xs: 1, md: 0 }, py: { xs: 1, md: 0 } }}>
                  <Typography variant="h4" sx={{ fontFamily: theme.typography.button.fontFamily, fontWeight: 200, color: 'primary.main', mb: 0.5 }}>Welcome to PoPLedger</Typography>
                  <Typography sx={{ fontFamily: theme.typography.button.fontFamily, color: 'text.secondary', mb: 2, textAlign: 'center', fontWeight: 100 }}>
                    Track your progress across TV series and games with a simple checklist. Now supporting <strong style={{color: theme.palette.primary.main}}>{resourceCounts.games ?? '—'} games</strong> and <strong style={{color: theme.palette.primary.main}}>{resourceCounts.series ?? '—'} series</strong> — explore our curated lists.
                  </Typography>

                  <Button
                    variant="outlined"
                    onClick={handleSignIn}
                    sx={{
                      mt:5,
                      width: { xs: 240, md: 360 },
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

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>~ No data is stored unless you sign in & your data is private to your account ~</Typography>
                </Box>
              </Box>

            </Box>
          </Box>
        </Box>
      )}

      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={() => setErrorOpen(false)} message={errorMessage} />
    </Box>
  );
}
