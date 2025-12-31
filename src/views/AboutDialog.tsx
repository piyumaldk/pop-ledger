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

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">About PoPLedger</Typography>
        <IconButton onClick={onClose} aria-label="close"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ position: 'relative' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', textAlign: 'center', px: { xs: 2, md: 6 }, py: { xs: 2, md: 4 } }}>
          <Typography variant="h5" sx={{ fontFamily: "'Pacifico', 'Brush Script MT', cursive", color: 'primary.main', fontWeight: 700 }}>
            PoPLedger
          </Typography>

          <Typography variant="body1" sx={{ maxWidth: 680, color: 'secondary.main' }}>
            PoPLedger is an open-source project to help you track TV series and video games progress.
          </Typography>

          <Typography variant="body1" sx={{ maxWidth: 680, color: 'secondary.main' }}>
            The project was initiated by <a href="https://github.com/piyumaldk" target="_blank" rel="noopener noreferrer" style={{ color: theme.palette.primary.main, fontWeight: 700 }}>Piyumal Kularathna</a> and the source code is available on <a href="https://github.com/piyumaldk/pop-ledger" target="_blank" rel="noopener noreferrer" style={{ color: theme.palette.primary.main, fontWeight: 700 }}>GitHub</a> <GitHubIcon sx={{ fontSize: 18, verticalAlign: 'middle', ml: 0.5, color: 'primary.main' }} />.
          </Typography>

          <Typography variant="body1" sx={{ maxWidth: 680, color: 'secondary.main' }}>
            Contributions are welcome — please consider raising issues, adding new lists, or contributing code. Your feedback and contributions are appreciated!
          </Typography>

          <Typography variant="caption" color="secondary.main" sx={{ mt: 1 }}>
            Thank you for checking it out — contributions are warmly appreciated.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
