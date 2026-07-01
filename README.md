# Femi Sobande Memorial Website

A premium, peaceful memorial website for Femi Sobande (FS). The site is designed to feel respectful, warm, and alive over time through daily memories, tribute sharing, map pins, candles, flowers, and family-curated featured content.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hook Form
- Zod
- Aiven PostgreSQL-ready data model
- Cloudinary-ready image upload flow

The current app uses typed fixture data in `lib/data.ts` so the experience can run immediately. Replace those fixtures with PostgreSQL queries when the database connection is wired into the public and admin workflows.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The local admin prototype is at `/admin` and uses the demo passcode `demo`. Replace this with Supabase Auth before launch.

## Environment

Create a local `.env` from `.env.example` and fill in the Aiven PostgreSQL and Cloudinary values. The project database name is `fs`.

```bash
cp .env.example .env
```

Required production variables:

```text
DATABASE_URL=postgres://avnadmin:<password>@<host>:20123/fs?sslmode=require
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
ADMIN_EMAILS=<comma-separated-admin-emails>
```

## Project Structure

```text
app/
  page.tsx                 Homepage composition
  admin/page.tsx           Admin dashboard prototype
  tributes/[slug]/page.tsx Shareable tribute pages
components/
  sections/                Homepage and admin feature sections
  ui/                      Reusable primitives
lib/
  data.ts                  Fixture content and settings
  schema.ts                Tribute form validation
  types.ts                 Shared content types
  utils.ts                 Small helpers
db/
  schema.sql               PostgreSQL schema for the fs database
public/
  images/                  Replaceable memorial/gallery images
  icons/favicon.svg        FS favicon
```

## Implemented Features

- Memorial Map with visitor pins
- Anniversary Mode hook for special dates
- Digital Guest Book metrics
- Candle and flower counters
- Shareable tribute URLs
- Photo Stories with modal memories
- Today's Memory rotation
- Family-curated featured and pinned tributes
- Searchable tribute wall
- Admin dashboard prototype for moderation, gallery, quotes, exports, and uploads
- SEO metadata, Open Graph image, sitemap, robots file, 404 page, reduced-motion support

## Configuring Anniversary Mode

Add known family dates in `lib/data.ts`:

```ts
specialDates: [
  {
    label: "Birthday",
    message: "Today we celebrate his birthday with gratitude and love.",
    month: 1,
    day: 1,
    enabled: true
  }
]
```

When the current month and day match an enabled date, the homepage shows a subtle candle treatment and special message.

## PostgreSQL Schema

The schema for the Aiven PostgreSQL database is in `db/schema.sql`. Run it against the `fs` database:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

## Content Maintenance

- Replace placeholder images in `public/images` with real approved family photos.
- Add tributes, map pins, timeline entries, and photo stories in `lib/data.ts` until Supabase is wired in.
- Keep alt text specific and descriptive for accessibility.
- Keep homepage messages grateful and warm rather than heavy.
