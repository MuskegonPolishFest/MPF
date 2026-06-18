import {createRequire} from 'node:module'
import {createReadStream, existsSync, readFileSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import vm from 'node:vm'
import ts from 'typescript'
import {createClient} from '@sanity/client'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const studioDir = path.resolve(__dirname, '..')
const rootDir = path.resolve(studioDir, '..')

const PROJECT_ID = 'zpmwzluo'
const DATASET = 'production'
const API_VERSION = '2026-06-07'
const HOTSPOT_BASE_WIDTH = 1200
const HOTSPOT_BASE_HEIGHT = 650
const replaceAssets = process.argv.includes('--replace-assets')

loadEnv(path.join(studioDir, '.env.local'))
loadEnv(path.join(rootDir, '.env.local'))

const token = process.env.SANITY_AUTH_TOKEN
if (!token) {
  throw new Error(
    'Missing SANITY_AUTH_TOKEN. Create studio-mpfest/.env.local from .env.local.example with a Sanity write token.',
  )
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token,
  useCdn: false,
})

const moduleCache = new Map()

const timelineDefinitions = [
  {
    eraKey: 'golden_age',
    name: 'The Golden Age',
    summary: 'A time of political strength, cultural flourishing, and territorial expansion.',
    timeframe: 'Late 15th - Mid-17th Century',
    years: [1635, 1653],
  },
  {
    eraKey: 'wars_partitions',
    name: 'The Silver Age & Era of Wars',
    summary: 'Marked by wars, weakening government, and foreign interference.',
    timeframe: 'Late 17th - 19th Century',
    years: [1686, 1699, 1701, 1713, 1721, 1742],
  },
  {
    eraKey: 'wars_partitions',
    name: 'Silver Age & Era of Wars: First Partition',
    summary: 'Marked by wars, weakening government, and foreign interference.',
    timeframe: 'Late 17th - 19th Century',
    years: [1772, 1792],
  },
  {
    eraKey: 'wars_partitions',
    name: 'Silver Age & Era of Wars: Second Partition',
    summary: 'Marked by wars, weakening government, and foreign interference.',
    timeframe: 'Late 17th - 19th Century',
    years: [1793],
  },
  {
    eraKey: 'wars_partitions',
    name: 'Silver Age & Era of Wars: Third Partition',
    summary: 'Marked by wars, weakening government, and foreign interference.',
    timeframe: 'Late 17th - 19th Century',
    years: [1795],
  },
  {
    eraKey: 'independence',
    name: 'Struggle for Independence',
    summary: 'A century of failed uprisings and growing nationalism.',
    timeframe: '19th Century - WW1',
    years: [1804, 1807, 1815, 1831, 1846, 1848, 1862, 1867, 1871, 1878, 1884, 1894, 1904],
  },
  {
    eraKey: 'rebirth',
    name: 'Rebirth of Poland',
    summary: 'Poland regained its independence and rebuilt itself as a sovereign state.',
    timeframe: '1914 - 1939',
    years: [1914, 1917, 1918, 1919, 1920, 1921, 1924, 1933, 1938],
  },
  {
    eraKey: 'ww2',
    name: 'World War II & Occupation',
    summary: 'Poland was invaded and divided between Nazi Germany and the Soviet Union.',
    timeframe: '1939 - 1945',
    years: [1939, 1940, 1942, 1944],
  },
  {
    eraKey: 'liberation',
    name: 'Liberation & Reorganization',
    summary: 'N/A',
    timeframe: '1945 - 1948',
    years: [1945],
  },
  {
    eraKey: 'communist',
    name: 'Communist Poland',
    summary: 'Communist Poland under Soviet influence.',
    timeframe: '1948 - 1980',
    years: [1948, 1951, 1960, 1970],
  },
  {
    eraKey: 'growingDiscontent',
    name: 'Growing Discontent',
    summary: 'N/A',
    timeframe: '1980 - 1989',
    years: [1980, 1985],
  },
  {
    eraKey: 'modern',
    name: 'Modern Poland',
    summary: 'Where we are today: a democratic republic and member of the EU and NATO.',
    timeframe: '1989 - Present',
    years: [1989, 1993, 2002, 2009],
  },
]

