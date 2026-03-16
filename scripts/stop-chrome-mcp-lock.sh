#!/usr/bin/env bash
set -euo pipefail

PROFILE_DIR="${HOME}/.cache/chrome-devtools-mcp/chrome-profile"
WAIT_SECONDS=3

usage() {
  cat <<'EOF'
Usage:
  bash scripts/stop-chrome-mcp-lock.sh [--force]

Options:
  --force   If processes remain after SIGTERM wait, send SIGKILL.

Behavior:
  - Finds processes currently holding files under:
      ~/.cache/chrome-devtools-mcp/chrome-profile
  - Sends SIGTERM to those processes.
  - Waits 3 seconds.
  - Optionally sends SIGKILL when --force is provided.
EOF
}

FORCE=0
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
  exit 0
elif [[ "${1:-}" == "--force" ]]; then
  FORCE=1
elif [[ $# -gt 0 ]]; then
  echo "Unknown argument: $1" >&2
  usage
  exit 2
fi

if [[ ! -d "$PROFILE_DIR" ]]; then
  echo "Profile directory not found: $PROFILE_DIR"
  exit 0
fi

pids=()
while IFS= read -r line; do
  [[ -n "$line" ]] && pids+=("$line")
done < <(lsof -t +D "$PROFILE_DIR" 2>/dev/null | sort -u)

if [[ "${#pids[@]}" -eq 0 ]]; then
  echo "No lock-holder processes found for $PROFILE_DIR"
  exit 0
fi

echo "Lock-holder processes:"
for pid in "${pids[@]}"; do
  cmd="$(ps -p "$pid" -o command= 2>/dev/null || true)"
  if [[ -n "$cmd" ]]; then
    echo "  PID $pid  $cmd"
  else
    echo "  PID $pid"
  fi
done

echo "Sending SIGTERM..."
kill "${pids[@]}" 2>/dev/null || true
sleep "$WAIT_SECONDS"

remaining=()
while IFS= read -r line; do
  [[ -n "$line" ]] && remaining+=("$line")
done < <(lsof -t +D "$PROFILE_DIR" 2>/dev/null | sort -u)
if [[ "${#remaining[@]}" -eq 0 ]]; then
  echo "Lock released."
  exit 0
fi

echo "Still holding lock after SIGTERM: ${remaining[*]}"
if [[ "$FORCE" -eq 1 ]]; then
  echo "Sending SIGKILL..."
  kill -9 "${remaining[@]}" 2>/dev/null || true
  sleep 1
  final_remaining=()
  while IFS= read -r line; do
    [[ -n "$line" ]] && final_remaining+=("$line")
  done < <(lsof -t +D "$PROFILE_DIR" 2>/dev/null | sort -u)
  if [[ "${#final_remaining[@]}" -eq 0 ]]; then
    echo "Lock released after SIGKILL."
    exit 0
  fi
  echo "Unable to release lock. Remaining PIDs: ${final_remaining[*]}" >&2
  exit 1
fi

echo "Run with --force to send SIGKILL if needed."
exit 1
