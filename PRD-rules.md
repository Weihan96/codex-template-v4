# PRD Rules (Project Requirement Docs)

## 1) Purpose and Scope
This file defines the required structure for project requirement documents so they are readable for humans and reliable for AI coding agents.

Document set covered:
- `master-plan.md`
- `implementation-plan.md`
- `design-guideline.md`
- `user-journey.md`
- `tasks.md`

Use this rulebook as the default contract unless a project-specific override is explicitly documented.

## 2) Doc+ID Standard (Canonical)
Use document-coded IDs only.

| Doc | Code | ID Pattern | Example |
|---|---|---|---|
| `master-plan.md` | `MP` | `MP-###` | `MP-001` |
| `implementation-plan.md` | `IP` | `IP-###` | `IP-001` |
| `design-guideline.md` | `DG` | `DG-###` | `DG-001` |
| `user-journey.md` | `UJ` | `UJ-###` | `UJ-001` |
| `tasks.md` | `TS` | `TS-###` | `TS-001` |

Rules:
1. Numbering is per document sequence (`001`, `002`, `003`, ...).
2. Type meaning comes from field context, not ID prefix.
3. Hard switch policy: legacy type-prefixed IDs are not allowed in active policy/docs.
4. Task-scoped test records may use derivatives like `TS-012.T1`.

## 3) Global Writing Rules (All Docs)
1. Use concise, direct language and concrete terms.
2. Keep deterministic section headers for reliable scanning.
3. Limit `master-plan.md`, `implementation-plan.md`, `design-guideline.md`, and `user-journey.md` to 5 sections each.
4. Target 80-140 words per section (hard cap 200).
5. Use one idea per paragraph.
6. Use tables, bullets, and concise prose as equal options; choose the clearest format by section.
7. For the first 4 docs, visuals are recommended when they improve clarity; add a 2-4 line text summary under each visual.
8. For `tasks.md`, avoid embedded diagrams as primary content; use checklists, bullets, tables, and links to diagrams when needed.
9. Define terms once and reuse them consistently.
10. Explicitly list non-goals.
11. Do not duplicate requirements across docs; cross-link to the source entry.

## 4) Source-of-Truth and Conflict Handling
Source-of-truth mapping:
- `master-plan.md`: product intent, boundaries, success criteria.
- `implementation-plan.md`: technical approach, sequencing, rollout safety.
- `design-guideline.md`: UX/UI behavior rules.
- `user-journey.md`: flow logic, friction points, recovery behavior.
- `tasks.md`: executable work units, tests, acceptance evidence.

Conflict prevention rules:
- Target state is zero conflicts across PRD docs.
- Detect and resolve contradictions during drafting/updates before finalizing docs.
- Resolve by aligning downstream docs to the canonical upstream source for that topic.
- Do not proceed to implementation while unresolved PRD conflicts remain.

Escalation rule:
- If auto-resolution is ambiguous, ask the user and provide:
  - exact conflicting statements
  - resolution options
  - impact/risk of each option

Fallback order (only when auto-resolution is possible):
1. `master-plan.md`
2. `user-journey.md`
3. `design-guideline.md`
4. `implementation-plan.md`
5. `tasks.md`

`tasks.md` may refine execution details, but must not contradict upstream intent.

## 5) Required vs Optional Sections by File

### 5.1 `master-plan.md`
Allowed sections: up to 5 total.

1. **Vision and Problem** (`Required`)
2. **Scope and Non-goals** (`Required`)
3. **Success Metrics (KPIs)** (`Required`)
4. **Milestones and Roadmap** (`Optional`)
- Include when delivery spans multiple phases/releases.
5. **Risks and Key Decisions** (`Optional`)
- Include when uncertainty, major tradeoffs, or dependencies exist.

### 5.2 `implementation-plan.md`
Allowed sections: up to 5 total.

1. **Architecture Slices and Boundaries** (`Required`)
2. **Delivery Sequence and Dependencies** (`Required`)
3. **Verification Strategy** (`Required`)
4. **Migration/Rollback Plan** (`Optional`)
- Include when changing existing data flows, APIs, or production behavior.
5. **Performance/Security Constraints** (`Optional`)
- Include when explicit NFR targets or compliance risk exists.

### 5.3 `design-guideline.md`
Allowed sections: up to 5 total.

