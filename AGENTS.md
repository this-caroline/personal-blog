# Agent Operating Contract

This repository is the canonical publishing hub for Caroline Marques, Software Engineer. Future agents must treat it as a long-lived engineering project, not a one-off generated site.

Before changing code, read:

1. `AGENTS.md`
2. `docs/architecture.md`
3. relevant ADRs in `docs/adr/`
4. nearby existing code before creating new patterns

## Engineering Principles

- Optimize for readability and maintainability, not minimum line count.
- Prefer explicit code over clever code.
- Prefer composition over inheritance.
- Prefer simple solutions over speculative abstraction.
- Do not create abstractions until there are at least two concrete use cases.
- Prefer a small amount of duplication over the wrong abstraction.
- Keep side effects at boundaries.
- Use descriptive domain-oriented names.
- Functions should perform one conceptual responsibility.
- Avoid deeply nested control flow.
- Prefer early returns where they improve readability.
- Avoid hidden global state.
- Do not modify unrelated code while implementing a task.

## Naming Rules

Avoid meaningless generic names unless the concept genuinely requires them:

- `data`
- `info`
- `item`
- `obj`
- `helper`
- `helpers`
- `utils`
- `common`
- `manager`
- `processor`

Names should communicate intent in the domain of the site.

## AI-Generated Code Anti-Patterns

Do not introduce:

- excessive comments explaining obvious code
- wrapper functions with no semantic purpose
- `catch` blocks that only rethrow unchanged exceptions
- speculative generic abstractions
- unnecessary base classes
- generic repository abstractions without justification
- `any` as an escape hatch
- disabled lint rules just to make validation pass
- duplicated domain concepts
- unnecessary dependencies
- huge files with unrelated responsibilities
- silent architectural changes
- random refactors while completing unrelated work
- excessive client-side JavaScript
- Astro components converted to React without a concrete reason

## Static-First Rule

The default implementation is:

```text
Astro component + HTML + CSS
```

React may be introduced only when actual stateful client-side behavior requires it. If a feature can be implemented without shipping JavaScript to the browser, use the static solution.

## Definition of Done

A task is not complete until:

- requirements are implemented
- architecture remains consistent
- code is readable
- names communicate intent
- no unnecessary abstraction was introduced
- relevant tests exist
- formatting passes
- lint passes
- typecheck passes
- architecture checks pass
- tests pass
- Astro build passes
- no unrelated changes are present

Run this before considering work complete:

```bash
pnpm validate
```
