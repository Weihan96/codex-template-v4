# AGENTS.md

## Purpose
- Define the mandatory testing workflow for AI agents in this repository.
- Scope: repository root and all tracked project files.

## Runtime Contract
- Use Bun only.
- Run app commands from `image-tagger-2026/` unless the task targets root-level docs or scripts.

## Unified Test Workflow

```text
Gate 0: Decision Lock (scaffold only)
  -> Gate 1: Static Quality
  -> Gate 2: Browser E2E (source of truth)
  -> Gate 3: Integration Contracts
```

## Gate 0: Decision Lock (Scaffold Only)
- Finalize stack and structure decision gates before scaffold expansion.
- Record each decision in `docs/adr/`.
- Do not continue scaffold implementation with unresolved gates.

## Gate 1: Static Quality (Required Every Change)
- Run `bun install` when dependencies or lockfile change.
- Run `bun run typecheck`.
- Run `bun run lint`.
- Stop on failure. Fix issues and rerun Gate 1.

## Gate 2: Browser E2E (Required Every Change)
- Run the full repository Playwright suite for desktop and mobile coverage.
- Treat committed Playwright specs/config as the source of truth.
- Use Codex browser tooling only for debugging, never as test evidence.

## Gate 3: Integration Contracts (Required When Boundaries Change)
- Run data contract checks: at least one read path and one write path with invalidation/refetch assertion.
- Run auth contract checks: sign-in flow and protected-route access.
- Run monitoring contract checks: controlled error/event delivery verification.
- Skip only integrations that are not part of the selected canonical stack path.

## Command Contract
- Maintain these scripts in the app package:
- `verify:static` = typecheck + lint.
- `verify:e2e` = full Playwright suite.
- `verify:integration` = selected integration contracts.
- `verify:all` = static + e2e + integration.
- Use `bun run verify:all` for scaffold milestones and pre-merge verification.
- Use `bun run verify:static` and `bun run verify:e2e` for daily iteration.

## Delivery Rules
- Add or update executable tests and explicit acceptance criteria for user-visible changes.
- Do not bypass failing checks by deleting test coverage unless requirements changed.
- Iterate until required gates pass or code output stops changing.
- Store temporary test artifacts under `.tmp/` and keep `.tmp/` gitignored.

## Definition of Done
- Required gates pass for the current change scope.
- User-facing behavior works on desktop and mobile.
- Acceptance criteria are documented and covered by executable tests.
