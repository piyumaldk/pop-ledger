import React, { useState } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import Fab from '@mui/material/Fab';
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
  const current = items.find((i) => i.id === selected) ?? items[0];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Keep detail mounted while loading so it can finish any restore effects.
  // Show a full-screen overlay loader when `detailLoading` is true.

  const handleItemClick = (id: string) => {
    setSelected(id);
    onSelect?.(id);
    if (isMobile) setMobileMenuOpen(false);
  };

  const menuContent = (
    <Box sx={{
      overflowY: 'auto',
      transition: 'opacity 320ms ease',
      opacity: listAnimating ? 0.2 : 1,
      '&::-webkit-scrollbar': { width: 10, height: 10 },
      '&::-webkit-scrollbar-track': { background: theme.palette.background.paper },
      '&::-webkit-scrollbar-thumb': { backgroundColor: theme.palette.primary.main, borderRadius: 8 },
      p: 0,
    }}>
      <Box sx={{ p: 1 }}>
        <TextField
          size="small"
          fullWidth
          placeholder={`Search ${title}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: 0 }}>
                <SearchIcon sx={{ color: theme.palette.primary.main }} />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.06),
            borderRadius: 1,
            // make outline and text use theme primary color and match card header height
            '& .MuiOutlinedInput-root': {
              height: 45,
              color: theme.palette.primary.main,
              '& fieldset': { borderColor: theme.palette.primary.main },
              '&:hover fieldset': { borderColor: theme.palette.primary.dark },
              '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
              '& .MuiInputBase-input': { color: theme.palette.primary.main, padding: '12px 14px' },
            },
            '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: theme.palette.primary.main },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
          }}
        />
      </Box>
      <Divider />
      <List sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 1 }}>
        {items.filter((it) => it.title.toLowerCase().includes(query.trim().toLowerCase())).map((it) => (
          <ListItem key={it.id} disablePadding>
            <Button
              variant={it.id === selected ? 'contained' : 'outlined'}
              color="primary"
              fullWidth
              onClick={() => handleItemClick(it.id)}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                borderRadius: 2,
                px: 2,
                py: 1.25,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              <Box sx={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
                <Typography variant="body1" noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</Typography>
              </Box>
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: 'calc(100vh - 144px)', py: 3, justifyContent: { xs: 'flex-start', md: 'center' }, gap: { xs: 0, md: 3 } }}>
      <Box sx={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: { xs: '100%', md: 400 }, position: 'relative' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
            <Typography variant="h6">{title}</Typography>
          </CardContent>
          <Divider />
          {!isMobile && menuContent}
          {menuLoading && !isMobile ? (
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <Typography variant="subtitle1" color="text.secondary">{`Loading ${title}...`}</Typography>
            </Box>
          ) : null}
        </Card>
      </Box>

      <Box sx={{ flex: '0 0 auto', minWidth: 0, width: { xs: '100%', md: 'min(900px, calc(100vw - 400px - 24px))' } }}>
          <Card sx={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{
            flex: 1,
            overflow: 'auto',
            '&::-webkit-scrollbar': { width: 12, height: 12 },
            '&::-webkit-scrollbar-track': { background: theme.palette.background.paper },
            '&::-webkit-scrollbar-thumb': { backgroundColor: theme.palette.primary.main, borderRadius: 10 },
          }}>
            {current ? (
              renderDetail ? (
                renderDetail(current)
              ) : (
                <>
                  <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 700 }}>
                    {current.title}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {current.desc}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This pane will show more information about the selected item (details, images, meta, etc.).
                  </Typography>
                </>
              )
            ) : (
              <Typography color="text.secondary">Loading...</Typography>
            )}
          </CardContent>
        </Card>
      </Box>

      {isMobile && (
        <Drawer anchor="left" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} ModalProps={{ keepMounted: true }} PaperProps={{ sx: { width: 300 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1 }}>
            <Typography variant="h6">{title}</Typography>
            <IconButton onClick={() => setMobileMenuOpen(false)} aria-label="close menu"><CloseIcon /></IconButton>
          </Box>
          <Divider />
          {menuContent}
        </Drawer>
      )}

      {isMobile && !mobileMenuOpen && (
        <Fab color="primary" size="small" onClick={() => setMobileMenuOpen(true)} aria-label={`Open ${title} list`} sx={{ position: 'fixed', left: 16, bottom: 16, zIndex: 1400 }}>
          <MenuIcon />
        </Fab>
      )}

    </Box>
  );
}
