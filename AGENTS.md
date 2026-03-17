# AGENTS.md

## 1) Purpose
This file defines the operating contract for creating and maintaining PRD documents in this repository.

This file is PRD-only. It does not define coding, test execution, CI, or release workflow policy.

## 2) Scope
Applies to creation and updates of:
- `master-plan.md`
- `implementation-plan.md`
- `design-guideline.md`
- `user-journey.md`
- `tasks.md`

Unless the user explicitly exempts a document, keep the full PRD set consistent.

## 3) Canonical Standard
- `PRD-rules.md` is the canonical PRD structure and quality standard.
- `AGENTS.md` defines authoring behavior and enforcement expectations for PRD work.
- If `AGENTS.md` and `PRD-rules.md` diverge, follow `PRD-rules.md` and update `AGENTS.md` to match.

## 4) PRD ID Legend
Use document-coded IDs consistently:
- `MP-###` for `master-plan.md`
- `IP-###` for `implementation-plan.md`
- `DG-###` for `design-guideline.md`
- `UJ-###` for `user-journey.md`
- `TS-###` for `tasks.md`

## 5) Authoring Order
Default update order:
1. `master-plan.md`
2. `user-journey.md`
3. `design-guideline.md`
4. `implementation-plan.md`
5. `tasks.md`

`tasks.md` may refine execution details, but must not contradict upstream intent.

## 6) PRD MUST
- Follow required vs optional section rules from `PRD-rules.md`.
- Keep section limits and readability constraints from `PRD-rules.md`.
- Keep acceptance criteria measurable and testable.
- Keep `source_links` valid for each `TS-###` entry.
- Keep structured notes clear and scannable (tables, bullets, or concise prose), chosen by clarity.
- In `tasks.md`, avoid embedded diagrams as primary content; diagram links are allowed.

## 7) PRD MUST NOT
- Do not create contradictory statements across PRD docs.
- Do not duplicate requirements without clear cross-reference to source entries.
- Do not leave `TS-###` entries without upstream `source_links`.
- Do not proceed with unresolved PRD conflicts.
- Do not introduce ad-hoc PRD formats that bypass `PRD-rules.md`.

## 8) Conflict Handling
Target state is zero conflicts across PRD docs.

During drafting or updates:
- Detect contradictions immediately.
- Auto-resolve by aligning downstream docs to canonical upstream sources.

If auto-resolution is ambiguous, ask the user and provide:
- exact conflicting statements
- resolution options
- impact and risk of each option

## 9) PRD Evidence Contract
When any PRD file changes, report:
- required vs optional section compliance
- Doc+ID and `source_links` consistency
- acceptance criteria measurability in `tasks.md`
- conflict status (auto-resolved or user-escalated)

## 10) PRD Definition of Done
PRD work is complete only when:
- changed docs comply with `PRD-rules.md`
- no unresolved cross-doc conflicts remain
- Doc+ID references and `source_links` are coherent across PRD docs
- acceptance criteria are measurable and reviewable
- PRD evidence is included in the final report
