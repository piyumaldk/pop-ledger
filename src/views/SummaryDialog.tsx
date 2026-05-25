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

export default function SummaryDialog({ open, onClose, onNavigate }: { open: boolean; onClose: () => void; onNavigate: (page: 'games' | 'series', id?: string) => void }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(false);
  const [ongoingSeries, setOngoingSeries] = useState<Item[]>([]);
  const [ongoingGames, setOngoingGames] = useState<Item[]>([]);
  const [completedSeries, setCompletedSeries] = useState<Item[]>([]);
  const [completedGames, setCompletedGames] = useState<Item[]>([]);

  // No determinate progress UI; fetching is parallelized for speed

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

          const filesToProcess = files.filter((f) => {
            const total = f.sections.reduce((sacc, s) => sacc + s.items.length, 0);
            return total > 0;
          });

          // Run all file progress fetches in parallel and update progress as each finishes
          const promises = filesToProcess.map((f) => (async () => {
            const total = f.sections.reduce((sacc, s) => sacc + s.items.length, 0);
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

          })());

          await Promise.all(promises);

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
      <DialogTitle sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid', borderColor: 'divider', pb: 2,
      }}>
        <Typography sx={{
          fontWeight: 700, fontSize: '1.1rem',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, #22d3ee, #a78bfa)'
            : 'linear-gradient(90deg, #0891b2, #7c3aed)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>Your Summary</Typography>
        <IconButton onClick={onClose} aria-label="close" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: '32px !important' }}>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 7, gap: 2 }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress size={52} thickness={3} color="primary" sx={{ filter: `drop-shadow(0 0 8px ${theme.palette.primary.main})` }} />
              <CircularProgress variant="determinate" value={100} size={52} thickness={3} sx={{ color: 'rgba(34,211,238,0.08)', position: 'absolute', top: 0, left: 0 }} />
            </Box>
            <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>Personalizing the summary just for you</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>This may take a few moments depending on your library size.</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {/* Series Section */}
            <Box>
              <SectionHeader label="On Going Series" />
              {ongoingSeries.length ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {ongoingSeries.map((it) => (
                    <Chip key={it.id} label={`${it.title}  ${it.percent}%`} color="primary" clickable variant="outlined"
                      sx={{ borderColor: 'primary.main', fontWeight: 500, '&:hover': { bgcolor: 'rgba(34,211,238,0.08)' } }}
                      onClick={() => { onClose(); onNavigate('series', it.id); }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>No ongoing series found.</Typography>
              )}
              <Box sx={{ mt: 3 }}>
                <SectionHeader label="Completed Series" completed />
                {completedSeries.length ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {completedSeries.map((it) => (
                      <Chip key={it.id} label={it.title} clickable color="primary" icon={<CheckIcon />} variant="outlined"
                        sx={{ borderColor: 'primary.main', '& .MuiChip-label': { color: 'primary.main' }, fontWeight: 500, '&:hover': { bgcolor: 'rgba(34,211,238,0.08)' } }}
                        onClick={() => { onClose(); onNavigate('series', it.id); }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>No completed series found.</Typography>
                )}
              </Box>
            </Box>

            {/* Divider */}
            <Divider sx={{ opacity: 0.4 }} />

            {/* Games Section */}
            <Box>
              <SectionHeader label="On Going Games" />
              {ongoingGames.length ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {ongoingGames.map((it) => (
                    <Chip key={it.id} label={`${it.title}  ${it.percent}%`} clickable color="primary" variant="outlined"
                      sx={{ borderColor: 'primary.main', fontWeight: 500, '&:hover': { bgcolor: 'rgba(34,211,238,0.08)' } }}
                      onClick={() => { onClose(); onNavigate('games', it.id); }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>No ongoing games found.</Typography>
              )}
              <Box sx={{ mt: 3 }}>
                <SectionHeader label="Completed Games" completed />
                {completedGames.length ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {completedGames.map((it) => (
                      <Chip key={it.id} label={it.title} clickable color="primary" icon={<CheckIcon />} variant="outlined"
                        sx={{ borderColor: 'primary.main', '& .MuiChip-label': { color: 'primary.main' }, fontWeight: 500, '&:hover': { bgcolor: 'rgba(34,211,238,0.08)' } }}
                        onClick={() => { onClose(); onNavigate('games', it.id); }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>No completed games found.</Typography>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SectionHeader({ label, completed }: { label: string; completed?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
      <Box sx={{
        width: 8, height: 8, borderRadius: '50%',
        bgcolor: completed ? '#22c55e' : 'primary.main',
        boxShadow: completed ? '0 0 6px rgba(34,197,94,0.5)' : '0 0 6px rgba(34,211,238,0.5)',
      }} />
      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.04em', color: 'text.primary' }}>{label}</Typography>
    </Box>
  );
}
