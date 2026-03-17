# Failure Playbook

## Purpose
Capture high-value stuck-case experience for reuse.

Keep full raw run history in `.tmp/test-diary.jsonl` (gitignored).  
Commit only promoted incident summaries in this file.

## Promotion Criteria
Create a playbook entry when any condition is true:
- Same `failure_signature` repeats for `>= 3` attempts.
- Task/check is `BLOCKED` for `> 1 day`.
- Fix relates to rollback risk or high-impact production risk.

## Entry Template
Use one entry per incident.

```md
## FP-YYYY-MM-DD-##

- incident_id: FP-YYYY-MM-DD-##
- failure_signature: <stable short signature>
- context: <component/system + TS IDs>
- attempts_failed: <count + short notes>
- final_fix_method: <what changed and why it worked>
- validation_result: <commands + PASS/FAIL/BLOCKED>
- prevention_check: <what now prevents recurrence>
- source_links: TS-###, MP-### (optional), UJ-### (optional), DG-### (optional), IP-### (optional)
- notes: <optional>
```

## Example
```md
## FP-2026-03-17-01

- incident_id: FP-2026-03-17-01
- failure_signature: auth-mw-redirect-loop
- context: auth middleware + TS-012
- attempts_failed: 3 (matcher issue, callback order, stale cookie state)
- final_fix_method: narrowed matcher and added callback guard for signed-out paths
- validation_result: `bun run verify:e2e` PASS, `bun run verify:integration` PASS
- prevention_check: added middleware regression smoke and route matcher assertion
- source_links: TS-012, UJ-004, IP-007
- notes: triggered by edge route in preview domain
```
