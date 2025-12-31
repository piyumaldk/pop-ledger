import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MovieIcon from '@mui/icons-material/Movie';
import SummarizeIcon from '@mui/icons-material/Summarize';
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body1">
            <strong>PoPLedger</strong> is an open-source project to help you track TV series and video games progress.
          </Typography>
          <Typography variant="body1">
            The project was initiated by <a href="https://github.com/piyumaldk" target="_blank" rel="noopener noreferrer">Piyumal Kularathna</a> and the source code is available on <a href="https://github.com/piyumaldk/pop-ledger" target="_blank" rel="noopener noreferrer">GitHub</a>.
          </Typography>
          <Typography variant="body1">
            Contributions are welcome — please consider raising issues, adding new lists, or contributing code. Your feedback and contributions are appreciated!
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
