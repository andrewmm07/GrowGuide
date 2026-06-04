"""
GrowGuide Month Overview Rewriter
Uses the Claude CLI (already authenticated) to rewrite all 3,672 overviews.
Run: python rewrite_overviews.py
"""

import csv
import subprocess
import os
import time
import json
from pathlib import Path

INPUT_CSV = Path(__file__).parent / "scripts/audit-output/month-overviews/all-locations.csv"
OUTPUT_CSV = Path(__file__).parent / "rewritten_overviews.csv"
CHECKPOINT_FILE = Path(__file__).parent / ".rewrite_checkpoint.json"

PROMPT_TEMPLATE = """Rewrite this GrowGuide month overview in the Peter Cundall sharp voice.

LOCATION: {place}, {state} ({climate} climate, zone {zone})
MONTH: {month}
TAGS: {tags}

CURRENT OVERVIEW:
{overview}

REWRITE RULES:
- Conversational warmth + genuine authority (trust reader as experienced)
- Explain WHY timing/crops matter, not just WHAT
- One specific local insight (frost patterns, wind, soil, seasonal shift for this climate)
- Direct, sharp language. NO clichés (stay ahead of, precious, matters most, watch for)
- NO generic seasonal openers (Summer is at its peak, Late summer is...)
- NO semicolons. Use periods or dashes.
- 120-200 words. Every sentence earns its place.
- Actionable. Reader knows what to plant/do/watch.
- Australian English only.

VARY STRUCTURE - pick one:
Option A: Opening insight -> core actions -> real watchpoint
Option B: Season shift -> what works -> why timing matters
Option C: The reality -> straight advice -> local pattern

OUTPUT:
Rewritten overview only. No preamble. No label. Just the paragraph(s). 120-200 words."""


def load_checkpoint():
    if CHECKPOINT_FILE.exists():
        with open(CHECKPOINT_FILE) as f:
            return json.load(f)
    return {"completed": 0, "rows": {}}


def save_checkpoint(checkpoint):
    with open(CHECKPOINT_FILE, "w") as f:
        json.dump(checkpoint, f)


def call_claude(prompt, retries=3):
    for attempt in range(retries):
        try:
            result = subprocess.run(
                ["claude", "-p", prompt],
                capture_output=True,
                text=True,
                timeout=60
            )
            if result.returncode == 0 and result.stdout.strip():
                return result.stdout.strip()
            else:
                print(f"  Error (attempt {attempt+1}): {result.stderr[:100]}")
        except subprocess.TimeoutExpired:
            print(f"  Timeout (attempt {attempt+1})")
        except FileNotFoundError:
            print("ERROR: 'claude' CLI not found. Make sure you're running this from a terminal where 'claude' is available.")
            raise
        if attempt < retries - 1:
            time.sleep(2 ** attempt)
    return None


def main():
    checkpoint = load_checkpoint()
    completed_keys = set(checkpoint.get("rows", {}).keys())

    rows = []
    with open(INPUT_CSV, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    total = len(rows)
    print(f"Total rows: {total}")
    print(f"Already completed: {len(completed_keys)}")
    print(f"Remaining: {total - len(completed_keys)}")
    print()

    # Write output CSV header if starting fresh
    output_exists = OUTPUT_CSV.exists() and len(completed_keys) > 0
    fieldnames = list(rows[0].keys()) + ["rewritten_overview"]

    if not output_exists:
        with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()

    processed = 0
    with open(OUTPUT_CSV, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)

        for i, row in enumerate(rows):
            key = f"{row['place']}_{row['state']}_{row['month']}"

            if key in completed_keys:
                continue

            prompt = PROMPT_TEMPLATE.format(
                place=row["place"].strip('"'),
                state=row["state"].strip('"'),
                climate=row["climate"],
                zone=row["zone"],
                tags=row.get("tags", ""),
                month=row["month"],
                overview=row["overview"].strip('"')
            )

            rewritten = call_claude(prompt)

            if rewritten is None:
                print(f"  SKIPPED row {i+1}: {key}")
                rewritten = row["overview"]  # fallback to original

            out_row = dict(row)
            out_row["rewritten_overview"] = rewritten
            writer.writerow(out_row)
            f.flush()

            checkpoint["rows"][key] = True
            checkpoint["completed"] = len(checkpoint["rows"])
            processed += 1

            if processed % 50 == 0:
                save_checkpoint(checkpoint)
                print(f"Progress: {len(checkpoint['rows'])}/{total} ({100*len(checkpoint['rows'])//total}%)")

    save_checkpoint(checkpoint)
    print(f"\nDone! {len(checkpoint['rows'])} rows written to {OUTPUT_CSV}")


if __name__ == "__main__":
    main()
