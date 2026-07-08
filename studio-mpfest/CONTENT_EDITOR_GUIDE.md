# MPFest Content Editor Guide

This guide is for editing the Polish Tablet Experience content in Sanity Studio. You do not need to edit code.

## How The App Uses Sanity

The tablet app reads published Sanity content when it starts. After you make a change, click **Publish** for the app to see it. Then reload or restart the tablet app.

If festival wifi is unstable, the app still has protection:

- If Sanity loads successfully, the app shows Sanity content.
- If wifi drops after a successful load, the app uses the last good Sanity content saved on the device.
- If there is no wifi and no saved Sanity content yet, the app uses bundled fallback content.

## How To Fill Fields

- Required fields must be filled before publishing.
- Optional fields can be left blank unless a workflow says to use them.
- For `Sort order`, use whole numbers. Lower numbers appear first.
- For new content, use gaps like `10`, `20`, `30` so another item can be inserted later.
- For test-only content, start titles and labels with `TEST -` so they are easy to find and remove.
- If you are unsure whether a stable key, map, image, or video is approved, save as a draft and ask before publishing.

## Content Types

### Era

Use `Era` for the broad historical periods.

Appears in:

- Content tab filters
- Timeline era labels
- Default era card title, time period, and summary

Important fields:

- `Stable era key`: choose from the dropdown. Do not invent or duplicate keys. Do not change this on seeded eras. If Studio rejects a duplicate, edit the existing Era instead.
- `Tab label`: short filter label, such as `World War II` or `Modern Poland`.
- `Default timeline title`: readable timeline title, such as `World War II & Occupation`.
- `Time period`: compact date range, such as `1939-1945`.
- `Summary / description`: 1-2 sentence overview of the era.
- `Sort order`: whole number. Lower numbers appear earlier in filters; use gaps like `10`, `20`, `30`.

### Knowledge Item

Use `Knowledge Item` for content cards and detail pages.

Appears in:

- Content tab cards
- Hotspot popups
- Detail page
- Related Content cards

Important fields:

- `Title / eyebrow`: card/detail title, often `Did You Know?` or a specific topic title.
- `Year label`: short date or range, such as `1791`, `1939-1945`, or blank if not useful.
- `Short card summary`: 1-2 short sentences for cards and hotspot popups. Keep this under the Studio warning limit.
- `Full detail text`: full paragraph text for the detail page.
- `Image`: approved image for the card/detail page. This is also the fallback if a video cannot play.
- `Image alt text`: plain description of the image, such as `Crowd in Warsaw during a wartime commemoration`.
- `Detail page YouTube clip`: optional video shown at the top of the detail page. Leave blank if there is no approved video.
- `YouTube URL`: normal YouTube watch/share link for an embeddable video.
- `Start time (seconds)`: whole number of seconds where the clip should begin, such as `306`.
- `End time (seconds)`: whole number of seconds where the clip should stop. This must be greater than `Start time (seconds)`, or blank to keep playing.
- `Facts`: optional short supporting facts, one fact per item.
- `Related eras`: select the era filters where this item should appear.
- `Related content`: select other relevant Knowledge Items to show on the detail page.
- `Sort order`: whole number. Lower numbers appear earlier in cards; use gaps like `10`, `20`, `30`.

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

- `Era year / timeline node`: whole year shown in the scrubber, such as `1939`.
- `Era`: select the matching Era.
- `Display title override`: title for this specific timeline node, or blank if the Era default title is fine.
- `Time period override`: event-specific range, such as `1939-1945`, or blank if the Era time period is fine.
- `Summary override`: event-specific 1-2 sentence summary, or blank if the Era summary is fine.
- `Border-change question text`: usually keep `What caused the border change?`.
- `Border-change answer`: short explanation shown in the border-change card.
- `Background map`: select the Map document that should appear behind this timeline node.
- `Map region label`: short label for the shown territory, or blank if the Map default label is fine.
- `Hotspots`: pins on the map that link to Knowledge Items.
- `Sort order`: whole number. Lower numbers appear earlier for timeline ordering; use gaps like `10`, `20`, `30`.

Hotspot fields:

