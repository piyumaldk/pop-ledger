import React, { useEffect, useState } from 'react';
import ListDetailView from './ListDetailView';
import type { ParsedFile } from '../utils/contentLoader';
import { loadResources } from '../utils/contentLoader';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { auth } from '../firebase';
import firestoreApi from '../services/firestoreService';
import DetailChecklist from './DetailChecklist';
// Card-scoped loaders handled by ListDetailView; keep FullScreenLoader for global use in App

function toListItems(files: ParsedFile[]) {
  return files.map((f) => ({ id: f.id, title: f.title }));
}

function GameDetailView({ file, uid, gameId, onLoadingChange }: { file: ParsedFile; uid: string; gameId: string; onLoadingChange?: (l: boolean) => void }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Restore checked state from Firestore on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!uid || !gameId) {
          if (mounted) {
            setLoading(false);
            onLoadingChange?.(false);
          }
          return;
        }
        onLoadingChange?.(true);
        const data = await firestoreApi.getGame(uid, gameId);
        if (!mounted) return;
        
        if (!data) {
          // No data found - show unchecked list
          setChecked({});
          setLoading(false);
          onLoadingChange?.(false);
          return;
        }

        // Reconstruct checked map from stored index
        const next: Record<string, boolean> = {};
        let count = 0;
        for (let si = 0; si < file.sections.length; si++) {
          for (let ii = 0; ii < file.sections[si].items.length; ii++) {
            if (count <= data.index) {
              next[`${si}-${ii}`] = true;
            }
            count++;
          }
        }
        setChecked(next);
      } catch (err) {
        console.error('Failed to load game state', err);
        if (mounted) setChecked({});
      } finally {
        if (mounted) {
          setLoading(false);
          onLoadingChange?.(false);
        }
      }
    })();
    return () => { mounted = false };
  }, [uid, gameId, file.sections, onLoadingChange]);

  const toggle = async (key: string) => {
    const [siStr, iiStr] = key.split('-');
    const si = Number(siStr);
    const ii = Number(iiStr);
    
    // Calculate global index (flat list index across all sections)
    let globalIndex = 0;
    for (let s = 0; s < si; s++) {
      globalIndex += file.sections[s].items.length;
    }
    globalIndex += ii;

    const wasChecked = !!checked[key];

    setChecked((c) => {
      const next = { ...c };
      const currently = !!c[key];
      const sectionsCount = file.sections.length;

      if (!currently) {
        // checking: mark all items in all previous sections
        for (let s = 0; s < si; s++) {
          const len = (file.sections[s] && file.sections[s].items.length) || 0;
          for (let j = 0; j < len; j++) {
            next[`${s}-${j}`] = true;
          }
        }
        // mark this section items up to ii
        const thisLen = (file.sections[si] && file.sections[si].items.length) || (ii + 1);
        for (let j = 0; j <= Math.min(ii, thisLen - 1); j++) {
          next[`${si}-${j}`] = true;
        }
      } else {
        // unchecking: uncheck this item and all items in later sections
        const thisLen = (file.sections[si] && file.sections[si].items.length) || (ii + 1);
        for (let j = ii; j < thisLen; j++) {
          next[`${si}-${j}`] = false;
        }
        for (let s = si + 1; s < sectionsCount; s++) {
          const len = (file.sections[s] && file.sections[s].items.length) || 0;
          for (let j = 0; j < len; j++) {
            next[`${s}-${j}`] = false;
          }
        }
      }
      return next;
    });

    // Update Firestore
    try {
      if (!wasChecked) {
        // User just checked item at globalIndex
        await firestoreApi.setGame(uid, gameId, globalIndex);
      } else {
        // User just unchecked item at globalIndex
        // If globalIndex is 0 (first item), delete the game doc; otherwise update to globalIndex - 1
        if (globalIndex === 0) {
          await firestoreApi.deleteGame(uid, gameId);
        } else {
          await firestoreApi.setGame(uid, gameId, globalIndex - 1);
        }
      }
    } catch (err) {
      console.error('Failed to update Firestore', err);
    }
  };

  // don't unmount detail while loading; parent will show a card-level loader

  return <DetailChecklist file={file} checked={checked} onToggle={toggle} />;
}

