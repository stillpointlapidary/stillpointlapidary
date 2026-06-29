# Still Point Lapidary — Encyclopedia Photo Standard

**Status:** Draft for Christie review  
**Purpose:** Defines the capture, editing, export, upload, and QA standards for encyclopedia stone photography.

---

## 1. Authority and Scope

This document controls:

- specimen photography setup
- canvas size
- background treatment
- specimen occupancy
- crop and framing
- shadow treatment
- export format and quality
- upload path and filename
- live-page image QA

This document does **not** control:

- page layout
- Hero frame CSS
- image database columns
- specimen identification
- editorial copy
- publication status

Related authorities:

- `ENCYCLOPEDIA-PAGE-STRUCTURE.md` controls how the image frame behaves on the page
- `ENCYCLOPEDIA-DATABASE-REFERENCE.md` controls image-field storage
- locked production data controls the approved image path
- `ENCYCLOPEDIA-PAGE-VISUAL-STANDARD.html` controls final presentation

---

## 2. Image Goal

Every encyclopedia image should:

- show the full specimen clearly
- preserve the specimen’s real shape and proportion
- feel neutral, consistent, and collectible
- avoid distracting props or styling
- retain enough shadow to feel grounded
- work cleanly inside the canonical square image frame

The image is a reference photograph, not a lifestyle photograph.

---

## 3. Capture Setup

### Background

Use:

- a matte white sweep
- a clean, uncluttered surface
- no visible horizon line when possible

Do not use:

- colored paper
- patterned surfaces
- fabric texture
- props
- hands
- display stands unless the specimen cannot be safely photographed otherwise
- styled environments

### Lighting

Use soft, even light that preserves:

- surface texture
- translucency
- luster
- crystal faces
- matrix detail
- color accuracy

Avoid:

- harsh direct glare
- blown highlights
- crushed shadows
- strong color cast
- ring-light reflections
- multiple competing shadows

### Camera Position

Use the angle that best communicates the specimen’s identity.

Default:

- specimen centered
- camera level enough to avoid distortion
- slight angle allowed when needed to show form, face, or depth

Do not force every specimen into the same camera angle when doing so hides important structure.

### Equipment

Record the approved equipment and setup once finalized:

- Camera or phone:
- Lens:
- Lighting:
- Tripod or support:
- Capture distance:
- White-balance method:

This section may remain operationally blank until Christie and Dustin lock the capture setup.

---

## 4. Specimen Placement

The specimen should feel centered and intentional.

Allow enough open space for:

- irregular edges
- towers
- clusters
- fossils
- matrix
- broad or low forms

The full specimen must remain visible.

Do not crop:

- tower tips
- cluster points
- fossil edges
- matrix corners
- irregular outer contours

A small visual offset is acceptable when needed for balance.

---

## 5. Canvas and Crop

### Canvas Size

- 1254 × 1254 pixels
- square
- no embedded border
- no decorative frame

### Crop

Crop to preserve the full specimen.

Do not crop merely to make every specimen occupy the same exact percentage.

The occupancy standard is a target, not a guillotine.

---

## 6. Occupancy Standard

Target specimen occupancy:

- approximately 68–74% of the square canvas

Adjust for specimen shape.

### Tall Specimens

Allow more vertical breathing room.

Do not enlarge until the top or base feels cramped.

### Flat or Wide Specimens

Allow more side-to-side occupancy while preserving full edges.

### Clusters and Irregular Forms

Prioritize the entire silhouette over a strict percentage target.

### Small Specimens

Do not enlarge so aggressively that texture becomes soft or artificial.

### Fossils and Matrix Specimens

Preserve complete context when the matrix or host material is part of the specimen’s identity.

---

## 7. Background Replacement

Approved working background:

`#FAF7F2`

This background is provisional until confirmed across a representative range of:

- white stones
- pale translucent stones
- metallic stones
- dark stones
- warm-toned stones
- cool-toned stones
- fossils
- matrix specimens

When replacing the background:

- preserve natural edge detail
- avoid halos
- avoid jagged masking
- preserve fine crystal points
- preserve translucent edges
- avoid clipping pale areas into the background

Do not brighten the specimen merely to separate it from the background.

---

## 8. Shadow Treatment

Preserve or recreate one soft grounding shadow.

The shadow should:

- anchor the specimen
- remain subtle
- follow the specimen’s apparent contact point
- match the lighting direction
- avoid becoming a dark oval or artificial glow

Do not use:

- dramatic drop shadows
- floating shadows
- multiple shadows
- hard-edged shadows
- colored shadows
- heavy vignette

