# AGENTS.md

## Purpose
- Define the mandatory testing workflow for AI agents in this repository.
- Scope: repository root and all tracked project files.

## Scaffold Pointer
- For scaffold-specific workflow, provider-specific setup rules, and human-checkpoint sequencing, use `docs/scaffold-plan.md`.
- Keep this file focused on cross-project gate and verification contracts.

## Runtime Contract
- Use Bun only.
- Run app commands from the app package directory unless the task targets root-level docs or scripts.
- Prefer TanStack Query plus Server Actions for client-server data communication.
## Unified Test Workflow

```text
Gate 0: Decision Lock (scaffold only)
  -> Preflight: Environment Preconditions
  -> Gate 1: Static Quality
  -> Gate 2: Browser E2E (source of truth)
  -> Gate 3: Integration Contracts
```

## Scope Matrix (Gate Selection)
- Docs-only changes: no gates required.
- App code or config changes: Gate 1 + Gate 2.
- Boundary changes: Gate 1 + Gate 2 + Gate 3.
- Scaffold milestone or pre-merge: follow `docs/scaffold-plan.md`, then run `bun run verify:preflight`, then Gate 1 + Gate 2 + Gate 3 via `bun run verify:all`.

## Boundary Change Definition
Boundary changes include:
- New or changed API routes.
- Request or response shape changes.
- DB schema, migration, model, or relation changes.
- Auth provider, session, sign-in flow, or protected-route behavior changes.
- Monitoring SDK, initialization, config, or transport changes.

## Gate 1: Static Quality
- Run `bun install` when dependencies or lockfile change.
- Run `bun run typecheck`.
- Run `bun run lint`.
- Stop on failure. Fix issues and rerun Gate 1.

## Gate 2: Browser E2E
- Run the full repository Playwright suite for desktop and mobile coverage.
- Treat committed Playwright specs/config as the source of truth.
- Use Codex browser tooling only for debugging, never as test evidence.

## Gate 3: Integration Contracts
- Run data contract checks: at least one read path and one write path with invalidation/refetch assertion.
- Run auth contract checks: sign-in flow and protected-route access.
- Run monitoring contract checks: controlled error/event delivery verification.
- Skip only integrations that are not part of the selected canonical stack path.

## Integration Preconditions
- Gate 3 requires valid integration env vars for the selected stack path.
- If required env vars are missing, mark Gate 3 as `BLOCKED` with exact missing variable names and stop.
- If a required external human checkpoint is incomplete, mark `BLOCKED (HUMAN_CHECKPOINT_REQUIRED)` and stop.
- Do not mark Gate 3 as passed when prerequisites are missing.

## Command Contract
- Maintain these scripts in the app package:
- `verify:preflight` = integration env + human-checkpoint preconditions.
- `verify:static` = typecheck + lint.
- `verify:e2e` = full Playwright suite.
- `verify:integration` = selected integration contracts.
- `verify:all` = static + e2e + integration.
- Run `bun run verify:preflight` before `verify:e2e`, `verify:integration`, and `verify:all`.
- `verify:all` must short-circuit when preflight fails.
- If any verify script is missing, add or update scripts first, then run gates.
- Do not replace required verification with ad-hoc commands in final verification unless script creation is blocked.
- Use `bun run verify:static` and targeted `verify:e2e` while iterating locally.

## Verification Evidence Contract
For every executed gate, report:
- Exact command.
- Exit code.
- One-line outcome (`PASS` or `FAIL`).
- If failed: first actionable error and fix applied.
- Do not claim success without command evidence.

## Skills Usage Contract
- If task scope matches an installed skill domain, the agent must use the skill workflow or explicitly state why it was skipped and what was used instead.
- Final delivery must include a Skill Receipt in this format:
- `<skill> -> used|skipped -> reason`.

## Delivery Rules
- Add or update executable tests and explicit acceptance criteria for user-visible changes.
- Do not bypass failing checks by deleting test coverage unless requirements changed.
- Iterate until required gates pass or code output stops changing.
- Store temporary test artifacts under `.tmp/` and keep `.tmp/` gitignored.

## Definition of Done
- Required gates pass for the current change scope.
- User-facing behavior works on desktop and mobile.
- Acceptance criteria are documented and covered by executable tests.
- Verification evidence is included for each executed gate.
