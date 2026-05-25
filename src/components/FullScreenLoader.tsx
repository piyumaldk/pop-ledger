import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';

interface Props {
  message?: string;
}

export default function FullScreenLoader({ message }: Props) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  return (
    <Box sx={{
      position: 'fixed', inset: 0, zIndex: 14000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      bgcolor: 'background.default',
      backgroundImage: mode === 'dark'
        ? 'radial-gradient(circle, rgba(34,211,238,0.07) 1px, transparent 1px)'
        : 'radial-gradient(circle, rgba(8,145,178,0.06) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    }}>
      {/* Orb glow */}
      <Box sx={{
        position: 'absolute',
        width: 400, height: 400, borderRadius: '50%',
        background: mode === 'dark'
          ? 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(8,145,178,0.1) 0%, transparent 70%)',
        animation: 'floatOrb1 8s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            size={56}
            thickness={3}
            sx={{
              color: 'primary.main',
              filter: `drop-shadow(0 0 8px ${alpha(theme.palette.primary.main, 0.5)})`,
            }}
          />
          <CircularProgress
            variant="determinate"
            value={100}
            size={56}
            thickness={3}
            sx={{ color: alpha(theme.palette.primary.main, 0.08), position: 'absolute', top: 0, left: 0 }}
          />
        </Box>
        {message && (
          <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', fontWeight: 500 }}>{message}</Typography>
        )}
      </Box>
    </Box>
  );
}
