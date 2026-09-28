# Testing

Do not chase meaningless coverage percentages. Tests should protect behavior and important invariants.

## Unit Tests

Use unit tests for reusable pure logic, such as metadata builders, URL helpers, and content transformations.

## Integration Tests

Use integration tests for content processing, generated feeds, structured data, or important framework integrations when they become meaningful.

## Architecture Tests

Architecture tests enforce repository rules that should never silently regress. They should be practical, understandable, and low maintenance.

## Build Verification

The production Astro build must always succeed in CI.

## Browser and E2E Tests

Add browser or end-to-end tests only when user-facing flows become interactive enough to justify the cost.
