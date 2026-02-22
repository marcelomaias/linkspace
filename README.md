# LinkSpace

A clean, minimal link-in-bio app. One link. All your links.

---

## Features

### Home

![Home](https://raw.githubusercontent.com/marcelomaias/linkspace/main/public/screenshots/Home.png)

Clean landing page with a bold hero and feature highlights.

---

### Dashboard

![Dashboard](https://raw.githubusercontent.com/marcelomaias/linkspace/main/public/screenshots/Dashboard.png)

Manage all your links in a responsive grid. Drag to reorder, add, edit, or delete with one click.

---

### Link editing

![Link Edit](https://raw.githubusercontent.com/marcelomaias/linkspace/main/public/screenshots/Link_Edit.png)

Edit links inline with a label, URL, and optional custom icon.

![Dashboard Link Hover](https://raw.githubusercontent.com/marcelomaias/linkspace/main/public/screenshots/Dashboard_Link_Hover.png)

Edit and delete actions appear on hover.

---

### Public profile

![Public Profile](https://raw.githubusercontent.com/marcelomaias/linkspace/main/public/screenshots/Public_Profile.png)

Each user gets a public profile at `/u/username` with their avatar and all their links.

---

### Admin panel

![Admin](https://raw.githubusercontent.com/marcelomaias/linkspace/main/public/screenshots/Admin.png)

Admins can view and manage all users and links across the platform.

---

## Stack

| Concern      | Technology                 |
| ------------ | -------------------------- |
| Framework    | Next.js 16                 |
| Auth         | Better Auth                |
| Database     | Neon (serverless Postgres) |
| ORM          | Drizzle                    |
| File uploads | Uploadthing                |
| Styling      | Tailwind CSS v4            |
| Deployment   | Vercel                     |

---

## Setup

### 1. Clone and install

```bash
pnpm install
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
pnpm db:push
```

This creates all tables in your Neon database via Drizzle.

### 4. Run dev server

```bash
pnpm dev
```

---

## Making yourself an admin

After creating your first account, open Drizzle Studio:

```bash
pnpm db:studio
```

Find your user in the `user` table and change `role` from `USER` to `ADMIN`.

---

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (your production URL), `UPLOADTHING_TOKEN`, and `NEXT_PUBLIC_APP_URL` in Vercel environment variables
4. Deploy

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
  db.ts             # Drizzle client
  schema.ts         # Database schema & inferred types
  actions.ts        # Server actions
  uploadthing.ts    # Uploadthing client helpers
  utils.ts          # Shared utilities
drizzle.config.ts   # Drizzle Kit config
```
