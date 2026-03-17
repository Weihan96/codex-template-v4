# Image Tagger Tasks

## Backlog Index

| task_id | name | status | primary source_links |
|---|---|---|---|
| TS-001 | Core Data Model and Migration Baseline | todo | MP-001, MP-003, IP-001, IP-016 |
| TS-002 | Project Creation and Image Upload Flow | todo | MP-005, MP-006, UJ-006, DG-006 |
| TS-003 | Tag Schema and Tag Set Management | todo | MP-007, UJ-006, DG-011 |
| TS-004 | Keyboard-First Tagging Workspace | todo | MP-002, UJ-007, DG-001, DG-012 |
| TS-005 | Multi-round Assignment, Shift, and Blind Rotation | todo | MP-003, UJ-008, UJ-013, IP-003 |
| TS-006 | Review, Disagreement, and Audit Resolution | todo | MP-009, UJ-009, UJ-014, DG-015 |
| TS-007 | JSON Export Contract and Download UX | todo | MP-004, MP-015, UJ-010, DG-016 |
| TS-008 | KPI Instrumentation and Operational Dashboards | todo | MP-011, MP-014, UJ-021, IP-005 |
| TS-009 | End-to-End Verification and Release Readiness | todo | IP-011, IP-014, IP-015, MP-020 |

## TS-001: Core Data Model and Migration Baseline

- task_id: TS-001
- status: todo
- estimate: M
- source_links: MP-001, MP-003, IP-001, IP-016
- test_links: TS-001.T1, TS-001.T2

### Description
Current scaffold has partial tables for notes, but no schema for project-scoped image tagging workflows, rounds, assignments, and audit events.

### Goal
Introduce normalized Drizzle schema and migrations for projects, images, tag schemas, assignments, decisions, and append-only audit logs.

### Implementation Notes
`next-app/lib/db/schema.ts`, `next-app/lib/db/migrations/*`, `next-app/drizzle.config.ts`

### Dependencies / Blockers
Requires stable entity definitions from MP-001 and MP-003 before downstream UI tasks.

### Test Plan
- Static: `cd next-app && bun run typecheck`
- E2E: N/A
- Integration: `cd next-app && bun run verify:integration` (schema + data path checks)

### Smoke Examples
1. Given a new project exists with zero images.
2. When an image row and assignment row are inserted for round 1.
3. Then assignment references valid project/image IDs and audit log row is created.

### Acceptance Criteria
- [ ] `projects`, `images`, `tag_schemas`, `tag_options`, `assignments`, `decisions`, and `audit_events` tables exist in migration output.
- [ ] All foreign keys are enforced and prevent orphan assignment/decision rows.
- [ ] `audit_events` is append-only by application logic and stores actor, action, target, and timestamp.
- [ ] Migration can apply on empty database and on existing local dev database without destructive changes.

