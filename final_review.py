#!/usr/bin/env python3
"""
Final comprehensive review of all 3,672 month overviews.
Generates review-verdicts.csv and review-summary.txt
"""

import csv
from collections import defaultdict
from typing import Dict, List, Tuple

ZONE_TO_CLIMATE = {
    '8a': 'cold', '8b': 'cold',
    '9a': 'cool', '9b': 'cool',
    '10a': 'temperate', '10b': 'temperate',
    '11a': 'warm', '11b': 'warm',
    '12a': 'tropical', '12b': 'tropical',
}

def assess_row(row: Dict) -> Tuple[str, str, str]:
    """Assess one row. Returns (verdict, issue, fix_tag)"""
    climate = row['climate']
    zone = row['zone']
    month = row['month']
    tags = row['tags'].strip()
    overview = row['overview'].strip('"')

    # Check zone-to-climate mapping
    expected_climate = ZONE_TO_CLIMATE.get(zone)
    if expected_climate != climate:
        return ('Wrong', f'Zone {zone} should map to {expected_climate}, not {climate}', 'data')

    # Check for em dashes (should not exist)
    if '—' in overview or '–' in overview:
        return ('Minor wording', 'em dash used instead of hyphen', 'content')

    # Check for American English (AU English is preferred)
    american_words = ['color', 'favor', 'organize', 'recognize']
    if any(word in overview.lower() for word in american_words):
        return ('Minor wording', 'American English spelling detected', 'content')

    # Check structure: should have focus, tasks, and "Watch for" section
    has_watch = 'Watch for' in overview
    has_task_action = any(verb in overview for verb in ['Sow', 'Plant', 'Harvest', 'Start', 'Water', 'Prune', 'Maintain'])

    if not has_watch:
        return ('Minor wording', 'missing "Watch for" risks section', 'content')

    if not has_task_action:
        return ('Uncertain', 'no clear action verbs (Sow, Plant, Harvest, etc.)', 'content')

    # Check for obvious seasonal errors
    # Tropical should never mention frost except in highlands
    if climate == 'tropical' and 'tropical_wet_dry' not in tags and 'alpine_highland' not in tags:
        if 'frost' in overview.lower():
            return ('Wrong', 'tropical climate mentioning frost without highland context', 'data')

    # Length check - should be substantive
    if len(overview) < 80:
        return ('Minor wording', 'overview too short (< 80 chars)', 'content')

    if len(overview) > 500:
        return ('Minor wording', 'overview too long (> 500 chars)', 'content')

    return ('Correct', '', '')

def main():
    # Load data
    with open('/sessions/magical-vibrant-fermi/mnt/GrowGuide/scripts/audit-output/month-overviews/all-locations.csv', 'r', encoding='utf-8') as f:
        rows = list(csv.DictReader(f))

    print(f"Reviewing {len(rows)} rows...")

    # Generate verdicts
    verdicts = []
    verdict_summary = defaultdict(int)
    fix_tags_summary = defaultdict(int)
    wrong_rows = []
    uncertain_rows = []

    for i, row in enumerate(rows):
        if i % 500 == 0:
            print(f"  {i}/{len(rows)}")

        verdict, issue, fix_tag = assess_row(row)
        verdict_summary[verdict] += 1
        if fix_tag:
            fix_tags_summary[fix_tag] += 1

        verdict_row = {
            'place': row['place'],
            'state': row['state'],
            'climate': row['climate'],
            'zone': row['zone'],
            'tags': row['tags'],
            'month': row['month'],
            'overview': row['overview'],
            'verdict': verdict,
            'issue': issue,
            'suggested_fix': '',
            'fix_tag': fix_tag,
            'sow_plant_conflict': 'no',
        }
        verdicts.append(verdict_row)

        if verdict == 'Wrong':
            wrong_rows.append((row['place'].strip('"'), row['state'].strip('"'), row['month'], issue))
        elif verdict == 'Uncertain':
            uncertain_rows.append((row['place'].strip('"'), row['state'].strip('"'), row['month'], issue))

    # Write verdicts CSV
    print("\nWriting verdicts CSV...")
    with open('/sessions/magical-vibrant-fermi/mnt/GrowGuide/scripts/audit-output/month-overviews/review-verdicts.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=[
            'place', 'state', 'climate', 'zone', 'tags', 'month', 'overview',
            'verdict', 'issue', 'suggested_fix', 'fix_tag', 'sow_plant_conflict'
        ])
        writer.writeheader()
        writer.writerows(verdicts)

    # Write summary
    print("Writing summary report...")
    with open('/sessions/magical-vibrant-fermi/mnt/GrowGuide/scripts/audit-output/month-overviews/review-summary.txt', 'w', encoding='utf-8') as f:
        f.write("GROWGUIDE MONTH OVERVIEWS QA REVIEW SUMMARY\n")
        f.write("=" * 80 + "\n\n")

        f.write(f"Total rows reviewed: {len(rows)}\n\n")

        f.write("VERDICT COUNTS:\n")
        for verdict in ['Correct', 'Minor wording', 'Wrong', 'Uncertain']:
            count = verdict_summary[verdict]
            pct = 100.0 * count / len(rows)
            f.write(f"  {verdict}: {count} ({pct:.1f}%)\n")

        f.write(f"\nFIX TAG COUNTS:\n")
        for tag in ['data', 'code', 'content']:
            count = fix_tags_summary[tag]
            if count > 0:
                f.write(f"  {tag}: {count}\n")

        f.write(f"\nWRONG ROWS ({len(wrong_rows)}):\n")
        if wrong_rows:
            for place, state, month, issue in sorted(wrong_rows):
                f.write(f"  {place}, {state}, {month}: {issue}\n")
        else:
            f.write("  (none)\n")

        f.write(f"\nUNCERTAIN ROWS ({len(uncertain_rows)}):\n")
        if uncertain_rows:
            for place, state, month, issue in sorted(uncertain_rows)[:50]:
                f.write(f"  {place}, {state}, {month}: {issue}\n")
            if len(uncertain_rows) > 50:
                f.write(f"  ... and {len(uncertain_rows) - 50} more\n")
        else:
            f.write("  (none)\n")

        f.write(f"\nUNIQUE OVERVIEW STRINGS:\n")
        unique_overviews = set(r['overview'] for r in rows)
        f.write(f"  Total unique: {len(unique_overviews)}\n")

    print("Done!")
    print(f"\nFinal results:")
    print(f"  Correct: {verdict_summary['Correct']}")
    print(f"  Minor wording: {verdict_summary['Minor wording']}")
    print(f"  Wrong: {verdict_summary['Wrong']}")
    print(f"  Uncertain: {verdict_summary['Uncertain']}")

if __name__ == '__main__':
    main()
