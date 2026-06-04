#!/usr/bin/env python3
"""
Systematically expand plants database from 30 to 100+ varieties
Generates plant entries with proper structure and detailed activities
"""

import json
from typing import Dict, List, Any

def create_plant_entry(
    name: str,
    common_names: List[str],
    category: str,
    sow_to_seedling: int,
    seedling_to_harvest: int,
    harvest_window: int,
    key_activities: List[Dict[str, Any]],
    zone_multipliers: Dict[str, float],
) -> Dict[str, Any]:
    """Create a standardized plant entry with all zones"""

    zones = {}
    zone_data = {
        "8a": {"multiplier": 1.3, "frequency": 5, "care": ["Protect from frost", "Start early"], "bestPlantMonth": 10},
        "8b": {"multiplier": 1.2, "frequency": 4, "care": ["Monitor frost dates", "Use season extenders"], "bestPlantMonth": 10},
        "9a": {"multiplier": 1.0, "frequency": 3, "care": ["Standard conditions"], "bestPlantMonth": 9},
        "9b": {"multiplier": 1.05, "frequency": 3, "care": ["Slightly warmer than 9a"], "bestPlantMonth": 8},
        "10a": {"multiplier": 0.95, "frequency": 2, "care": ["Provide afternoon shade in summer"], "bestPlantMonth": 3},
        "10b": {"multiplier": 0.9, "frequency": 2, "care": ["Shade cloth often needed", "Monitor for heat stress"], "bestPlantMonth": 2},
        "11a": {"multiplier": 0.85, "frequency": 1, "care": ["Frequent watering in dry season", "Heavy shade for cool-season crops"], "bestPlantMonth": 1},
        "12b": {"multiplier": 0.8, "frequency": 1, "care": ["Year-round growing potential", "Shade critical for many crops"], "bestPlantMonth": 1},
    }

    for zone, base_data in zone_data.items():
        zones[zone] = {
            "multiplier": base_data["multiplier"] * zone_multipliers.get(category, 1.0),
            "frequency": base_data["frequency"],
            "care": base_data["care"],
            "bestPlantMonth": base_data["bestPlantMonth"]
        }

    return {
        "name": name,
        "commonNames": common_names,
        "category": category,
        "sowToSeedling": sow_to_seedling,
        "seedlingToHarvest": seedling_to_harvest,
        "harvestWindow": harvest_window,
        "warm": {"multiplier": zone_multipliers.get(f"{category}_warm", 0.9), "frequency": 2, "care": []},
        "cool": {"multiplier": zone_multipliers.get(f"{category}_cool", 1.2), "frequency": 4, "care": []},
        "temperate": {"multiplier": 1.0, "frequency": 3, "care": []},
        "zones": zones,
        "keyActivities": key_activities,
    }


