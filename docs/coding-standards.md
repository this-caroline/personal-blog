# Coding Standards

Code should read like it was written for another engineer to maintain, not generated to minimize tokens.

## General Expectations

- Use descriptive, domain-oriented names.
- Keep modules small and cohesive.
- Separate logical sections with whitespace.
- Use type imports consistently.
- Prefer early returns when they flatten control flow.
- Avoid deeply nested logic.
- Do not leave dead code or unused exports.
- Avoid comments that restate obvious code.
- Explain magic values through names, constants, or short comments when needed.
- Avoid giant configuration blobs where smaller typed configuration makes sense.

## Imports

- Keep imports ordered by standard library, external packages, internal aliases, and relative paths.
- Prefer path aliases for stable cross-area imports.
- Avoid circular imports.
- Do not import browser-only modules into static/server-oriented code.

## TypeScript

- Do not use `any` as an escape hatch.
- Model stable domain concepts with explicit types.
- Prefer narrow exported APIs.
- Let strict TypeScript settings surface design issues early.

## Markup and Accessibility

- Use semantic HTML by default.
- Preserve a meaningful heading hierarchy.
- Use accessible link text and image alt text.
- Keep interactive controls keyboard accessible.
- Do not ship client-side JavaScript unless the user experience requires it.

## URLs and Metadata

- Treat external URLs and public profile metadata explicitly.
- Keep canonical site identity in `src/config/site.ts`.
- Use shared metadata helpers rather than hand-rolling page metadata repeatedly.
