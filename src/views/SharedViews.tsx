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

function toListItems(files: ParsedFile[]) {
  return files.map((f) => ({ id: f.id, title: f.title }));
}

function DetailView({ file }: { file: ParsedFile }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    const [siStr, iiStr] = key.split('-');
    const si = Number(siStr);
    const ii = Number(iiStr);
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
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>{file.title}</Typography>
      {file.sections.map((section, si) => (
        <Box key={si} sx={{ mb: 2 }}>
          {section.header && (
            <Typography variant="subtitle1" sx={{ mb: 1 }}>{section.header}</Typography>
          )}
          <List>
            {section.items.map((it, ii) => {
              const key = `${si}-${ii}`;
              return (
                <ListItem key={key} disablePadding>
                  <ListItemIcon>
                    <Checkbox edge="start" checked={!!checked[key]} onChange={() => toggle(key)} />
                  </ListItemIcon>
                  <ListItemText primary={it} />
                </ListItem>
              );
            })}
          </List>
          <Divider />
        </Box>
      ))}
    </Box>
  );
}

export function GamesView() {
  const [files, setFiles] = useState<ParsedFile[]>([]);

  useEffect(() => {
    let mounted = true;
    loadResources('games')
      .then((f) => { if (!mounted) return; setFiles(f); })
      .catch(() => { if (!mounted) return; setFiles([]); });
    return () => { mounted = false };
  }, []);

  const items = toListItems(files);

  return (
    <ListDetailView
      title={"Games"}
      items={items}
      renderDetail={(it) => {
        const file = files.find((f) => f.id === it.id);
        return file ? <DetailView file={file} /> : <Typography color="text.secondary">No details available.</Typography>;
      }}
    />
  );
}

export function SeriesView() {
  const [files, setFiles] = useState<ParsedFile[]>([]);

  useEffect(() => {
    let mounted = true;
    loadResources('series')
      .then((f) => { if (!mounted) return; setFiles(f); })
      .catch(() => { if (!mounted) return; setFiles([]); });
    return () => { mounted = false };
  }, []);

  const items = toListItems(files);

  return (
    <ListDetailView
      title={"Series"}
      items={items}
      renderDetail={(it) => {
        const file = files.find((f) => f.id === it.id);
        return file ? <DetailView file={file} /> : <Typography color="text.secondary">No details available.</Typography>;
      }}
    />
  );
}