# Example expansions for each category
NEW_PLANTS = {
    "fruiting": [
        {
            "name": "Cherry Tomato",
            "common_names": ["Sweet 100", "Sungold", "Black Cherry"],
            "sow_to_seedling": 21,
            "seedling_to_harvest": 55,
            "harvest_window": 60,
            "activities": [
                # Truncated for example - would include full activity timeline
                {"timing": 21, "activity": "Fertilise", "details": "Cherry tomatoes need consistent nutrition. Apply balanced 5-5-5 fertilizer at 1 tablespoon per plant, 4 inches from stem. Water thoroughly. Feed every 3 weeks.", "category": "fertilizing"},
                {"timing": 35, "activity": "Install support", "details": "Unlike large beefsteaks, cherry tomatoes sprawl. Use 5-6 foot cages or stakes. Cherry varieties produce hundreds of fruits - support is critical to prevent branch breakage under weight.", "category": "planting"},
                {"timing": 45, "activity": "Remove suckers", "details": "Pinch off suckers (shoots between main stem and branches) to direct energy to fruit. Cherry tomatoes benefit less from aggressive pruning than large varieties but still improve with some management.", "category": "pruning"},
                {"timing": 55, "activity": "Harvest continuously", "details": "Cherry tomatoes ripen continuously. Harvest ripe fruits every 2-3 days. Leave overripe fruit on the vine—it signals plant to stop flowering. Daily picking extends season significantly.", "category": "harvest"},
            ]
        },
        # ... more fruiting varieties
    ],
    "leafy": [
        {
            "name": "Rocket (Arugula)",
            "common_names": ["Roquette", "Wild rocket"],
            "sow_to_seedling": 5,
            "seedling_to_harvest": 30,
            "harvest_window": 21,
            "activities": [
                {"timing": 7, "activity": "Thin seedlings", "details": "When rocket has 2-3 leaves, thin to 6 inches apart. Rocket seeds densely - aggressive thinning prevents leggy plants. Cut seedlings at soil level to avoid root disturbance.", "category": "planting"},
                {"timing": 14, "activity": "Monitor for flea beetles", "details": "Flea beetles are rocket's main pest. Look for tiny round holes in leaves (window-like damage). Young plants vulnerable. Use row covers, or spray neem oil every 5-7 days if damage appears.", "category": "pest"},
                {"timing": 25, "activity": "Begin harvesting leaves", "details": "Harvest outer leaves when 4-6 inches long. Cut 1 inch above soil for regrowth. Rocket matures quickly in cool seasons (as early as day 20-25). Warm weather causes early bolting and bitterness.", "category": "harvest"},
                {"timing": 30, "activity": "Harvest before bolting", "details": "Rocket bolts quickly in heat. Once flowering begins, leaves become bitter and tough. Harvest entire remaining plant if bolting starts. This crop is cool-season only in warm zones—time plantings accordingly.", "category": "harvest"},
            ]
        },
        # ... more leafy varieties
    ],
    "root": [
        {
            "name": "Daikon Radish",
            "common_names": ["Mooli", "Winter radish"],
            "sow_to_seedling": 5,
            "seedling_to_harvest": 50,
            "harvest_window": 21,
            "activities": [
                {"timing": 10, "activity": "Thin to 6 inches apart", "details": "Daikon is large—needs more space than spring radish. Thin to 6-8 inches apart when seedlings have 2-3 leaves. Proper spacing prevents tiny, woody roots. Cut unwanted seedlings at soil level.", "category": "planting"},
                {"timing": 30, "activity": "Check sizing", "details": "Daikon roots can reach 12 inches long and 3+ inches diameter. Gently brush soil to monitor growth. Ideal harvest size depends on variety (2-4 inches diameter typical). Don't expose roots—re-cover soil gently.", "category": "harvest"},
                {"timing": 50, "activity": "Harvest before hard frost", "details": "Daikon tolerates cold but becomes woody if frozen then thawed. Harvest just before hard frosts expected. Roots store 2-3 months in cool (40-50°F), humid conditions. Leave soil attached during storage.", "category": "harvest"},
            ]
        },
        # ... more root varieties
    ],
    "herb_soft": [
        {
            "name": "Thai Basil",
            "common_names": ["Horapha", "Asian basil"],
            "sow_to_seedling": 7,
            "seedling_to_harvest": 35,
            "harvest_window": 90,
            "activities": [
                {"timing": 10, "activity": "Pinch growing tips early", "details": "Thai basil needs more aggressive pinching than sweet basil to stay bushy. When 6 inches tall, pinch off top 2-3 leaf pairs. Repeat weekly. Thai basil flowers earlier and more readily than sweet basil.", "category": "pruning"},
                {"timing": 21, "activity": "Remove flower buds", "details": "Thai basil flowers profusely and early. Pinch off flower buds constantly (every 2-3 days). Flowering makes leaves bitter and stops vegetative growth. This is more demanding than sweet basil maintenance.", "category": "pruning"},
                {"timing": 35, "activity": "Harvest regularly", "details": "Harvest by pinching stem tips (top 2-3 leaf pairs). Thai basil has stronger, more peppery flavor than sweet basil. Harvest 2-3 times per week in warm weather. Plant reaches 18-24 inches with good management.", "category": "harvest"},
            ]
        },
        # ... more soft herb varieties
    ],
    "fruit": [
        {
            "name": "Strawberry",
            "common_names": ["June-bearing", "Ever-bearing", "Day-neutral"],
            "sow_to_seedling": 30,
            "seedling_to_harvest": 120,
            "harvest_window": 180,
            "activities": [
                {"timing": 30, "activity": "Plant in prepared beds", "details": "Strawberries need rich, well-draining soil with pH 6.0-6.8. Plant crowns just above soil level—burying them causes rot, leaving exposed kills growth point. Space 12-18 inches apart in rows 3 feet apart.", "category": "planting"},
                {"timing": 60, "activity": "Remove runners if needed", "details": "June-bearing varieties produce runners (plantlets). Remove them to force energy into fruit. Ever-bearing and day-neutral produce fewer runners. Runners can be pegged down to create new plants for next season's bed.", "category": "pruning"},
                {"timing": 90, "activity": "Remove first flowers", "details": "First-year plants: pinch off all flowers to build strong plants. This sacrifices first year's harvest but gives 3-5 years of high productivity after. Skip this on established beds.", "category": "pruning"},
                {"timing": 120, "activity": "Monitor for disease", "details": "Strawberries suffer from leaf spot, powdery mildew, and gray mold (botrytis). Ensure 18-24 inches between plants for air flow. Remove diseased leaves. Don't overhead water—water at soil level only.", "category": "pest"},
                {"timing": 150, "activity": "Harvest ripe berries", "details": "Pick berries when fully red (flavor continues ripening after picking more than with most fruits). Harvest in morning when cool. Eat same day if possible—strawberries spoil quickly. Pinch stems to avoid damaging fruit.", "category": "harvest"},
                {"timing": 180, "activity": "Renewal for next season", "details": "After final harvest, either replant (every 3 years recommended) or renew existing bed by mowing down plants to 1 inch, then fertilizing and watering heavily for regrowth. Beds produce best first 2-3 years.", "category": "pruning"},
            ]
        },
        # ... more fruit varieties
    ],
}

if __name__ == "__main__":
    print("Plant database expansion generator")
    print("This script generates plant entries for comprehensive expansion")
    print("\nCategories to expand:")
    for cat, plants in NEW_PLANTS.items():
        print(f"  {cat}: {len(plants)} plants defined as examples")

    print("\nNote: This is a template generator. Full database expansion requires:")
    print("  1. Complete activity timelines (8-12 per plant)")
    print("  2. Zone-specific care instructions")
    print("  3. Verification of Australian climate applicability")
    print("  4. Companion planting data (optional)")
