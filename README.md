# RAWG Games Explorer

A Next.js 16 app for browsing video games from the RAWG API, with search, platform/genre filters, pagination, and game details.

## Features

- Server-rendered game list (`/`) with RAWG data
- Search by game name
- Multi-select filters:
  - Parent platforms
  - Genres
- Pagination with URL-based state
- Game details page (`/game/[id]`)
- Dark black/red UI theme
- Resilient API layer:
  - Request timeout handling
  - Retry on transient network failures
  - Friendly error messages
  - Rate-limit awareness (`429`)
- Cached filter endpoints for better performance (`unstable_cache`)
- Optimized images (`next/image`, AVIF/WebP)

## Tech Stack

- Next.js `16.1.6` (App Router, Turbopack)
- React `19`
- TypeScript
- Tailwind CSS v4
- ESLint

## Project Structure

```text
src/
  app/
    page.tsx                # Home page (list, filters, pagination)
    game/[id]/page.tsx      # Game details page
    layout.tsx              # Global layout + metadata
    globals.css             # Global styles + theme variables
  components/
    Filters.tsx             # Search/platform/genre filters
    GamesGrid.tsx           # Grid wrapper for game cards
    GameCard.tsx            # Single game card
    Pagination.tsx          # Prev/Next navigation
  lib/
    rawg.ts                 # Shared RAWG API client + cache + error mapping
    types.ts                # Shared TypeScript types
```

## Prerequisites

- Node.js `18.18+` (Node 20 recommended)
- npm
- A valid RAWG API key

Get your key from: `https://rawg.io/apidocs`

## Environment Variables

Create `.env.local` in the project root:

```env
RAWG_API_KEY=your_rawg_api_key_here
```

Important:
- Do **not** commit real API keys.
- If a key was exposed, rotate/regenerate it.

## Installation

```bash
npm install
```

## Run the Website (Local Development)

```bash
npm run dev
```

Then open:

- `http://localhost:3000`

This starts the app in development mode with hot reload.

## Build and Run Production

```bash
npm run build
npm run start
```

Then open:

- `http://localhost:3000`

## Scripts

- `npm run dev` → start local dev server
- `npm run build` → create optimized production build
- `npm run start` → run production server
- `npm run lint` → run ESLint checks

## How Filtering Works

The app keeps filter state in URL query params, for example:

```text
/?search=elden&parent_platforms=1,2&genres=action&page=2
```

Query params used:

- `search`
- `parent_platforms`
- `genres`
- `page`

## API Reliability and Performance Notes

- API requests include timeout + retry logic in `src/lib/rawg.ts`.
- Filter data (platforms/genres) is cached for 24h.
- Game list is revalidated periodically.
- Detail page data is revalidated hourly.
- Image delivery is optimized through Next.js image pipeline.

## Troubleshooting

### 1) `fetch failed` / timeout / network error

Possible causes:
- Your network cannot reach RAWG endpoints
- Temporary RAWG outage
- ISP/DNS restrictions

Try:
- Enable a VPN
- Switch DNS (e.g. Cloudflare `1.1.1.1`, Google `8.8.8.8`)
- Retry after a few minutes

### 2) `429` Too Many Requests

You hit RAWG rate limits.

Try:
- Wait and retry later
- Reduce rapid reload/refresh frequency
- Use your own key (not shared keys)

### 3) `RAWG_API_KEY` not set

Make sure `.env.local` exists and has:

```env
RAWG_API_KEY=...
```

After editing env vars, restart the dev server.

## Deployment

You can deploy to any Node-compatible platform (Vercel recommended for Next.js):

- Add `RAWG_API_KEY` as an environment variable in your hosting provider.
- Build command: `npm run build`
- Start command: `npm run start`

## License

Private project.
