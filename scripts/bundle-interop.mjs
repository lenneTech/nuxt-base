// Pre-bundles the gql-query-builder interop helper into self-contained ESM.
//
// gql-query-builder is CJS-only (no ESM entry point). nuxt-module-build transpiles the
// runtime file-by-file (mkdist, no bundling), so the emitted
// dist/runtime/helpers/gql-query-builder-interop.js keeps a bare `import ... from
// 'gql-query-builder'`. A consuming Nuxt 4 / Vite 7 app then serves that raw CJS over @fs,
// where `exports` is undefined ("ReferenceError: exports is not defined") and the client
// bundle crashes (no hydration).
//
// This step re-bundles the interop entry point with esbuild so gql-query-builder is inlined
// and converted to ESM. The published helper then imports nothing external, and the consumer
// never touches the raw CJS — no optimizeDeps/transpile/alias workaround needed.
// (js-sha256 was replaced by the pure-ESM @noble/hashes, so it needs no bundling.)
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

const entryPoints = ['src/runtime/helpers/gql-query-builder-interop.ts'];

await build({
  absWorkingDir: root,
  entryPoints,
  outdir: 'dist/runtime/helpers',
  bundle: true,
  format: 'esm',
  // Neutral keeps the UMD `typeof process/self/global` guards intact so the output runs on
  // both the Nitro server and the browser client. Neutral resets mainFields to empty, so the
  // `main`-only CJS packages are resolved via an explicit mainFields list.
  platform: 'neutral',
  mainFields: ['module', 'main'],
  target: 'es2020',
  logLevel: 'info',
  allowOverwrite: true,
});

console.log('[bundle-interop] Bundled', entryPoints.join(', '), '→ dist/runtime/helpers');