function SeriesDetailView({ file, uid, seriesId, onLoadingChange }: { file: ParsedFile; uid: string; seriesId: string; onLoadingChange?: (l: boolean) => void }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Restore checked state from Firestore on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!uid || !seriesId) {
          if (mounted) {
            setLoading(false);
            onLoadingChange?.(false);
          }
          return;
        }
        onLoadingChange?.(true);
        const data = await firestoreApi.getSeries(uid, seriesId);
        if (!mounted) return;
        
        if (!data) {
          // No data found - show unchecked list
          setChecked({});
          setLoading(false);
          onLoadingChange?.(false);
          return;
        }

        // Reconstruct checked map from stored index
        const next: Record<string, boolean> = {};
        let count = 0;
        for (let si = 0; si < file.sections.length; si++) {
          for (let ii = 0; ii < file.sections[si].items.length; ii++) {
            if (count <= data.index) {
              next[`${si}-${ii}`] = true;
            }
            count++;
          }
        }
        setChecked(next);
      } catch (err) {
        console.error('Failed to load series state', err);
        if (mounted) setChecked({});
      } finally {
        if (mounted) {
          setLoading(false);
          onLoadingChange?.(false);
        }
      }
    })();
    return () => { mounted = false };
  }, [uid, seriesId, file.sections, onLoadingChange]);

  const toggle = async (key: string) => {
    const [siStr, iiStr] = key.split('-');
    const si = Number(siStr);
    const ii = Number(iiStr);
    
    // Calculate global index (flat list index across all sections)
    let globalIndex = 0;
    for (let s = 0; s < si; s++) {
      globalIndex += file.sections[s].items.length;
    }
    globalIndex += ii;

    const wasChecked = !!checked[key];

    setChecked((c) => {
      const next = { ...c };
      const currently = !!c[key];
      const sectionsCount = file.sections.length;

      if (!currently) {
        // checking: mark all items in all previous sections
        for (let s = 0; s < si; s++) {
          const len = (file.sections[s] && file.sections[s].items.length) || 0;
          for (let j = 0; j < len; j++) {
            next[`${s}-${j}`] = true;
          }
        }
        // mark this section items up to ii
        const thisLen = (file.sections[si] && file.sections[si].items.length) || (ii + 1);
        for (let j = 0; j <= Math.min(ii, thisLen - 1); j++) {
          next[`${si}-${j}`] = true;
        }
      } else {
        // unchecking: uncheck this item and all items in later sections
        const thisLen = (file.sections[si] && file.sections[si].items.length) || (ii + 1);
        for (let j = ii; j < thisLen; j++) {
          next[`${si}-${j}`] = false;
        }
        for (let s = si + 1; s < sectionsCount; s++) {
          const len = (file.sections[s] && file.sections[s].items.length) || 0;
          for (let j = 0; j < len; j++) {
            next[`${s}-${j}`] = false;
          }
        }
      }
      return next;
    });

    // Update Firestore
    try {
      if (!wasChecked) {
        // User just checked item at globalIndex
        await firestoreApi.setSeries(uid, seriesId, globalIndex);
      } else {
        // User just unchecked item at globalIndex
        // If globalIndex is 0 (first item), delete the series doc; otherwise update to globalIndex - 1
        if (globalIndex === 0) {
          await firestoreApi.deleteSeries(uid, seriesId);
        } else {
          await firestoreApi.setSeries(uid, seriesId, globalIndex - 1);
        }
      }
    } catch (err) {
      console.error('Failed to update Firestore', err);
    }
  };

  // don't unmount detail while loading; parent will show a card-level loader

  return <DetailChecklist file={file} checked={checked} onToggle={toggle} />;
}