- `Hotspot ID`: short unique ID, such as `warsaw-1939-hotspot`. Use lowercase letters, numbers, and hyphens when possible.
- `Place name`: editor-friendly place label, such as `Warsaw`.
- `Metadata`: short helper text, such as `1939`, or blank if not needed.
- `Icon type`: choose Culture, Biography, History, or Science.
- `X position percent`: number from `0` to `100`; `0` is left, `50` is center, `100` is right.
- `Y position percent`: number from `0` to `100`; `0` is top, `50` is center, `100` is bottom.
- `Linked knowledge item`: select the Knowledge Item opened by this hotspot.
- `Shortened hotspot text override`: shorter popup text, or blank to use the Knowledge Item summary.

### Map

Use `Map` for the background map artwork shown on timeline events.

Appears in:

- Background map selection on Timeline Events
- Timeline screen map artwork

Important fields:

- `Stable map key`: approved map key matching the app's bundled offline fallback maps. Keep it unique and do not change seeded values.
- `Editor label`: human-friendly name shown in Studio, such as `1939 - Poland divided`.
- `Map image`: approved background map artwork with the red territory baked in.
- `Default region label`: fallback territory label, such as `Poland and occupied territories`, or blank if not needed.
- `Applies from year`: whole year used for map routing, such as `1939`.

## Common Workflows

### Complete Lifecycle Test: Add And Verify A New Content Path

Use this test when you want to confirm that a new editable content path works from Sanity Studio all the way to the tablet app.

#### 1. Create Or Choose An Era

1. Open **Era**.
2. For festival content, choose the existing Era where the new content belongs.
3. For a test-only path, create a new Era only if you have a safe unused `Stable era key`, and use labels like `TEST - World War II`.
4. Fill in or confirm:
   - `Stable era key`: choose an unused dropdown value. Do not type a custom value.
   - `Tab label`: short filter label, such as `TEST - WWII`.
   - `Default timeline title`: readable title, such as `TEST - World War II & Occupation`.
   - `Time period`: compact range, such as `1939-1945`.
   - `Summary / description`: 1-2 sentence overview.
   - `Sort order`: whole number, such as `10` for the first test era or `20` for the next.

Each `Stable era key` must be unique. If Studio says the key already exists, edit the existing Era instead of creating another one.

#### 2. Create Or Choose A Map

1. Open **Map**.
2. For most content edits, choose an existing Map that matches the timeline year.
3. Create a new Map only when new map artwork is ready and approved.
4. Fill in or confirm:
   - `Stable map key`: approved key for the fallback map, such as `1939`.
   - `Editor label`: friendly label, such as `TEST - 1939 map`.
   - `Map image`: approved map artwork.
   - `Default region label`: short territory label, or blank if not needed.
   - `Applies from year`: whole year, such as `1939`.

Do not change `Stable map key` on a seeded Map unless the app team confirms the map key should change.

#### 3. Create The Knowledge Item

1. Open **Knowledge Item**.
2. Create a new document.
3. Fill in:
   - `Title / eyebrow`: title shown on cards/details, such as `TEST - Did You Know?`.
   - `Year label`: short date or range, such as `1939-1945`.
   - `Short card summary`: 1-2 short sentences.
   - `Full detail text`: full paragraph text for the detail page.
   - `Image`: approved image.
   - `Image alt text`: plain image description.
   - `Related eras`: select the Era from step 1.
   - `Sort order`: whole number, such as `10` for the first test card or `20` for the next.
4. Optional: add `Facts` as short one-line facts.
5. Optional: add `Related content` if this item should link to other Knowledge Items.
6. Optional: add `Detail page YouTube clip`.
   - Paste an embeddable YouTube watch/share link into `YouTube URL`.
   - Use whole total seconds for `Start time (seconds)` and `End time (seconds)`.
   - Example: `5:06` is `306` seconds.
   - Leave `End time (seconds)` blank if the clip should continue playing.

The `Image` and `Image alt text` are required even when a YouTube clip is added.

#### 4. Create The Timeline Event

1. Open **Timeline Event**.
2. Create a new document.
3. Fill in:
   - `Era year / timeline node`: whole year, such as `1939`.
   - `Era`: select the Era from step 1.
   - `Display title override`: title for this node, such as `TEST - 1939 timeline node`, or blank if the Era title is fine.
   - `Time period override`: event-specific range, such as `1939-1945`, or blank if the Era range is fine.
   - `Summary override`: 1-2 sentence event summary, or blank if the Era summary is fine.
   - `Border-change question text`: usually keep `What caused the border change?`.
   - `Border-change answer`: short explanation for the border-change card.
   - `Background map`: select the Map from step 2.
   - `Map region label`: short label for the territory, or blank if the Map default is fine.
   - `Sort order`: whole number, such as `10` for the first test event or `20` for the next.

