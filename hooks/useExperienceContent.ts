import {useEffect, useMemo, useState} from 'react';
import {File, Paths} from 'expo-file-system';

import {
  EARLIEST_TIMELINE_YEAR_BY_ERA,
  ERA_TABS,
  EraKey,
  EraKeyNoAll,
  MOCK_CARDS,
  POI_DETAILS,
  PoiDetail,
} from '@/constants/contentData';
import {HOTSPOT_POSITIONS} from '@/constants/hotspotPositions';
import {EraColors, EraTabTheme} from '@/constants/theme';
import {DEFAULT_MAP_KEY, MAP_BY_KEY, MapKey, getMapKeyForYear} from '@/constants/staticMaps';
import {normalizeYouTubeClip, YouTubeClip} from '@/utils/youtube';

export type NormalizedHotspotCategory = {
  id: string;
  title: string;
  description?: string;
  iconSource: string | number;
};

export type NormalizedEra = {
  eraKey: EraKeyNoAll;
  tabLabel: string;
  defaultTitle: string;
  timePeriod: string;
  summary: string;
  color: string;
  sortOrder: number;
};

export type NormalizedKnowledgeItem = {
  id: string;
  eraKeys: EraKeyNoAll[];
  yearLabel: string;
  titleTop: string;
  titleBottom: string;
  description: string;
  summary?: string;
  facts?: string[];
  imageUri?: string | number;
  mainImage?: string | number;
  imageAlt?: string;
  video?: YouTubeClip;
  relatedIds: string[];
  sortOrder: number;
};

export type NormalizedHotspot = {
  id: string;
  placeName?: string;
  metadata?: string;
  top: number | `${number}%`;
  left: number | `${number}%`;
  category: NormalizedHotspotCategory;
  knowledgeId: string;
  shortTextOverride?: string;
};

export type NormalizedTimelineEvent = {
  id: string;
  year: number;
  eraKey: EraKeyNoAll;
  title: string;
  timePeriod: string;
  summary: string;
  color: string;
  mapKey: MapKey;
  mapImageUri?: string;
  mapRegionLabel?: string;
  borderChangePrompt: string;
  borderChangeText?: string;
  sortOrder: number;
  hotspots: NormalizedHotspot[];
};

export type ExperienceContent = {
  eras: NormalizedEra[];
  eraTabs: typeof ERA_TABS;
  timelineEvents: NormalizedTimelineEvent[];
  knowledgeItems: NormalizedKnowledgeItem[];
  knowledgeById: Record<string, NormalizedKnowledgeItem>;
  earliestTimelineYearByEra: Record<EraKey, number>;
  categories: NormalizedHotspotCategory[];
  source: 'fallback' | 'sanity' | 'device-cache';
};

export type ContentRefreshStatus = 'updated' | 'cached' | 'fallback';

const SANITY_PROJECT_ID = 'zpmwzluo';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = 'v2026-06-07';
const SANITY_QUERY_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;
const CONTENT_CACHE_KEY = 'mpfest-experience-content-cache-v1';

const BORDER_CHANGE_PROMPT = 'What caused the border change?';

// Bundled icons used only when there's no network access to Sanity (offline fallback),
// or when a hotspot's category reference fails to resolve.
const FALLBACK_CATEGORIES: NormalizedHotspotCategory[] = [
  {
    id: 'culture',
    title: 'Culture',
    description: 'Highlights cultural traditions, art, and identity.',
    iconSource: require('@/assets/POI_Icon/POI_Culture.svg'),
  },
  {
    id: 'biography',
    title: 'Biography',
    description: 'Introduces important people connected to this era.',
    iconSource: require('@/assets/POI_Icon/POI_Biography.svg'),
  },
  {
    id: 'history',
    title: 'History',
    description: 'Explains major historical moments and turning points.',
    iconSource: require('@/assets/POI_Icon/POI_History.svg'),
  },
  {
    id: 'science',
    title: 'Science',
    description: 'Shows discoveries, inventions, and scientific impact.',
    iconSource: require('@/assets/POI_Icon/POI_Science.svg'),
  },
];
const DEFAULT_FALLBACK_CATEGORY = FALLBACK_CATEGORIES[0];

