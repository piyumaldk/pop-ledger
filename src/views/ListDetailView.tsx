import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
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

  // Keep detail mounted while loading so it can finish any restore effects.
  // Show a full-screen overlay loader when `detailLoading` is true.

  const handleItemClick = (id: string) => {
    setSelected(id);
    onSelect?.(id);
    if (isMobile) setMobileMenuOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: 'calc(100vh - 144px)', py: 3, justifyContent: { xs: 'flex-start', md: 'center' }, gap: { xs: 0, md: 3 } }}>
      <Box sx={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: { xs: '100%', md: 400 }, position: 'relative' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
            {isMobile ? (
              <ButtonBase onClick={() => setMobileMenuOpen((v) => !v)} sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', px: 1 }}>
                <Typography variant="h6">{title}</Typography>
                <IconButton size="small" aria-label="toggle menu" onClick={(e) => { e.stopPropagation(); setMobileMenuOpen((v) => !v); }}>
                  {mobileMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </ButtonBase>
            ) : (
              <Typography variant="h6">{title}</Typography>
            )}
          </CardContent>
          <Divider />
          {(!isMobile || mobileMenuOpen) && (
            <Box sx={{ overflowY: 'auto', transition: 'opacity 320ms ease', opacity: listAnimating ? 0.2 : 1 }}>
              <List sx={{ display: 'block', px: 1 }}>
                {items.map((it) => (
                  <ListItemButton
                    key={it.id}
                    selected={it.id === selected}
                    onClick={() => handleItemClick(it.id)}
                    sx={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      px: 2,
                    }}
                  >
                    <ListItemText primary={it.title} primaryTypographyProps={{ noWrap: true, sx: { overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 700, color: 'primary.main' } }} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          )}
          {menuLoading && !isMobile ? <CardLoader /> : null}
        </Card>
      </Box>

      <Box sx={{ flex: '0 0 auto', minWidth: 0, width: { xs: '100%', md: 'min(900px, calc(100vw - 400px - 24px))' } }}>
        <Card sx={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: 1, overflow: 'auto' }}>
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
              <Typography color="text.secondary">No items available.</Typography>
            )}
          </CardContent>
          {/* detail content is shown above; overlay a card-scoped loader when detailLoading */}
          {detailLoading ? <CardLoader /> : null}
        </Card>
      </Box>
    </Box>
  );
}
