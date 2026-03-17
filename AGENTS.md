# AGENTS.md

## 1) Purpose and Inputs

This file defines implementation rules for AI agents coding from PRDs.

Implementation input:

- `tasks.md` is the only execution-driving input.

Reference-only context (read, do not treat as direct task queue):

- `master-plan.md`
- `user-journey.md`
- `design-guideline.md`
- `implementation-plan.md`

`PRD-rules.md` remains the canonical standard for PRD structure.

## 2) Scope and Traceability Rules

- Implement only `TS-###` entries from `tasks.md`.
- Every change must map to `TS-###` and its `source_links` (`MP-###`, `UJ-###`, optional `DG-###`, `IP-###`).
- Preserve documented constraints and decisions from referenced source entries.
- If PRD conflict is ambiguous and cannot be auto-resolved, escalate once to the user before implementation.

## 3) Coding MUST / MUST NOT

### MUST

- Convert each task goal and acceptance criteria into concrete behavior.
- Keep changes minimal, explicit, and reversible.
- Add or update tests for user-visible and contract-level changes.
- Keep fixing bugs and rerunning required tests until they pass or are explicitly `BLOCKED`.

### MUST NOT

- Do not implement scope not represented in `tasks.md`.
- Do not claim completion while acceptance criteria or required tests are failing.
- Do not silently change API/data/auth/monitoring behavior without PRD traceability.
- Do not remove failing tests to force green status unless requirements changed.

## 4) Testing Cadence

- Docs-only exception: if a change only modifies documentation files, code checks and test-pass requirements are not required.
- Task loop (progressive): for each `TS-###` update, run task smoke tests + `verify:static`.
- System block checkpoint (boundary-based): run targeted `verify:e2e` and `verify:integration` when a system block completes and boundaries changed.
- Periodic full check: run `verify:all` pre-merge and nightly.
- Keep full run-by-run diary local at `.tmp/test-diary.jsonl` (gitignored).

Boundary-based checkpoint triggers:

- API route or request/response contract changes
- DB schema/model/relation changes
- auth/session/protected-route behavior changes
- monitoring initialization/event/transport changes
- shared cross-service interface changes

If required checks cannot run, mark `BLOCKED` with exact missing prerequisites.

## 5) Smoke Test Contract (tasks.md-Aligned)

- Create smoke tests according to `tasks.md` for each implemented `TS-###`.
- Map smoke tests to acceptance criteria and `source_links`.
- Execute smoke tests before marking a task complete.
- Cover at least one happy path and one failure path per changed task.
- If `tasks.md` smoke examples are missing or ambiguous, update PRD docs before sign-off.
- Keep `tasks.md` Evidence concise; link to failure playbook entries when created.

## 6) Test Result Diary (Prevent Repeat Failures)

Maintain a structured test diary for each run to prevent repeated failed solutions.
Storage path (default): `.tmp/test-diary.jsonl`.
Commit policy:

- Do not commit raw diary runs by default.
- Promote high-value stuck cases into committed knowledge at `docs/testing/failure-playbook.md`.

Schema (one record per test run attempt):


| Field               | Required | Description                                        |
| ------------------- | -------- | -------------------------------------------------- |
| `run_id`            | yes      | Unique run identifier.                             |
| `timestamp`         | yes      | ISO datetime of the run.                           |
| `task_id`           | yes      | `TS-###` under test.                               |
| `source_links`      | yes      | Linked source IDs for this task.                   |
| `test_scope`        | yes      | `smoke`, `static`, `e2e`, `integration`, or `all`. |
| `command`           | yes      | Exact command executed.                            |
| `status`            | yes      | `PASS`, `FAIL`, or `BLOCKED`.                      |
| `failure_signature` | no       | Stable short identifier for the failure mode.      |
| `root_cause`        | no       | Short cause summary.                               |
| `fix_method`        | no       | Short method used to fix.                          |
| `rerun_result`      | no       | Result after fix attempt.                          |
| `blind_spot`        | no       | Remaining gap/risk not fully covered.              |


Anti-repeat rule:

- Before applying a new fix for a failing test, check prior diary entries with the same `failure_signature`.
- Do not repeat the same fix method unchanged after a prior `FAIL`; change approach and record the new method.

Promotion trigger from diary to committed playbook:

- repeated same `failure_signature` for `>= 3` attempts, or
- task/check remains `BLOCKED` for `> 1 day`, or
- rollback risk or high-impact production risk is involved.

## 7) Reporting and Definition of Done

For each completed `TS-###`, report:

- task ID and `source_links`
- behavior change summary
- exact commands, exit codes, and pass/fail results
- smoke coverage summary against `tasks.md`
- potential blind spots/test gaps and reason
- test diary entry summary (latest failure -> fix -> rerun outcome, if applicable)
- `playbook_link` when promotion trigger is met

Skill reporting rule:

- If any skill was used for a task, include skill receipt line(s): `<skill> -> used -> reason`.
- If no skill was used, do not mention skills.

Done means:

- acceptance criteria satisfied
- required tests passed, correctly marked `BLOCKED`, or not required for docs-only changes
- no unresolved PRD conflict remains
- diary and final report are consistent with executed results

