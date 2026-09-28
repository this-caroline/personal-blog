# Testing

Do not chase meaningless coverage percentages. Tests should protect behavior and important invariants.

## Unit Tests

Use unit tests for reusable pure logic, such as metadata builders, URL helpers, and content transformations.

## Integration Tests

Use integration tests for content processing, generated feeds, structured data, or important framework integrations when they become meaningful.

## Architecture Tests

Architecture tests check required documents, canonical-origin and profile-URL ownership, unique project/story identifiers, and the absence of React components before an approved interactive use case exists. Dependency checks parse TypeScript imports, re-exports, and literal dynamic imports, resolve TypeScript aliases and relative paths, and check source-layer boundaries. Astro frontmatter and inline scripts are included; type-only Astro content imports remain permitted.

Lint smoke tests verify Astro import ordering, imports before executable code, accessibility rules, and failure on warnings. ESLint's warning limit is zero. Unit fixtures use the real writing collection type, and article tests cover draft visibility, ordering, reading-time boundaries, and input immutability.

Naming quality, semantic duplication, appropriate abstractions, and cohesive responsibilities still require review. These checks do not claim to detect equivalent prose, arbitrary computed dynamic imports, or every possible dependency through third-party code. Framework-owned names such as `entry.data` are valid; there is no blanket identifier blacklist.

## Build Verification

`pnpm validate` checks formatting, lint, types, tests, and the production Astro build. Both CI and the Pages build run this gate; Pages uploads artifacts only after it passes.

Use the Node version in `.nvmrc` and pnpm version in `packageManager`. Dependency and action updates arrive weekly through Dependabot; minor/patch updates are grouped, major updates remain separate, and merging is manual.

## Browser and E2E Tests

Add browser or end-to-end tests only when user-facing flows become interactive enough to justify the cost.

## Static Layout Changes

For CSS ownership changes, compare Home, About, Projects, Writing, and 404 at desktop and mobile widths. Check keyboard focus, hover states, and reduced motion. When the writing collection is empty, use temporary local content to verify article headings, lists, code, tags, and dates; remove it before the final production build. Browser checks complement accessibility linting and do not imply full accessibility certification.
