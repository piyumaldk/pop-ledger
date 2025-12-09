import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';

export type ListItem = { id: string; title: string; desc?: string };

interface Props<T extends ListItem> {
  title: string;
  items: T[];
  initialSelectedId?: string;
  onSelect?: (id: string) => void;
  renderDetail?: (item: T) => React.ReactNode;
  detailLoading?: boolean;
  listAnimating?: boolean;
}

export default function ListDetailView<T extends ListItem>({
  title,
  items,
  initialSelectedId,
  onSelect,
  renderDetail,
  detailLoading,
  listAnimating,
}: Props<T>) {
  const [selected, setSelected] = useState<string>(initialSelectedId ?? (items[0]?.id ?? ''));
  const current = items.find((i) => i.id === selected) ?? items[0];

  const handleItemClick = (id: string) => {
    setSelected(id);
    onSelect?.(id);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: 'calc(100vh - 144px)', py: 3, justifyContent: { xs: 'flex-start', md: 'center' }, gap: { xs: 0, md: 3 } }}>
      <Box sx={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: { xs: '100%', md: 400 } }}>
          <CardContent>
            <Typography variant="h6">{title}</Typography>
          </CardContent>
          <Divider />
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
                  <ListItemText primary={it.title} primaryTypographyProps={{ noWrap: true, sx: { overflow: 'hidden', textOverflow: 'ellipsis' } }} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Card>
      </Box>

      <Box sx={{ flex: '0 0 auto', minWidth: 0, width: { xs: '100%', md: 'min(900px, calc(100vw - 400px - 24px))' } }}>
        <Card sx={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ display: detailLoading ? 'none' : 'block', flex: 1, overflow: 'auto' }}>
            {current ? (
              renderDetail ? (
                renderDetail(current)
              ) : (
                <>
                  <Typography variant="h5" gutterBottom>
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
          {detailLoading ? (
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : null}
        </Card>
      </Box>
    </Box>
  );
}
