# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `@lenne.tech/nuxt-base`, a Nuxt module that provides GraphQL integration and code generation capabilities for Nuxt applications. The module focuses on GraphQL codegen, easy GraphQL syntax, and authentication helpers.

## Development Commands

### Core Development
- `npm run dev:prepare` - Generate type stubs and prepare the development environment
- `npm run dev` - Start development server with playground app on port 3001
- `npm run dev:generate-types` - Start dev server with type generation enabled (GENERATE_TYPES=1)
- `npm run dev:build` - Build the playground application

### Building and Testing
- `npm run build` - Build the module using nuxt-module-build
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode

### Code Quality
- `npm run lint` - Run ESLint on TypeScript, JavaScript, and Vue files
- `npm run lint:fix` - Run ESLint with auto-fix

### Release Management
- `npm run release` - Create a new release with standard-version and push to main
- `npm run release:minor` - Create a minor release
- `npm run release:major` - Create a major release

### Utilities
- `npm run reinit` - Complete reinstall (removes lock files, node_modules, clears cache)

## Architecture Overview

### Module Structure
- **`src/module.ts`** - Main Nuxt module definition with configuration options and setup logic
- **`src/generate.ts`** - GraphQL type generation and composable creation logic
- **`src/runtime/`** - Runtime code that gets bundled with the module

### Runtime Architecture
The runtime is organized into several key directories:

- **`classes/`** - Core classes including GraphQL type helpers and standard utilities
- **`composables/`** - Vue composables for GraphQL operations (query, mutation, subscription) and auth
- **`enums/`** - GraphQL-related enums and request types
- **`interfaces/`** - TypeScript interfaces for GraphQL operations and configuration
- **`plugins/`** - Nuxt plugins for cookies, GraphQL meta, WebSocket, and auth
- **`states/`** - Pinia/state management for authentication

### Key Features
1. **GraphQL Code Generation** - Automatically generates TypeScript types and composables from GraphQL schema
2. **Authentication System** - Built-in auth state management with JWT token handling
3. **WebSocket Support** - Real-time GraphQL subscriptions via WebSocket
4. **Type Safety** - Full TypeScript support with generated types

### Configuration
Module configuration happens in `nuxt.config.ts` under the `nuxtBase` key:
```typescript
nuxtBase: {
  generateTypes: boolean,    // Enable/disable type generation
  gqlHost: string,          // GraphQL endpoint URL
  host: string,             // Base host URL
  schema: string,           // Path to GraphQL schema file
  storagePrefix: string,    // Local storage prefix for auth tokens
  disableGraphql: boolean,  // Completely disable GraphQL features
  registerAuthPlugins: boolean,   // Enable auth plugins
  registerCookiePlugin: boolean,  // Enable cookie plugin
  autoImport: boolean       // Enable auto-import of generated composables
}
```

### Playground Application
The `playground/nuxt-app/` directory contains a complete Nuxt application for testing the module:
- Uses the module in development mode
- Includes a GraphQL server in `playground/server/` 
- Demonstrates auth flows, GraphQL operations, and real-time features

### Type Generation Process
When `generateTypes: true` or `GENERATE_TYPES=1`:
1. Module loads GraphQL schema from file or introspects remote endpoint
2. Generates TypeScript types in `src/base/default.ts`
3. Creates typed composables in `src/base/index.ts`
4. Auto-imports become available for use in Nuxt applications

### Testing
- Uses Vitest for unit testing
- Test fixtures in `test/fixtures/` for integration testing
- ESLint configuration extends `@lenne.tech/eslint-config-vue`

## Important Notes

- Node.js >= 22 and npm >= 10 required
- The module exits after type generation (5 second timeout) when `generateTypes` is enabled
- WebSocket URL is automatically derived from `gqlHost` (https → wss, http → ws)
- Built for ESM environments with proper transpilation handling for problematic dependencies