import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

interface Props {
  message?: string;
}

export default function FullScreenLoader({ message }: Props) {
  return (
    <Box sx={{ position: 'fixed', inset: 0, zIndex: 14000, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper' }}>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress />
        {message ? <Typography sx={{ mt: 2 }}>{message}</Typography> : null}
      </Box>
    </Box>
  );
}
