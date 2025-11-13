```markdown
# News/Blog Starter — Next.js + Sanity + Postgres (Prisma) + Redis

This repository is a starter for a content-first, publisher-grade blog/news site that combines features you've requested:
- content structure and editorial workflow like JPost & BusinessDailyAfrica
- production-quality UX, subscription/paywall possibilities like FT & WSJ
- social/interaction features (likes, comments, view counts)
- admin/publisher tools to add and manage articles

This README documents everything your blog will need from the MVP through to the final product: features, data model, APIs, admin UX, tech choices, infra, roadmap, KPIs, costs, and next steps you can act on.

---

## Project goals & constraints (from your requirements)
- Content-first site with distinct sections (news, opinion, business, culture, etc.)
- Authors and publishers (roles) with an admin interface for creating/publishing articles
- Article metadata: author, date published, tags, read time, view count
- Social features: likes, commenting (moderated), view counts
- Clean, well-organized UI (less clutter than most large news sites)
- SEO-friendly, mobile-first, and performant
- Monetization-ready (ads and/or meter/membership paywall)
- Scalable (content scale and interaction scale)
- Privacy-conscious and legally compliant (GDPR/CCPA-ready)

---

## Scope by stage

### MVP (must-have to launch quickly)
- Responsive homepage with sections and featured stories
- Article pages with:
  - Title, hero image, author, publish date, read-time estimate
  - Content body (rich text/portable blocks)
  - Tags and related links
  - Share buttons (og/twitter meta)
- Author profiles
- Headless CMS (Sanity) for editorial publishing (authors create content; publishers approve/publish)
- Basic admin dashboard for publishers (create/edit/publish/schedule)
- Likes per article (requires sign-in for reliable counts OR cookie-based fallback)
- View count display (fast increment using Redis; fallback to DB)
- Basic commenting: integrate a third-party provider (Commento or Disqus) OR a lightweight in-house comments table with "pending" moderation state
- Search (tag/topic search)
- Newsletter signup (email capture)
- Basic analytics and error monitoring
- Essential SEO: title/meta tags, sitemap, structured data (Article schema)
- Environment and deployment instructions

### Next-wave (30–90 days, post-MVP)
- User accounts and secure auth (NextAuth/Clerk)
- In-house comments + moderation UI (or extend third-party moderation)
- Author dashboard (drafts, scheduled articles, analytics)
- Related articles & simple recommendation engine
- Read-later / saved articles
- Lightweight personalization (recent reads, topic preferences)
- Metered paywall or membership gating for premium content (Stripe)
- Background job to persist Redis view counts to Postgres
- Advanced search (Algolia) and topic pages
- Improved editorial workflow (assigning, review, versioning)

### Final product / Scale (3–12 months)
- Full-featured paywall (metered & tiered membership)
- Native mobile apps or advanced PWA
- Multimedia: podcasts, video hosting, live blog capability
- Advertising infrastructure (header bidding integrations) and ad management
- Personalization & recommendations at scale
- Enterprise CMS features: multi-site, multi-language, editorial analytics
- Advanced moderation (ML-based toxicity filtering, user trust & badges)
- Events & community features for subscribers (virtual or IRL)

---

## Recommended tech stack (what we started with)
- Frontend: Next.js (App Router) for SSR + SSG and good SEO
- Styling: Tailwind CSS + component primitives (Radix UI)
- CMS: Sanity (headless) — content managed by authors/publishers (can swap for Contentful/Strapi or headless WordPress)
- DB: PostgreSQL (Prisma ORM) — users, likes, views rollups, comments, subscriptions
- Cache/fast counters: Redis (ioredis) — view counter increments, rate limiting, sessions cache
- Auth: NextAuth.js (or Clerk/Auth0) — supports email magic links & OAuth
- Media: Cloudinary or Imgix for image transforms & CDN
- Search: Algolia (hosted) or Elasticsearch (self-managed)
- Hosting: Vercel for frontend serverless & ISR; managed DB on Supabase/Amazon RDS; Redis via Upstash/Redis Cloud
- Payments: Stripe for subscriptions/memberships
- Analytics: GA4 + lightweight privacy-friendly alternative (Plausible/Fathom)
- Error logging: Sentry

---

## Core data model (summary)
- users: id, email, name, role (ADMIN/EDITOR/PUBLISHER/AUTHOR/READER), createdAt
- authors: (can map to users) bio, avatar, social links
- articles (stored in Sanity): canonical Sanity id, slug, title, body, mainImage, author reference, publishedAt, tags, readTime
- article_meta (Postgres): sanityId, slug, title, publishedAt, authorName, likesCount, viewsCount, readTimeMin
- likes: userId, articleId, createdAt (unique per user/article)
- view_daily: articleId, date, count (daily rollups)
- comments: articleId, userId (nullable for guest), body, status (PENDING/VISIBLE/DELETED), parentId, createdAt
- subscriptions: userId, stripeCustomerId, plan, status, startedAt
- tags: id, name, slug, description

Notes:
- Keep canonical content in Sanity (so editors can use the Studio UI). Postgres holds interaction metadata that ties back to Sanity IDs.
- Redis used for high-frequency counters and caching; persisted to Postgres periodically.

---

## Important API endpoints (design sketch)
Public APIs:
- GET /api/sections -> sections + top stories
- GET /api/articles/:slug -> article content & meta (Sanity + article_meta)
- GET /api/authors/:id -> author profile + article list
- GET /api/search?q=... -> search results (Algolia/DB)

Interaction APIs (authenticated / rate-limited):
- POST /api/views/:slug -> increment view (beacon from client)
- GET /api/views/:slug -> read current views (from Redis or DB)
- POST /api/likes -> toggle like/unlike (requires session)
- POST /api/comments -> submit comment (requires session or CAPTCHA for guests)
- GET /api/comments?article=:slug -> fetch visible comments for article
- POST /api/publish -> admin-only create/publish article (or handled in Sanity Studio webhooks)
- Admin moderation endpoints: GET /api/moderation/comments, POST /api/moderation/comments/:id/action

Security:
- All POST endpoints must be CSRF-protected and rate-limited.
- Use server-side session for determining user identity (do not accept userId from client in production).

---

## Likes, comments and view counts — implementation details
Likes:
- Require sign-in for most accurate counts.
- DB constraint unique(userId, articleId) to prevent duplicates.
- For anonymous likes: sign/issue a guest token stored in an HttpOnly cookie, but these are less reliable.

Comments:
- Option A (fast): third-party (Commento, Disqus) integrated in article pages — quick but adds third-party script and privacy concerns.
- Option B (control): in-house comments table with moderation UI. Use Akismet/Spam detection, CAPTCHA for guests, rate-limits, and a "Pending" state for moderation.
- Include parentId to support threads; paginate and lazy-load older comments.

View counts:
- Use client-side beacon to POST /api/views/:slug on first view or at intervals.
- On server: use Redis INCR to update per-article key (low latency).
- Use a cron or serverless scheduled job to persist counters to Postgres (hourly/daily) and update ArticleMeta.viewsCount.
- For display, serve Redis value with fallback to DB.

---

## Admin / editorial UX and roles
Roles:
- ADMIN: full control
- EDITOR: review & publish
- PUBLISHER: publish; manage frontline content
- AUTHOR: write and submit drafts
- READER: default site visitor/subscriber

Editorial workflow:
- Author writes in Sanity Studio -> save draft -> submit for review
- Editor reviews -> request changes or approve
- Publisher publishes & schedules (Sanity Studio handles scheduling)
- On publish: webhook triggers to ensure ArticleMeta upsert in Postgres and optionally queue social posts/newsletter

Admin dashboard features:
- Queue of drafts, scheduled articles and pending approvals
- Flagged content/comments list
- Create/edit article UI, preview (desktop + mobile)
- Author profiles & permissions
- Editorial calendar & scheduling
- Reporting: top articles, daily views, subscriber growth

---

## SEO, performance & accessibility best practices
SEO:
- Server-render headlines and meta for each article (Next.js SSG/SSR)
- Article schema (schema.org) JSON-LD
- Canonical URLs, sitemaps, RSS feeds
- Topic clusters: tag pages + internal linking strategy

Performance:
- Use Next.js ISR for pages that can be cached; SSR for paywalled or live pages
- Use Cloudinary/Imgix for responsive image transforms and lazy loading
- Cache commonly requested API results at the edge (Vercel/Cloudflare)
- Keep third-party scripts minimal and load them asynchronously after interaction

Accessibility:
- Semantic HTML, keyboard-accessible components, alt text for images, color contrast checks
- Use Lighthouse and axe for automated checks

---

## Monetization & paywall approach
Options:
- Ads (ad slots, lazy-loaded scripts) — easiest to start but impacts UX and performance
- Metered paywall (e.g., N free articles / month) — needs server-side enforcement and session+cookie logic
- Memberships (Stripe): ad-free browsing, exclusive newsletters, events
- Sponsored/native content: keep clearly labeled and separated from editorial content

Implementation notes:
- Use Stripe for subscriptions and customer portal (billing management)
- Keep some content free (news), reserve analysis for subscribers (recommended)
- Implement server-side paywall gating in article API and during SSR to protect content from scraping (or render teaser + paywall)

---

## Security & Privacy
- HTTPS everywhere
- Input sanitization for comments and user-provided content to prevent XSS
- CSRF protection on state-changing endpoints
- Secure, HttpOnly cookies for session tokens
- Rate-limiting endpoints prone to abuse (views, likes, comments)
- Cookie consent & privacy policy (GDPR/CCPA)
- Data deletion & export flows for users

---

## Moderation & trust
- Clear labeling of opinion vs. news (badges on article cards)
- Corrections policy & published corrections page
- Moderation UI: approve/hold/delete comments, user bans, audit logs
- Use Akismet or similar to filter spam; optionally Perspective API for toxicity scoring
- Verified author badges for high-trust contributors

---

## Deployment & infra (suggestion)
- Frontend: Vercel — auto-deploy from main branch, ISR & serverless
- Sanity Studio: hosted via Sanity / or deploy Studio on Vercel for customizations
- Postgres: Supabase / AWS RDS / Google Cloud SQL
- Redis: Upstash / Redis Cloud (managed)
- Images: Cloudinary or Imgix (hosted)
- Search: Algolia
- Cron/background jobs: Vercel cron (or Cloudflare Workers / AWS Lambda scheduled)
- Logging: Sentry; backups for DB & Sanity exports

---

## Development setup & commands
1. Clone repo
2. Copy `.env.example` to `.env` and fill values
3. Install & run:
   - npm install
   - npx prisma migrate dev --name init
   - npm run dev
4. Sanity:
   - Create Sanity project, set the dataset & API token
   - Define article schema in Sanity Studio and seed sample articles
5. Optional: run Prisma Studio `npm run prisma:studio` to inspect DB

Key env variables (see `.env.example`):
- DATABASE_URL
- REDIS_URL (optional, recommended)
- SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_TOKEN
- NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
- NEXTAUTH_URL, NEXTAUTH_SECRET
- STRIPE_SECRET, STRIPE_WEBHOOK_SECRET (when enabling payments)

---

## 90‑day roadmap & milestone breakdown
Week 0–2 (Foundation)
- Finalize editorial taxonomy & sections
- Setup Sanity Studio with article schema & seed 10 articles
- Setup Postgres & Prisma; initialize schema
- Basic Next.js frontend, homepage and article template

Week 3–6 (Core interactions)
- Implement Redis view counters and persistence job
- Implement likes endpoint and wire NextAuth (session-based)
- Integrate a commenting solution (third-party for speed or build MVP)
- Add newsletter signup (Mailchimp / Revue)

Week 7–10 (Editorial & quality)
- Build moderation UI for comments and flagged content
- Add author dashboards and scheduling UI hooks
- Improve search (Algolia) and related content widgets
- Performance & SEO tuning (images, pre-renders, CWV monitoring)

Week 11–12 (Launch MVP)
- Seed content, invite beta testers
- Measurement & monitoring: set up analytics & Sentry
- Launch public MVP, begin acquisition + SEO work
- Collect feedback & iterate on the first improvements

---

## KPIs to track
- Monthly Active Users (MAU) / Daily Active Users (DAU)
- Returning visitor rate
- Pages per session, time on page
- Likes per article, comments per article
- Conversion rate: visitor -> newsletter signup -> subscriber (if paywall)
- Views per article & top 100 articles
- Revenue metrics: ARPU, CPM, subscription MRR
- Core Web Vitals for top pages

---

## Rough cost estimates (monthly, approximate)
- Hosting & CDN (Vercel): $0 (hobby) — $100+/mo (team)
- Sanity: free tier → $99+/mo for production teams
- Postgres (Supabase / managed): $25–$200+/mo
- Redis (Upstash): small free tier → $20–$100+/mo
- Cloudinary/Imgix: $0–$200+ depending on media volume
- Algolia: free tier → $50–$200+/mo for search volumes
- Sentry & monitoring: small free tier → $20–$100+
- Editorial staff costs: largest variable (writers, editors, moderators)

Expect a lean MVP to run at $50–$500/mo excluding staff; production scale rapidly increases costs.

---

## Next steps I can implement for you (pick one or more)
- Wire NextAuth (or Clerk) and secure likes/comments endpoints (recommended next step)
- Scaffold Sanity Studio schema and seed script for articles & authors
- Implement in-house comments + moderation UI (full control) OR integrate Commento for speed
- Add a background worker to persist Redis counters to Postgres
- Implement a simple metered paywall flow with Stripe (server-side enforcement example)
- Create wireframes for homepage & article pages (mobile + desktop)
- Deliver a starter production deploy guide (Vercel + DB + Redis + Sanity)

Tell me which one you want me to do next and I will extend this repo with the required files (auth wiring, Sanity schema, comment endpoints, background job, or paywall). I will add code and configuration changes inline to the repo in the same style as the starter.

```