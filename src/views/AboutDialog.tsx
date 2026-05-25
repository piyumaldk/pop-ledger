import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function AboutDialog({ open, onClose, onNavigate, onOpenSummary }: { open: boolean; onClose: () => void; onNavigate: (page: 'games' | 'series') => void; onOpenSummary: () => void }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const mode = theme.palette.mode;

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} maxWidth="sm" fullWidth>
      <DialogTitle sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid', borderColor: 'divider', pb: 2,
      }}>
        <Typography sx={{
          fontWeight: 700, fontSize: '1.1rem',
          background: mode === 'dark'
            ? 'linear-gradient(90deg, #22d3ee, #a78bfa)'
            : 'linear-gradient(90deg, #0891b2, #7c3aed)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>About PoPLedger</Typography>
        <IconButton onClick={onClose} aria-label="close" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', textAlign: 'center', px: { xs: 1, md: 3 }, py: { xs: 1, md: 2 } }}>

          {/* Logo mark */}
          <Box sx={{
            width: 64, height: 64, borderRadius: 3,
            background: mode === 'dark'
              ? 'linear-gradient(135deg, rgba(34,211,238,0.2) 0%, rgba(139,92,246,0.15) 100%)'
              : 'linear-gradient(135deg, rgba(8,145,178,0.15) 0%, rgba(124,58,237,0.1) 100%)',
            border: mode === 'dark' ? '1px solid rgba(34,211,238,0.25)' : '1px solid rgba(8,145,178,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography sx={{
              fontFamily: "'Pacifico', 'Brush Script MT', cursive",
              fontSize: '1.4rem',
              background: mode === 'dark'
                ? 'linear-gradient(135deg, #22d3ee, #a78bfa)'
                : 'linear-gradient(135deg, #0891b2, #7c3aed)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>P</Typography>
          </Box>

          <Typography sx={{
            fontFamily: "'Pacifico', 'Brush Script MT', cursive",
            fontSize: '2rem',
            background: mode === 'dark'
              ? 'linear-gradient(135deg, #67e8f9 0%, #22d3ee 50%, #a78bfa 100%)'
              : 'linear-gradient(135deg, #0891b2 0%, #0284c7 50%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            PoPLedger
          </Typography>

          <Typography sx={{ maxWidth: 520, color: 'text.secondary', lineHeight: 1.7 }}>
            PoPLedger is an open-source project to help you track TV series and video games progress — beautifully.
          </Typography>

          <Typography sx={{ maxWidth: 520, color: 'text.secondary', lineHeight: 1.7 }}>
            Initiated by{' '}
            <Box component="a" href="https://github.com/piyumaldk" target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Piyumal Kularathna
            </Box>
            {' '}— source code available on{' '}
            <Box component="a" href="https://github.com/piyumaldk/pop-ledger" target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              GitHub
            </Box>
            {' '}<GitHubIcon sx={{ fontSize: 16, verticalAlign: 'middle', ml: 0.25, color: 'primary.main' }} />.
          </Typography>

          <Typography sx={{ maxWidth: 520, color: 'text.secondary', lineHeight: 1.7 }}>
            Contributions are welcome — raise issues, add new lists, or contribute code. Your feedback is warmly appreciated!
          </Typography>

          {/* GitHub CTA */}
          <Box
            component="a"
            href="https://github.com/piyumaldk/pop-ledger"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              px: 2.5, py: 1, borderRadius: 2.5,
              border: mode === 'dark' ? '1px solid rgba(34,211,238,0.25)' : '1px solid rgba(8,145,178,0.25)',
              color: 'primary.main',
              textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem',
              background: mode === 'dark' ? 'rgba(34,211,238,0.06)' : 'rgba(8,145,178,0.05)',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: mode === 'dark' ? 'rgba(34,211,238,0.12)' : 'rgba(8,145,178,0.1)',
                borderColor: 'primary.main',
                transform: 'translateY(-1px)',
              },
            }}
          >
            <GitHubIcon sx={{ fontSize: 18 }} />
            Star on GitHub
          </Box>

          <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.6 }}>
            Thank you for checking it out — contributions are warmly appreciated.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
