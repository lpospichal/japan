# Japan Family Companion

Installable mobile web app for the Japan 2026 family trip.

## What is included
- Preloaded trip structure based on the uploaded Japan archive
- Today screen, Timeline, Tickets, Travel, Explore, Updates, and Help
- Offline-friendly PWA shell
- Manual import flow for updated trip bundles, exported emails, and ticket files
- Export bundle flow so the latest shared state can be moved to another phone manually

## Important note about sharing
This first build is local-first. It works offline and supports import/export, but it does not include a live cloud backend yet. To keep all three phones aligned, export the latest shared bundle from one phone and import it on the others.

## Quick deploy options
Host the contents of the `dist` folder on any static host such as Netlify, Vercel, GitHub Pages, Cloudflare Pages, or a simple local web server.

## Local preview
From the project folder:

```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
```

Then deploy the contents of `dist/`.
