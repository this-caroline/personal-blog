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

Stable site identity, URLs, and shared editorial records belong here. Do not duplicate canonical identity metadata across pages. Projects and engineering stories have one record per concept, with explicit page-specific copy where the presentation differs. Current snapshot entries use stable keys rather than display-label lookups.

### `src/styles`

Global CSS contains tokens, base typography, and truly global styles. Components and routes own their scoped styles, including breakpoints and animations. CSS modules live beside their rendering owner; related Home, About, and article components may share a module within their component folder. Scoped styles shared across component folders live under `src/styles`.

Existing global class names remain on elements that also receive module classes. Rendered Markdown descendants are styled through selectors anchored to the article body's module class.

## Dependency Principles

- Configuration depends only on other configuration within `src`.
- Pure `lib` modules depend only on `lib` and configuration within `src`. Runtime Astro content loaders and asset APIs belong at route boundaries; type-only Astro imports are allowed.
- Components do not import routes or layouts.
- Pages compose layouts and components.
- Components may depend on configuration and pure `lib` modules.
- Content transformation belongs outside presentation components.
- Site-wide constants and identity metadata belong in central configuration.
- SEO metadata generation should have one canonical implementation.
- Browser-only code must remain isolated and clearly justified.
- React islands must not become the default component model.
- Avoid cross-folder shortcuts that obscure ownership.

Architecture should grow from concrete needs, not anticipation.