const borderChangeByYear = {
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
}

// Source artwork per map key. Defaults to the bundled SVGs (mirrors constants/staticMaps.ts).
// If a rasterized PNG/WebP exists in assets/maps_raster/<filename> it is uploaded instead,
// which renders more reliably in expo-image. Drop rasterized files there to switch formats.
const mapsDir = path.join(rootDir, 'assets', 'maps_svg')
const rasterMapsDir = path.join(rootDir, 'assets', 'maps_raster')
const mapFiles = {
  1635: '1635-Realsize.svg',
  1699: '1699,1701,1713.svg',
  1721: '1721.svg',
  1772: '1772.svg',
  1793: '1793.svg',
  1795: '1795.svg',
  1807: '1807.svg',
  1815: '1815.svg',
  1831: '1831.svg',
  1846: '1846.svg',
  1848: '1848.svg',
  1867: '1867.svg',
  1871: '1871.svg',
  1878: '1878, 1884,1894,1904.svg',
  1917: '1917.svg',
  1918: '1918 - 5.svg',
  1919: '1919-1.svg',
  1920: '1920, 1923.svg',
  1922: '1922-2, 1924, 1935.svg',
  1938: '1938 -1.svg',
  1939: '1939-2.svg',
  1940: '1940.1942.svg',
  1944: '1944.svg',
  1945: '1945 - 5.svg',
  1948: '1948, 1951, 1960, 1970, 1975, 1980, 1987.svg',
  1989: '1989.svg',
  1993: '1993, 2002, 2011.svg',
}

const mapFloorKeys = [
  [1635, '1635'],
  [1686, '1699'],
  [1721, '1721'],
  [1772, '1772'],
  [1793, '1793'],
  [1795, '1795'],
  [1807, '1807'],
  [1815, '1815'],
  [1831, '1831'],
  [1846, '1846'],
  [1848, '1848'],
  [1867, '1867'],
  [1871, '1871'],
  [1878, '1878'],
  [1917, '1917'],
  [1918, '1918'],
  [1919, '1919'],
  [1920, '1920'],
  [1922, '1922'],
  [1938, '1938'],
  [1939, '1939'],
  [1940, '1940'],
  [1944, '1944'],
  [1945, '1945'],
  [1948, '1948'],
  [1989, '1989'],
  [1993, '1993'],
]

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

async function main() {
  const {POI_DETAILS, MOCK_CARDS, ERA_TABS} = loadTsModule(
    path.join(rootDir, 'constants', 'contentData.ts'),
  ).exports
  const {HOTSPOT_POSITIONS} = loadTsModule(
    path.join(rootDir, 'constants', 'hotspotPositions.ts'),
  ).exports

  const eraTabsByKey = new Map(ERA_TABS.map((tab) => [tab.key, tab.label]))
  const eraDefinitions = uniqueEras(eraTabsByKey)

  console.log(`Seeding ${eraDefinitions.length} eras...`)
  for (const era of eraDefinitions) {
    await client.createOrReplace({
      _id: eraId(era.eraKey),
      _type: 'era',
      eraKey: era.eraKey,
      tabLabel: era.tabLabel,
      defaultTitle: era.defaultTitle,
      timePeriod: era.timePeriod,
      summary: era.summary,
      sortOrder: era.sortOrder,
    })
  }

  console.log(`Seeding ${Object.keys(POI_DETAILS).length} knowledge items...`)
  const cardById = new Map(MOCK_CARDS.map((card) => [card.id, card]))
  for (const [index, poi] of Object.values(POI_DETAILS).entries()) {
    const card = cardById.get(poi.id)
    const existing = await client.getDocument(knowledgeId(poi.id))
    const imageRef =
      !replaceAssets && existing?.image?.asset?._ref
        ? existing.image.asset._ref
        : await uploadImage(poi.mainImage || card?.imageUri, poi.id)

    await client.createOrReplace({
      _id: knowledgeId(poi.id),
      _type: 'knowledgeItem',
      title: poi.titleTop,
      yearLabel: poi.yearLabel || card?.yearLabel || '',
      shortSummary: poi.summary || card?.titleBottom || poi.description.slice(0, 160),
      detailText: poi.description,
      image: imageRef ? {_type: 'image', asset: {_type: 'reference', _ref: imageRef}} : undefined,
      imageAlt: `${poi.titleTop}${poi.yearLabel ? `, ${poi.yearLabel}` : ''}`,
      facts: [],
      eras: poi.eraKeys.map((key) => ({_type: 'reference', _ref: eraId(key), _key: key})),
      relatedKnowledge: [],
      sortOrder: index,
    })
  }

  console.log('Linking related knowledge items...')
  for (const poi of Object.values(POI_DETAILS)) {
    await client
      .patch(knowledgeId(poi.id))
      .set({
        relatedKnowledge: (poi.relatedIds || []).map((id) => ({
          _type: 'reference',
          _ref: knowledgeId(id),
          _key: id,
        })),
      })
      .commit()
  }

  await seedMaps()

  const timelineEvents = buildTimelineEvents(Object.values(POI_DETAILS), HOTSPOT_POSITIONS)
  console.log(`Seeding ${timelineEvents.length} timeline events...`)
  for (const event of timelineEvents) {
    await client.createOrReplace(event)
  }

  console.log(
    'Done. Sanity Studio should now show seeded Era, Knowledge Item, Map, and Timeline Event documents.',
  )
}

