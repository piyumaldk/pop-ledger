/* Content loader — bundles raw .txt files from repository `resources` folder using Vite's import.meta.glob
   Exports a helper to load all files under `resources/games` or `resources/series` and parse them into
   { id, title, sections } where sections = [{ header?: string, items: string[] }].
*/

export type ParsedSection = { header?: string; items: string[] };
export type ParsedFile = { id: string; title: string; sections: ParsedSection[]; raw: string };

function parseText(raw: string, fallbackTitle: string): ParsedFile {
  const lines = raw.split(/\r?\n/).map((l) => l.replace(/\r$/, ''));
  let title = fallbackTitle;
  const sections: ParsedSection[] = [];

  // Find first header line starting with '# '
  let i = 0;
  for (; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.startsWith('#')) {
      title = line.replace(/^#+\s*/, '').trim() || fallbackTitle;
      i++;
      break;
    }
    // if first non-empty line isn't a '#', treat it as title
    title = line;
    i++;
    break;
  }

  let current: ParsedSection | null = { header: undefined, items: [] };

  for (; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith('#')) {
      // top-level header inside file — start a new unnamed section
      if (current && (current.items.length || current.header)) sections.push(current);
      current = { header: line.replace(/^#+\s*/, '').trim(), items: [] };
    } else if (line.startsWith('-')) {
      const text = line.replace(/^-\s*/, '').trim();
      if (!current) current = { header: undefined, items: [] };
      current.items.push(text);
    } else {
      // subheader (non '-' and non '#')
      if (current && (current.items.length || current.header)) sections.push(current);
      current = { header: line, items: [] };
    }
  }

  if (current && (current.items.length || current.header)) sections.push(current);

  return { id: fallbackTitle, title, sections, raw };
}

export async function loadResources(kind: 'games' | 'series'): Promise<ParsedFile[]> {
  // Vite requires a static string literal for import.meta.glob.
  // Provide two static globs and pick the right one based on `kind`.
  // @ts-ignore - import.meta.glob types are provided by Vite at build time
  const modulesGames = import.meta.glob('../../resources/games/*.txt', { as: 'raw' }) as Record<string, () => Promise<string>>;
  // @ts-ignore
  const modulesSeries = import.meta.glob('../../resources/series/*.txt', { as: 'raw' }) as Record<string, () => Promise<string>>;

  const modules = kind === 'games' ? modulesGames : modulesSeries;

  const entries = Object.entries(modules);
  if (!entries.length) return [];

  const loaded = await Promise.all(
    entries.map(async ([path, loader]) => {
      const raw = await loader();
      const name = path.split('/').pop()?.replace(/\.txt$/i, '') ?? path;
      return parseText(raw, name);
    })
  );

  // Use file name as id (unique enough)
  return loaded.map((f) => ({ ...f, id: f.id }));
}