const FALLBACK_TIMELINE_DEFINITIONS: {
  eraKey: EraKeyNoAll;
  name: string;
  summary: string;
  timeframe: string;
  years: number[];
  color: string;
}[] = [
  {
    eraKey: 'golden_age',
    name: EraTabTheme.golden_age.label,
    summary: 'A time of political strength, cultural flourishing, and territorial expansion.',
    timeframe: 'Late 15th - Mid-17th Century',
    years: [1635, 1653],
    color: EraColors.golden_age,
  },
  {
    eraKey: 'wars_partitions',
    name: 'The Silver Age & Era of Wars',
    summary: 'Marked by wars, weakening government, and foreign interference.',
    timeframe: 'Late 17th - 19th Century',
    years: [1686, 1699, 1701, 1713, 1721, 1742],
    color: EraColors.wars_partitions,
  },
  {
    eraKey: 'wars_partitions',
    name: 'Silver Age & Era of Wars: First Partition',
    summary: 'Marked by wars, weakening government, and foreign interference.',
    timeframe: 'Late 17th - 19th Century',
    years: [1772, 1792],
    color: EraColors.wars_partitions,
  },
  {
    eraKey: 'wars_partitions',
    name: 'Silver Age & Era of Wars: Second Partition',
    summary: 'Marked by wars, weakening government, and foreign interference.',
    timeframe: 'Late 17th - 19th Century',
    years: [1793],
    color: EraColors.wars_partitions,
  },
  {
    eraKey: 'wars_partitions',
    name: 'Silver Age & Era of Wars: Third Partition',
    summary: 'Marked by wars, weakening government, and foreign interference.',
    timeframe: 'Late 17th - 19th Century',
    years: [1795],
    color: EraColors.wars_partitions,
  },
  {
    eraKey: 'independence',
    name: EraTabTheme.independence.label,
    summary: 'A century of failed uprisings and growing nationalism.',
    timeframe: '19th Century - WW1',
    years: [1804, 1807, 1815, 1831, 1846, 1848, 1862, 1867, 1871, 1878, 1884, 1894, 1904],
    color: EraColors.independence,
  },
  {
    eraKey: 'rebirth',
    name: EraTabTheme.rebirth.label,
    summary: 'Poland regained its independence and rebuilt itself as a sovereign state.',
    timeframe: '1914 - 1939',
    years: [1914, 1917, 1918, 1919, 1920, 1921, 1924, 1933, 1938],
    color: EraColors.rebirth,
  },
  {
    eraKey: 'ww2',
    name: EraTabTheme.ww2.label,
    summary: 'Poland was invaded and divided between Nazi Germany and the Soviet Union.',
    timeframe: '1939 - 1945',
    years: [1939, 1940, 1942, 1944],
    color: EraColors.ww2,
  },
  {
    eraKey: 'liberation',
    name: 'Liberation & Reorganization',
    summary: 'N/A',
    timeframe: '1945 - 1948',
    years: [1945],
    color: EraColors.liberation,
  },
  {
    eraKey: 'communist',
    name: EraTabTheme.communist.label,
    summary: 'Communist Poland under Soviet influence.',
    timeframe: '1948 - 1980',
    years: [1948, 1951, 1960, 1970],
    color: EraColors.communist,
  },
  {
    eraKey: 'growingDiscontent',
    name: 'Growing Discontent',
    summary: 'N/A',
    timeframe: '1980 - 1989',
    years: [1980, 1985],
    color: EraColors.growingDiscontent,
  },
  {
    eraKey: 'modern',
    name: EraTabTheme.modern.label,
    summary: 'Where we are today: a democratic republic and member of the EU and NATO.',
    timeframe: '1989 - Present',
    years: [1989, 1993, 2002, 2009],
    color: EraColors.modern,
  },
];

