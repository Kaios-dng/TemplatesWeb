# Kaios creative lock

## Design read

An international, bilingual template marketplace for small business owners,
freelancers, and developers. The visual language is technical but warm, built as
a native modular-assembly system rather than a borrowed product library.

## Dials

- `DESIGN_VARIANCE: 8`
- `MOTION_INTENSITY: 6`
- `VISUAL_DENSITY: 4`

High variance supports the asymmetric marketplace composition. Medium motion is
reserved for product demonstration and interface feedback. Moderate density
keeps the catalog useful without turning the public site into a dashboard.

## Tokens

### Typography

- Display: Space Grotesk, weights 500-700
- Body and UI: Inter, weights 400-700
- Numeric and structural labels: Space Grotesk with tabular numerals

Space Grotesk supplies the architectural geometry requested by the brief. Inter
is used deliberately for multilingual body clarity.

### Color

- Canvas: `#111312`
- Raised surface: `#181B19`
- Strong surface: `#202420`
- Line: `#353B35`
- Muted text: `#A8B0A6`
- Main text: `#F2F4EF`
- Signal accent: `#B7F34A`
- Accent ink: `#172006`
- Error: `#FF786A`

Lime is a functional signal for live previews, focus, and primary actions. It is
not used as ambient decoration. The public experience is intentionally theme
locked to graphite because the brief explicitly calls for a dark graphite base.

### Shape and spacing

- Frames and cards: 6px
- Inputs and compact controls: 4px
- True binary toggles only: full radius
- Spacing: 4, 8, 12, 16, 24, 32, 48, 64, 96px
- Content maximum: 1440px

### Layers

- Base content: 0
- Sticky navigation: 20
- Drawer scrim: 40
- Drawer: 50
- Toast and critical status: 60

## Motion map

| Surface | Communication | Implementation | Reduced motion |
| --- | --- | --- | --- |
| Hero assembly | Shows that Kaios sells assembled, working sites | GSAP timeline, 1.4s, `power3.out`; three blocks under 768px | Final positions with 200ms opacity |
| Hero page track | Shows a living page after assembly | CSS transform loop, 8s, desktop only | Static |
| Navigation | Establishes entry hierarchy | CSS stagger, 400ms total | Opacity only |
| Category compositions | Marks the next browsing layer | GSAP ScrollTrigger, 500ms | Opacity only |
| Template preview | Confirms the item is a real site | 400ms hover intent or 500ms touch hold; one iframe maximum | Poster plus direct demo link |
| Catalog filter | Confirms the visible data changed | 250ms opacity transition | Instant |
| Device selector | Demonstrates responsive behavior | 350ms frame transform and width transition | Instant |
| Contact drawer | Preserves purchase context | 300ms transform | Opacity only |
| Admin rows | Confirms create or delete state | 150ms opacity and transform | Instant |

No scroll listener writes React state. GSAP effects live in client leaves and
clean themselves up with `gsap.context().revert()`.

## Composition rules

- The hero is a left editorial column beside a real interactive assembly stage.
- Category showcase uses one lead category, one vertical category, and one
  wide category row. It is not a trio of equal cards.
- Featured templates use alternating frame scales rather than the catalog grid.
- Catalog alone uses a repeated product grid because scanning is its job.
- Browser chrome is a product convention across hero, cards, and detail.
- Blueprint lines terminate at content edges or connect real metadata. No
  decorative full-page crosshair grid.

