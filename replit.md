# Prossi

Marketing homepage for "Prossi Clinic", an Indonesian aesthetic/medical clinic (skin treatments, slimming programs, doctor-led care). Presentation-only React + Vite single-page site, sliced from a Figma design.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

- `artifacts/prossi` (web, served at `/`) — Prossi Clinic homepage. Sections in order: Header, Hero, Philosophy, Stats, Services, Team, Blog, Testimonials, CTA, Footer.
- Header/Footer are standalone components; sections live in `src/components/sections/`; shared shadcn primitives in `src/components/ui/`.
- Interactive carousels (Testimonials, CTA) use `embla-carousel-react`.
- Figma assets live in `src/assets/figma/`; mapping in `artifacts/prossi/FIGMA_ASSET_MAP.md`; raw Figma reference in `artifacts/prossi/.figma-reference/`.
- Presentation-only: dummy data, no backend wired to this artifact.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
