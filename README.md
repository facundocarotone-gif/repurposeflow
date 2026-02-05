# RepurposeFlow 🔄

One Blog Post. Five Platforms. 60 Seconds.

Paste a blog URL and get ready-to-post content for Twitter, LinkedIn, Instagram, TikTok, and newsletters.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (PostgreSQL + Auth)
- **AI:** OpenAI API (GPT-4o)
- **Content Extraction:** Cheerio

## Getting Started

### 1. Clone and Install

```bash
cd repurposeflow
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration file: `supabase/migrations/001_initial_schema.sql`
3. Copy your project URL and keys from Settings > API

### 3. Configure Environment

Copy the example env file and fill in your keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-api-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Testing the MVP

### Critical Path

1. **Visit landing page** → Dark theme, clear value prop
2. **Sign up** → Create account with email/password
3. **Paste a blog URL** → Use any public blog post (Medium, Dev.to, personal blogs)
4. **Wait for generation** → 15-30 seconds
5. **View results** → All 5 platform outputs with copy buttons
6. **Check history** → Previous repurposes appear in list
7. **Verify credits** → Should show 2/3 after first use

### Test URLs

Try these public blog posts:
- Any Medium article URL
- Dev.to posts
- Personal blog posts with `<article>` tags

### Known Limitations (MVP)

- Email auth only (no OAuth)
- No inline editing of outputs
- No payments (free tier only)
- May struggle with paywalled or JS-rendered content

## Project Structure

```
repurposeflow/
├── app/
│   ├── api/           # API routes
│   ├── dashboard/     # Protected dashboard pages
│   ├── login/         # Auth pages
│   ├── signup/
│   └── page.tsx       # Landing page
├── components/
│   ├── ui/            # Reusable UI components
│   └── layout/        # Layout components
├── lib/
│   ├── supabase/      # Supabase clients
│   ├── openai.ts      # AI generation
│   └── extractor.ts   # URL content extraction
├── supabase/
│   └── migrations/    # Database schema
└── types/             # TypeScript types
```

## API Routes

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/repurpose` | Generate content from URL |
| GET | `/api/repurpose` | Get repurpose history |
| GET | `/api/repurpose/[id]` | Get single result |
| DELETE | `/api/repurpose/[id]` | Delete a repurpose |
| POST | `/api/extract` | Extract content from URL |
| GET | `/api/user/credits` | Get remaining credits |
| GET/PATCH | `/api/user/settings` | User settings |

## Credits System

- **Free tier:** 3 repurposes/month
- **Creator:** 30 repurposes/month (coming soon)
- **Pro:** Unlimited (coming soon)

Credits reset monthly. Each successful repurpose uses 1 credit.

---

Built with ❤️ by Tono
