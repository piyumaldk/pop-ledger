import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme, alpha } from '@mui/material/styles';

export default function CardLoader() {
  const theme = useTheme();
  return (
    <Box sx={{
      position: 'absolute', inset: 0, zIndex: 1300,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      bgcolor: theme.palette.mode === 'dark' ? 'rgba(15,23,42,0.75)' : 'rgba(255,255,255,0.75)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      borderRadius: 'inherit',
    }}>
      <CircularProgress
        size={40}
        thickness={3}
        sx={{ color: 'primary.main', filter: `drop-shadow(0 0 6px ${alpha(theme.palette.primary.main, 0.4)})` }}
      />
    </Box>
  );
}
