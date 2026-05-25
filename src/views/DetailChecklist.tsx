import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
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
    minHeight: { xs: 72, md: 68 },
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    zIndex: (theme: any) => theme.zIndex.appBar - 1,
    background: scrolled
      ? (theme.palette.mode === 'dark' ? 'rgba(15,23,42,0.96)' : 'rgba(255,255,255,0.96)')
      : (theme.palette.mode === 'dark' ? 'rgba(15,23,42,0.7)' : 'rgba(255,255,255,0.8)'),
    backdropFilter: scrolled ? 'blur(16px)' : 'blur(8px)',
    WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'blur(8px)',
    px: 2.5,
    transition: 'all 0.25s ease',
    borderBottom: scrolled ? `1px solid ${alpha(theme.palette.primary.main, 0.15)}` : '1px solid transparent',
    boxShadow: scrolled ? `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}` : 'none',
  } as const;

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      {/* Fixed header */}
      <Box ref={headerRef} sx={headerSx}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h5" sx={{
            fontWeight: 700, mb: 0, wordBreak: 'break-word', whiteSpace: 'normal',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #67e8f9 0%, #22d3ee 60%, #a78bfa 100%)'
              : 'linear-gradient(135deg, #0891b2 0%, #0284c7 60%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: { xs: '1.15rem', md: '1.35rem' },
          }}>{file.title}</Typography>
        </Box>
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
          {loading ? (
            <Box sx={{ width: 52, height: 52, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{
                width: 52, height: 52, borderRadius: '50%',
                border: `3px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                borderTopColor: theme.palette.primary.main,
                animation: 'spinLoader 0.8s linear infinite',
                position: 'absolute',
              }} />
              <HourglassTopIcon sx={{ color: 'primary.main', fontSize: 20, animation: 'subtlePulse 1.5s ease infinite' }} />
            </Box>
          ) : (
            <Box sx={{ width: 52, height: 52, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress
                variant="determinate"
                value={percent}
                size={52}
                thickness={3.5}
                sx={{
                  color: percent >= 100 ? '#22c55e' : 'primary.main',
                  filter: percent >= 100
                    ? 'drop-shadow(0 0 6px rgba(34,197,94,0.5))'
                    : `drop-shadow(0 0 6px ${alpha(theme.palette.primary.main, 0.5)})`,
                }}
              />
              <CircularProgress
                variant="determinate"
                value={100}
                size={52}
                thickness={3.5}
                sx={{ color: alpha(theme.palette.primary.main, 0.1), position: 'absolute', top: 0, left: 0 }}
              />
              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontWeight: 700, lineHeight: 1, fontSize: '0.78rem', color: percent >= 100 ? '#22c55e' : 'primary.main' }}>{percent}%</Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Scrollable list area */}
      <Box ref={scrollRef} sx={{
        position: 'absolute', top: headerHeight, left: 0, right: 0, bottom: 0,
        overflowY: 'auto', px: 2.5, pt: 2,
        '&::-webkit-scrollbar': { width: 6 },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { backgroundColor: alpha(theme.palette.primary.main, 0.35), borderRadius: 8, '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.6) } },
        scrollbarColor: `${alpha(theme.palette.primary.main, 0.35)} transparent`,
        scrollbarWidth: 'thin',
      }}>
        {file.sections.map((section, si) => (
          <Box key={si} sx={{ mb: 3 }}>
            {section.header && (
              <Box sx={{ mb: 1.5, pb: 0.75, borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`, display: 'inline-block', width: '100%' }}>
                <Typography sx={{
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(90deg, #22d3ee, #a78bfa)'
                    : 'linear-gradient(90deg, #0891b2, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>{section.header}</Typography>
              </Box>
            )}
            <List dense disablePadding>
              {section.items.map((it, ii) => {
                const key = `${si}-${ii}`;
                const isChecked = !!checked[key];
                return (
                  <ListItem key={key} disablePadding sx={{
                    py: 0.125,
                    borderRadius: 2,
                    transition: 'background 0.15s ease',
                    '&:hover': { background: alpha(theme.palette.primary.main, 0.06) },
                  }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Checkbox
                        size="small"
                        edge="start"
                        checked={isChecked}
                        onChange={() => onToggle(key)}
                        sx={{
                          color: alpha(theme.palette.primary.main, 0.4),
                          '&.Mui-checked': { color: 'primary.main' },
                          padding: '4px',
                          transition: 'transform 0.15s ease, color 0.15s ease',
                          '&:hover': { transform: 'scale(1.15)' },
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={it}
                      primaryTypographyProps={{
                        sx: {
                          fontSize: '0.875rem',
                          color: isChecked ? alpha(theme.palette.text.primary, 0.45) : 'text.primary',
                          textDecoration: isChecked ? 'line-through' : 'none',
                          transition: 'color 0.2s ease, text-decoration 0.2s ease',
                          lineHeight: 1.5,
                        },
                      }}
                    />
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