The shadow should disappear into the image before it becomes a design element.

---

## 9. Color and Retouching

Retouch only enough to present the specimen accurately and consistently.

Allowed:

- white-balance correction
- exposure correction
- mild contrast correction
- dust removal
- sensor-spot removal
- background cleanup
- subtle shadow reconstruction
- correction of obvious capture artifacts

Not allowed:

- changing the stone’s actual color
- increasing saturation beyond believable appearance
- adding or intensifying rainbows
- adding sparkle
- removing natural fractures, pits, inclusions, or matrix
- smoothing natural texture
- reshaping the specimen
- compositing a different specimen
- making treated material appear natural

The image must remain a truthful representation of the photographed specimen.

---

## 10. Sharpness and Resolution

The specimen should be:

- sharp at normal viewing size
- detailed enough to show texture
- free of obvious motion blur
- free of excessive noise reduction
- free of artificial oversharpening halos

Do not rescue a weak source image with aggressive sharpening.

Retake the image when detail is materially inadequate.

---

## 11. Export Standard

Export as:

- WebP
- 1254 × 1254 pixels
- maximum practical quality
- embedded color profile when supported

Recommended quality range:

- 85–90 for normal production
- higher only when needed to preserve fine texture or translucency

File size should remain efficient without visible degradation.

Do not export:

- JPEG as the canonical encyclopedia image
- PNG unless transparency is explicitly required
- oversized source dimensions as the final production file
- multiple competing final versions under similar names

---

## 12. Filename

Canonical filename:

`[stone-slug].webp`

Examples:

- `hematite.webp`
- `black-tourmaline.webp`
- `rainbow-moonstone.webp`

Rules:

- lowercase
- exact canonical slug
- hyphens only
- no spaces
- no version suffix in the final production filename
- no photographer name
- no date stamp

Working files may use version suffixes outside the production upload path.

---

## 13. Upload Location

Supabase storage:

- bucket: `stone-images`
- path: `encyclopedia/[stone-slug].webp`

Canonical public pattern:

`stone-images/encyclopedia/[stone-slug].webp`

After upload:

- confirm the public URL
- update the approved image field in production data or Supabase as required
- confirm the slug matches the stone record
- remove stale duplicate uploads only after verifying the active URL

---

## 14. Live-Page Behavior

The live page uses:

- square frame
- background `#FAF7F2`
- `object-fit: contain`
- `object-position: center`
- no internal padding
- no inner image border

The entire specimen must remain visible at:

- desktop
- tablet
- mobile

Do not compensate for poor source framing by switching the live page to `object-fit: cover`.

Fix the image source instead.

---

## 15. Quality Check

Before approval, verify:

### Source Image

- full specimen visible
- no accidental crop
- accurate color
- clean edges
- no masking halo
- natural-looking shadow
- sharp enough
- background consistent
- filename correct
- correct 1254 × 1254 dimensions
- WebP export

### Live Page

- image loads
- no distortion
- no dominant empty area
- no cramped specimen
- no background mismatch
- no border artifact
- full specimen visible at all required breakpoints
- image feels balanced beside Hero content

### Data

- URL points to the correct stone
- slug matches
- alt text is present
- no stale duplicate URL remains in active production data

---

## 16. Exceptions

An exception may be appropriate when:

- the specimen is extremely tall or wide
- the matrix is essential to identity
- the specimen cannot safely stand unsupported
- translucency requires a modified lighting approach
- a fossil or slab needs a flatter presentation
- a microscopic or tiny specimen needs different capture treatment
- the approved page composition requires a carefully justified position adjustment

Exceptions require Christie or Dustin approval.

Record the exception in production notes when it affects reuse or future replacement.

---

## 17. Replacement Images

When replacing an existing encyclopedia image:

1. confirm the new image is approved
2. export using the canonical filename
3. upload to the canonical path
4. confirm cache behavior
5. verify the live page
6. confirm no stale alternate URL remains in production data
7. retain the prior source file outside the production path only if needed for archive

Do not create permanent filename forks such as:

- `hematite-new.webp`
- `hematite-final.webp`
- `hematite-final2.webp`

The canonical production filename remains stable.

---

## 18. Change Control

Changes to:

- background color
- canvas size
- occupancy target
- export format
- upload path
- filename convention
- live image-fit behavior

require:

1. Christie or Dustin approval
2. update to this document
3. review of the visual standard
4. testing across a representative stone range
5. targeted review of existing images when the change could expose inconsistencies

This document reflects the current approved photo workflow only.

Do not preserve superseded photo rules in an amendment archive.
