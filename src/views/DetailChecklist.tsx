import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import type { ParsedFile } from '../utils/contentLoader';

interface Props {
  file: ParsedFile;
  checked: Record<string, boolean>;
  onToggle: (key: string) => void;
}

export default function DetailChecklist({ file, checked, onToggle }: Props) {
  // compute total and checked counts
  let total = 0;
  for (const s of file.sections) total += s.items.length;
  let checkedCount = 0;
  for (const k of Object.keys(checked)) if (checked[k]) checkedCount++;
  const percent = total === 0 ? 0 : Math.round((checkedCount / total) * 100);

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 700 }}>{file.title}</Typography>
      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ position: 'relative', width: 48, height: 48 }} aria-hidden>
          <CircularProgress variant="determinate" value={percent} size={48} color="primary" />
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1 }}>{percent}%</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: 2 }} />
      {file.sections.map((section, si) => (
        <Box key={si} sx={{ mb: 2 }}>
          {section.header && (
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>{section.header}</Typography>
          )}
          <Divider />
          <List>
            {section.items.map((it, ii) => {
              const key = `${si}-${ii}`;
              return (
                <ListItem key={key} disablePadding>
                  <ListItemIcon>
                    <Checkbox edge="start" checked={!!checked[key]} onChange={() => onToggle(key)} />
                  </ListItemIcon>
                  <ListItemText primary={it} primaryTypographyProps={{ sx: { color: 'primary.main' } }} />
                </ListItem>
              );
            })}
          </List>
        </Box>
      ))}
    </Box>
  );
}
