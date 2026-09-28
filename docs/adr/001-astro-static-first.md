# ADR 001: Astro Static First

## Status

Accepted

## Decision

Use Astro as the primary framework and default to statically generated HTML.

React islands may be used only where actual client-side interactivity requires them.

## Context

The website prioritizes:

- SEO
- performance
- long-term maintainability
- crawlable content
- low JavaScript usage

## Consequences

Most components should be Astro components.

React should not become the default component model merely because it is available. Features that can be implemented with Astro, HTML, and CSS should not ship browser JavaScript.
