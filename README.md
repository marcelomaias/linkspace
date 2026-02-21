# LinkSpace

A clean, minimal link-in-bio app. Built with Next.js 16, Better Auth, Prisma, Neon, and Uploadthing.

---

## Stack

| Concern | Technology |
|---|---|
| Framework | Next.js 16 |
| Auth | Better Auth |
| Database | Neon (serverless Postgres) |
| ORM | Prisma |
| File uploads | Uploadthing |
| Styling | Tailwind CSS v4 |
| Deployment | Vercel |

---

## Setup

### 1. Clone and install

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in these values:

**Neon (database)**
- Go to [console.neon.tech](https://console.neon.tech)
- Create a new project
- Copy the connection string into `DATABASE_URL`

**Better Auth**
- Generate a secret: `openssl rand -base64 32`
- Set `BETTER_AUTH_SECRET` to that value
- Set `BETTER_AUTH_URL` to `http://localhost:3000` (locally)

**Uploadthing**
- Go to [uploadthing.com](https://uploadthing.com) and create an app
- Copy your token into `UPLOADTHING_TOKEN`

### 3. Push database schema

```bash
npm run db:push
```

This creates all tables in your Neon database via Prisma.

### 4. Run dev server

```bash
npm run dev
```

---

## Making yourself an admin

After creating your first account, run this in Prisma Studio:

```bash
npm run db:studio
```

Find your user in the `User` table and change `role` from `USER` to `ADMIN`.

---

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add the Neon integration in Vercel (auto-wires `DATABASE_URL`)
4. Add `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (your production URL), `UPLOADTHING_TOKEN`, and `NEXT_PUBLIC_APP_URL` in Vercel environment variables
5. Deploy

---

## Project structure

```
app/
  (auth)/           # login, signup — redirects if already logged in
  (protected)/      # dashboard, profile — requires auth
  (public)/         # u/[username] — public profile pages
  (admin)/          # admin/users, admin/links — requires ADMIN role
  api/
    auth/[...all]/  # Better Auth handler
    uploadthing/    # File upload handler
components/         # Shared UI components
lib/
  auth.ts           # Better Auth server config
  auth-client.ts    # Better Auth browser client
  prisma.ts         # Prisma client singleton
  actions.ts        # Server actions
  uploadthing.ts    # Uploadthing client helpers
  utils.ts          # Shared utilities
prisma/
  schema.prisma     # Database schema
proxy.ts            # Route protection (Next.js 16)
```
