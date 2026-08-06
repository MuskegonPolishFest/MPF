# Tablet Setup Guide

One-time provisioning steps for each Lenovo exhibit tablet. Run through this checklist on all five tablets before the festival, after the festival APK (`com.muskegonpolishfestival.tablet`) is installed.

## 1. Disable Screen Sleep

The tablets stay powered and plugged in for the duration of the exhibit, so the screen should never dim or lock on its own.

1. Open **Settings > Display > Screen timeout** (naming may vary slightly by Android version).
2. Set it to **Never** / the longest available value.
3. If a "Never" option is not available under Display, enable Developer Options and use **Stay awake while charging**:
   - Settings > About tablet > tap **Build number** 7 times.
   - Settings > System > Developer options > enable **Stay awake**.
4. Confirm the tablet is on continuous power (charging cable connected) — "Stay awake while charging" only works while power is connected.

## 2. Enable App Pinning (Kiosk Mode)

App pinning locks the tablet to the festival app so a visitor can't back out to the home screen, notification shade, or another app.

1. Open **Settings > Security** (may be under **Security > More security settings** or **Security > Screen pinning** depending on Android version).
2. Enable **Screen pinning** (may also be labeled **App pinning**).
3. Optionally enable **Ask for PIN before unpinning** for extra protection.
4. Open the festival app.
5. Open the Recents/Overview screen (the square button or the gesture for it) and tap the app icon at the top of the card, then choose **Pin**.
6. Confirm the app is pinned — the status bar / home and back gestures should be blocked.

## 3. Volunteer Quick Reference

Give both on-site volunteers this before the festival opens.

**To unpin the app** (only needed for troubleshooting or shutdown):

- Hold **Back** and **Recents/Overview** at the same time until it unpins.
- On newer Android versions with gesture navigation: swipe up and hold from the bottom of the screen.
- If a PIN was set for unpinning, enter it when prompted.

**If the app freezes or shows an error screen:**

1. Unpin the app using the gesture above.
2. Close the app from Recents (swipe it away) or use the app switcher to force-close it.
3. Reopen the app from the home screen.
4. Re-pin the app (step 5 in section 2).

**If content looks out of date:**

- On the timeline screen, long-press the Home icon for 2 seconds. See [studio-mpfest/README.md](./studio-mpfest/README.md#last-minute-content-update-workflow) for what each status message means.

## 4. Pre-Festival Checklist (Per Tablet)

- [ ] Festival APK installed and opens to the intro/guide screen.
- [ ] Screen timeout set to Never / Stay awake while charging enabled.
- [ ] Wifi connected and content loads from Sanity at least once (see [studio-mpfest/README.md](./studio-mpfest/README.md#festival-wifi-fallback)).
- [ ] App pinned.
- [ ] Volunteers briefed on unpin gesture and freeze-recovery steps above.
- [ ] Charging cable connected and cable-managed so visitors can't dislodge it.
