# @lenne.tech/nuxt-base

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

@lenne.tech/nuxt-base had some amazing features for easy initialize nuxt applications.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/@lenne.tech/nuxt-base?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- &nbsp;GraphQL codegen
- &nbsp;Easy graphql syntax

## Quick Setup

1. Add `@lenne.tech/nuxt-base` dependency to your project

```bash
# Using npm
npm install -D @lenne.tech/nuxt-base

# Using yarn
yarn add --dev @lenne.tech/nuxt-base

# Using npm
npm install --save-dev @lenne.tech/nuxt-base
```

2. Add `@lenne.tech/nuxt-base` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    '@lenne.tech/nuxt-base'
  ]
})
```

That's it! You can now use @lenne.tech/nuxt-base in your Nuxt app ✨

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@lenne.tech/nuxt-base/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@lenne.tech/nuxt-base

[npm-downloads-src]: https://img.shields.io/npm/dm/@lenne.tech/nuxt-base.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@lenne.tech/nuxt-base

[license-src]: https://img.shields.io/npm/l/@lenne.tech/nuxt-base.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@lenne.tech/nuxt-base

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
