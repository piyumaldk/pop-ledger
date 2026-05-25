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
import LogoSVG from './assets/LogoSVG';

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
    <Box sx={{
      height: 'calc(var(--vh, 1vh) * 100)',
      display: 'flex',
      flexDirection: 'column',
      pt: { xs: user ? '64px' : '0px', md: user ? '64px' : '0px' },
      overflow: 'hidden',
      position: 'relative',
      bgcolor: 'background.default',
      backgroundImage: user
        ? 'radial-gradient(circle, rgba(34,211,238,0.07) 1px, transparent 1px)'
        : 'none',
      backgroundSize: '28px 28px',
    }}>
      {user ? (
        <>
          <MobileMenuProvider>
            <AppBar position="fixed" sx={{ top: 0, zIndex: (theme) => theme.zIndex.appBar }}>
            <Toolbar sx={{ minHeight: 64, px: { xs: 1.5, md: 3 }, gap: 1 }}>
              {isMobile && (
                <HeaderMenuToggler />
              )}

              {/* Brand */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: { xs: 'auto', md: 2 } }}>
                <ReceiptLongIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                <Typography sx={{
                  fontFamily: "'Pacifico', 'Brush Script MT', cursive",
                  fontSize: { xs: 17, md: 20 },
                  fontWeight: 400,
                  color: 'text.primary',
                  lineHeight: 1,
                  letterSpacing: '0.01em',
                }}>
                  PoPLedger
                </Typography>
              </Box>

              {/* Desktop nav tabs */}
              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 'auto' }}>
                  <Button
                    onClick={() => { if (summaryOpen) closeSummary(); if (aboutOpen) closeAbout(); changePage('games'); }}
                    startIcon={<SportsEsportsIcon sx={{ fontSize: 17 }} />}
                    sx={{
                      px: 2, py: 0.75, borderRadius: 3, fontSize: 14,
                      color: page === 'games' ? 'primary.main' : 'text.secondary',
                      bgcolor: page === 'games' ? 'rgba(34,211,238,0.12)' : 'transparent',
                      border: '1px solid',
                      borderColor: page === 'games' ? 'primary.main' : 'transparent',
                      fontWeight: page === 'games' ? 600 : 500,
                      '&:hover': {
                        bgcolor: 'rgba(34,211,238,0.1)',
                        borderColor: 'primary.main',
                        color: 'primary.main',
                      },
                    }}
                  >
                    Games
                  </Button>
                  <Button
                    onClick={() => { if (summaryOpen) closeSummary(); if (aboutOpen) closeAbout(); changePage('series'); }}
                    startIcon={<MovieIcon sx={{ fontSize: 17 }} />}
                    sx={{
                      px: 2, py: 0.75, borderRadius: 3, fontSize: 14,
                      color: page === 'series' ? 'primary.main' : 'text.secondary',
                      bgcolor: page === 'series' ? 'rgba(34,211,238,0.12)' : 'transparent',
                      border: '1px solid',
                      borderColor: page === 'series' ? 'primary.main' : 'transparent',
                      fontWeight: page === 'series' ? 600 : 500,
                      '&:hover': {
                        bgcolor: 'rgba(34,211,238,0.1)',
                        borderColor: 'primary.main',
                        color: 'primary.main',
                      },
                    }}
                  >
                    Series
                  </Button>
                </Box>
              )}

              {/* Theme toggle + user */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>

                <ButtonBase
                  onClick={handleMenuOpen}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.25,
                    py: 0.75,
                    borderRadius: 2.5,
                    transition: 'background 0.2s ease',
                    '&:hover': { bgcolor: 'rgba(34,211,238,0.1)' },
                  }}
                  aria-label="Open account menu"
                >
                  <Avatar
                    src={user.photoURL ?? undefined}
                    alt={user.displayName ?? "User"}
                    sx={{ width: 32, height: 32, bgcolor: 'primary.main', border: '2px solid', borderColor: 'primary.main' }}
                    imgProps={{ crossOrigin: 'anonymous', referrerPolicy: 'no-referrer' }}
                  >
                    {!user.photoURL && <AccountCircleIcon sx={{ color: 'common.white', fontSize: 20 }} />}
                  </Avatar>
                  <Typography sx={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: 'text.primary',
                    whiteSpace: 'nowrap',
                    display: { xs: 'none', md: 'inline-flex' },
                  }}>
                    {user.displayName ?? user.email}
                  </Typography>
                </ButtonBase>
              </Box>

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

          <Container maxWidth={false} sx={{ marginTop: 0, px: 2, display: 'flex', justifyContent: 'center', flex: 1, minHeight: 0 }}>
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
            sx={{
              position: 'fixed', right: 20, bottom: 20,
              zIndex: theme.zIndex.modal + 50,
              '& .MuiFab-primary': {
                background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
                boxShadow: '0 4px 20px rgba(34,211,238,0.4)',
                '&:hover': {
                  boxShadow: '0 4px 28px rgba(34,211,238,0.6)',
                },
              },
            }}
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
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'error.main' }}>Delete my data</Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 2.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.7 }}>
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
        <Box sx={{
          flex: 1,
          minHeight: 'calc(var(--vh, 1vh) * 100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'background.default',
        }}>
          {/* Animated gradient orbs */}
          <Box sx={{
            position: 'absolute',
            width: { xs: 400, md: 720 },
            height: { xs: 400, md: 720 },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,211,238,0.18) 0%, rgba(8,145,178,0.07) 40%, transparent 70%)',
            top: '-18%', right: '-12%',
            animation: 'floatOrb1 12s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
          <Box sx={{
            position: 'absolute',
            width: { xs: 300, md: 560 },
            height: { xs: 300, md: 560 },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.16) 0%, rgba(109,40,217,0.05) 40%, transparent 70%)',
            bottom: '-5%', left: '-12%',
            animation: 'floatOrb2 9s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
          <Box sx={{
            position: 'absolute',
            width: { xs: 200, md: 380 },
            height: { xs: 200, md: 380 },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)',
            top: '40%', left: '8%',
            animation: 'floatOrb3 7s ease-in-out infinite',
            pointerEvents: 'none',
          }} />

          {/* Dot grid pattern */}
          <Box sx={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(34,211,238,0.2) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            pointerEvents: 'none', opacity: 0.8,
          }} />

          {/* Content */}
          <Box sx={{
            position: 'relative', zIndex: 1,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: { xs: 3, md: 4 },
            px: { xs: 3, md: 4 }, py: 6,
            maxWidth: 600, width: '100%',
            animation: 'fadeInUp 0.8s ease both',
          }}>
            {/* Logo */}
            <Box sx={{
              width: { xs: 110, md: 150 },
              filter: 'drop-shadow(0 0 28px rgba(34,211,238,0.45))',
              animation: 'subtlePulse 3s ease-in-out infinite',
            }}>
              <LogoSVG width="100%" />
            </Box>

            {/* Headline */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{
                fontFamily: "'Pacifico', 'Brush Script MT', cursive",
                fontWeight: 400,
                fontSize: { xs: '2.6rem', md: '3.8rem' },
                background: 'linear-gradient(135deg, #67e8f9 0%, #22d3ee 30%, #0ea5e9 65%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 1.5,
                letterSpacing: '0.01em',
                lineHeight: 1.2,
              }}>
                PoPLedger
              </Typography>
              <Typography sx={{
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.1rem' },
                maxWidth: 480, lineHeight: 1.7, mx: 'auto',
              }}>
                Track your progress across TV series and video games with a beautiful checklist. Explore{' '}
                <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>{resourceCounts.games ?? '—'} games</Box>
                {' '}and{' '}
                <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>{resourceCounts.series ?? '—'} series</Box>
                {' '}— curated just for you.
              </Typography>
            </Box>

            {/* Stats pills */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { icon: <SportsEsportsIcon sx={{ fontSize: 18 }} />, label: 'Games', value: resourceCounts.games ?? '—' },
                { icon: <MovieIcon sx={{ fontSize: 18 }} />, label: 'Series', value: resourceCounts.series ?? '—' },
              ].map((stat) => (
                <Box key={stat.label} sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.25, borderRadius: 3,
                  background: 'rgba(34,211,238,0.08)',
                  border: '1px solid rgba(34,211,238,0.2)',
                  backdropFilter: 'blur(8px)',
                }}>
                  <Box sx={{ color: 'primary.main' }}>{stat.icon}</Box>
                  <Box>
                    <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1, color: 'primary.main' }}>{stat.value}</Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', fontWeight: 500 }}>{stat.label}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Sign in button */}
            <Button
              variant="contained"
              size="large"
              onClick={handleSignIn}
              sx={{
                mt: 1, px: 4, py: 1.75, borderRadius: 3, fontSize: '1rem', fontWeight: 700,
                minWidth: 260, maxWidth: '90vw',
                background: 'linear-gradient(135deg, #22d3ee 0%, #67e8f9 60%, #a5f3fc 100%)',
                color: '#020617',
                letterSpacing: '0.01em',
                boxShadow: '0 0 0 1px rgba(34,211,238,0.4), 0 8px 40px rgba(34,211,238,0.45)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #67e8f9 0%, #a5f3fc 60%, #cffafe 100%)',
                  boxShadow: '0 0 0 1px rgba(34,211,238,0.6), 0 8px 56px rgba(34,211,238,0.65)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 10, flexShrink: 0 }}>
                <g fill="none">
                  <path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6-6C34 6 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.8z" />
                  <path fill="#34A853" d="M6.3 14.6l6.6 4.8C14 16.1 18.6 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6-6C34 6 29.4 4 24 4 16.7 4 10.2 7.8 6.3 14.6z" />
                  <path fill="#FBBC05" d="M24 44c5.4 0 9.9-2.1 13.3-5.6l-6.3-5.2C28.9 34.6 26.6 35.5 24 35.5c-5.3 0-9.8-3.4-11.3-8h-6.6C6.1 37.1 14 44 24 44z" />
                  <path fill="#EA4335" d="M43.6 20.5H42V20H24v8h11.3c-.9 2.6-2.6 4.8-4.7 6.4l6.3 5.2C39.9 37.9 44 30.6 44 24c0-1.3-.1-2.6-.4-3.8z" />
                </g>
              </svg>
              Continue with Google
            </Button>

            {/* Caption */}
            <Typography sx={{ color: 'text.secondary', textAlign: 'center', fontSize: '0.8rem', opacity: 0.75 }}>
              Your data is private to your account — nothing stored without signing in
            </Typography>
          </Box>
        </Box>
      )}

      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={() => setErrorOpen(false)} message={errorMessage} />
    </Box>
  );
}
