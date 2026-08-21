// One-time migration: converts existing timelineEvent.hotspots[].iconType from a plain
// string ("culture", "biography", "history", "science") into a reference to the matching
// hotspotCategory document.
//
// Run this AFTER the hotspotCategory documents exist (e.g. after running
// seed-current-content.mjs, which now seeds them) and BEFORE relying on the Studio's
// reference-typed iconType field for editing. Safe to re-run: hotspots whose iconType is
// already a reference are skipped.
//
// Usage: node scripts/migrate-hotspot-categories.mjs [--dry-run]

import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {createClient} from '@sanity/client'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const studioDir = path.resolve(__dirname, '..')
const rootDir = path.resolve(studioDir, '..')

const PROJECT_ID = 'zpmwzluo'
const DATASET = 'production'
const API_VERSION = '2026-06-07'
const dryRun = process.argv.includes('--dry-run')

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

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

async function main() {
  const categories = await client.fetch(`*[_type == "hotspotCategory"]{_id, value}`)
  if (!categories.length) {
    throw new Error(
      'No hotspotCategory documents found. Seed them first (e.g. run seed-current-content.mjs).',
    )
  }
  const categoryIdByValue = new Map(categories.map((category) => [category.value, category._id]))

  const events = await client.fetch(
    `*[_type == "timelineEvent" && count(hotspots[iconType._type != "reference"]) > 0]{_id, hotspots}`,
  )

  console.log(`Found ${events.length} timeline event(s) with unmigrated hotspots.`)

  let patchedHotspots = 0
  let skippedHotspots = 0

  for (const event of events) {
    const patch = client.patch(event._id)
    let hasSet = false

    for (const hotspot of event.hotspots || []) {
      if (!hotspot._key) continue
      if (hotspot.iconType && hotspot.iconType._type === 'reference') continue

      const value = typeof hotspot.iconType === 'string' ? hotspot.iconType : undefined
      const categoryId = value ? categoryIdByValue.get(value) : undefined

      if (!categoryId) {
        console.warn(
          `  ${event._id}: hotspot "${hotspot._key}" has unrecognized iconType ${JSON.stringify(
            hotspot.iconType,
          )}; skipping.`,
        )
        skippedHotspots += 1
        continue
      }

      patch.set({
        [`hotspots[_key=="${hotspot._key}"].iconType`]: {_type: 'reference', _ref: categoryId},
      })
      hasSet = true
      patchedHotspots += 1
    }

    if (!hasSet) continue

    if (dryRun) {
      console.log(`  [dry-run] would patch ${event._id}`)
      continue
    }

    await patch.commit()
    console.log(`  patched ${event._id}`)
  }

  console.log(
    `Done. ${patchedHotspots} hotspot(s) patched, ${skippedHotspots} skipped.${
      dryRun ? ' (dry run — no writes made)' : ''
    }`,
  )
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
