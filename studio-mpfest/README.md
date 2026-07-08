# MPFest Sanity Studio

This folder contains the Sanity Studio for the Muskegon Polish Festival tablet experience. Use it to manage published CMS content for the app, deploy the hosted Studio, and seed the current bundled app content into Sanity.

For non-code content editing instructions, see [CONTENT_EDITOR_GUIDE.md](./CONTENT_EDITOR_GUIDE.md).

## Project Config

- Sanity project ID: `zpmwzluo`
- Dataset: `production`
- Studio title: `MPFest`
- Studio folder: `studio-mpfest`
- Hosted Studio: `https://mpfest.sanity.studio`

The Studio content types are:

- `Era`
- `Knowledge Item`
- `Timeline Event`
- `Map`

## Local Development

From the repo root:

```powershell
cd studio-mpfest
npm install
npm run dev
```

Build the Studio locally:

```powershell
npm run build
```

## Deploy Sanity Studio

From the repo root:

```powershell
cd studio-mpfest
npm install
npm run build
npm run deploy
```

If Sanity asks you to log in:

```powershell
npx sanity login
npm run deploy
```

On the first deploy, Sanity may ask for a Studio hostname. Use:

```text
mpfest
```

The hosted Studio should then be available at:

```text
https://mpfest.sanity.studio
```

## Seed Current App Content

Use the seed script only when you need to populate or refresh Sanity with the current app content.

Create `studio-mpfest/.env.local`:

```powershell
cd studio-mpfest
Copy-Item .env.local.example .env.local
```

Add a Sanity token with **Editor** permissions:

```env
SANITY_AUTH_TOKEN=your-token-here
```

Run:

```powershell
npm run seed:current
```

Force image and map asset re-upload only when necessary:

```powershell
npm run seed:current -- --replace-assets
```

The seed script uses stable IDs like `seed-era-golden_age`, `seed-knowledge-c1`, `seed-map-1635`, and `seed-event-golden_age-1635-0-0`, so rerunning it updates seeded documents instead of duplicating them.

Map seeding uses bundled map artwork from the app. It prefers raster files in `assets/maps_raster` when a matching `.png`, `.webp`, `.jpg`, or `.jpeg` exists, and otherwise falls back to the bundled SVG source in `assets/maps_svg`.

## Token Notes

Use an **Editor** token for seeding.

- `Viewer` cannot write content.
- `Contributor` can write drafts but is not appropriate for publishing seeded documents.
- `Developer` works but grants more access than needed.
- `Access Manager` is too broad for this task.

After seeding, you can revoke the token in Sanity Manage if it is no longer needed.

## How App Content Updates Work

- The tablet app fetches published Sanity content when it starts.
- If Sanity content is valid, the app displays CMS content.
- If wifi fails after a successful fetch, the app uses the last-known-good device cache.
- If there is no wifi and no cache yet, the app uses bundled fallback content.
- Content edits appear after publishing and refreshing or restarting the app.

## Festival APK Build

Build the festival APK with the `preview` profile:

```powershell
eas build --platform android --profile preview
```

The `preview` profile builds an installable APK because it uses internal distribution and `android.buildType: "apk"`.

Content-only Sanity edits do not require:

- a new APK
- EAS Update
- rebuilding
- reinstalling

Code changes after APK install require a new APK. This app is not relying on EAS Update for festival-day content changes.

## Last-Minute Content Update Workflow

Use this when the content intern changes content shortly before the festival.

1. Content intern edits content in Sanity Studio.
2. Content intern clicks **Publish**.
3. On each tablet, go to the timeline screen.
4. Long-press the Home icon for 2 seconds.
5. Confirm the app shows one of these messages:
   - `Content updated`
   - `Using cached content`
   - `Wifi unavailable`
6. Confirm the edited card, detail page, hotspot, or map appears.

`Content updated` means the tablet pulled the latest published Sanity content.

`Using cached content` means Sanity was unavailable, but the tablet still has a previous good CMS copy.

`Wifi unavailable` means the app could not reach Sanity and no saved CMS cache was available, so it is using bundled fallback content.

## Refresh Connected Tablets From Terminal

If a tablet is connected by USB with Android debugging enabled, restart the installed APK from the repo root:

```powershell
npm run tablet:restart
```

This runs `adb`, force-stops the package, and launches it again. Startup will fetch Sanity content if wifi is available.

If multiple tablets are connected, use `adb devices` first and restart one tablet at a time with a selected device if needed.

## Festival Wifi Fallback

Before the festival:

1. Connect each tablet to wifi.
2. Start the app once and confirm CMS content loads.
3. This saves the latest good CMS content on the device.
4. Test with wifi disabled.

Expected result:

- If the device already loaded Sanity once, it should show cached CMS content.
- If the device has never loaded Sanity, it should still show bundled fallback content.

## Validation Checklist

After deploy:

- Open `https://mpfest.sanity.studio`.
- Confirm you can log in.
- Confirm `Era`, `Knowledge Item`, `Timeline Event`, and `Map` appear in Structure.
- Confirm seeded documents exist.

After content edit:

- Edit one `Knowledge Item`.
- Publish it.
- Long-press the Home icon for 2 seconds or restart the tablet app.
- Confirm the change appears in the Content tab and detail page.

After map edit:

- Edit one `Map` or the `Background map` reference on a `Timeline Event`.
- Publish the affected document.
- Long-press the Home icon for 2 seconds or restart the tablet app.
- Confirm the expected map appears on the timeline screen.

After wifi test:

- Load app once with wifi enabled.
- Disable wifi.
- Restart app.
- Confirm content still appears.

## Troubleshooting

### Studio shows no documents

Run:

```powershell
cd studio-mpfest
npm run seed:current
```

Then refresh the Studio.

### App does not show a published edit

Check:

- Was the document published, not just saved as a draft?
- Did you restart or reload the tablet app?
- Is the edited item linked to the right Era, Timeline Event, or Map?

### Seed script fails with token or permissions error

Check:

- `.env.local` exists in `studio-mpfest`.
- `SANITY_AUTH_TOKEN` is set.
- The token has **Editor** permissions.

### Seed script fails with missing references

Rerun:

```powershell
npm run seed:current
```

The script seeds documents with deterministic IDs and links related content after all Knowledge Items and Maps exist.

## Official Sanity References

- Deploy CLI command reference: https://www.sanity.io/docs/cli-reference/deploy
- Hosting and deployment: https://www.sanity.io/docs/deployment