Choose the same Era used by the Knowledge Item, and choose the Map that should appear behind this timeline node.

#### 5. Add A Hotspot

1. In the Timeline Event, go to `Hotspots`.
2. Add a new hotspot.
3. Fill in:
   - `Hotspot ID`: short unique ID, such as `test-1939-hotspot`.
   - `Place name`: label for editors, such as `TEST - Warsaw`.
   - `Metadata`: short helper text, such as `1939`, or blank if not needed.
   - `Icon type`: choose Culture, Biography, History, or Science.
   - `X position percent`: number from `0` to `100`; `50` is the horizontal center.
   - `Y position percent`: number from `0` to `100`; `50` is the vertical center.
   - `Linked knowledge item`: select the Knowledge Item from step 3.
   - `Shortened hotspot text override`: shorter popup text, or blank to use the Knowledge Item summary.
4. Set `Linked knowledge item` to the Knowledge Item created in step 3.

Use `X position percent` and `Y position percent` values from `0` to `100`. If you are testing quickly, start near the center of the map, such as `50` and `50`, then adjust after viewing it on the tablet.

#### 6. Publish And Refresh The Tablet

1. Publish the Era, Map, Knowledge Item, and Timeline Event.
2. On the tablet, go to the timeline screen.
3. Long-press the Home icon for 2 seconds, or restart the tablet app.
4. Confirm the app shows one of these messages:
   - `Content updated`
   - `Using cached content`
   - `Wifi unavailable`

`Content updated` is the expected result when wifi and Sanity are available.

#### 7. Verify In The App

Confirm the new path appears in all expected places:

- Content tab: the Knowledge Item appears under the selected Era.
- Detail page: the title, year label, image, full detail text, facts, related content, and optional YouTube clip appear correctly.
- Timeline: the timeline node appears for the selected year.
- Map: the selected Background map appears.
- Hotspot: the hotspot appears in the expected map position.
- Hotspot popup: the popup opens the linked Knowledge Item and shows the short summary or `Shortened hotspot text override`.

For test-only content, unpublish or delete the test documents after verification. For festival content, leave it published only after review.

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
   - `Metadata`: short helper text, such as a year, or blank if not needed.
   - `Icon type`: Culture, Biography, History, or Science.
   - `X position percent`: horizontal map position from `0` to `100`; `50` is center.
   - `Y position percent`: vertical map position from `0` to `100`; `50` is center.
   - `Linked knowledge item`: the Knowledge Item opened by this hotspot.
   - `Shortened hotspot text override`: optional shorter popup text, or blank to use the Knowledge Item summary.
5. Click **Publish**.
6. Restart or reload the tablet app.

### Change A Timeline Map

1. Open **Timeline Event**.
2. Select the event/year that should use a different map.
3. Update `Background map` to the correct existing Map document.
4. Update `Map region label` only if this event needs a label different from the Map default.
5. Click **Publish**.
6. Restart or reload the tablet app.

### Add A New Era Safely

1. Create a new **Era**.
2. Choose the correct `Stable era key`.
3. Add label, title, time period, summary, and sort order.
4. Create one or more **Knowledge Item** documents and link them to the Era.
5. Create one or more **Timeline Event** documents and link them to the Era.
6. Link each Timeline Event to the correct `Background map`.
7. Add hotspots inside the Timeline Event if needed.
8. Publish the Era, Knowledge Items, Timeline Events, and any changed Maps.
9. Restart or reload the tablet app.

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
- Do not change `Stable map key` or swap a Timeline Event's `Background map` unless you know which map year should be used.
- Hotspot positions are percentages from `0` to `100`.
- Do not delete seeded documents during festival prep. Edit or unpublish instead.
- Keep `Short card summary` short. Long text belongs in `Full detail text`.
- Always test YouTube clips on the tablet detail page after publishing.
- Prefer YouTube videos that show a working embed preview.
- Do not rely on the **Watch on YouTube** link for the exhibit tablet flow.
- If you are unsure whether a change is safe, make the edit as a draft and ask before publishing.
