## Why

The redesigned FrontStage already has a strong editorial identity, but it can use one restrained interactive visual accent to make the portfolio feel more memorable without turning the site into a tech demo. This change evaluates the proposed Open Design adjacent libraries and adopts only the one that fits the current portfolio surface.

## What Changes

- Add a lightweight `cobe` WebGL globe accent to the FrontStage, using the existing warm cream / ink / yellow visual system.
- Place the globe where it supports the portfolio story, preferably near Contact or About, with a Taiwan marker and no API or backend dependency.
- Keep `pretext` out of the implementation because the current FrontStage does not have a repeated text measurement hot path.
- Keep `mapcn` out of the implementation because the current FrontStage does not need an interactive map, route drawing, or geospatial UI.
- Preserve the existing BEM CSS design system and FrontStage content structure.

## Capabilities

### New Capabilities

- `frontstage-globe-accent`: A decorative but purposeful FrontStage globe accent that works across themes, viewports, and reduced-motion preferences.

### Modified Capabilities

(none)

## Impact

- Affected specs: `frontstage-globe-accent`
- Affected code:
  - `frontend/package.json` / lockfile dependency changes for `cobe`
  - FrontStage Home section/component files for the globe placement
  - FrontStage design CSS for globe layout, theme colors, and responsive fallback
- No API, Workers, D1 schema, upload flow, or Admin behavior changes.
