# Dev Palette Generator

Generate UI color palettes and export them directly to Tailwind, CSS variables, or design tokens.

Live demo:
https://mikewebworks-dev-palette.vercel.app

## Features

- Generate UI-ready color palettes
- Lock colors and regenerate variations
- Keyboard shortcut support (SPACE to generate)
- WCAG contrast checking
- UI preview of palette usage
- Export palettes to Tailwind config
- Export palettes to CSS variables
- Export palettes to design tokens
- Save palettes to your dashboard
- Share palettes via public URLs
- GitHub OAuth and magic link authentication

## Tech Stack

Frontend
Next.js (App Router)
TypeScript

Backend
Supabase

Deployment
Vercel

## Local Development

git clone https://github.com/mstobrawa/dev-palette-generator.git

cd dev-palette-generator

npm install

npm run dev

Open:
http://localhost:3000

## Environment Variables

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_APP_URL=http://localhost:3000

## Release

v1.0.0

## Author

Mike Webworks

https://mikewebworks.dev

## License

MIT
