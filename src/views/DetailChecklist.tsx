import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
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
  loading?: boolean;
}

export default function DetailChecklist({ file, checked, onToggle, loading }: Props) {
  // compute total and checked counts
  let total = 0;
  for (const s of file.sections) total += s.items.length;
  let checkedCount = 0;
  for (const k of Object.keys(checked)) if (checked[k]) checkedCount++;
  const percent = total === 0 ? 0 : Math.round((checkedCount / total) * 100);

  const theme = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Track header size so the scrollable area can be positioned below it dynamically
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(72);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 0);
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const measure = () => setHeaderHeight(el.offsetHeight || 72);
    measure();

    if ((window as any).ResizeObserver) {
      const ro = new (window as any).ResizeObserver(measure);
      ro.observe(el);
      window.addEventListener('resize', measure);
      return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
    }

    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [file.title]);

  const headerSx = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    // Allow header to grow with content but provide a comfortable minimum height
    minHeight: { xs: 72, md: 64 },
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    zIndex: (theme: any) => theme.zIndex.appBar - 1,
    backgroundColor: 'background.paper',
    px: 2,
    boxShadow: scrolled ? `0 6px 14px ${alpha(theme.palette.primary.main, 0.12)}` : 'none',
  } as const;

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      {/* Fixed header: use a fixed height so scroll area below can be calculated */}
      <Box ref={headerRef} sx={headerSx}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 700, mb: 0, wordBreak: 'break-word', whiteSpace: 'normal' }}>{file.title}</Typography>
        </Box>
        <Box sx={{ width: 48, height: 48, position: 'relative' }} aria-hidden>
          {loading ? (
            <>
              <CircularProgress size={48} color="primary" />
              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HourglassTopIcon color="primary" sx={{ fontSize: 20 }} />
              </Box>
            </>
          ) : (
            <>
              <CircularProgress variant="determinate" value={percent} size={48} color="primary" />
              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1 }}>{percent}%</Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Scrollable list area implemented as absolute box below the fixed header */}
      <Box ref={scrollRef} sx={{ position: 'absolute', top: headerHeight, left: 0, right: 0, bottom: 0, overflowY: 'auto', px: 2, pt: 2, backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'transparent' : 'transparent'), '&::-webkit-scrollbar': { width: 10 }, '&::-webkit-scrollbar-thumb': { backgroundColor: theme.palette.primary.main, borderRadius: 8 }, scrollbarColor: `${theme.palette.primary.main} transparent`, scrollbarWidth: 'thin' }}>
        {file.sections.map((section, si) => (
          <Box key={si} sx={{ mb: 2 }}>
            {section.header && (
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>{section.header}</Typography>
            )}
            <Divider />
            <List dense>
              {section.items.map((it, ii) => {
                const key = `${si}-${ii}`;
                return (
                  <ListItem key={key} disablePadding sx={{ py: 0 }}>
                    <ListItemIcon>
                      <Checkbox size="small" edge="start" checked={!!checked[key]} onChange={() => onToggle(key)} />
                    </ListItemIcon>
                    <ListItemText primary={it} primaryTypographyProps={{ sx: { color: 'primary.main' } }} />
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
