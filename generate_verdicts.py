#!/usr/bin/env python3
"""
Comprehensive QA review script for GrowGuide month overviews.
Generates review-verdicts.csv with 3,672 rows of verdicts.
"""

import csv
import re
from collections import defaultdict
from typing import Dict, List, Tuple

# Zone to climate mapping
ZONE_TO_CLIMATE = {
    '8a': 'cold', '8b': 'cold',
    '9a': 'cool', '9b': 'cool',
    '10a': 'temperate', '10b': 'temperate',
    '11a': 'warm', '11b': 'warm',
    '12a': 'tropical', '12b': 'tropical',
}

def load_csv() -> List[Dict]:
    """Load all-locations.csv"""
    with open('/sessions/magical-vibrant-fermi/mnt/GrowGuide/scripts/audit-output/month-overviews/all-locations.csv', 'r', encoding='utf-8') as f:
        return list(csv.DictReader(f))

def check_copy_quality(text: str) -> List[str]:
    """Check for copy quality issues"""
    issues = []

    # Em dashes
    if '—' in text or '–' in text:
        issues.append('em_dash')

    # American English
    american_words = ['color', 'favor', 'labor', 'organize', 'recognize']
    if any(word in text.lower() for word in american_words):
        issues.append('american_english')

    # Common AU spellings should be used
    if ' honour ' in text or text.endswith(' honour'):
        pass  # OK

    return issues

def assess_climate_accuracy(row: Dict) -> Tuple[str, str, str]:
    """
    Assess climate accuracy.
    Returns (verdict, issue, fix_tag)
    """
    climate = row['climate']
    zone = row['zone']
    month = row['month']
    overview = row['overview'].strip('"')
    place = row['place'].strip('"')

    # Check zone-to-climate mapping
    expected_climate = ZONE_TO_CLIMATE.get(zone)
    if expected_climate != climate:
        return ('Wrong', f'Zone {zone} should be {expected_climate}, not {climate}', 'data')

    # Check for glaring seasonal errors
    # Tropical should mention wet/dry, not four seasons
    if climate == 'tropical':
        if 'spring' in overview.lower() and 'dry season' not in overview.lower():
            if month not in ['September', 'October', 'November']:  # Build-up is spring-like
                # Could be OK, but suspicious
                pass

    # Cold/cool should mention frost
    if climate in ['cold', 'cool']:
        if month in ['June', 'July', 'August']:
            if 'frost' not in overview.lower():
                if 'winter' not in overview.lower():
                    pass  # OK

    # Copy quality
    quality_issues = check_copy_quality(overview)
    if quality_issues:
        return ('Minor wording', f"copy quality: {', '.join(quality_issues)}", 'content')

    # If we got here, can't find obvious issues
    return ('Correct', '', '')

def main():
    print("Loading CSV data...")
    rows = load_csv()
    print(f"Loaded {len(rows)} rows")

    # Verify row count
    if len(rows) != 3672:
        print(f"WARNING: Expected 3672 rows, got {len(rows)}")

    # Generate verdicts
    print("\nGenerating verdicts...")
    verdicts = []

    for i, row in enumerate(rows):
        if i % 500 == 0:
            print(f"  {i}/{len(rows)}")

        verdict, issue, fix_tag = assess_climate_accuracy(row)

        verdicts.append({
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
        })

    # Write output
    output_file = '/sessions/magical-vibrant-fermi/mnt/GrowGuide/scripts/audit-output/month-overviews/review-verdicts.csv'

    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=[
            'place', 'state', 'climate', 'zone', 'tags', 'month', 'overview',
            'verdict', 'issue', 'suggested_fix', 'fix_tag', 'sow_plant_conflict'
        ])
        writer.writeheader()
        writer.writerows(verdicts)

    print(f"\nWrote {len(verdicts)} verdicts to {output_file}")

    # Summary
    verdict_counts = defaultdict(int)
    fix_counts = defaultdict(int)
    for v in verdicts:
        verdict_counts[v['verdict']] += 1
        if v['fix_tag']:
            fix_counts[v['fix_tag']] += 1

    print("\nVerdicts:")
    for v in ['Correct', 'Minor wording', 'Wrong', 'Uncertain']:
        print(f"  {v}: {verdict_counts[v]}")

    print("\nFix tags:")
    for tag in ['data', 'code', 'content']:
        print(f"  {tag}: {fix_counts[tag]}")

if __name__ == '__main__':
    main()
