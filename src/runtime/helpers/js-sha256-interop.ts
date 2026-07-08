// Interop layer for js-sha256 (UMD/CJS, no ESM entry point).
//
// `js-sha256` exposes its members as named exports that Vite 7 / Nuxt 4 cannot
// statically detect from the raw UMD output, so a direct `import { sha256 } from
// 'js-sha256'` breaks the client bundle (no hydration). Importing the whole
// namespace and resolving the member at runtime works for both CJS shapes:
//  - __esModule (exports.sha256 = ...) → member sits directly on the namespace
//  - module.exports = {...}            → member sits under `.default`
// The package must stay out of `build.transpile` and be pre-bundled via
// optimizeDeps (dev) / handled by the commonjs plugin (build) for the interop
// wrapper to be produced (see module.ts).
//
// This file deliberately lives outside the auto-imported runtime dirs so its
// generic `sha256` export is NOT registered as a global Nuxt auto-import.

import * as jsSha256 from 'js-sha256';

const mod = (jsSha256 as any).sha256 ? (jsSha256 as any) : ((jsSha256 as any).default ?? jsSha256);

export const sha256: typeof import('js-sha256').sha256 = mod.sha256;
