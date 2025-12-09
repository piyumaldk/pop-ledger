import React from 'react';
import ListDetailView, { ListItem } from './ListDetailView';

const SAMPLE_GAMES: ListItem[] = [
  { id: 'g1', title: 'Tetris', desc: 'A falling blocks classic.' },
  { id: 'g2', title: 'Pac-Man', desc: 'Gobble pellets and avoid ghosts.' },
  { id: 'g3', title: 'Chess', desc: 'Strategic board game for two players.' },
  { id: 'g4', title: 'Sudoku', desc: 'Number puzzle to train the brain.' },
  { id: 'g5', title: 'Mario', desc: 'Platformer adventure.' },
];

const SAMPLE_SERIES: ListItem[] = [
  { id: 's1', title: 'Stranger Things', desc: 'A science fiction-horror series.' },
  { id: 's2', title: 'Breaking Bad', desc: 'A chemistry teacher becomes meth kingpin.' },
  { id: 's3', title: 'The Crown', desc: 'Historical drama about the British monarchy.' },
  { id: 's4', title: 'Friends', desc: 'Sitcom about six friends in NYC.' },
  { id: 's5', title: 'Dark', desc: 'German sci-fi thriller.' },
];

export function GamesView() {
  return <ListDetailView title="Games" items={SAMPLE_GAMES} />;
}

export function SeriesView() {
  return <ListDetailView title="Series" items={SAMPLE_SERIES} />;
}