function uniqueEras(eraTabsByKey) {
  const seen = new Set()
  const eras = []
  for (const definition of timelineDefinitions) {
    if (seen.has(definition.eraKey)) continue
    seen.add(definition.eraKey)
    eras.push({
      eraKey: definition.eraKey,
      tabLabel: eraTabsByKey.get(definition.eraKey) || definition.name,
      defaultTitle: definition.name,
      timePeriod: definition.timeframe,
      summary: definition.summary,
      sortOrder: eras.length,
    })
  }
  return eras
}

function buildTimelineEvents(pois, positions) {
  const events = []
  for (const [definitionIndex, definition] of timelineDefinitions.entries()) {
    for (const [yearIndex, year] of definition.years.entries()) {
      const hotspots = pois
        .filter((poi) => poi.eraKeys.includes(definition.eraKey))
        .map((poi) => {
          const position = positions[poi.id]
          if (!position) return null
          return {
            _key: poi.id,
            hotspotId: poi.id,
            placeName: poi.titleTop,
            metadata: poi.yearLabel || '',
            iconType: 'culture',
            xPercent: toPercent(position.left, HOTSPOT_BASE_WIDTH),
            yPercent: toPercent(position.top, HOTSPOT_BASE_HEIGHT),
            knowledge: {_type: 'reference', _ref: knowledgeId(poi.id)},
            shortTextOverride: poi.summary,
          }
        })
        .filter(Boolean)

      events.push({
        _id: `seed-event-${definition.eraKey}-${year}-${definitionIndex}-${yearIndex}`,
        _type: 'timelineEvent',
        year,
        era: {_type: 'reference', _ref: eraId(definition.eraKey)},
        displayTitle: definition.name,
        timePeriodOverride: definition.timeframe,
        summaryOverride: definition.summary,
        borderChangePrompt: 'What caused the border change?',
        borderChangeText: borderChangeByYear[year],
        map: {_type: 'reference', _ref: mapId(mapKeyForYear(year))},
        mapRegionLabel: definition.name,
        hotspots,
        sortOrder: definitionIndex * 100 + yearIndex,
      })
    }
  }
  return events
}

async function seedMaps() {
  const keys = mapFloorKeys.map(([, key]) => key)
  console.log(`Seeding ${keys.length} maps...`)
  for (const [floorYear, key] of mapFloorKeys) {
    const existing = await client.getDocument(mapId(key))
    const imageRef =
      !replaceAssets && existing?.image?.asset?._ref
        ? existing.image.asset._ref
        : await uploadMapImage(key)

    if (!imageRef) {
      console.warn(`Skipping map ${key}; no image asset available.`)
      continue
    }

    await client.createOrReplace({
      _id: mapId(key),
      _type: 'map',
      mapKey: key,
      title: key,
      image: {_type: 'image', asset: {_type: 'reference', _ref: imageRef}},
      floorYear,
    })
  }
}

