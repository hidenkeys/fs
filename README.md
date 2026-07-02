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

The public site, admin view, shareable tribute pages, sitemap, gallery, and guest book metrics read from PostgreSQL. Cloudinary stores memorial photos and tribute uploads.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The local admin prototype is at `/admin` and uses the demo passcode `demo`. Replace this with production authentication before giving anyone admin access.

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
  content.ts               PostgreSQL-backed content queries
  db.ts                    PostgreSQL pool configuration
  cloudinary.ts            Cloudinary upload helpers
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

Add known family dates in the `settings` table using the `special_dates` key:

```json
[
  {
    "label": "Birthday",
    "message": "Today we celebrate his birthday with gratitude and love.",
    "month": 1,
    "day": 1,
    "enabled": true
  }
]
```

The value should be stored as JSONB:

```sql
insert into settings (key, value)
values (
  'special_dates',
  '[
    {
      "label": "Birthday",
      "message": "Today we celebrate his birthday with gratitude and love.",
      "month": 1,
      "day": 1,
      "enabled": true
    }
  ]'::jsonb
)
on conflict (key) do update set value = excluded.value, updated_at = now();
```

When the current month and day match an enabled date, the homepage shows a subtle candle treatment and special message.

## PostgreSQL Schema

The schema for the Aiven PostgreSQL database is in `db/schema.sql`. Run it against the `fs` database:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

## Production Seed

Seed the production database with the approved gallery photos, starter tribute stories, timeline entries, map pins, and settings:

```bash
npm run db:seed
```

The seed uploads the approved photos to Cloudinary and writes their Cloudinary URLs into PostgreSQL. It is safe to rerun for the seeded gallery, timeline, tributes, and settings because the script uses stable slugs and unique titles.

## Content Maintenance

- Add and approve new tributes in PostgreSQL. Public pages only show approved tributes.
- Tribute form uploads are stored in Cloudinary, saved as pending tributes, and added to the pending gallery queue when a photo is attached.
- Keep alt text specific and descriptive for accessibility.
- Keep homepage messages grateful and warm rather than heavy.
- Do not commit `.env`; configure the same environment variables in Vercel.
