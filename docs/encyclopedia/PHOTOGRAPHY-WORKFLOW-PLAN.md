# Photography Workflow Plan
**Version:** 2026-06-28

## Capture
- Equipment: [leave blank for Christie/Dustin to fill]
- Background: matte white sweep
- Lighting: [leave blank]
- Specimen placement: centered, intentional, allow shadow

## Editing
- Crop to 1254×1254px square
- Background replacement: #FAF7F2 (provisional — test across stone range before locking)
- Preserve or recreate soft grounding shadow
- Export: WebP, maximum quality

## Occupancy standard
- Target: 68–74% of canvas
- Adjust per specimen shape (tall, flat, irregular)
- Full specimen must be visible — no edge cropping

## Upload
- Destination: Supabase storage bucket `stone-images/encyclopedia/`
- Filename: [stone-slug].webp
- Update `image_url` in `enc_stone_content` after upload

## Quality check
- Open on live page with object-fit: contain
- Confirm full specimen is visible
- Confirm no background color mismatch
- Confirm shadow reads naturally on #FAF7F2

## Notes
- `object-fit: contain` is canonical — never override to cover without Christie approval
- Background color #FAF7F2 is provisional — final lock after testing across stone range
