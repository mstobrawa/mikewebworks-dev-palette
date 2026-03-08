# Mike Webworks - Dev Palette Generator

Minimal SaaS MVP for generating professional UI color palettes, previewing them live, exporting design tokens, and saving palettes with Supabase.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth + Postgres
- Vercel-ready deployment

## Folder structure

```text
.
|-- app
|   |-- api
|   |   |-- palettes
|   |   |   |-- [id]
|   |   |   |   `-- route.ts
|   |   |   `-- route.ts
|   |-- dashboard
|   |   `-- page.tsx
|   |-- generator
|   |   `-- page.tsx
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- components
|   |-- auth-button.tsx
|   |-- export-panel.tsx
|   |-- footer.tsx
|   |-- generate-button.tsx
|   |-- harmony-selector.tsx
|   |-- palette-card.tsx
|   |-- palette-studio.tsx
|   |-- saved-palette-list.tsx
|   |-- site-navbar.tsx
|   `-- ui-preview.tsx
|-- lib
|   |-- supabase
|   |   |-- client.ts
|   |   `-- server.ts
|   |-- exports.ts
|   |-- palette.ts
|   `-- utils.ts
|-- supabase
|   `-- migrations
|       `-- 20260308134000_create_palettes.sql
|-- types
|   |-- palette.ts
|   `-- supabase.ts
|-- .env.example
|-- middleware.ts
|-- next.config.ts
|-- package.json
|-- postcss.config.js
|-- tailwind.config.ts
`-- tsconfig.json
```

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Create a Supabase project and fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_APP_URL`.
4. Run the SQL migration in `supabase/migrations/20260308134000_create_palettes.sql`.
5. Start the app with `npm run dev`.

## Supabase setup

1. Enable Email OTP auth in Supabase Auth.
2. Add `http://localhost:3000/dashboard` as a redirect URL for local development.
3. Confirm Row Level Security policies are active on `public.palettes`.

## MVP features included

- Harmony-based palette generation
- UI preview section
- CSS, SCSS, Tailwind, and JSON token exports
- Copy to clipboard
- Shareable palette URL
- Spacebar shortcut for regeneration
- Supabase-backed save and delete flows

## Notes

- The navbar auth button uses a lightweight email prompt to keep the starter compact. Replace it with a full auth form for production.
- Stripe is intentionally left as a future integration point for Pro billing.
