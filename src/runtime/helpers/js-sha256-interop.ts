// SHA-256 helper backing the password hashing.
//
// Previously this used `js-sha256` (UMD/CJS with no ESM entry point), which Vite 7 /
// Nuxt 4 served as raw CJS in consuming apps ("ReferenceError: exports is not defined",
// no hydration). `@noble/hashes` is a pure-ESM, dependency-free implementation, so the
// import resolves natively in every consumer with no bundling or interop workaround.
//
// This file deliberately lives outside the auto-imported runtime dirs so its generic
// `sha256` export is NOT registered as a global Nuxt auto-import.

import { sha256 as nobleSha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, utf8ToBytes } from '@noble/hashes/utils.js';

// Hex digest of the UTF-8 bytes of `message` — identical output to `js-sha256`'s sha256(string).
export function sha256(message: string): string {
  return bytesToHex(nobleSha256(utf8ToBytes(message)));
}
