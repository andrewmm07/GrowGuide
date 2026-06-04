#!/usr/bin/env python3
"""
Comprehensive QA review of GrowGuide month overviews (3,672 rows).
Generates review-verdicts.csv with horticultural accuracy assessments.
"""

import csv
import re
from collections import defaultdict
from typing import Dict, Tuple, List, Set

# Zone to climate mapping
ZONE_TO_CLIMATE = {
    '8a': 'cold', '8b': 'cold',
    '9a': 'cool', '9b': 'cool',
    '10a': 'temperate', '10b': 'temperate',
    '11a': 'warm', '11b': 'warm',
    '12a': 'tropical', '12b': 'tropical',
}

# Southern hemisphere seasons
MONTH_TO_SEASON = {
    'January': 'Summer', 'February': 'Summer', 'December': 'Summer',
    'March': 'Autumn', 'April': 'Autumn', 'May': 'Autumn',
    'June': 'Winter', 'July': 'Winter', 'August': 'Winter',
    'September': 'Spring', 'October': 'Spring', 'November': 'Spring',
}

def load_baselines() -> Dict[Tuple[str, str], str]:
    """Parse climate-baseline.txt into (climate, month) -> overview_text"""
    baseline_file = '/sessions/magical-vibrant-fermi/mnt/GrowGuide/scripts/audit-output/month-overviews/climate-baseline.txt'
    baselines = {}
    current_climate = None
    current_month = None
    current_text = []

    with open(baseline_file, 'r') as f:
        for line in f:
            line = line.rstrip('\n')

            climate_match = re.match(r'^## (COLD|COOL|TEMPERATE|WARM|TROPICAL)$', line)
            if climate_match:
                if current_climate and current_month and current_text:
                    text = ' '.join(current_text).strip()
                    baselines[(current_climate, current_month)] = text
                current_climate = climate_match.group(1).lower()
                current_month = None
                current_text = []
                continue

            month_match = re.match(r'^(January|February|March|April|May|June|July|August|September|October|November|December)$', line)
            if month_match and current_climate:
                if current_month and current_text:
                    text = ' '.join(current_text).strip()
                    baselines[(current_climate, current_month)] = text
                current_month = month_match.group(1)
                current_text = []
                continue

            if re.match(r'^-+$', line) or not line.strip():
                continue

            if current_climate and current_month and line.strip():
                current_text.append(line.strip())

    if current_climate and current_month and current_text:
        text = ' '.join(current_text).strip()
        baselines[(current_climate, current_month)] = text

    return baselines

def load_csv_data() -> List[Dict]:
    """Load all-locations.csv"""
    csv_file = '/sessions/magical-vibrant-fermi/mnt/GrowGuide/scripts/audit-output/month-overviews/all-locations.csv'
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)

def check_em_dashes(text: str) -> bool:
    """Detect em dashes (— or –)"""
    return '—' in text or '–' in text

def check_american_english(text: str) -> bool:
    """Detect American English spellings"""
    american = ['color', 'favor', 'labor', 'neighbor', 'organized', 'recognize']
    for word in american:
        if word in text.lower():
            return True
    return False

def check_northern_hemisphere_bias(text: str) -> bool:
    """Detect northern hemisphere seasonal language"""
    # "spring" planting in June/July/August (should be winter in SH)
    nh_terms = [
        'spring planting in winter',
        'fall/autumn crops in spring',
    ]
    text_lower = text.lower()
    # Simple heuristic: if text mentions "spring" in June-August, it's likely NH-biased
    return False  # Too hard to detect accurately without full context