const BORDER_CHANGE_BY_YEAR: Record<number, string> = {
  1635: 'Sweden signed the Treaty of Stuhmsdorf, returning territories to the Polish-Lithuanian Commonwealth.',
  1653: "Internal conflicts and wars begin, marking the decline of Poland's strength.",
  1686: 'Eternal Peace Treaty confirmed Russias control over Left-bank Ukraine.',
  1699: 'Treaty of Karlowitz returned remaining Podolia to Poland.',
  1721: 'Poland loses more control as its neighbors gain power.',
  1742: "Poland's economy and military decline further.",
  1772: 'First Partition divided 30% of Poland among Russia, Prussia, and Austria.',
  1792: 'Poland fights Russia to protect its new constitution but loses.',
  1793: 'Second Partition saw more land lost to Russia and Prussia.',
  1795: 'Third Partition erased Poland from the map.',
  1804: "Napoleon's rise gives Poles hope for independence.",
  1807: 'Duchy of Warsaw created by Napoleon from former Polish lands.',
  1815: 'Congress of Vienna split Duchy of Warsaw between Prussia and Russia.',
  1831: 'Congress Poland lost autonomy after the November Uprising.',
  1846: 'Free City of Cracow annexed by Austria.',
  1848: "Eternal Peace Treaty confirmed Russia's control over Left-bank Ukraine.",
  1862: "Eternal Peace Treaty confirmed Russia's control over Left-bank Ukraine.",
  1867: 'Austria grants some autonomy to the Polish region of Galicia.',
  1871: 'Germany is united, increasing pressure on Polish culture.',
  1878: 'Polish nationalism and independence movements grow.',
  1914: "WWI begins - Poland's land is controlled by Germany, Russia, and Austro-Hungary.",
  1917: 'The Russian Revolution brings hope for Polish independence.',
  1918: 'Poland declared independence and began reclaiming territory.',
  1919: 'Treaty of Versailles recreated Poland with lands from Germany.',
  1920: 'Poland gained Danzig access and seized East Galicia from ZUNR.',
  1922: 'Central Lithuania joined Poland finalizing eastern borders.',
  1938: 'Poland annexed Trans-Olza and parts of Slovak Czechoslovakia.',
  1939: 'Germany and USSR partitioned Poland in WWII.',
  1940: 'Poland is divided between Nazi Germany and the Soviet Union.',
  1944: 'Warsaw Uprising - A major rebellion against German rule fails.',
  1945: 'Post-WWII borders shifted west; eastern lands annexed by USSR.',
  1948: 'Minor border adjustment near Przemysl with USSR.',
  1991: 'Communism ends - Poland becomes a democracy.',
  1993: 'The last Soviet troops leave Poland.',
};

type SanityPayload = {
  eras?: SanityEra[];
  timelineEvents?: SanityTimelineEvent[];
  knowledgeItems?: SanityKnowledgeItem[];
  categories?: SanityHotspotCategory[];
};

type SanityHotspotCategory = {
  _id?: string;
  title?: string;
  iconUrl?: string;
  description?: string;
};

type SanityEra = {
  _id?: string;
  eraKey?: EraKeyNoAll;
  tabLabel?: string;
  defaultTitle?: string;
  timePeriod?: string;
  summary?: string;
  sortOrder?: number;
};

type SanityKnowledgeItem = {
  _id?: string;
  title?: string;
  yearLabel?: string;
  shortSummary?: string;
  detailText?: string;
  imageUrl?: string;
  imageAlt?: string;
  video?: {
    youtubeUrl?: string;
    startSeconds?: number;
    endSeconds?: number;
  };
  facts?: string[];
  sortOrder?: number;
  eras?: {eraKey?: EraKeyNoAll}[];
  relatedKnowledge?: {_id?: string}[];
};

type SanityTimelineEvent = {
  _id?: string;
  year?: number;
  displayTitle?: string;
  timePeriodOverride?: string;
  summaryOverride?: string;
  borderChangePrompt?: string;
  borderChangeText?: string;
  mapKey?: string;
  map?: {
    mapKey?: string;
    regionLabel?: string;
    imageUrl?: string;
  };
  mapRegionLabel?: string;
  sortOrder?: number;
  era?: SanityEra;
  hotspots?: {
    _key?: string;
    hotspotId?: string;
    placeName?: string;
    metadata?: string;
    iconType?: SanityHotspotCategory;
    xPercent?: number;
    yPercent?: number;
    shortTextOverride?: string;
    knowledge?: SanityKnowledgeItem;
  }[];
};

