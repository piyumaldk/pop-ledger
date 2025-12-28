#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

async function countFiles(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    let count = 0;
    for (const ent of entries) {
      if (ent.isFile()) count += 1;
    }
    return count;
  } catch (e) {
    return 0;
  }
}

async function main() {
  const root = path.resolve(process.cwd());
  const gamesDir = path.join(root, 'resources', 'games');
  const seriesDir = path.join(root, 'resources', 'series');
  const outPath = path.join(root, 'public', 'resources-count.json');

  const games = await countFiles(gamesDir);
  const series = await countFiles(seriesDir);

  const payload = { games, series };
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log('Wrote', outPath, payload);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
