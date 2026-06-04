#!/usr/bin/env python3
"""
Generate 3,672 month overviews for Australian gardens.
Peter Cundall + Monty Don voice, informed by climate/zone/month data.
"""

import csv
from pathlib import Path

# Month-to-season mapping (Southern Hemisphere)
MONTH_TO_SEASON = {
    'January': 'summer',
    'February': 'summer',
    'March': 'autumn',
    'April': 'autumn',
    'May': 'autumn',
    'June': 'winter',
    'July': 'winter',
    'August': 'winter',
    'September': 'spring',
    'October': 'spring',
    'November': 'spring',
    'December': 'summer',
}

def generate_overview(place, state, climate, zone, tags, month):
    """Generate overview for one location-month combination."""

    season = MONTH_TO_SEASON[month]
    coastal = 'coastal' in tags
    inland = 'inland' in tags

    # COLD CLIMATE (Tasmania, high altitude)
    if climate == 'cold':
        if month == 'January':
            return (f"Summer is properly established now in {place}. Tomatoes, beans, cucumbers and zucchini should be producing heavily in any reasonably sunny, sheltered garden. Pick constantly. A neglected bean or oversized zucchini slows the whole plant down.\n\n"
                   f"There is still time for late tomatoes from strong seedlings, particularly in warm gardens. Capsicums and eggplants become less certain from this point onward unless you have excellent sun, protection from wind, or greenhouse help.\n\n"
                   f"The autumn garden begins now. Sow carrots, beetroot, parsnips, broccoli, kale, cabbage, silverbeet and turnips while the soil still carries summer warmth. Lettuce seed struggles in heat. Chill it first or sow in shade during cooler parts of the day.\n\n"
                   f"Water deeply in the morning rather than little and often. Dry soil followed by sudden soaking stresses plants badly in the wind. Mulch heavily while the ground is still warm and moist underneath.")

        elif month == 'February':
            return (f"The garden still looks summery in {place}, though the light softens by month's end. Nights cool slightly and the frantic pace of early summer eases.\n\n"
                   f"Plant out brassicas started in January. Broccoli, cabbage, cauliflower and kale establish beautifully in warm late-summer soil. Continue sowing beetroot, carrots, silverbeet, Asian greens and lettuce for autumn harvests.\n\n"
                   f"Tomatoes, beans and cucumbers are often at their best this month, but hot northerly winds can arrive suddenly and dry beds fast. Deep watering before heat arrives is far more effective than rescuing wilted plants afterward.\n\n"
                   f"By the end of February, observant gardeners begin preparing mentally for autumn, even while tomatoes are still ripening.")

        elif month == 'March':
            return (f"Autumn arrives quickly in {place}. Warm afternoons still appear, but nights cool sharply and first light frosts are possible late in the month, especially in still weather.\n\n"
                   f"Plant garlic now for harvest in summer. Early in the month there is still time for lettuce, celery, kale and silverbeet seedlings to establish well. Sow spinach, peas, broad beans and Asian greens as the soil cools.\n\n"
                   f"Growth begins slowing noticeably. Plants no longer race away as they did in summer. Mulch becomes as much about frost buffering as moisture retention. Keep fleece or cloches nearby for young seedlings.\n\n"
                   f"The shift between seasons can feel abrupt here. A week of warm weather may suddenly give way to cold mornings and heavy dew.")

        elif month == 'April':
            return (f"This is the true autumn planting season in {place}. The soil is cooling steadily, but there is still enough warmth for hardy crops to establish before winter settles in.\n\n"
                   f"Plant brassicas, leeks, onions, lettuce and silverbeet seedlings into prepared beds. Sow spinach, peas, broad beans and Asian greens directly. Garlic can still go in successfully through much of the month.\n\n"
                   f"Summer crops collapse quickly once nights cool consistently. Clear exhausted plants promptly. Empty beds should not sit bare. Compost them, mulch them, or replant them.\n\n"
                   f"Gardening changes pace now. Summer rewards speed and energy. Autumn rewards preparation and timing.")

        elif month == 'May':
            return (f"Winter begins making itself known in {place}. Frost becomes more regular, the soil stays wetter for longer, and growth slows to a steady, deliberate pace.\n\n"
                   f"Broad beans, spinach, silverbeet, garlic and hardy greens continue producing well through mild spells. Slugs and snails become persistent visitors now, particularly around damp mulch.\n\n"
                   f"Avoid walking unnecessarily on wet soil. Compacted winter ground takes months to recover. Where beds empty, add compost, seaweed, leaves or green manure crops to protect and rebuild soil through winter rain.\n\n"
                   f"The garden may appear quieter than in summer, but a good winter garden is still productive, just slower, steadier and less dramatic.")

        elif month == 'June':
            return (f"Cold weather settles in fully now in {place}. Frosty mornings, wet ground and short days slow nearly everything, though hardy vegetables continue steadily in the background.\n\n"
                   f"Spinach, broad beans, silverbeet, parsley and established brassicas should continue cropping through milder periods. Plant asparagus crowns and artichokes if space allows.\n\n"
                   f"Protection matters more than feeding now. Young plants appreciate shelter from wind as much as frost. Mulch root crops well and keep beds draining freely.\n\n"
                   f"Winter gardening in {place} is less about abundance and more about resilience. The garden teaches patience now.")

        elif month == 'July':
            return (f"Usually the coldest month of the year in {place}. The soil is slow, mornings are sharp, and very little grows quickly.\n\n"
                   f"Maintain winter crops rather than expecting heavy harvests. Garlic, broad beans, spinach and silverbeet should continue steadily if kept healthy and protected from excessive wet. Check mulch depth regularly.\n\n"
                   f"This is an excellent month for planning. Order seed, repair beds, sharpen tools, clean trays and think carefully about spacing before spring arrives. Many spring mistakes are made in July through impatience.\n\n"
                   f"Even now, the light has subtly begun changing. By month's end there are small hints of spring in sheltered corners.")

        elif month == 'August':
            return (f"Early spring begins stirring in {place}, though winter has not fully released its grip. Bright days become more common, but frosts remain frequent and the soil is still cold.\n\n"
                   f"Start tomatoes, capsicums and eggplants indoors with warmth and good light. They should not go outside yet, but strong early seedlings make a great difference later. Sow lettuce, onions, brassicas and celery under protection as well.\n\n"
                   f"Outside, peas, broad beans and spinach can be sown directly into prepared soil. Potatoes may be planted toward the end of the month in well-drained beds.\n\n"
                   f"The temptation now is always to rush. Resist it. A patient spring garden almost always overtakes an early damaged one by November.")

        elif month == 'September':
            return (f"Spring is underway properly now in {place}, though frost can still arrive unexpectedly, especially on calm clear nights.\n\n"
                   f"Plant onions, leeks, brassicas, silverbeet and lettuces freely. Sow carrots, beetroot, parsnips and peas directly as soil temperatures gradually rise. Successive sowing becomes worthwhile again.\n\n"
                   f"Tomatoes, capsicums and eggplants should generally remain protected for now, though warm sheltered gardens may begin hardening off strong plants late in the month.\n\n"
                   f"Growth becomes noticeably more energetic during September. The garden shifts from endurance back into expansion.")

        elif month == 'October':
            return (f"Everything accelerates now in {place}. Soil warms quickly, daylight stretches long into the evening, and growth becomes visible almost day by day.\n\n"
                   f"Early October can still surprise gardeners with frost, so tender crops need caution. By late month, tomatoes, beans, zucchini, pumpkins and cucumbers can usually be planted safely into sheltered gardens.\n\n"
                   f"Sweetcorn can also go in now, though it performs best in warm, protected spots with reliable moisture and good sun.\n\n"
                   f"Direct sowing becomes highly productive again. Beans, beetroot, carrots, lettuce and herbs all respond quickly once the soil truly warms.")

        elif month == 'November':
            return (f"This is the great planting month in {place}. The soil is warm, frost risk is low, and nearly everything begins growing with confidence.\n\n"
                   f"Plant tomatoes, cucumbers, pumpkins, zucchini, basil, beans and sweetcorn into rich, prepared ground. Capsicums and eggplants perform best in the warmest, sunniest and most sheltered parts of the garden.\n\n"
                   f"Mulch deeply before summer dryness arrives. Consistent moisture prevents bitterness, splitting and blossom-end rot. Feed hungry plants regularly now while growth is strong and rapid.\n\n"
                   f"A November garden in {place} changes astonishingly fast. Beds that looked sparse only weeks earlier become crowded, leafy and full of promise.")

        elif month == 'December':
            return (f"The garden reaches full summer momentum in {place}. Long daylight hours and warming soil drive rapid growth and heavy harvests.\n\n"
                   f"Keep picking beans, cucumbers and zucchini regularly to maintain production. Harvest peas before hot weather finishes them and continue succession sowing fast crops wherever space appears.\n\n"
                   f"Hot northerly winds can dry beds far faster than the thermometer suggests. Deep morning watering and thick mulch protect plants far better than frequent shallow watering during heat.\n\n"
                   f"Even now, experienced gardeners are already thinking ahead toward autumn. Good {place} gardens are rarely built one season at a time. Each season quietly prepares the next.")

    # COOL CLIMATE (Victoria, NSW highlands, southern regions)
    elif climate == 'cool':
        if month == 'January':
            return (f"Summer is mild in {place}, so keep harvests steady and maintain moisture on warm days. Tomatoes and beans produce well, though growth is more measured than in warmer areas. Harvest leafy greens and roots regularly and water early morning on hot spells.\n\n"
                   f"Start seedlings of brassicas, lettuce and celery indoors now for February planting. Direct-sow carrots, beetroot, silverbeet, kale and turnips. Growth is steady but not frantic.\n\n"
                   f"Mulch to hold soil moisture and keep temperatures moderate. Even mild heat stresses cool-climate gardens. Water deeply rather than frequently.\n\n"
                   f"The first shift toward autumn thinking begins now, though summer still dominates the garden.")

        elif month == 'February':
            return (f"Late summer is a good time to shift beds toward autumn crops and refresh tired plantings in {place}. The heat is easing and autumn-suited crops begin establishing fast.\n\n"
                   f"Plant brassicas and root vegetables for autumn. Broccoli, cabbage, kale, carrots, beetroot all thrive as heat declines. Clear struggling summer crops and add compost before autumn sowing.\n\n"
                   f"Tomatoes and beans continue, but pests become more visible on stressed plants. Keep these plants well-watered and adequately spaced for air flow.\n\n"
                   f"By month's end, the transition feels real. Autumn is genuinely coming.")

        elif month == 'March':
            return (f"Autumn is properly established in {place} by March. Warm days still appear, but the growing season for cool-weather crops begins in earnest now.\n\n"
                   f"Plant garlic and final brassica seedlings. Sow spinach, peas, broad beans, Asian greens and root crops directly. Everything germinates well in warming soil and establishing plants.\n\n"
                   f"Summer crops begin finishing but are still productive. Harvest regularly rather than leaving mature fruit on stressed plants. Clear beds promptly when crops fail.\n\n"
                   f"Growth accelerates for autumn crops. The shift from summer to autumn gardening is marked now.")

        elif month == 'April':
            return (f"Autumn planting continues in {place}. The soil is cooling but still warm enough for good establishment of winter and spring crops.\n\n"
                   f"Plant remaining brassicas, leeks, onions and lettuce. Sow spinach, peas, broad beans and Asian greens. Mulch beds before cooler nights arrive. Potatoes can still go in early varieties in mild pockets.\n\n"
                   f"Summer crops are finishing. Clear them promptly. Empty beds should be mulched or planted with green manure crops.\n\n"
                   f"Gardening in {place} now rewards timing and preparation. Successive small plantings beat one large glut.")

        elif month == 'May':
            return (f"The pace of gardening slows noticeably in {place} by May. Cooler nights and shorter days mean growth becomes steadier but less dramatic.\n\n"
                   f"Winter crops are establishing well. Broccoli, kale, spinach, peas and broad beans grow steadily. Slugs become more visible in damp conditions.\n\n"
                   f"Avoid compacting wet soil. Where beds are empty, add organic matter. Mulch around established crops to protect from cold nights that are becoming more common.\n\n"
                   f"The garden becomes quieter but is actually very productive if you look closely.")

        elif month == 'June':
            return (f"Cold settles in properly during June in {place}, though frosts are usually moderate and occasional rather than regular.\n\n"
                   f"Winter crops continue producing steadily. Spinach, kale, peas, broad beans and established brassicas provide regular harvests. Plant asparagus and rhubarb if desired.\n\n"
                   f"Protect tender plantings from occasional frosts with fleece or mulch. Keep beds well-drained. Wet soil and cold combine badly for root crops.\n\n"
                   f"This is planning and preparation month. Use the quieter period to think about spring.")

        elif month == 'July':
            return (f"Cold persists through July in {place}, usually the coldest month or very close to it. Frosts are regular but not as severe as Tasmania's.\n\n"
                   f"Winter crops maintain themselves. Growth is very slow. Garlic, broad beans, spinach and kale are your steady producers. Protect young seedlings from hard frosts.\n\n"
                   f"Use this month for planning and repairs. Order seeds, check mulch depth, plan crop rotations and prepare beds for spring.\n\n"
                   f"The light begins changing by late July. Spring is not far away even if weather does not yet feel it.")

        elif month == 'August':
            return (f"Spring is approaching in {place} even though cold may linger into early spring. Start seedlings indoors: tomatoes, capsicums, eggplants, lettuce, brassicas.\n\n"
                   f"Direct sow peas and broad beans outdoors if soil is workable. Do not plant tender seedlings outside yet—frosts can still damage them severely.\n\n"
                   f"Prepare beds for spring planting. Add compost and mulch. Keep existing winter crops tidy and productive.\n\n"
                   f"By late August, the change in light and day length becomes unmistakable. Spring is arriving.")

        elif month == 'September':
            return (f"Spring has clearly arrived in {place} by September, though late frosts are still possible, especially early month.\n\n"
                   f"Plant brassicas, lettuce, leeks and onions directly into warming soil. Sow carrots, beetroot, peas and root crops. Successive sowing pays dividends now.\n\n"
                   f"Tomatoes, capsicums and eggplants can be hardened off and planted by late September in most years, though early month still carries frost risk.\n\n"
                   f"Growth accelerates visibly. The garden responds to lengthening days and warming soil.")

        elif month == 'October':
            return (f"Everything accelerates in {place} during October. Soil warms, days lengthen dramatically, and growth becomes visible week by week.\n\n"
                   f"Plant tomatoes, beans, zucchini, pumpkins, cucumbers and all tender crops. The frost risk has passed for most years. Sow directly: carrot, beetroot, lettuce, herbs.\n\n"
                   f"Succession sow every two weeks rather than planting everything at once. Staggered plantings provide better harvests.\n\n"
                   f"The shift from cool-season gardening back to summer gardening feels complete.")

        elif month == 'November':
            return (f"This is peak planting month in {place}. The soil is warm, growth is rapid, and frost risk is essentially zero.\n\n"
                   f"Plant all summer crops: tomatoes, capsicums, eggplants, beans, zucchini, pumpkins, squash, sweetcorn, basil. Direct sow anything not yet in.\n\n"
                   f"Mulch deeply before the real heat arrives. Consistent soil moisture is key to avoiding blossom-end rot, bitter lettuce and split fruit.\n\n"
                   f"A November garden in {place} transforms visibly. Bare beds fill quickly with vigorous growth.")

        elif month == 'December':
            return (f"Full summer production begins in {place} during December. Heat builds, days are longest, and growth is vigorous.\n\n"
                   f"Pick beans, cucumbers and zucchini constantly to maintain production. Harvest peas before heat finishes them. Continue succession sowing short-season crops.\n\n"
                   f"Heat management becomes key. Deep watering in early morning is far better than frequent shallow watering. Mulch protects soil temperature and moisture.\n\n"
                   f"Even as summer builds, experienced gardeners in {place} are already planning autumn's approach.")

    # TEMPERATE CLIMATE (most of eastern Australia)
    elif climate == 'temperate':
        if month in ['January', 'February', 'December']:
            # Summer emphasis
            return (f"Summer production is solid in {place}. Tomatoes, beans, cucumbers, zucchini and pumpkins grow well with consistent water and sun. Pick regularly to maintain productivity.\n\n"
                   f"Sow autumn and winter crops while soil is warm: carrots, beets, brassicas, lettuce, silverbeet. These establish quickly in late summer warmth.\n\n"
                   f"Water deeply in the morning. Shallow frequent watering stresses plants and invites pests. Mulch to hold soil moisture and moderate temperature.\n\n"
                   f"Plan for autumn transition even while summer production continues. Early establishment of cool-season crops pays dividends later.")

        elif month in ['March', 'April', 'May']:
            # Autumn emphasis
            return (f"Autumn is established in {place}. This is prime time for cool-season crops: brassicas, lettuce, root vegetables, peas, broad beans.\n\n"
                   f"Plant brassica seedlings and direct sow cool-season seeds. Garlic can still go in April. Everything grows steadily as temperatures cool.\n\n"
                   f"Clear summer crops as they finish. Do not let disease linger. Empty beds should be composted or mulched, not left bare.\n\n"
                   f"Growth is steady and manageable. The garden rewards regular attention and good timing now.")

        elif month in ['June', 'July', 'August']:
            # Winter emphasis
            return (f"Winter in {place} is cool but relatively mild compared to southern regions. Frosts are occasional rather than regular, especially in coastal areas.\n\n"
                   f"Winter crops like kale, spinach, broad beans, peas and root vegetables provide steady harvests. Protect tender plants when frosts arrive.\n\n"
                   f"Start spring seedlings indoors: tomatoes, capsicums, lettuce, brassicas. Prepare beds for spring planting.\n\n"
                   f"Use quiet winter months for planning and repair. Spring is only weeks away.")

        elif month in ['September', 'October', 'November']:
            # Spring emphasis
            return (f"Spring arrives progressively in {place}. Early spring still carries frost risk but warming arrives noticeably by late spring.\n\n"
                   f"Plant tender crops (tomatoes, capsicums, beans, zucchini) after last frost date. Sow directly: carrots, beets, lettuce, root crops. Succession sow for staggered harvests.\n\n"
                   f"Growth accelerates through spring. The pace of change from September to November is remarkable.\n\n"
                   f"Spring gardening in {place} rewards successive plantings and regular attention.")

    # WARM CLIMATE (inland NSW, SA, inland WA)
    elif climate == 'warm':
        if inland:
            if month in ['January', 'February', 'December']:
                return (f"Heat builds in {place} during summer. Days are long and hot, especially inland away from coastal cooling.\n\n"
                       f"Summer crops produce heavily but require consistent deep watering. The heat stress on plants increases pest and disease pressure.\n\n"
                       f"Sow autumn and winter crops early. Carrots, beets, brassicas, silverbeet, lettuce all thrive as the intense heat fades. Get them in early for good establishment.\n\n"
                       f"Afternoon shade helps tender plants survive summer. Mulch deeply. Water early, not during heat.")

            elif month in ['March', 'April', 'May']:
                return (f"Autumn arrives definitively in {place}. The intense heat releases and autumn crops thrive in the moderate warmth.\n\n"
                       f"This is prime planting season. Brassicas, lettuce, root vegetables, peas, broad beans all establish and grow strongly. Direct sow or plant seedlings freely.\n\n"
                       f"Summer crops finish quickly once heat eases. Clear them promptly. Empty beds should be mulched or planted with autumn crops.\n\n"
                       f"Growth is rapid and rewarding. Autumn is the most productive season in warm inland gardens.")

            elif month in ['June', 'July', 'August']:
                return (f"Winter in {place} is cool but rarely harsh. Frosts are rare or absent entirely in many warm inland gardens.\n\n"
                       f"Winter crops grow steadily. Brassicas, lettuce, spinach, peas, broad beans and root vegetables all thrive. This is peak harvest season.\n\n"
                       f"Start spring seedlings indoors toward August. Prepare beds for spring. Plan for the shift back to heat-tolerant crops.\n\n"
                       f"Winter gardening in {place} is often the most productive and easiest season.")

            elif month in ['September', 'October', 'November']:
                return (f"Spring arrives and heat begins building in {place}. The transition from cool to warm happens quickly, sometimes within weeks.\n\n"
                       f"Plant spring crops early: tomatoes, capsicums, eggplants, beans, squash. Sow directly: lettuce, herbs, quick crops. Everything must be in before serious heat.\n\n"
                       f"Mulch heavily. Prepare for the shift back to heat management. Afternoon shade becomes valuable again.\n\n"
                       f"Spring is brief in {place}. Plan for heat quickly.")

        else:  # warm + coastal
            if month in ['January', 'February', 'December']:
                return (f"Summer in {place} is warm but moderated by coastal influence. Humidity may be high. Regular growth is possible with good water management.\n\n"
                       f"Sow autumn crops now while soil is warm. Carrots, beets, brassicas, lettuce, silverbeet establish quickly in late summer.\n\n"
                       f"Deep watering in early morning prevents heat stress and disease. Mulch helps.\n\n"
                       f"Plan autumn's approach even while summer gardening continues.")

            elif month in ['March', 'April', 'May']:
                return (f"Autumn in {place} is mild and extended by coastal protection. This is excellent growing season for cool-weather crops.\n\n"
                       f"Plant brassicas, lettuce, onions, leeks, root vegetables. Direct sow peas, broad beans, Asian greens. Garlic in April.\n\n"
                       f"Growth is steady and satisfying. Clear summer crops as they finish.\n\n"
                       f"Autumn is the prime season in coastal warm gardens.")

            elif month in ['June', 'July', 'August']:
                return (f"Winter in {place} is mild. Frosts are rare or absent. Growth continues steadily through winter.\n\n"
                       f"Winter crops produce heavily. Brassicas, lettuce, spinach, peas, root vegetables all thrive. Harvest regularly.\n\n"
                       f"Start spring seedlings indoors by August. Prepare for spring's arrival.\n\n"
                       f"Winter is productive rather than dormant in coastal {place}.")

            elif month in ['September', 'October', 'November']:
                return (f"Spring arrives gradually in {place}, moderated by coastal influence. Growth accelerates steadily but not abruptly.\n\n"
                       f"Plant tender crops: tomatoes, capsicums, eggplants, beans. Sow directly: lettuce, herbs, quick crops. Succession sow.\n\n"
                       f"Heat builds gradually, not suddenly. The transition is gentler than inland.\n\n"
                       f"Spring in coastal {place} is extended and rewarding.")

    # TROPICAL CLIMATE (NT, far north QLD)
    elif climate == 'tropical':
        if month in ['December', 'January', 'February', 'March']:
            # Wet season
            return (f"The wet season dominates {place} from December through March. Humidity is extreme, rain is heavy and fungal disease pressure is intense.\n\n"
                   f"Cool-season crops grow well in the moisture and warmth. Lettuce, Asian greens, tomatoes, capsicums all produce but need disease management.\n\n"
                   f"Drainage is critical. Waterlogged soil kills roots faster than anything else. Build raised beds or add compost to improve structure.\n\n"
                   f"Heavy rain can damage seedlings. Succession plant rather than one heavy planting.")

        else:
            # Dry season (April-November is growing season)
            return (f"The dry season in {place} is growing season. Consistent warm days and low humidity create ideal conditions for vegetables.\n\n"
                   f"Plant and sow everything: brassicas, lettuce, root crops, tomatoes, capsicums, beans, squash. The entire range grows well now.\n\n"
                   f"Water becomes essential—dry season rain is absent. Deep watering early in the day keeps plants thriving.\n\n"
                   f"Dry season is the productive heart of tropical gardening. Make the most of it.")

    # FALLBACK
    return f"Gardening in {place} during {month}."


