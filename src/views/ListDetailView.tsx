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

export type ListItem = { id: string; title: string; desc?: string };

interface Props<T extends ListItem> {
  title: string;
  items: T[];
  initialSelectedId?: string;
  renderDetail?: (item: T) => React.ReactNode;
}

export default function ListDetailView<T extends ListItem>({
  title,
  items,
  initialSelectedId,
  renderDetail,
}: Props<T>) {
  const [selected, setSelected] = useState<string>(initialSelectedId ?? (items[0]?.id ?? ''));
  const current = items.find((i) => i.id === selected) ?? items[0];

  return (
    <Grid container spacing={2} sx={{ height: 'calc(100vh - 144px)', py: 3 }}>
      <Grid item xs={12} md={3}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardContent>
            <Typography variant="h6">{title}</Typography>
          </CardContent>
          <Divider />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {items.map((it) => (
                <ListItemButton key={it.id} selected={it.id === selected} onClick={() => setSelected(it.id)}>
                  <ListItemText primary={it.title} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} md={9}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
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
        </Card>
      </Grid>
    </Grid>
  );
}
