import React, { useState } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import { useMobileMenu } from '../contexts/MobileMenuContext';
import ButtonBase from '@mui/material/ButtonBase';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardLoader from '../components/CardLoader';

export type ListItem = { id: string; title: string; desc?: string };

interface Props<T extends ListItem> {
  title: string;
  items: T[];
  initialSelectedId?: string;
  onSelect?: (id: string) => void;
  renderDetail?: (item: T) => React.ReactNode;
  detailLoading?: boolean;
  listAnimating?: boolean;
  menuLoading?: boolean;
}

export default function ListDetailView<T extends ListItem>({
  title,
  items,
  initialSelectedId,
  onSelect,
  renderDetail,
  detailLoading,
  listAnimating,
  menuLoading,
}: Props<T>) {
  const [selected, setSelected] = useState<string>(initialSelectedId ?? (items[0]?.id ?? ''));
  // If `initialSelectedId` changes (navigation or external request), update selection.
  React.useEffect(() => {
    if (initialSelectedId && initialSelectedId !== selected) {
      setSelected(initialSelectedId);
      onSelect?.(initialSelectedId);
    }
  }, [initialSelectedId]);

  const current = items.find((i) => i.id === selected) ?? items[0];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { open: mobileMenuOpen, setOpen: setMobileMenuOpen } = useMobileMenu();
  const [query, setQuery] = useState('');
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);

  // Keep detail mounted while loading so it can finish any restore effects.
  // Show a full-screen overlay loader when `detailLoading` is true.

  const handleItemClick = (id: string) => {
    setSelected(id);
    onSelect?.(id);
    if (isMobile) {
      searchInputRef.current?.blur();
      setMobileMenuOpen(false);
    }
  };

  const menuContent = (
    <Box sx={{
      width: '100%',
      overflowY: 'auto',
      transition: 'opacity 320ms ease',
      opacity: listAnimating ? 0.2 : 1,
      boxSizing: 'border-box',
      // hide native scrollbar layout so open/close doesn't change widths
      '&::-webkit-scrollbar': { width: 0, height: 0 },
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar-track': { background: theme.palette.background.paper },
      '&::-webkit-scrollbar-thumb': { backgroundColor: theme.palette.primary.main, borderRadius: 8 },
      p: 0,
    }}>
      <Box sx={{ p: 1.5 }}>
        <TextField
          inputRef={searchInputRef}
          size="small"
          fullWidth
          placeholder={`Search ${title}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: 0 }}>
                <SearchIcon sx={{ color: 'primary.main', fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              height: 42,
              background: alpha(theme.palette.primary.main, 0.05),
              color: 'text.primary',
              borderRadius: 2.5,
              '& fieldset': { borderColor: alpha(theme.palette.primary.main, 0.25) },
              '&:hover fieldset': { borderColor: theme.palette.primary.main },
              '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
              '& .MuiInputBase-input': { color: 'inherit', padding: '10px 14px' },
              '& .MuiInputBase-input::placeholder': { color: theme.palette.text.secondary, opacity: 1 },
            },
            '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: theme.palette.primary.main },
          }}
        />
      </Box>
      <Divider sx={{ opacity: 0.5 }} />
      <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, px: 1.5, py: 1 }}>
        {items.filter((it) => it.title.toLowerCase().includes(query.trim().toLowerCase())).map((it) => (
          <ListItem key={it.id} disablePadding>
            <Button
              fullWidth
              onClick={() => handleItemClick(it.id)}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                borderRadius: 2.5,
                px: 2,
                py: 0.875,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                overflow: 'hidden',
                fontWeight: it.id === selected ? 600 : 400,
                fontSize: '0.875rem',
                color: it.id === selected ? 'primary.main' : 'text.secondary',
                background: it.id === selected
                  ? (theme.palette.mode === 'dark' ? 'linear-gradient(135deg, rgba(34,211,238,0.15) 0%, rgba(8,145,178,0.08) 100%)' : 'linear-gradient(135deg, rgba(8,145,178,0.12) 0%, rgba(34,211,238,0.06) 100%)')
                  : 'transparent',
                border: '1px solid',
                borderColor: it.id === selected ? alpha(theme.palette.primary.main, 0.35) : 'transparent',
                boxShadow: it.id === selected
                  ? (theme.palette.mode === 'dark' ? '0 2px 12px rgba(34,211,238,0.15)' : '0 2px 12px rgba(8,145,178,0.12)')
                  : 'none',
                transition: 'all 0.18s ease',
                '&:hover': {
                  color: 'primary.main',
                  background: it.id === selected
                    ? (theme.palette.mode === 'dark' ? 'linear-gradient(135deg, rgba(34,211,238,0.2) 0%, rgba(8,145,178,0.12) 100%)' : 'linear-gradient(135deg, rgba(8,145,178,0.16) 0%, rgba(34,211,238,0.08) 100%)')
                    : alpha(theme.palette.primary.main, 0.06),
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  transform: 'translateX(2px)',
                },
              }}
            >
              <Box sx={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
                <Typography variant="body2" noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 'inherit', color: 'inherit' }}>{it.title}</Typography>
              </Box>
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: { xs: '100%', md: '90vw' }, mx: 'auto', height: { xs: 'calc(var(--vh, 1vh) * 100 - 80px)', md: 'calc(var(--vh, 1vh) * 100 - 76px)' }, minHeight: 0, boxSizing: 'border-box', pt: { xs: 1.5, md: 1.5 }, pb: { xs: 1.5, md: 1.5 }, justifyContent: { xs: 'flex-start', md: 'center' }, gap: { xs: 0, md: 2.5 } }}>
      {!isMobile && (
        <Box sx={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: { xs: '100%', md: 380 }, position: 'relative', borderRadius: 3 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}>
              {!isMobile && (
                <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: '0.02em', color: 'text.primary', fontSize: '0.95rem' }}>{title}</Typography>
              )}
            </CardContent>
            <Divider sx={{ opacity: 0.5 }} />
            {!isMobile && menuContent}
            {menuLoading && !isMobile ? (
              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', bgcolor: 'transparent' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ position: 'relative', width: 36, height: 36 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${alpha(theme.palette.primary.main, 0.12)}`, borderTopColor: theme.palette.primary.main, animation: 'spinLoader 0.8s linear infinite', position: 'absolute' }} />
                  </Box>
                </Box>
              </Box>
            ) : null}
          </Card>
        </Box>
      )}

      <Box sx={{ flex: '1 1 auto', minWidth: 0, width: { xs: '100%', md: 'min(900px, calc(100vw - 380px - 20px))' } }}>
        <Card sx={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', borderRadius: 3 }}>
          <CardContent sx={{
            flex: 1,
            overflow: 'auto',
            p: 0,
            '&:last-child': { pb: 0 },
            '&::-webkit-scrollbar': { width: 6, height: 6 },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: alpha(theme.palette.primary.main, 0.4), borderRadius: 10, '&:hover': { backgroundColor: theme.palette.primary.main } },
          }}>
            {current ? (
              renderDetail ? (
                renderDetail(current)
              ) : (
                <>
                  <Box sx={{ position: 'sticky', top: 0, zIndex: (theme) => theme.zIndex.appBar - 1, backgroundColor: 'background.paper', py: 1, boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
                    <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 700, mb: 0 }}>
                      {current.title}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>{current.desc}</Typography>
                  </Box>
                  <Box sx={{ mt: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    This pane will show more information about the selected item (details, images, meta, etc.).
                  </Typography>
                </>
              )
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 200 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${alpha(theme.palette.primary.main, 0.12)}`, borderTopColor: theme.palette.primary.main, animation: 'spinLoader 0.8s linear infinite' }} />
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {isMobile && (
        <Drawer anchor="left" open={mobileMenuOpen} onClose={() => { searchInputRef.current?.blur(); setMobileMenuOpen(false); }} ModalProps={{ keepMounted: true }} PaperProps={{ sx: { width: { xs: 'min(88vw, 380px)' }, boxSizing: 'border-box' } }}>
          <Box sx={{ position: 'sticky', top: 0, zIndex: (theme) => theme.zIndex.appBar - 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.25, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>{title}</Typography>
            <IconButton onClick={() => { searchInputRef.current?.blur(); setMobileMenuOpen(false); }} aria-label="close menu" sx={{ color: 'text.secondary' }}><CloseIcon /></IconButton>
          </Box>
          {menuContent}
        </Drawer>
      )}

    </Box>
  );
}
