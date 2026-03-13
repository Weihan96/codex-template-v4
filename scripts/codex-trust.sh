#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  scripts/codex-trust.sh [--project-path /abs/path] [--config /path/to/config.toml] [--unset]

Description:
  Set mode (default): mark target project as trusted in Codex config:
    [projects."<absolute-project-path>"]
    trust_level = "trusted"

  Unset mode (--unset): remove the target project's [projects."..."] section from config.
EOF
}

project_path=""
config_path="${HOME}/.codex/config.toml"
unset_mode="false"

while [ "$#" -gt 0 ]; do
  case "$1" in
    --project-path)
      if [ "$#" -lt 2 ]; then
        echo "Missing value for --project-path" >&2
        usage
        exit 1
      fi
      project_path="$2"
      shift 2
      ;;
    --config)
      if [ "$#" -lt 2 ]; then
        echo "Missing value for --config" >&2
        usage
        exit 1
      fi
      config_path="$2"
      shift 2
      ;;
    --unset)
      unset_mode="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [ -z "$project_path" ]; then
  project_path="$(pwd)"
fi

project_path="$(cd "$project_path" && pwd)"

config_dir="$(dirname "$config_path")"
section_header="[projects.\"${project_path}\"]"
trusted_line='trust_level = "trusted"'

if [ "$unset_mode" = "true" ]; then
  if [ ! -f "$config_path" ]; then
    echo "No config file found, nothing to unset: $config_path"
    exit 0
  fi

  if ! grep -Fxq "$section_header" "$config_path"; then
    echo "No trust section found for: $project_path"
    echo "Config file: $config_path"
    exit 0
  fi

  awk -v header="$section_header" '
    BEGIN {
      in_target = 0
    }
    {
      if ($0 == header) {
        in_target = 1
        next
      }

      if (in_target == 1 && $0 ~ /^\[.*\]$/) {
        in_target = 0
      }

      if (in_target == 0) {
        print
      }
    }
  ' "$config_path" > "${config_path}.tmp"
  mv "${config_path}.tmp" "$config_path"
  echo "Removed trust section for: $project_path"
else
  mkdir -p "$config_dir"
  touch "$config_path"

  if grep -Fxq "$section_header" "$config_path"; then
    # Update trust_level inside the section if present; insert it if missing.
    awk -v header="$section_header" -v trusted="$trusted_line" '
      BEGIN {
        in_section = 0
        saw_trust = 0
      }
      {
        if ($0 == header) {
          in_section = 1
          saw_trust = 0
          print
          next
        }

        if (in_section == 1 && $0 ~ /^\[.*\]$/) {
          if (saw_trust == 0) {
            print trusted
          }
          in_section = 0
        }

        if (in_section == 1 && $0 ~ /^trust_level[[:space:]]*=/) {
          if (saw_trust == 0) {
            print trusted
            saw_trust = 1
          }
          next
        }

        print
      }
      END {
        if (in_section == 1 && saw_trust == 0) {
          print trusted
        }
      }
    ' "$config_path" > "${config_path}.tmp"
    mv "${config_path}.tmp" "$config_path"
    echo "Updated trust entry for: $project_path"
  else
    {
      echo
      echo "$section_header"
      echo "$trusted_line"
    } >> "$config_path"
    echo "Added trust entry for: $project_path"
  fi
fi

echo "Config file: $config_path"