const EXPERIENCE_CONTENT_QUERY = `
{
  "eras": *[_type == "era"] | order(sortOrder asc) {
    _id,
    eraKey,
    tabLabel,
    defaultTitle,
    timePeriod,
    summary,
    sortOrder
  },
  "timelineEvents": *[_type == "timelineEvent"] | order(sortOrder asc, year asc) {
    _id,
    year,
    displayTitle,
    timePeriodOverride,
    summaryOverride,
    borderChangePrompt,
    borderChangeText,
    mapKey,
    map->{mapKey, regionLabel, "imageUrl": image.asset->url},
    mapRegionLabel,
    sortOrder,
    era->{_id, eraKey, tabLabel, defaultTitle, timePeriod, summary, sortOrder},
    hotspots[]{
      _key,
      hotspotId,
      placeName,
      metadata,
      iconType->{
        _id,
        title,
        "iconUrl": icon.asset->url,
        description
      },
      xPercent,
      yPercent,
      shortTextOverride,
      knowledge->{
        _id,
        title,
        yearLabel,
        shortSummary,
        detailText,
        "imageUrl": image.asset->url,
        imageAlt,
        video,
        facts,
        sortOrder,
        eras[]->{eraKey},
        relatedKnowledge[]->{_id}
      }
    }
  },
  "knowledgeItems": *[_type == "knowledgeItem"] | order(sortOrder asc) {
    _id,
    title,
    yearLabel,
    shortSummary,
    detailText,
    "imageUrl": image.asset->url,
    imageAlt,
    video,
    facts,
    sortOrder,
    eras[]->{eraKey},
    relatedKnowledge[]->{_id}
  },
  "categories": *[_type == "hotspotCategory"] | order(sortOrder asc) {
    _id,
    title,
    "iconUrl": icon.asset->url,
    description
  }
}
`;

let cachedContent: ExperienceContent | null = null;
let inFlightContent: Promise<ExperienceContent> | null = null;
const contentListeners = new Set<(content: ExperienceContent) => void>();

function publishContent(content: ExperienceContent) {
  cachedContent = content;
  contentListeners.forEach((listener) => listener(content));
}

