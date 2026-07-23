# Hero Acron Block

## Overview

Full-width hero banner modeled after the `HeroStandard` component on acronaviation.com. Renders a background image with a dark gradient overlay, an optional uppercase supertitle, a heading, optional copy text, and up to two call-to-action buttons (primary + secondary).

## Authoring

Author the block with up to five rows, each containing one piece of content, in this order:

1. Background image (image/picture)
2. Supertitle (short paragraph, e.g. "Acron Aviation")
3. Heading (use a heading style, e.g. H1)
4. Copy (paragraph)
5. Buttons — a paragraph with one or two links. The first link becomes the primary (filled) button, the second becomes the secondary (outlined) button.

Any row may be omitted except the heading.

## Integration

### Block Configuration

No `readBlockConfig()` configuration keys — content is derived purely from DOM position (image, supertitle paragraph, heading, copy paragraph, button links).

### URL Parameters

None.

### Local Storage

None.

### Events

None.

## Behavior Patterns

### Layout

- On mobile the hero content stacks with a minimum height of 480px.
- On viewports ≥ 900px the minimum height increases to 620px and padding increases.
- The background image is optimized via `createOptimizedPicture` with responsive widths (2000/1200/750).

### Styling

- Colors come from the Acron Aviation design tokens defined in `styles/styles.css` (`--acron-yoke-*`, `--acron-pitch-*`, `--acron-thrust-*`).
- The primary button uses the brand green (`--acron-pitch-400`); the secondary button is an outline button that adapts to white text/border on the hero's dark background.

### Error Handling

- If no image is present, the dark gradient overlay is hidden and the hero falls back to a solid `--acron-yoke-400` background.
- If no buttons are authored, the CTA row is simply omitted.
