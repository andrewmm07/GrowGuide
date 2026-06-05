# Archive

Non-product code and historical documentation quarantined so agents and contributors focus on `app/`, `lib/`, and `supabase/`.

## Layout

| Path | Contents |
|------|----------|
| `legacy-src/` | Former root `src/` — old React app (excluded from `tsconfig.json`) |
| `garden-app/` | Unused Next scaffold |
| `garden-planner/` | Unused Next scaffold |
| `root-components/` | Former root `components/` (duplicate of `app/components/`) |
| `docs/` | Obsolete root `.md` status/audit/prompt files |
| `calendar/` | Pre-app-router calendar experiment |

## Rules

- Do **not** import from `archive/**` in active app code
- `tsconfig.json` and ESLint ignore these paths
- Index of moved docs: [docs/ARCHIVE_INDEX.md](../docs/ARCHIVE_INDEX.md)