1. **Design Principles and UX Tone** (`Required`)
2. **Information Architecture and Navigation** (`Required`)
3. **Component and Interaction Rules** (`Required`)
4. **Accessibility Rules** (`Optional`)
- Include by default for user-facing products; omit only for non-UI/internal-only tooling.
5. **Content and Microcopy Rules** (`Optional`)
- Include when text UX, onboarding, or form-heavy flows are meaningful.

### 5.4 `user-journey.md`
Allowed sections: up to 5 total.

1. **Personas or Jobs-to-be-Done** (`Required`)
2. **Primary Journeys (Happy Paths)** (`Required`)
3. **Failure and Recovery Paths** (`Required`)
4. **Trust/Friction Moments** (`Optional`)
- Include when conversion, retention, or risk-sensitive flows matter.
5. **Journey Metrics and Instrumentation Points** (`Optional`)
- Include when analytics events are in scope.

### 5.5 `tasks.md`
No section count limit. Each task must follow the task card schema below.

Presentation rules:
- Use checklists, bullets, or markdown tables for backlog/index/summary views.
- Do not use embedded diagrams as the primary representation; links to diagrams are allowed.

## 6) `tasks.md` Task Card Schema (Required)
Every task entry must include:
- `task_id` (`TS-###`) + task name
- status (`todo`, `in_progress`, `blocked`, `done`)
- description (problem/context)
- goal (expected outcome)
- `source_links` (at least one upstream Doc+ID from `MP`, `UJ`, `DG`, `IP`)
- test plan (static, e2e, integration as applicable)
- smoke examples (`Given/When/Then` or command + expected result)
- acceptance criteria (checklist, measurable)
- source references (doc links and/or external links)

Recommended fields:
- owner
- estimate (S/M/L or points)
- dependencies/blockers
- evidence links (PR, screenshots, test logs)
- `test_links` (task-scoped test IDs such as `TS-012.T1`)
- `playbook_links` (entries in `docs/testing/failure-playbook.md` when promoted)

### Task Card Template
```md
## TS-###: <Task Name>

- task_id: TS-###
- status: todo|in_progress|blocked|done
- owner: <name> (optional)
- estimate: S|M|L (optional)
- source_links: MP-###, UJ-###, DG-### (optional), IP-### (optional)
- test_links: TS-###.T1 (optional)

### Description
<Context and current problem>

### Goal
<Outcome this task must produce>

### Implementation Notes
<Main files/components touched> (optional)

### Dependencies / Blockers
<Upstream task, env, decision> (optional)

### Test Plan
- Static: <command or N/A>
- E2E: <spec or flow>
- Integration: <contract checks or N/A>

### Smoke Examples
1. Given ...
2. When ...
3. Then ...

### Acceptance Criteria
- [ ] ...
- [ ] ...

### Source References
- <doc section link>
- <external reference link>

### Evidence
- <concise PR / run log / screenshot summary> (optional during draft, required at done)
- <playbook link when promotion criteria are met>
```

## 7) Human Cognitive Rules
1. Put a `Quick Read` block at top of each of the first 4 docs:
- objective
- target user
- in-scope
- out-of-scope
- current status
- links to related docs
2. Keep each section scannable in under 30 seconds.
3. Prefer the clearest scannable format (tables, bullets, concise prose); use diagrams mainly in the first 4 docs.
4. Use explicit numbers and thresholds instead of vague adjectives.
5. Keep decision history small and visible.

## 8) AI-Optimization Rules
1. Use deterministic headings exactly as defined in this file.
2. Keep each requirement atomic and testable.
3. Avoid ambiguous pronouns in critical requirements.
4. Add explicit pass/fail conditions whenever possible.
5. Use stable Doc+IDs and cross-links for retrieval and traceability.
6. Keep each task independently executable without hidden context.
7. When visuals are used (first 4 docs), include concise text equivalents directly below.
8. In `tasks.md`, prefer machine-parseable checklists/bullets/tables; avoid embedded diagrams but include links when useful.

## 9) Quality Checklist Before Merge
- All 5 docs exist and follow section limits/rules.
- Optional sections are included only when trigger conditions apply.
- Every `TS-###` links to at least one upstream `source_links` entry.
- Every acceptance criterion is measurable.
- No contradictory statements remain across docs.
- Structured notes use a clear, scannable format chosen by clarity.
- Visual elements (first 4 docs only) include short text summaries for AI parsing.
- Any detected conflict during drafting was resolved or escalated to the user.
- No legacy type-prefixed IDs remain in active policy/docs.
- For repeated/high-risk stuck cases, a playbook entry exists in `docs/testing/failure-playbook.md` and is linked from task evidence.
