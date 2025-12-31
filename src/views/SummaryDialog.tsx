import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CheckIcon from '@mui/icons-material/Check';
import { loadResources, ParsedFile } from '../utils/contentLoader';
import firestoreApi from '../services/firestoreService';
import { auth } from '../firebase';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

type Item = { id: string; title: string; percent?: number };

export default function SummaryDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(false);
  const [ongoingSeries, setOngoingSeries] = useState<Item[]>([]);
  const [ongoingGames, setOngoingGames] = useState<Item[]>([]);
  const [completedSeries, setCompletedSeries] = useState<Item[]>([]);
  const [completedGames, setCompletedGames] = useState<Item[]>([]);

  useEffect(() => {
    let mounted = true;
    if (!open) return;

    (async () => {
      setLoading(true);
      setOngoingGames([]);
      setOngoingSeries([]);
      setCompletedGames([]);
      setCompletedSeries([]);

      try {
        const uid = auth?.currentUser?.uid ?? '';
        if (!uid) {
          // nothing to do
          if (mounted) setLoading(false);
          return;
        }

        const [gamesFiles, seriesFiles] = await Promise.all([loadResources('games'), loadResources('series')]);

        const processFiles = async (files: ParsedFile[], kind: 'games' | 'series') => {
          const ongoing: Item[] = [];
          const completed: Item[] = [];

          for (const f of files) {
            // calculate total items
            let total = 0;
            for (const s of f.sections) total += s.items.length;
            if (total === 0) continue;

            let data: any = null;
            try {
              data = kind === 'games' ? await firestoreApi.getGame(uid, f.id) : await firestoreApi.getSeries(uid, f.id);
            } catch (err) {
              console.error('Failed to load user progress for', f.id, err);
            }

            const percent = data ? Math.round(((Number(data.index) + 1) / total) * 100) : 0;

            if (percent >= 100) {
              completed.push({ id: f.id, title: f.title });
            } else if (percent > 0) {
              ongoing.push({ id: f.id, title: f.title, percent });
            }
          }

          return { ongoing, completed };
        };

        const [gamesRes, seriesRes] = await Promise.all([processFiles(gamesFiles, 'games'), processFiles(seriesFiles, 'series')]);

        if (!mounted) return;
        setOngoingGames(gamesRes.ongoing.sort((a, b) => (b.percent ?? 0) - (a.percent ?? 0)));
        setOngoingSeries(seriesRes.ongoing.sort((a, b) => (b.percent ?? 0) - (a.percent ?? 0)));
        setCompletedGames(gamesRes.completed.sort((a, b) => a.title.localeCompare(b.title)));
        setCompletedSeries(seriesRes.completed.sort((a, b) => a.title.localeCompare(b.title)));
      } catch (err) {
        console.error('Failed to build summary', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false };
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Your Summary</Typography>
        <IconButton onClick={onClose} aria-label="close"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={56} color="primary" />
            <Typography sx={{ mt: 2 }} variant="subtitle1">Personalizing the summary just for you</Typography>
            <Typography sx={{ mt: 1, color: 'text.secondary' }} variant="body2">This may take a few moments depending on your library size.</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>On Going Series</Typography>
              <Divider sx={{ mb: 1 }} />
              {ongoingSeries.length ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {ongoingSeries.map((it) => (
                    <Chip key={it.id} label={`${it.title} | ${it.percent}%`} color="primary" variant="outlined" sx={{ borderColor: 'primary.main' }} />
                  ))}
                </Box>
              ) : (
                <Typography color="primary">No ongoing series found.</Typography>
              )}

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Completed Series</Typography>
                <Divider sx={{ mb: 1 }} />
                {completedSeries.length ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {completedSeries.map((it) => (
                      <Chip key={it.id} label={it.title} icon={<CheckIcon sx={{ color: 'primary.main' }} />} variant="outlined" sx={{ borderColor: 'primary.main', '& .MuiChip-label': { color: 'primary.main' } }} />
                    ))}
                  </Box>
                ) : (
                  <Typography color="primary">No completed series found.</Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>On Going Games</Typography>
              <Divider sx={{ mb: 1 }} />
              {ongoingGames.length ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {ongoingGames.map((it) => (
                    <Chip key={it.id} label={`${it.title} | ${it.percent}%`} color="primary" variant="outlined" sx={{ borderColor: 'primary.main' }} />
                  ))}
                </Box>
              ) : (
                <Typography color="primary">No ongoing games found.</Typography>
              )}

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Completed Games</Typography>
                <Divider sx={{ mb: 1 }} />
                {completedGames.length ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {completedGames.map((it) => (
                      <Chip key={it.id} label={it.title} icon={<CheckIcon sx={{ color: 'primary.main' }} />} variant="outlined" sx={{ borderColor: 'primary.main', '& .MuiChip-label': { color: 'primary.main' } }} />
                    ))}
                  </Box>
                ) : (
                  <Typography color="primary">No completed games found.</Typography>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
