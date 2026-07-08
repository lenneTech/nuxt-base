// Interop layer for gql-query-builder (CJS with __esModule, no ESM entry point).
//
// `gql-query-builder` exposes `query`/`mutation`/`subscription` as named exports
// that Vite 7 / Nuxt 4 cannot statically detect from the raw CJS output, so a
// direct `import { query } from 'gql-query-builder'` breaks the client bundle
// (no hydration). Importing the whole namespace and resolving the members at
// runtime works for both CJS shapes:
//  - __esModule (exports.query = ...) → member sits directly on the namespace
//  - module.exports = {...}           → member sits under `.default`
// This interop is pre-bundled into self-contained ESM at build time (see
// scripts/bundle-interop.mjs), so `gql-query-builder` is inlined here and the
// consuming app never resolves the raw CJS package.
//
// This file deliberately lives outside the auto-imported runtime dirs so its
// generic `query`/`mutation`/`subscription` exports are NOT registered as global
// Nuxt auto-imports. It is kept separate from the js-sha256 interop so the
// disableGraphql / password-hashing path never pulls gql-query-builder into the
// module graph.

import * as gqlQueryBuilder from 'gql-query-builder';

const mod = (gqlQueryBuilder as any).query ? (gqlQueryBuilder as any) : ((gqlQueryBuilder as any).default ?? gqlQueryBuilder);

export const query: typeof import('gql-query-builder').query = mod.query;
export const mutation: typeof import('gql-query-builder').mutation = mod.mutation;
export const subscription: typeof import('gql-query-builder').subscription = mod.subscription;
