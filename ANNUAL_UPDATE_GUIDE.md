# Annual Update Guide

Steps for bringing this project back for a future festival. Use this alongside [TABLET_SETUP_GUIDE.md](./TABLET_SETUP_GUIDE.md) (per-tablet provisioning) and [studio-mpfest/README.md](./studio-mpfest/README.md) (Studio/content operations).

## 1. Update Content for the New Year

Content lives in Sanity, not in app code. Follow [studio-mpfest/CONTENT_EDITOR_GUIDE.md](./studio-mpfest/CONTENT_EDITOR_GUIDE.md) to add or edit Eras, Timeline Events, Knowledge Items, and Maps in the Studio. Publish changes before rebuilding — content-only edits do not require a new APK.

If you need to seed or reset content programmatically, see the seed workflow in [studio-mpfest/README.md](./studio-mpfest/README.md#seed-current-app-content).

## 2. Bump the App Version

Before building a new APK, update `android.versionCode` in `app.config.js` (currently `1`). Increment it so the new build is distinguishable from last year's install.

## 3. Rebuild the APK

From the repo root:

```powershell
eas build --platform android --profile preview
```

The `preview` profile produces an installable APK for internal distribution (see [README.md](./README.md#festival-apk-build) for details).

## 4. Reinstall on Tablets

1. Uninstall the previous year's build or sideload the new APK over it.
2. Re-run the full checklist in [TABLET_SETUP_GUIDE.md](./TABLET_SETUP_GUIDE.md) on each tablet — a reinstall can clear app-pinning and screen-timeout state, so don't assume last year's settings carried over.

## 5. Rotate Credentials

- Rotate or revoke the `SANITY_AUTH_TOKEN` used for seeding. See "Token Notes" in [studio-mpfest/README.md](./studio-mpfest/README.md#token-notes) for which permission level to issue.
- Confirm whoever is editing content this year has login access to `https://mpfest.sanity.studio`, and remove access for anyone who's no longer involved.

## 6. Dependency Check

A year is a long gap between builds. Before rebuilding, check for outdated packages:

```powershell
npm outdated
npx expo install --check
```

This is informational - don't upgrade blindly right before the festival. If dependencies are badly out of date, budget time to test after upgrading, separate from the content/build cycle above.
