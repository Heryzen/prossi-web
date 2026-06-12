---
name: Figma slicing into react-vite
description: How to slice a concrete Figma design into a react-vite artifact via the DESIGN subagent.
---

# Slicing a Figma design into a react-vite artifact

When the user provides a finished Figma design to replicate (not a free creative brief),
the normal "presentation-first = give a vague vibe brief" rule is overridden.

**Why:** The user wants pixel-faithful parity with a specific design, so the DESIGN
subagent needs the exact reference, not creative latitude.

**How to apply:**
- Download all Figma assets up front. The Figma MCP `downloadAssets` rate-limits; plain
  HTTP `fetch` of the asset URLs from the design-context export works instead. Name each
  local file after its asset constant (e.g. `imgProgramImage.png`) so the subagent can map
  `const imgX = "..."` → `src/assets/figma/imgX.<ext>` by name with zero guessing.
- Write a `FIGMA_ASSET_MAP.md` (constant → local path) and copy the design-context code,
  full-page screenshot, and typography file into the artifact (e.g. `.figma-reference/`).
- Pass all of those via `relevantFiles` and tell the subagent explicitly: this is a SLICING
  task, match the reference closely, keep section order, copy text verbatim.
- The react-vite scaffold ships a large shadcn/radix `ui/` primitive set by default. That is
  the template baseline — leave it. "Minimal libraries" applies to the components you build,
  not pruning the scaffold.
- After the first build, run the architect review, then expect a second targeted DESIGN pass:
  first builds commonly miss logo image assets (use the real logo PNG, not a text wordmark),
  real social/contact icon SVGs, and sliders the design implies (look for repeated cards +
  arrow assets like `imgSystemUiconsArrowLeft`). Reuse the embla pattern already in one
  section for the others.
