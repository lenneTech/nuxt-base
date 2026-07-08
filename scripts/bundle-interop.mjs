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
//
// After bundling, the script asserts that dist/runtime contains no bare imports of CJS-only
// packages anymore, so a silent regression (e.g. mkdist emitting .mjs so the overwrite no
// longer targets the file the composables import) fails the build instead of shipping.
import { build } from 'esbuild';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

const entryPoints = ['src/runtime/helpers/gql-query-builder-interop.ts'];
const target = join(root, 'dist/runtime/helpers/gql-query-builder-interop.js');

// Guard: the mkdist output we are about to overwrite must exist. If module-builder ever
// changes its runtime output convention (e.g. .mjs), this must fail loudly — otherwise we
// would write a dead file next to the unbundled one the composables actually import.
if (!existsSync(target)) {
  console.error(`[bundle-interop] Expected mkdist output not found: ${target}`);
  console.error('[bundle-interop] nuxt-module-build output layout changed — adjust this script.');
  process.exit(1);
}

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

// Post-build assertion: no file in dist/runtime may import the CJS-only packages bare.
const CJS_ONLY = ['gql-query-builder', 'js-sha256'];
const barePattern = new RegExp(`(from\\s*["'](${CJS_ONLY.join('|')})["'])|(require\\(["'](${CJS_ONLY.join('|')})["']\\))`);

function scan(dir) {
  const offenders = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      offenders.push(...scan(path));
    } else if (/\.(js|mjs|cjs)$/.test(entry.name) && barePattern.test(readFileSync(path, 'utf8'))) {
      offenders.push(path);
    }
  }
  return offenders;
}

const offenders = scan(join(root, 'dist/runtime'));
if (offenders.length > 0) {
  console.error('[bundle-interop] dist/runtime still contains bare CJS imports — refusing to ship:');
  for (const file of offenders) {
    console.error(`  - ${file}`);
  }
  process.exit(1);
}

console.log('[bundle-interop] Bundled', entryPoints.join(', '), '→ dist/runtime/helpers (dist/runtime verified free of bare CJS imports)');
