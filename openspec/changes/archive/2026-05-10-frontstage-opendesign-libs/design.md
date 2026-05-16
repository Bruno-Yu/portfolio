## Context

The FrontStage redesign uses custom BEM CSS, warm paper tones, black ink, and a yellow accent. The current Home page is editorial and text-led; any new library must strengthen that identity without adding unrelated UI weight.

## Goals / Non-Goals

**Goals:**

- Add one polished interactive visual accent to the FrontStage.
- Keep the implementation local to the frontend.
- Preserve the existing section rhythm, language toggle, theme toggle, and API behavior.
- Keep the dependency choice deliberate and reversible.

**Non-Goals:**

- Do not add `pretext` for this change; the current site has no text measurement hot path.
- Do not add `mapcn` for this change; the current site has no map, routing, or geospatial workflow.
- Do not redesign Admin, Workers, uploads, D1 schema, or portfolio data APIs.

## Decisions

### Use cobe as a restrained FrontStage globe accent

`cobe` is the only proposed library that matches the current portfolio as a visual enhancement. It can render a small WebGL globe with a Taiwan marker while keeping the existing editorial layout intact.

Alternative considered: full map UI with `mapcn`. Rejected because MapLibre and map controls imply location browsing behavior that the portfolio does not provide.

### Place the globe near contact-oriented content

The globe belongs near Contact because it reinforces location, availability, and international collaboration without competing with the Hero portrait. The component will be self-contained and decorative, with nearby text and links remaining the primary content.

Alternative considered: placing the globe in Hero. Rejected because the Hero already has a portrait, stamp, headline, quick tags, and CTA row.

### Keep pretext as a future-only performance option

`pretext` is valuable when layout depends on repeated text measurement, but this FrontStage mostly uses normal DOM flow, CSS wrapping, and static copy. Adding it now would create integration surface without solving a current bottleneck.

Alternative considered: using `pretext` for headline fitting. Rejected because CSS responsive typography already covers the current need.

## Risks / Trade-offs

- [Risk] WebGL canvas can fail or feel too heavy on some devices. → Mitigation: render a static fallback frame when canvas setup fails and hide or simplify the accent on narrow screens if needed.
- [Risk] Motion can distract from portfolio content. → Mitigation: slow rotation, pause or reduce movement for `prefers-reduced-motion`, and keep the globe visually secondary.
- [Risk] Dependency adds maintenance cost. → Mitigation: use `cobe` only behind one small component with no global state or backend coupling.

## Migration Plan

Install `cobe` in the frontend package, add the component and CSS, run typecheck/build, then verify locally in the browser. Rollback is removing the component, CSS block, and dependency.

## Open Questions

(none)
