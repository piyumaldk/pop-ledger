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
    setChecked((c) => ({ ...c, [key]: !c[key] }));
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
