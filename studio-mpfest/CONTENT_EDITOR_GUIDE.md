# MPFest Content Editor Guide

This guide is for editing the Polish Tablet Experience content in Sanity Studio. You do not need to edit code.

## How The App Uses Sanity

The tablet app reads published Sanity content when it starts. After you make a change, click **Publish** for the app to see it. Then reload or restart the tablet app.

If festival wifi is unstable, the app still has protection:

- If Sanity loads successfully, the app shows Sanity content.
- If wifi drops after a successful load, the app uses the last good Sanity content saved on the device.
- If there is no wifi and no saved Sanity content yet, the app uses bundled fallback content.

## Content Types

### Era

Use `Era` for the broad historical periods.

Appears in:

- Content tab filters
- Timeline era labels
- Default era card title, time period, and summary

Important fields:

- `Stable era key`: connects this era to the app. Do not change this on seeded eras.
- `Tab label`: label shown in the Content tab.
- `Default timeline title`: fallback title shown on timeline cards.
- `Time period`: date range shown under the title.
- `Summary / description`: short overview shown on the timeline.
- `Sort order`: controls display order.

### Knowledge Item

Use `Knowledge Item` for content cards and detail pages.

Appears in:

- Content tab cards
- Hotspot popups
- Detail page
- Related Content cards

Important fields:

- `Title / eyebrow`: top title, often "Did You Know?"
- `Year label`: short time label, such as `1400s-1791`.
- `Short card summary`: short text for cards and hotspot popups.
- `Full detail text`: longer text on the detail page.
- `Image`: main image for card/detail.
- `Image alt text`: plain description of the image.
- `Detail page YouTube clip`: optional video shown at the top of the detail page.
- `YouTube URL`: normal YouTube watch/share URL for the optional video.
- `Start time (seconds)` and `End time (seconds)`: optional clip range. Use total seconds.
- `Facts`: optional supporting facts.
- `Related eras`: which era filters this item belongs to.
- `Related content`: other Knowledge Items shown on the detail page.
- `Sort order`: controls card order.

The `Image` and `Image alt text` are still required even when a YouTube clip is added. The app uses the image if the video cannot play.

### Timeline Event

Use `Timeline Event` for timeline nodes, maps, border-change text, and hotspots.

Appears in:

- Timeline scrubber year nodes
- Timeline era card
- Background map selection
- Border-change card
- Hotspots on the map

Important fields:

- `Era year / timeline node`: year shown in the scrubber.
- `Era`: links this timeline event to an Era.
- `Display title override`: title shown for this specific event.
- `Time period override`: optional event-specific time period.
- `Summary override`: optional event-specific summary.
- `Border-change question text`: usually "What caused the border change?"
- `Border-change answer`: text shown in the border-change card.
- `Static map key`: chooses one of the bundled app maps.
- `Map region label`: label for the region shown on the map.
- `Hotspots`: pins shown on the map.
- `Sort order`: controls timeline order.

## Common Workflows

### Edit An Existing Content Card

1. Open **Knowledge Item**.
2. Find the item you want to edit.
3. Update `Title / eyebrow`, `Year label`, `Short card summary`, or `Full detail text`.
4. Click **Publish**.
5. Restart or reload the tablet app to see the change.

### Replace An Image

1. Open the relevant **Knowledge Item**.
2. In the `Image` field, upload or select a new image.
3. Update `Image alt text`.
4. Click **Publish**.
5. Restart or reload the tablet app.

### Add Related Content

1. Open the main **Knowledge Item**.
2. Go to `Related content`.
3. Add one or more existing Knowledge Items.
4. Click **Publish**.
5. Check the detail page in the app.

### Add A YouTube Clip To A Detail Page

1. Find the video on YouTube.
2. Check whether it can be embedded:
   - Click **Share**.
   - Click **Embed**.
   - If the preview says `Playback on other websites has been disabled by the video owner`, do not use that video.
3. Open the relevant **Knowledge Item** in Sanity.
4. Go to `Detail page YouTube clip`.
5. Paste the YouTube link into `YouTube URL`.
6. Enter `Start time (seconds)` and `End time (seconds)`.
   - Use total seconds, not minutes and seconds.
   - Example: `5:06` is `306` seconds.
   - Example: `5:06` to `5:45` is start `306`, end `345`.
7. Click **Publish**.
8. Restart or reload the tablet app and test the detail page.

If `End time (seconds)` is left blank, the video starts at `Start time (seconds)` and continues playing.

### Add A Hotspot To A Timeline Event

1. Open **Timeline Event**.
2. Select the event/year where the hotspot should appear.
3. In `Hotspots`, add a new hotspot.
4. Fill in:
   - `Hotspot ID`: short unique ID, such as `c39-hotspot`.
   - `Place name`: display/helpful name for editors.
   - `Icon type`: Culture, Biography, History, or Science.
   - `X position percent`: horizontal map position from `0` to `100`.
   - `Y position percent`: vertical map position from `0` to `100`.
   - `Linked knowledge item`: the Knowledge Item opened by this hotspot.
   - `Shortened hotspot text override`: optional shorter popup text.
5. Click **Publish**.
6. Restart or reload the tablet app.

### Add A New Era Safely

1. Create a new **Era**.
2. Choose the correct `Stable era key`.
3. Add label, title, time period, summary, and sort order.
4. Create one or more **Knowledge Item** documents and link them to the Era.
5. Create one or more **Timeline Event** documents and link them to the Era.
6. Add hotspots inside the Timeline Event if needed.
7. Publish the Era, Knowledge Items, and Timeline Events.
8. Restart or reload the tablet app.

## YouTube Troubleshooting

Some YouTube videos cannot play inside the tablet app because the video owner has disabled embedding. The app cannot override this YouTube setting.

If a video is blocked:

- Try a different upload of the same footage.
- Prefer a video that shows a working preview after clicking **Share** then **Embed**.
- Use an owned or approved video source when possible.
- Do not rely on the **Watch on YouTube** link for the exhibit tablet flow.

If a YouTube clip fails, the detail page should still show the required image fallback.

## Rules During Festival Prep

- Always click **Publish**. Drafts do not show in the tablet app.
- Do not change `Stable era key` on seeded Era documents.
- Do not edit `Static map key` unless you know which bundled map year should be used.
- Hotspot positions are percentages from `0` to `100`.
- Do not delete seeded documents during festival prep. Edit or unpublish instead.
- Keep `Short card summary` short. Long text belongs in `Full detail text`.
- Always test YouTube clips on the tablet detail page after publishing.
- Prefer YouTube videos that show a working embed preview.
- Do not rely on the **Watch on YouTube** link for the exhibit tablet flow.
- If you are unsure whether a change is safe, make the edit as a draft and ask before publishing.