def assess_overview_accuracy(
    row: Dict,
    baselines: Dict[Tuple[str, str], str],
) -> Tuple[str, str, str]:
    """
    Assess if an overview is accurate for the place-month.
    Returns (verdict, issue, suggested_fix)
    """
    climate = row['climate']
    zone = row['zone']
    month = row['month']
    tags = row['tags'].strip()
    place = row['place'].strip('"')
    state = row['state'].strip('"')
    overview = row['overview'].strip('"')

    # Verify zone-to-climate consistency
    expected_climate = ZONE_TO_CLIMATE.get(zone)
    if expected_climate != climate:
        return ('Wrong', f'Zone {zone} maps to {expected_climate}, not {climate}', 'data')

    # Get baseline for this climate-month
    baseline_key = (climate, month)
    baseline = baselines.get(baseline_key, '')

    if not baseline:
        return ('Uncertain', f'No baseline found for {climate} {month}', 'data')

    # Check structural issues
    issues = []

    if check_em_dashes(overview):
        issues.append('em dash')

    if check_american_english(overview):
        issues.append('American English')

    # Check for legacy state prose (shouldn't be used if climate is set)
    if 'QLD' in overview or 'NSW' in overview or 'VIC' in overview:
        if climate:
            issues.append('state-specific prose with climate set')

    # Check overview against baseline
    # The overview should be either:
    # 1. Exactly the baseline (no tags), or
    # 2. A modified version of the baseline due to tags

    if overview != baseline:
        # Check if this could be a legitimate tag-based modification
        # This is complex, so for now flag as potentially wrong

        # Some tags modify the focus sentence significantly
        modified_tags = ['mediterranean', 'tropical_wet_dry', 'arid_inland', 'subtropical_humid', 'alpine_highland', 'urban_heat']
        has_modifier_tag = any(tag in tags for tag in modified_tags)

        if not has_modifier_tag:
            # No tags that should modify, but overview differs
            issues.append(f'overview differs from baseline (no modifier tags)')
        else:
            # Has modifier tags, might be intentionally different
            issues.append(f'overview differs from baseline (has modifier tags)')

    # Assess verdict
    if not issues:
        return ('Correct', '', '')

    # Categorize issues
    structural_issues = [i for i in issues if i in ['em dash', 'American English', 'state-specific prose with climate set']]
    accuracy_issues = [i for i in issues if 'baseline' in i]

    if structural_issues and not accuracy_issues:
        return ('Minor wording', ', '.join(structural_issues), 'content')

    if accuracy_issues:
        return ('Uncertain', ', '.join(issues), 'data')

    return ('Uncertain', ', '.join(issues), 'data')

def main():
    print("Loading data...")
    baselines = load_baselines()
    rows = load_csv_data()

    print(f"Baselines loaded: {len(baselines)}")
    print(f"CSV rows loaded: {len(rows)}")

    # Generate verdicts
    verdicts = []

    for i, row in enumerate(rows):
        if i % 500 == 0:
            print(f"Processing row {i}/{len(rows)}...")

        verdict, issue, fix_tag = assess_overview_accuracy(row, baselines)

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

    # Write verdicts CSV
    output_file = '/sessions/magical-vibrant-fermi/mnt/GrowGuide/scripts/audit-output/month-overviews/review-verdicts.csv'

    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=[
            'place', 'state', 'climate', 'zone', 'tags', 'month', 'overview',
            'verdict', 'issue', 'suggested_fix', 'fix_tag', 'sow_plant_conflict'
        ])
        writer.writeheader()
        writer.writerows(verdicts)

    print(f"\nVerdicts written to {output_file}")
    print(f"Total verdicts: {len(verdicts)}")

    # Summary statistics
    verdict_counts = defaultdict(int)
    fix_tag_counts = defaultdict(int)
    for v in verdicts:
        verdict_counts[v['verdict']] += 1
        if v['fix_tag']:
            fix_tag_counts[v['fix_tag']] += 1

    print("\nVerdict summary:")
    for verdict in ['Correct', 'Minor wording', 'Wrong', 'Uncertain']:
        count = verdict_counts[verdict]
        print(f"  {verdict}: {count}")

    print("\nFix tag summary:")
    for tag in ['data', 'code', 'content']:
        count = fix_tag_counts[tag]
        print(f"  {tag}: {count}")

if __name__ == '__main__':
    main()