async function uploadMapImage(key) {
  const filename = mapFiles[key]
  if (!filename) {
    console.warn(`No source file mapping for map ${key}.`)
    return undefined
  }

  // Prefer a rasterized version (renders reliably in expo-image), fall back to the bundled SVG.
  const base = path.parse(filename).name
  const rasterCandidate = ['.png', '.webp', '.jpg', '.jpeg']
    .map((ext) => path.join(rasterMapsDir, `${base}${ext}`))
    .find((candidate) => existsSync(candidate))
  const sourcePath = rasterCandidate || path.join(mapsDir, filename)

  if (!existsSync(sourcePath)) {
    console.warn(`Skipping map ${key}; missing file ${sourcePath}.`)
    return undefined
  }

  console.log(`  map ${key}: uploading ${path.relative(rootDir, sourcePath)}`)
  const asset = await client.assets.upload('image', createReadStream(sourcePath), {
    filename: path.basename(sourcePath),
    source: {
      name: 'PolishTabletExperience seed',
      id: `map-${key}`,
      url: sourcePath,
    },
  })
  return asset._id
}

async function uploadImage(imagePath, id) {
  if (!imagePath || typeof imagePath !== 'string' || !existsSync(imagePath)) {
    console.warn(`Skipping image upload for ${id}; missing local image path.`)
    return undefined
  }

  const asset = await client.assets.upload('image', createReadStream(imagePath), {
    filename: path.basename(imagePath),
    source: {
      name: 'PolishTabletExperience seed',
      id,
      url: imagePath,
    },
  })
  return asset._id
}

function mapKeyForYear(year) {
  for (let index = mapFloorKeys.length - 1; index >= 0; index -= 1) {
    const [startYear, mapKey] = mapFloorKeys[index]
    if (year >= startYear) return mapKey
  }
  return '1635'
}

function toPercent(value, base) {
  return Math.max(0, Math.min(100, Number(((value / base) * 100).toFixed(2))))
}

function eraId(key) {
  return `seed-era-${key}`
}

function knowledgeId(id) {
  return `seed-knowledge-${id}`
}

function mapId(key) {
  return `seed-map-${key}`
}

function loadEnv(filePath) {
  if (!existsSync(filePath)) return
  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

function loadTsModule(filePath) {
  const normalizedPath = path.normalize(filePath)
  if (moduleCache.has(normalizedPath)) return moduleCache.get(normalizedPath)

  const module = {exports: {}}
  moduleCache.set(normalizedPath, module)

  const source = readFileSync(normalizedPath, 'utf8')
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: normalizedPath,
  }).outputText

  const localRequire = (specifier) => {
    if (specifier === 'react-native') {
      return {
        Platform: {
          select(values) {
            return values.default ?? values.web ?? values.ios ?? Object.values(values)[0]
          },
        },
      }
    }

    if (specifier.startsWith('.')) {
      const resolved = path.resolve(path.dirname(normalizedPath), specifier)
      const assetPath = resolveAssetPath(resolved)
      if (assetPath) return assetPath
      return loadTsModule(resolveTsPath(resolved)).exports
    }

    return require(specifier)
  }

  const wrapper = `(function(exports, require, module, __filename, __dirname) { ${output}\n})`
  vm.runInThisContext(wrapper, {filename: normalizedPath})(
    module.exports,
    localRequire,
    module,
    normalizedPath,
    path.dirname(normalizedPath),
  )

  return module
}

function resolveTsPath(resolved) {
  for (const candidate of [resolved, `${resolved}.ts`, `${resolved}.tsx`, path.join(resolved, 'index.ts')]) {
    if (existsSync(candidate)) return candidate
  }
  throw new Error(`Unable to resolve TypeScript module: ${resolved}`)
}

function resolveAssetPath(resolved) {
  for (const candidate of [resolved, `${resolved}.png`, `${resolved}.jpg`, `${resolved}.jpeg`, `${resolved}.webp`]) {
    if (existsSync(candidate) && /\.(png|jpe?g|webp)$/i.test(candidate)) return candidate
  }
  return undefined
}
