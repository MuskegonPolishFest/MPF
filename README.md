# Polish Tablet Experience

Expo React Native tablet app for the Muskegon Polish Festival interactive exhibit. The app runs in landscape orientation, shows bundled fallback content, and can load published content from the MPFest Sanity Studio.

## Quick Start

Install dependencies:

```powershell
npm install
```

Start the Expo development server:

```powershell
npm run start
```

Run on Android:

```powershell
npm run android
```

Run lint checks:

```powershell
npm run lint
```

## Tablet Utilities

Restart a connected Android tablet from the repo root:

```powershell
npm run tablet:restart
```

This force-stops and relaunches the installed package `com.muskegonpolishfestival.tablet`.

## Festival APK Build

Build the festival APK with the `preview` EAS profile:

```powershell
eas build --platform android --profile preview
```

The `preview` profile creates an installable APK for internal distribution.

## Content System

- The app fetches published Sanity content when it starts.
- If Sanity loads successfully, the app displays CMS content.
- If Sanity later fails, the app uses the last-known-good device cache.
- If no CMS content or cache is available, the app uses bundled fallback content.

For Studio setup, deploy, and seed operations, see [studio-mpfest/README.md](./studio-mpfest/README.md).

For content intern workflows, see [studio-mpfest/CONTENT_EDITOR_GUIDE.md](./studio-mpfest/CONTENT_EDITOR_GUIDE.md).

## Tablet Provisioning

For per-tablet setup (screen sleep, app pinning, volunteer instructions), see [TABLET_SETUP_GUIDE.md](./TABLET_SETUP_GUIDE.md).

## Annual Updates

For bringing this project back next year (content refresh, rebuild, redeploy, credential rotation), see [ANNUAL_UPDATE_GUIDE.md](./ANNUAL_UPDATE_GUIDE.md).