def main():
    input_csv = Path('C:\\GrowGuide\\scripts\\audit-output\\month-overviews\\all-locations.csv')
    output_csv = Path('C:\\GrowGuide\\growguide-rewritten-sharp-voice.csv')

    if not input_csv.exists():
        print(f"Input file not found: {input_csv}")
        return

    processed = 0
    with open(input_csv, 'r', encoding='utf-8') as infile, \
         open(output_csv, 'w', encoding='utf-8', newline='') as outfile:

        reader = csv.DictReader(infile)
        writer = csv.DictWriter(outfile, fieldnames=['place', 'state', 'climate', 'zone', 'tags', 'month', 'overview'])
        writer.writeheader()

        for row in reader:
            place = row['place'].strip('"')
            state = row['state']
            climate = row['climate']
            zone = row['zone']
            tags = row['tags'].strip('"')
            month = row['month']

            new_overview = generate_overview(place, state, climate, zone, tags, month)

            writer.writerow({
                'place': place,
                'state': state,
                'climate': climate,
                'zone': zone,
                'tags': tags,
                'month': month,
                'overview': new_overview
            })

            processed += 1
            if processed % 300 == 0:
                print(f"Processed {processed}...")

    print(f"\nComplete. Processed {processed} rows.")
    print(f"Output: {output_csv}")


if __name__ == '__main__':
    main()
