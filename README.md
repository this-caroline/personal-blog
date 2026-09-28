Personal publishing hub for me :)

This repository is the engineering foundation for a static-first public website focused on original writing, projects, profile discovery, and long-term maintainability.

## Stack

- Astro
- TypeScript in strict mode
- MDX
- pnpm
- ESLint
- Prettier
- Vitest

## Local Development

Requires Node.js 22.12.0 or newer and pnpm 9.6.0.

```bash
pnpm install
pnpm dev
```

## Validation

Run the full local quality gate before opening or merging changes:

```bash
pnpm validate
```

This checks formatting, linting, TypeScript, architecture tests, unit tests, and the production Astro build.

## Architecture

The site is static-first. The default implementation should be Astro components, semantic HTML, and CSS.

Read `AGENTS.md`, `docs/architecture.md`, and relevant ADRs before adding new patterns.

## Licensing

The MIT license applies to the source code in this repository. Written articles, personal images, and original artwork are not automatically MIT-licensed unless that is explicitly stated.

## Agent Workflow

Agents should make small, intentional changes; avoid unrelated refactors; keep identity metadata centralized; and preserve fast, crawlable HTML.
Bad patterns should fail validation where practical.
