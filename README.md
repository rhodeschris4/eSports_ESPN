# eSports ESPN Platform

A comprehensive eSports platform for live tournament viewing, match scheduling, team information, and real-time statistics. Built with Next.js 14+, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and more.

## Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- React Query (TanStack Query)
- Zustand
- Prisma ORM
- PostgreSQL
- Redis (Upstash or similar)
- HLTV/Steam/Twitch API integration (future)

## Project Structure
```
/esports_espn
  /src
    /components    # Shared React components
    /hooks         # Custom hooks (Zustand stores, React Query, etc.)
    /lib           # Utilities, API clients
    /scraping      # HLTV/Steam/Twitch scraping logic
    /types         # Shared TypeScript types/interfaces
    /app           # Next.js App Router pages
  /prisma
    schema.prisma  # Prisma data models
  public           # Static assets
  .env.example     # Example environment variables
  README.md
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up your environment variables:**
   - Copy `.env.example` to `.env` and fill in your database and API credentials.
3. **Set up the database:**
   ```bash
   npx prisma migrate dev --name init
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```

## Development Notes
- See `prisma/schema.prisma` for the data model.
- Add your scraping logic in `src/scraping/`.
- Add React components in `src/components/`.
- Use `src/types/` for shared TypeScript types.

## License
MIT
