# Charmike Frontend — Step 1: Base Setup

## What's included in this step
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui tokens (base config, no components yet)
- TanStack Query (provider wired up, devtools included)
- Axios client pointed at your Laravel API via env var

## Run it locally

```bash
# 1. Unzip and enter the folder
cd charmike-frontend

# 2. Install dependencies
npm install

# 3. Copy env file and point it at your Laravel API
cp .env.local.example .env.local
# edit .env.local if your API isn't on http://localhost:8000/api

# 4. (Optional) Initialize shadcn/ui to pull in the CLI + first components
npx shadcn@latest init
# It will detect components.json — accept the defaults it suggests.
# Then add components as needed, e.g.:
npx shadcn@latest add button input card table badge

# 5. Start the dev server
npm run dev
```

Open http://localhost:3000 — you should see a "Charmike Investments" card
showing your configured API base URL. If it shows the URL in black text
(not a red "not set" warning), the env wiring works.

## Make sure your Laravel API allows this origin

In your Laravel project's `config/cors.php`, confirm `http://localhost:3000`
is allowed (or `*` for local dev), e.g.:

```php
'allowed_origins' => ['http://localhost:3000'],
```

## Confirm before we proceed
Please check off:
- [ ] `npm run dev` runs with no errors
- [ ] Page loads at localhost:3000 and shows the API URL correctly
- [ ] `npx shadcn@latest init` completed without errors (needed for next step's UI components)

Once confirmed, next step will be: **Auth (login pages for admin/agent/client + token storage + protected routes)**.
