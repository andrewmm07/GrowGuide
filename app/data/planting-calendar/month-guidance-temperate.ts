import type { MonthGuidance } from './month-guidance-types'

/** Temperate coastal / inland AU (Sydney, Canberra, Perth metro, Adelaide). */
export const TEMPERATE_MONTH_GUIDANCE: Record<string, MonthGuidance> = {
  January: {
    focus: 'Summer is at its peak, so water early and harvest before heat stress sets in.',
    tasks: ['Deep water in the morning twice a week in heat', 'Harvest tomatoes, beans, and stone fruit promptly', 'Mulch and shade sensitive crops in heatwaves'],
    risks: ['Fruit fly on stone fruit', 'Sun scorch on leafy greens'],
    avoid: ['Transplanting in midday heat'],
  },
  February: {
    focus: 'Late summer calls for steady harvests, humidity awareness, and planning for autumn.',
    tasks: ['Harvest summer crops regularly', 'Sow leafy greens in partial shade', 'Remove diseased foliage promptly'],
    risks: ['Powdery mildew and rust', 'Fruit fly pressure'],
    avoid: ['Overhead watering late evening in humid weather'],
  },
  March: {
    focus: 'Autumn is starting while soil is still warm, making it ideal for brassicas and roots.',
    tasks: ['Plant brassicas, carrots, and root vegetables', 'Clear finished summer crops', 'Prepare winter beds with compost'],
    risks: ['Pests moving onto new seedlings', 'Dry soil after hot February'],
    avoid: ['Leaving diseased plant debris in beds'],
  },
  April: {
    focus: 'Cooler autumn weather suits peas, beans, and leafy greens across temperate gardens.',
    tasks: ['Sow peas and broad beans', 'Add compost to planting beds', 'Watch inland areas for early frost'],
    risks: ['Early frosts inland', 'Slugs on young greens'],
    avoid: ['Planting heat-loving crops without protection'],
  },
  May: {
    focus: 'The cool season is here, with garlic, onions, and frost-aware planting taking priority.',
    tasks: ['Plant garlic and winter greens', 'Protect tender plants on cold nights', 'Improve soil on vacant beds'],
    risks: ['Frosts in inland and elevated sites', 'Slow germination in cold soil'],
    avoid: ['Sowing heat-loving crops outdoors'],
  },
  June: {
    focus: 'Winter favours frost-hardy crops, bare-root planting, and structural garden work.',
    tasks: ['Maintain winter vegetables', 'Plant bare-root trees and shrubs', 'Prune deciduous fruit'],
    risks: ['Frost on coastal margins', 'Root rot in poorly drained beds'],
    avoid: ['Heavy feeding dormant plants'],
  },
  July: {
    focus: 'Midwinter is for planning spring, protecting sensitive plants, and keeping harvests going.',
    tasks: ['Order seeds and plan crop rotation', 'Continue winter harvests', 'Check frost protection'],
    risks: ['Coldest nights inland', 'Citrus cold damage in marginal areas'],
    avoid: ['Pruning evergreens in hard frost'],
  },
  August: {
    focus: 'Late winter opens the last bare-root window and the first indoor seed starts.',
    tasks: ['Start seeds indoors for spring', 'Plant potatoes and asparagus', 'Finish dormant pruning'],
    risks: ['Late frosts after warm days', 'Indoor seedling legginess'],
    avoid: ['Planting tomatoes outdoors too early'],
  },
  September: {
    focus: 'Spring is beginning with peas and early veg, but late frosts can still appear.',
    tasks: ['Sow peas and early vegetables', 'Prepare beds for summer crops', 'Harden off seedlings before planting out'],
    risks: ['Late frosts', 'Snails on new growth'],
    avoid: ['Skipping hardening off'],
  },
  October: {
    focus: 'Spring planting peaks as soil warms and summer crops go into the ground.',
    tasks: ['Plant tomatoes, beans, and zucchini', 'Start regular feeding on fruiting crops', 'Stake climbers before wind damage'],
    risks: ['Increasing pest activity', 'Variable spring rainfall'],
    avoid: ['Planting into cold, wet soil'],
  },
  November: {
    focus: 'Late spring means succession sowing and stepping up watering as temperatures rise.',
    tasks: ['Succession sow beans and cucumbers', 'Increase watering as temperatures rise', 'Mulch before summer heat'],
    risks: ['Heat spikes late month', 'Aphids on soft growth'],
    avoid: ['Letting new plantings dry out in hot spells'],
  },
  December: {
    focus: 'Early summer needs a steady harvest rhythm and regular pest monitoring.',
    tasks: ['Harvest regularly to keep plants productive', 'Water deeply in the morning', 'Scout for pests on fruiting crops'],
    risks: ['Heat stress', 'Fruit fly and caterpillars'],
    avoid: ['Neglecting mulch before holiday heat'],
  },
}
