# Architecture

This project is a static-first personal publishing hub. Keep the architecture simple until real complexity justifies another layer.

## Responsibilities

### `src/pages`

Pages define routes. They compose layouts, components, and content, and should keep route-specific orchestration readable.

### `src/layouts`

Layouts own repeated document structure such as `<html>`, metadata plumbing, landmarks, and page shells. They should not contain unrelated content processing.

### `src/components`

Components render reusable interface pieces. Prefer Astro components. Components should not contain unrelated application logic or browser-only behavior unless that behavior is the reason the component exists.

### `src/content`

Content collections and MDX live here. Content should remain portable and should not unnecessarily depend on presentation implementation details.

### `src/lib`

Reusable pure logic belongs here when it has a clear purpose. Content parsing, metadata generation, and structured-data builders should live outside presentation components.

### `src/config`

Stable site identity, URLs, and shared constants belong here. Do not duplicate canonical identity metadata across pages.

### `src/styles`

Global CSS belongs here. Prefer scoped component styles for component-specific presentation.

## Dependency Principles

- Pages compose layouts and components.
- Components may depend on configuration and pure `lib` modules.
- Content transformation belongs outside presentation components.
- Site-wide constants and identity metadata belong in central configuration.
- SEO metadata generation should have one canonical implementation.
- Browser-only code must remain isolated and clearly justified.
- React islands must not become the default component model.
- Avoid cross-folder shortcuts that obscure ownership.

Architecture should grow from concrete needs, not anticipation.