### Source References
- [master-plan.md#vision-and-problem](./master-plan.md#vision-and-problem)
- [implementation-plan.md#architecture-slices-and-boundaries](./implementation-plan.md#architecture-slices-and-boundaries)

### Evidence
- Pending implementation.

## TS-002: Project Creation and Image Upload Flow

- task_id: TS-002
- status: todo
- estimate: M
- source_links: MP-005, MP-006, UJ-006, DG-006, IP-002
- test_links: TS-002.T1, TS-002.T2

### Description
Users need a reliable way to create projects and ingest image batches with progress and retry behavior.

### Goal
Ship project setup UI and robust upload pipeline with file validation, partial failure handling, and resumable status.

### Implementation Notes
`next-app/app/*`, `next-app/app/api/uploadthing/*`, `next-app/components/*`

### Dependencies / Blockers
Depends on TS-001 schema availability.

### Test Plan
- Static: `cd next-app && bun run verify:static`
- E2E: `cd next-app && bunx playwright test tests/e2e/project-upload.spec.ts`
- Integration: `cd next-app && bun run verify:integration`

### Smoke Examples
1. Given a user opens the new project page.
2. When the user submits project metadata and uploads 20 files where 2 are invalid.
3. Then 18 files persist, 2 files show actionable errors, and retry is available for failed subset.

### Acceptance Criteria
- [ ] Project creation form enforces required fields and saves project metadata in one submit flow.
- [ ] Upload UI shows per-file status (`queued`, `uploading`, `done`, `failed`) with retry for failed files only.
- [ ] Failed uploads do not rollback successful file records.
- [ ] Upload completion view displays total counts and next action link to tagging queue.

### Source References
- [master-plan.md#scope-and-non-goals](./master-plan.md#scope-and-non-goals)
- [user-journey.md#failure-and-recovery-paths](./user-journey.md#failure-and-recovery-paths)

### Evidence
- Pending implementation.

## TS-003: Tag Schema and Tag Set Management

- task_id: TS-003
- status: todo
- estimate: M
- source_links: MP-007, UJ-006, DG-022, IP-001
- test_links: TS-003.T1

### Description
Projects require custom tags with clear definitions to reduce disagreement and avoid ambiguous labeling.

### Goal
Create tag schema management with option types (single-select, multi-select), examples, and version tracking.

### Implementation Notes
`next-app/app/projects/[projectId]/tags/*`, `next-app/lib/db/schema.ts`

### Dependencies / Blockers
Depends on TS-001 and TS-002.

### Test Plan
- Static: `cd next-app && bun run verify:static`
- E2E: `cd next-app && bunx playwright test tests/e2e/tag-schema.spec.ts`
- Integration: API contract tests for create/update schema endpoints.

### Smoke Examples
1. Given a project owner opens tag management.
2. When the owner creates a single-select class with two options and one example each.
3. Then annotators receive the updated schema and new assignments use the latest active version.

### Acceptance Criteria
- [ ] Tag schemas support active/inactive versions with immutable historical references for prior decisions.
- [ ] Each tag option can store concise definition text and optional example image links.
- [ ] Schema edits are blocked when required fields are missing and errors name exact invalid field.
- [ ] Decision rows always reference a concrete schema version ID.

### Source References
- [master-plan.md#risks-and-key-decisions](./master-plan.md#risks-and-key-decisions)
- [design-guideline.md#content-and-microcopy-rules](./design-guideline.md#content-and-microcopy-rules)

### Evidence
- Pending implementation.

## TS-004: Keyboard-First Tagging Workspace

- task_id: TS-004
- status: todo
- estimate: L
- source_links: MP-002, UJ-007, DG-011, DG-012, IP-007
- test_links: TS-004.T1, TS-004.T2

### Description
High-volume annotation requires minimal pointer usage and near-instant submit-next transitions.

### Goal
Deliver a focused tagging workspace with hotkeys, autosave, submit-next behavior, and uncertainty reason capture.

### Implementation Notes
`next-app/app/tagging/*`, `next-app/components/tagging/*`

### Dependencies / Blockers
Depends on TS-001 and TS-003.

### Test Plan
- Static: `cd next-app && bun run verify:static`
- E2E: `cd next-app && bunx playwright test tests/e2e/tagging-workspace.spec.ts`
- Integration: Queue fetch and decision submit contracts with assignment ownership checks.

### Smoke Examples
1. Given an annotator has an active queue assignment.
2. When the annotator presses mapped hotkeys and submits a decision.
3. Then decision persists, next image loads, and queue counters update without full page reload.

### Acceptance Criteria
- [ ] Hotkey map renders on screen and all mapped actions work via keyboard only.
- [ ] Submit-next median latency is <= 250 ms in local performance smoke run with warm cache.
- [ ] Uncertain decision path requires reason code before submit and routes record to review queue.
- [ ] Session interruption restores last in-progress image and unsent draft state.

### Source References
- [design-guideline.md#component-and-interaction-rules](./design-guideline.md#component-and-interaction-rules)
- [user-journey.md#primary-journeys-happy-paths](./user-journey.md#primary-journeys-happy-paths)

### Evidence
- Pending implementation.

## TS-005: Multi-round Assignment, Shift, and Blind Rotation

- task_id: TS-005
- status: todo
- estimate: L
- source_links: MP-003, UJ-008, UJ-013, UJ-016, IP-003, IP-018
- test_links: TS-005.T1, TS-005.T2, TS-005.T3

### Description
Ground-truth preservation needs deterministic reassignment logic across rounds while hiding prior labels from annotators.

### Goal
Implement assignment engine that supports rounds, shift ownership windows, blind rotation, timeout reassignment, and escalation triggers.

### Implementation Notes
`next-app/lib/workflows/*`, `next-app/app/api/assignments/*`

### Dependencies / Blockers
Depends on TS-001 and TS-004.

### Test Plan
- Static: `cd next-app && bun run verify:static`
- E2E: `cd next-app && bunx playwright test tests/e2e/round-rotation.spec.ts`
- Integration: Deterministic assignment tests for rotation and timeout reassignment behavior.

### Smoke Examples
1. Given round 1 is complete for a batch.
2. When round 2 starts with blind mode enabled.
3. Then each image is assigned to a different annotator and previous decisions are hidden.

### Acceptance Criteria
- [ ] Assignment engine prevents same annotator from receiving the same image in consecutive blind rounds.
- [ ] Shift timeout requeues stale assignments within configured SLA window.
- [ ] Blind mode suppresses prior labels in annotator APIs and UI responses.
- [ ] Every reassignment or escalation action writes an immutable audit event.

### Source References
- [master-plan.md#vision-and-problem](./master-plan.md#vision-and-problem)
- [user-journey.md#trustfriction-moments](./user-journey.md#trustfriction-moments)

### Evidence
- Pending implementation.

## TS-006: Review, Disagreement, and Audit Resolution

- task_id: TS-006
- status: todo
- estimate: L
- source_links: MP-009, UJ-009, UJ-014, DG-015, IP-009
- test_links: TS-006.T1, TS-006.T2

### Description
Reviewers and auditors need structured tools to resolve disagreement efficiently and preserve rationale history.

### Goal
Ship disagreement queue, side-by-side round comparison, resolution actions, and escalation to third round when confidence is low.

### Implementation Notes
`next-app/app/review/*`, `next-app/app/audit/*`, `next-app/components/review/*`

### Dependencies / Blockers
Depends on TS-005.

### Test Plan
- Static: `cd next-app && bun run verify:static`
- E2E: `cd next-app && bunx playwright test tests/e2e/review-audit.spec.ts`
- Integration: Reviewer permission and resolution-state transition contract tests.

### Smoke Examples
1. Given a reviewer opens disagreement queue.
2. When reviewer selects a record and chooses final tag with rationale code.
3. Then record transitions to resolved state or escalates to round 3 when low confidence is selected.

### Acceptance Criteria
- [ ] Disagreement queue supports filters for project, tag class, round, urgency, and assignee.
- [ ] Resolution action requires rationale code and confidence tier before completion.
- [ ] Low-confidence resolution can trigger third-round escalation path.
- [ ] Audit history timeline is immutable and shows full actor/time/action chain.

### Source References
- [user-journey.md#failure-and-recovery-paths](./user-journey.md#failure-and-recovery-paths)
- [design-guideline.md#information-architecture-and-navigation](./design-guideline.md#information-architecture-and-navigation)

### Evidence
- Pending implementation.

## TS-007: JSON Export Contract and Download UX

- task_id: TS-007
- status: todo
- estimate: M
- source_links: MP-004, MP-015, UJ-010, UJ-015, DG-016, IP-005
- test_links: TS-007.T1, TS-007.T2

### Description
Consumers need deterministic JSON exports with schema versioning and explicit validation status.

### Goal
Provide export API and UI that enforce pre-export validation, support scoped exports, and produce versioned JSON artifacts.

### Implementation Notes
`next-app/app/exports/*`, `next-app/app/api/exports/*`

### Dependencies / Blockers
Depends on TS-006.

### Test Plan
- Static: `cd next-app && bun run verify:static`
- E2E: `cd next-app && bunx playwright test tests/e2e/export-json.spec.ts`
- Integration: Schema validation tests for export payload versions.

### Smoke Examples
1. Given a project has frozen records and no unresolved items.
2. When auditor requests export for specific round range.
3. Then system returns JSON matching versioned schema and download completes.

### Acceptance Criteria
- [ ] Export UI blocks download if unresolved or invalid records remain and lists failing counts.
- [ ] JSON payload includes schema version, project metadata, decisions, and provenance fields.
- [ ] Export endpoint returns deterministic ordering for records within identical filters.
- [ ] Schema validator passes for 100% of generated sample exports in CI test set.

### Source References
- [master-plan.md#success-metrics-kpis](./master-plan.md#success-metrics-kpis)
- [implementation-plan.md#performancesecurity-constraints](./implementation-plan.md#performancesecurity-constraints)

### Evidence
- Pending implementation.

## TS-008: KPI Instrumentation and Operational Dashboards

- task_id: TS-008
- status: todo
- estimate: M
- source_links: MP-011, MP-012, MP-013, MP-014, UJ-021, UJ-022, UJ-025, IP-010
- test_links: TS-008.T1

### Description
Operational teams need metrics tied directly to quality and throughput KPIs, not disconnected event streams.

### Goal
Implement event capture and dashboard views for annotation speed, disagreement, audit SLA, and export quality metrics.

### Implementation Notes
`next-app/lib/analytics/*`, `next-app/app/audit/metrics/*`

### Dependencies / Blockers
Depends on TS-004 through TS-007 emitting required events.

### Test Plan
- Static: `cd next-app && bun run verify:static`
- E2E: `cd next-app && bunx playwright test tests/e2e/metrics-dashboard.spec.ts`
- Integration: Event schema validation and KPI aggregation contract tests.

### Smoke Examples
1. Given daily annotation and review activity exists.
2. When owner opens KPI dashboard.
3. Then dashboard displays throughput, disagreement, SLA, and export error metrics by selected project window.

### Acceptance Criteria
- [ ] Event schema includes project_id, round, actor_role, and timestamp for all KPI-linked events.
- [ ] Dashboard can filter by project and date range and render within 2 seconds for 30-day dataset.
- [ ] KPI formulas are documented and match MP-011 to MP-014 definitions.
- [ ] Missing or malformed events are visible in data quality panel.

### Source References
- [master-plan.md#success-metrics-kpis](./master-plan.md#success-metrics-kpis)
- [user-journey.md#journey-metrics-and-instrumentation-points](./user-journey.md#journey-metrics-and-instrumentation-points)

### Evidence
- Pending implementation.

## TS-009: End-to-End Verification and Release Readiness

- task_id: TS-009
- status: todo
- estimate: M
- source_links: IP-011, IP-012, IP-013, IP-014, IP-015, MP-020
- test_links: TS-009.T1, TS-009.T2

### Description
A consolidated verification plan is required before pilot release to avoid shipping partial or inconsistent workflow behavior.

### Goal
Complete automated and manual release gates for full workflow coverage from project creation through export.

### Implementation Notes
`next-app/tests/e2e/*`, `next-app/scripts/verify-*.ts`, release checklist doc under `docs/`.

### Dependencies / Blockers
Depends on TS-001 through TS-008 completion.

### Test Plan
- Static: `cd next-app && bun run verify:static`
- E2E: `cd next-app && bun run verify:e2e`
- Integration: `cd next-app && bun run verify:integration`

### Smoke Examples
1. Given staging environment has required env vars configured.
2. When release candidate pipeline runs `verify:all`.
3. Then preflight, static, e2e, and integration checks pass with no critical failures.

### Acceptance Criteria
- [ ] `bun run verify:preflight` fails with explicit missing var list when secrets are absent.
- [ ] `bun run verify:all` passes on staging with at least one representative project dataset.
- [ ] E2E suite includes flows for upload, tagging, blind round, review resolution, and export.
- [ ] Release checklist stores evidence links for test logs and KPI snapshot from pilot run.

### Source References
- [implementation-plan.md#verification-strategy](./implementation-plan.md#verification-strategy)
- [master-plan.md#milestones-and-roadmap](./master-plan.md#milestones-and-roadmap)

### Evidence
- Pending implementation.
