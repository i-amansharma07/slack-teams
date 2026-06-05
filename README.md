# slack-teams

A Slack/Teams-inspired collaboration platform. Multi-tenant, role-based, real-time messaging.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 |
| Database | PostgreSQL + Prisma |
| Auth | Auth.js v5 (credentials) |
| Cache | Redis + ioredis |
| Real-time | Pusher |
| Email | Resend |
| Validation | Zod |

## Roles

`super_admin` → `org_admin` → `moderator` → `member` → `guest`

- Super Admin: platform-level — creates orgs, assigns org admins
- Org Admin: org-level — manages members, channels, workspaces
- Moderator: channel-level — manages channel membership, can delete messages
- Member: can send/read messages, react, DM
- Guest: read + DM only, expires 30 days after channel invite

## Getting Started

```bash
# Start infrastructure
docker compose up -d

# Install dependencies
npm install

# Push schema + seed
npm run db:push
npm run db:seed

# Run dev server
npm run dev
```

Requires a `.env` file:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/slack_teams
REDIS_URL=redis://localhost:6379
AUTH_SECRET=your_secret
```

## Project Structure

```
modules/
  auth/        # login, registration, invite flow
  org/         # org CRUD (super-admin only)
lib/
  cache.ts     # Redis CacheService facade
  cache-keys.ts
  redis.ts     # ioredis singleton
db/
  repos/       # one repo per model, pure DB operations
  prisma.ts
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:push` | Push schema to DB |
| `npm run db:seed` | Seed initial data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset DB and re-seed |
