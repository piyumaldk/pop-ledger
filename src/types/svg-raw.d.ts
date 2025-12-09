// Type declarations for importing SVG as raw text via Vite's ?raw
declare module '*.svg?raw' {
  const content: string;
  export default content;
}