export function GamesView() {
  const [files, setFiles] = useState<ParsedFile[]>([]);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [listAnimating, setListAnimating] = useState<boolean>(false);
  const uid = auth?.currentUser?.uid ?? '';

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [f, current] = await Promise.all([
          loadResources('games'),
          uid ? firestoreApi.getCurrent(uid) : Promise.resolve(null),
        ]);
        if (!mounted) return;
        setFiles(f);
        setCurrentGameId(current?.currentGame ?? null);
      } catch (err) {
        console.error('Failed to load games', err);
        if (mounted) setFiles([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [uid]);

  // Sort: current game first, then others ascending by title
  const sortedFiles = [...files].sort((a, b) => {
    if (a.id === currentGameId) return -1;
    if (b.id === currentGameId) return 1;
    return a.title.localeCompare(b.title);
  });
  const items = toListItems(sortedFiles);

  const handleSelect = async (gameId: string) => {
    if (!uid) return;
    try {
      // animate list while reordering
      setListAnimating(true);
      await firestoreApi.setCurrentGame(uid, gameId);
      setCurrentGameId(gameId);
      // keep animation briefly for the transition
      setTimeout(() => setListAnimating(false), 360);
    } catch (err) {
      console.error('Failed to set current game', err);
      setListAnimating(false);
    }
  };

  // don't unmount detail while loading; parent will show a card-level loader

  return (
    <ListDetailView
      title={"Games"}
      items={items}
      initialSelectedId={currentGameId ?? undefined}
      onSelect={handleSelect}
      detailLoading={loading || detailLoading}
      menuLoading={loading}
      listAnimating={listAnimating}
      renderDetail={(it) => {
        const file = files.find((f) => f.id === it.id);
        return file && uid ? <GameDetailView file={file} uid={uid} gameId={it.id} onLoadingChange={setDetailLoading} /> : <Typography color="text.secondary">No details available.</Typography>;
      }}
    />
  );
}

export function SeriesView() {
  const [files, setFiles] = useState<ParsedFile[]>([]);
  const [currentSeriesId, setCurrentSeriesId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [listAnimating, setListAnimating] = useState<boolean>(false);
  const uid = auth?.currentUser?.uid ?? '';

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [f, current] = await Promise.all([
          loadResources('series'),
          uid ? firestoreApi.getCurrent(uid) : Promise.resolve(null),
        ]);
        if (!mounted) return;
        setFiles(f);
        setCurrentSeriesId(current?.currentSeries ?? null);
      } catch (err) {
        console.error('Failed to load series', err);
        if (mounted) setFiles([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [uid]);

  // Sort: current series first, then others ascending by title
  const sortedFiles = [...files].sort((a, b) => {
    if (a.id === currentSeriesId) return -1;
    if (b.id === currentSeriesId) return 1;
    return a.title.localeCompare(b.title);
  });
  const items = toListItems(sortedFiles);

  const handleSelect = async (seriesId: string) => {
    if (!uid) return;
    try {
      setListAnimating(true);
      await firestoreApi.setCurrentSeries(uid, seriesId);
      setCurrentSeriesId(seriesId);
      setTimeout(() => setListAnimating(false), 360);
    } catch (err) {
      console.error('Failed to set current series', err);
      setListAnimating(false);
    }
  };

  // don't unmount detail while loading; parent will show a card-level loader

  return (
    <ListDetailView
      title={"Series"}
      items={items}
      initialSelectedId={currentSeriesId ?? undefined}
      onSelect={handleSelect}
      detailLoading={loading || detailLoading}
      menuLoading={loading}
      listAnimating={listAnimating}
      renderDetail={(it) => {
        const file = files.find((f) => f.id === it.id);
        return file && uid ? <SeriesDetailView file={file} uid={uid} seriesId={it.id} onLoadingChange={setDetailLoading} /> : <Typography color="text.secondary">No details available.</Typography>;
      }}
    />
  );
}
