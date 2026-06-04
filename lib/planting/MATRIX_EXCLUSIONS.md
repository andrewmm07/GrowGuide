# Planting matrix exclusions

Crops in `plants-definitions.json` / Supabase that intentionally have **no** sow/plant windows in `plantingByClimate.ts`.

## Sea Asparagus (samphire)

**Status:** Excluded from matrices.

**Reason:** Coastal saline specialty crop; most home gardeners do not sow samphire from seed on a seasonal calendar. It is often foraged or grown in dedicated saline beds. Adding generic lettuce-style windows would mislead users in inland climates.

**UX:** Plant picker shows “Not advised for this season” (`methodMatch: no_window`). Timeline data may still exist for users who add it manually to My Garden.

## Duplicate / alias-only entries

These DB names resolve via `plantTimingAliases.ts` and do not need separate matrix labels:

| Database name   | Resolves to                          |
|-----------------|--------------------------------------|
| Artichoke       | Globe Artichoke (matrix + alias)     |
| Cardoon         | Globe Artichoke (alias)              |
| Endive          | Lettuce windows (alias)              |
| Chicory         | Lettuce windows (alias)              |
| Radicchio       | Lettuce windows (alias)              |
| Watercress      | Lettuce windows (alias)              |
| Warrigal Greens | Asian Greens windows (alias)         |