function canUseLocalStorage() {
  try {
    return typeof globalThis.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

function isUsableContent(content: ExperienceContent | null): content is ExperienceContent {
  return Boolean(
    content?.eras?.length &&
      content.timelineEvents?.length &&
      content.knowledgeItems?.length &&
      content.knowledgeById
  );
}

function getCacheFile() {
  try {
    return new File(Paths.document, `${CONTENT_CACHE_KEY}.json`);
  } catch {
    return null;
  }
}

async function readCachedContent(): Promise<ExperienceContent | null> {
  try {
    let raw: string | null = null;
    const cacheFile = getCacheFile();

    if (cacheFile?.exists) {
      raw = await cacheFile.text();
    } else if (canUseLocalStorage()) {
      raw = globalThis.localStorage.getItem(CONTENT_CACHE_KEY);
    }

    if (!raw) return null;
    const parsed = JSON.parse(raw) as ExperienceContent;
    if (!isUsableContent(parsed)) return null;

    return {
      ...parsed,
      // Older cache files (written before categories were introduced) won't have this field.
      categories: parsed.categories?.length ? parsed.categories : FALLBACK_CATEGORIES,
      source: 'device-cache',
    };
  } catch {
    return null;
  }
}

async function writeCachedContent(content: ExperienceContent) {
  if (content.source !== 'sanity') return;

  try {
    const raw = JSON.stringify(content);
    const cacheFile = getCacheFile();

    if (cacheFile) {
      if (!cacheFile.exists) cacheFile.create({intermediates: true, overwrite: true});
      cacheFile.write(raw);
    } else if (canUseLocalStorage()) {
      globalThis.localStorage.setItem(CONTENT_CACHE_KEY, raw);
    }
  } catch {
    // Cache writes are best-effort. The bundled fallback still protects the experience.
  }
}

function isMapKey(value: string | undefined): value is MapKey {
  return Boolean(value && value in MAP_BY_KEY);
}

function getEraColor(eraKey: EraKeyNoAll): string {
  return EraTabTheme[eraKey]?.color ?? EraColors[eraKey as keyof typeof EraColors] ?? '#2f2b2d';
}

function normalizePoi(id: string, poi: PoiDetail, index: number): NormalizedKnowledgeItem {
  const card = MOCK_CARDS.find((item) => item.id === id);

  return {
    id,
    eraKeys: poi.eraKeys,
    yearLabel: poi.yearLabel || card?.yearLabel || '',
    titleTop: poi.titleTop,
    titleBottom: poi.summary || card?.titleBottom || poi.description,
    description: poi.description,
    summary: poi.summary,
    imageUri: card?.imageUri ?? poi.mainImage,
    mainImage: poi.mainImage ?? card?.imageUri,
    relatedIds: poi.relatedIds || [],
    sortOrder: index,
  };
}

function buildFallbackContent(): ExperienceContent {
  const knowledgeItems = Object.entries(POI_DETAILS).map(([id, poi], index) =>
    normalizePoi(id, poi, index)
  );
  const knowledgeById = Object.fromEntries(knowledgeItems.map((item) => [item.id, item]));
  const seenEraKeys = new Set<EraKeyNoAll>();
  const eras: NormalizedEra[] = [];

  FALLBACK_TIMELINE_DEFINITIONS.forEach((definition, index) => {
    if (seenEraKeys.has(definition.eraKey)) return;
    seenEraKeys.add(definition.eraKey);
    eras.push({
      eraKey: definition.eraKey,
      tabLabel: EraTabTheme[definition.eraKey]?.label ?? definition.name,
      defaultTitle: definition.name,
      timePeriod: definition.timeframe,
      summary: definition.summary,
      color: definition.color,
      sortOrder: index,
    });
  });

  const timelineEvents = FALLBACK_TIMELINE_DEFINITIONS.flatMap((definition, definitionIndex) =>
    definition.years.map((year, yearIndex) => {
      const hotspots = knowledgeItems
        .filter((item) => item.eraKeys.includes(definition.eraKey))
        .map((item): NormalizedHotspot | null => {
          const position = HOTSPOT_POSITIONS[item.id];

          return position
            ? {
                id: item.id,
                top: position.top,
                left: position.left,
                category: DEFAULT_FALLBACK_CATEGORY,
                knowledgeId: item.id,
              }
            : null;
        })
        .filter((item): item is NormalizedHotspot => Boolean(item));

      return {
        id: `${definition.eraKey}-${year}-${definitionIndex}-${yearIndex}`,
        year,
        eraKey: definition.eraKey,
        title: definition.name,
        timePeriod: definition.timeframe,
        summary: definition.summary,
        color: definition.color,
        mapKey: getMapKeyForYear(year),
        borderChangePrompt: BORDER_CHANGE_PROMPT,
        borderChangeText: BORDER_CHANGE_BY_YEAR[year],
        sortOrder: definitionIndex * 100 + yearIndex,
        hotspots,
      };
    })
  );

  return {
    eras,
    eraTabs: ERA_TABS,
    timelineEvents,
    knowledgeItems,
    knowledgeById,
    earliestTimelineYearByEra: EARLIEST_TIMELINE_YEAR_BY_ERA,
    categories: FALLBACK_CATEGORIES,
    source: 'fallback',
  };
}

const FALLBACK_CONTENT = buildFallbackContent();

function normalizeSanityKnowledge(item: SanityKnowledgeItem, index: number): NormalizedKnowledgeItem | null {
  if (!item._id || !item.title || !item.shortSummary || !item.detailText) return null;

  const eraKeys = (item.eras || [])
    .map((era) => era.eraKey)
    .filter((eraKey): eraKey is EraKeyNoAll => Boolean(eraKey));

  if (eraKeys.length === 0) return null;

  return {
    id: item._id,
    eraKeys,
    yearLabel: item.yearLabel || '',
    titleTop: item.title,
    titleBottom: item.shortSummary,
    description: item.detailText,
    summary: item.shortSummary,
    facts: item.facts || [],
    imageUri: item.imageUrl,
    mainImage: item.imageUrl,
    imageAlt: item.imageAlt,
    video: normalizeYouTubeClip(item.video),
    relatedIds: (item.relatedKnowledge || [])
      .map((related) => related._id)
      .filter((id): id is string => Boolean(id)),
    sortOrder: item.sortOrder ?? index,
  };
}

function normalizeSanityCategory(category: SanityHotspotCategory): NormalizedHotspotCategory | null {
  if (!category._id || !category.title) return null;

  return {
    id: category._id,
    title: category.title,
    description: category.description,
    iconSource: category.iconUrl ?? DEFAULT_FALLBACK_CATEGORY.iconSource,
  };
}

function normalizeSanityHotspotCategory(
  category: SanityHotspotCategory | undefined
): NormalizedHotspotCategory {
  return normalizeSanityCategory(category || {}) ?? DEFAULT_FALLBACK_CATEGORY;
}

function dedupeErasByKey(eras: NormalizedEra[]) {
  const seen = new Set<EraKeyNoAll>();

  return eras
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .filter((era) => {
      if (seen.has(era.eraKey)) return false;
      seen.add(era.eraKey);
      return true;
    });
}

function normalizeSanityContent(payload: SanityPayload): ExperienceContent | null {
  if (!payload.eras?.length || !payload.timelineEvents?.length || !payload.knowledgeItems?.length) {
    return null;
  }

  const normalizedEras = payload.eras
    .filter((era): era is SanityEra & {eraKey: EraKeyNoAll} => Boolean(era.eraKey))
    .map((era, index) => ({
      eraKey: era.eraKey,
      tabLabel: era.tabLabel || EraTabTheme[era.eraKey]?.label || era.defaultTitle || era.eraKey,
      defaultTitle: era.defaultTitle || era.tabLabel || era.eraKey,
      timePeriod: era.timePeriod || '',
      summary: era.summary || '',
      color: getEraColor(era.eraKey),
      sortOrder: era.sortOrder ?? index,
    }));
  const eras = dedupeErasByKey(normalizedEras);

  const eraByKey = Object.fromEntries(eras.map((era) => [era.eraKey, era]));
  const normalizedCategories = (payload.categories || [])
    .map((category) => normalizeSanityCategory(category))
    .filter((category): category is NormalizedHotspotCategory => Boolean(category));
  const categories = normalizedCategories.length ? normalizedCategories : FALLBACK_CATEGORIES;
  const knowledgeItems = payload.knowledgeItems
    .map((item, index) => normalizeSanityKnowledge(item, index))
    .filter((item): item is NormalizedKnowledgeItem => Boolean(item));
  const knowledgeById = Object.fromEntries(knowledgeItems.map((item) => [item.id, item]));

  const timelineEvents = payload.timelineEvents
    .map((event, index): NormalizedTimelineEvent | null => {
      const eraKey = event.era?.eraKey;
      if (!event._id || !event.year || !eraKey) return null;

      const era = eraByKey[eraKey];
      if (!era) return null;

      const resolvedMapKey = event.map?.mapKey ?? event.mapKey;

      const hotspots = (event.hotspots || [])
        .map((hotspot): NormalizedHotspot | null => {
          const knowledgeId = hotspot.knowledge?._id;
          if (
            !knowledgeId ||
            hotspot.xPercent == null ||
            hotspot.yPercent == null ||
            !knowledgeById[knowledgeId]
          ) {
            return null;
          }

          return {
            id: hotspot.hotspotId || hotspot._key || knowledgeId,
            placeName: hotspot.placeName,
            metadata: hotspot.metadata,
            top: `${hotspot.yPercent}%`,
            left: `${hotspot.xPercent}%`,
            category: normalizeSanityHotspotCategory(hotspot.iconType),
            knowledgeId,
            shortTextOverride: hotspot.shortTextOverride,
          };
        })
        .filter((hotspot): hotspot is NormalizedHotspot => Boolean(hotspot));

      return {
        id: event._id,
        year: event.year,
        eraKey,
        title: event.displayTitle || era.defaultTitle,
        timePeriod: event.timePeriodOverride || era.timePeriod,
        summary: event.summaryOverride || era.summary,
        color: era.color,
        mapKey: isMapKey(resolvedMapKey) ? resolvedMapKey : DEFAULT_MAP_KEY,
        mapImageUri: event.map?.imageUrl,
        mapRegionLabel: event.mapRegionLabel ?? event.map?.regionLabel,
        borderChangePrompt: event.borderChangePrompt || BORDER_CHANGE_PROMPT,
        borderChangeText: event.borderChangeText,
        sortOrder: event.sortOrder ?? index,
        hotspots,
      };
    })
    .filter((event): event is NormalizedTimelineEvent => Boolean(event))
    .sort((a, b) => a.year - b.year || a.sortOrder - b.sortOrder || a.id.localeCompare(b.id));

  if (!eras.length || !timelineEvents.length || !knowledgeItems.length) return null;

  const eraTabs = [
    {key: 'all' as EraKey, label: 'All'},
    ...eras.map((era) => ({key: era.eraKey as EraKey, label: era.tabLabel})),
  ];

  const earliestTimelineYearByEra = timelineEvents.reduce<Record<EraKey, number>>(
    (acc, event) => {
      const current = acc[event.eraKey];
      if (current == null || event.year < current) acc[event.eraKey] = event.year;
      return acc;
    },
    {...EARLIEST_TIMELINE_YEAR_BY_ERA}
  );

  return {
    eras,
    eraTabs,
    timelineEvents,
    knowledgeItems,
    knowledgeById,
    earliestTimelineYearByEra,
    categories,
    source: 'sanity',
  };
}

async function fetchExperienceContent(): Promise<ExperienceContent> {
  if (cachedContent) return cachedContent;
  if (inFlightContent) return inFlightContent;

  inFlightContent = fetch(`${SANITY_QUERY_URL}?query=${encodeURIComponent(EXPERIENCE_CONTENT_QUERY)}`)
    .then(async (response) => {
      if (!response.ok) throw new Error(`Sanity request failed: ${response.status}`);
      const json = (await response.json()) as {result?: SanityPayload};
      return normalizeSanityContent(json.result || {}) || (await readCachedContent()) || FALLBACK_CONTENT;
    })
    .catch(async () => (await readCachedContent()) || FALLBACK_CONTENT)
    .then(async (content) => {
      await writeCachedContent(content);
      publishContent(content);
      return content;
    })
    .finally(() => {
      inFlightContent = null;
    });

  return inFlightContent;
}

export async function refreshExperienceContent(): Promise<{
  content: ExperienceContent;
  status: ContentRefreshStatus;
}> {
  try {
    const response = await fetch(
      `${SANITY_QUERY_URL}?query=${encodeURIComponent(EXPERIENCE_CONTENT_QUERY)}`
    );

    if (!response.ok) throw new Error(`Sanity request failed: ${response.status}`);

    const json = (await response.json()) as {result?: SanityPayload};
    const sanityContent = normalizeSanityContent(json.result || {});

    if (sanityContent) {
      await writeCachedContent(sanityContent);
      publishContent(sanityContent);
      return {content: sanityContent, status: 'updated'};
    }
  } catch {
    // Fall through to cache/fallback below.
  }

  const cached = await readCachedContent();
  if (cached) {
    publishContent(cached);
    return {content: cached, status: 'cached'};
  }

  publishContent(FALLBACK_CONTENT);
  return {content: FALLBACK_CONTENT, status: 'fallback'};
}

export function useExperienceContent() {
  const [content, setContent] = useState<ExperienceContent>(cachedContent || FALLBACK_CONTENT);

  useEffect(() => {
    let isMounted = true;
    const listener = (nextContent: ExperienceContent) => {
      if (isMounted) setContent(nextContent);
    };

    contentListeners.add(listener);

    fetchExperienceContent().then((nextContent) => {
      listener(nextContent);
    });

    return () => {
      isMounted = false;
      contentListeners.delete(listener);
    };
  }, []);

  return useMemo(() => content, [content]);
}
