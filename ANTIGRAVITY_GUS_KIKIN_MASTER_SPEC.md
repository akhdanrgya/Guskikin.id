# MASTER BUILD SPEC — Gus Kikin Digital Platform

> **Purpose:** Master implementation brief for Antigravity / coding agent.
>  
> Build a production-ready hybrid digital platform for **Gus Kikin** that combines a modern news portal, digital knowledge archive, dakwah/event tracker, audiovisual hub, and community network.
>
> **Important:** For visual/UI exploration, **use Stitch through MCP**. Do not invent the final UI directly in code before generating and evaluating the design direction in Stitch.

---

## 1. Project Vision

Build a premium, editorial-first digital platform that positions Gus Kikin as a central source for:

- News and official activities
- Islamic scholarship and thought
- Tebuireng-related content
- PBNU / NU-related coverage
- Dawuh, quotes, transcripts, khutbah manuscripts, and intellectual archives
- Safari Dakwah schedules and livestreams
- Audio, podcast, and video content
- Community and alumni information

The website should feel like a combination of:

- a modern national news portal,
- a curated scholarly archive,
- a personal/public figure digital hub,
- and a contemporary Islamic media platform.

The final result must feel **credible, authoritative, calm, modern, editorial, highly readable, SEO-first, and not like a generic corporate template**.

---

# 2. Core Tech Stack

## Framework

Use:

- **Next.js 15**
- **App Router**
- **TypeScript**
- React Server Components by default
- Server Actions where appropriate
- SSR / SSG / ISR depending on content type

Prioritize server-rendered content for SEO-sensitive pages.

---

## CMS

Use:

- **Payload CMS v3**
- Embedded directly inside the Next.js application
- Code-first collections and globals
- TypeScript-native schemas
- Payload generated types must be used throughout frontend code

Admin panel should live in the same project.

Recommended admin path:

```txt
/admin
```

Use proper role-based access control.

Initial roles:

```txt
super-admin
editor
author
contributor
```

---

## Styling / UI

Use:

- **Tailwind CSS v4**
- **shadcn/ui**
- Lucide icons
- CSS variables for design tokens
- Modern responsive layout
- Light mode as primary visual direction

Avoid excessive animation.

Animations must be subtle and primarily used for:

- hover states,
- drawers,
- modal transitions,
- sticky player,
- navigation,
- cards.

---

## Database

Preferred:

```txt
PostgreSQL
```

Recommended providers:

1. Supabase

Environment variables must be used for credentials.

---

## Media Storage

Use S3-compatible object storage.

Preferred:

```txt
Cloudflare R2
```

Alternative:

```txt
AWS S3
```

Use Payload storage adapter.

Media should never depend on local filesystem storage in production.

---

# 3. Design Workflow — MUST USE STITCH MCP

## Mandatory Rule

Before implementing major frontend pages, use **Stitch MCP** to generate / explore UI concepts.

The coding agent must:

1. Create the initial design direction using Stitch.
2. Evaluate visual hierarchy and information density.
3. Refine the concept if needed.
4. Translate the approved Stitch direction into reusable Next.js + Tailwind + shadcn components.
5. Do not copy unnecessary generated markup blindly.
6. Preserve the visual language consistently across pages.

---

## Stitch Prompt — Global Design Direction

Use a prompt approximately like:

```txt
Design a premium Indonesian Islamic editorial media platform for Gus Kikin.

The platform combines:
- national/news editorial content,
- Islamic scholarship archive,
- Tebuireng heritage,
- NU community content,
- dakwah event calendar,
- audiovisual content,
- quote archive.

Visual style:
- modern editorial website
- authoritative but warm
- elegant Islamic nuance without excessive ornaments
- clean light mode
- ivory / warm white background
- dark charcoal typography
- deep green primary accent
- subtle muted gold accent
- restrained borders
- generous whitespace
- magazine-like hierarchy
- excellent readability
- premium Indonesian media aesthetic

Avoid:
- generic SaaS dashboard aesthetics
- excessive gradients
- overly rounded cards
- glassmorphism
- neon colors
- excessive Islamic geometric decorations
- crowded layouts

Typography should feel editorial, intellectual, elegant, and highly readable.

Homepage sections:
1. top utility bar
2. main logo/navigation
3. breaking/latest headline area
4. editorial hero story
5. latest news grid
6. Gus Kikin quote / Dawuh feature
7. Safari Dakwah upcoming agenda
8. Khazanah Pemikiran archive
9. video / podcast section
10. Tebuireng & NU community section
11. newsletter / social follow CTA
12. sophisticated editorial footer

Desktop width around 1280px with excellent tablet and mobile adaptation.
```

---

# 4. Brand / Visual Direction

## General Mood

Keywords:

```txt
Editorial
Scholarly
Islamic
Indonesian
Authoritative
Human
Premium
Calm
Timeless
Trustworthy
Modern
```

The interface should not look like a government website or generic Islamic blog.

---

## Suggested Color Tokens

Final values may be refined after Stitch exploration.

```css
--background: #FAF9F5;
--surface: #FFFFFF;
--foreground: #171A18;
--muted: #6B716C;

--primary: #174A37;
--primary-foreground: #FFFFFF;

--secondary: #EDE9DF;
--secondary-foreground: #243129;

--accent: #A8884D;
--accent-soft: #F2EBDD;

--border: #DEDCD5;
--danger: #A93434;
```

Use muted green instead of bright green.

Gold must only be a subtle accent.

---

## Typography

Recommended pairing:

### Editorial / Display

Examples:

```txt
Cormorant Garamond
Libre Baskerville
Newsreader
DM Serif Display
```

### UI / Body

Examples:

```txt
Inter
Manrope
Geist
Plus Jakarta Sans
```

Prefer:

```txt
Headings: Newsreader / Libre Baskerville
Body & UI: Geist / Inter
```

Use `next/font`.

---

# 5. Information Architecture

Primary navigation:

```txt
Beranda
Berita
Khazanah
Dawuh Gus Kikin
Safari Dakwah
Video & Audio
Tebuireng
Komunitas
Tentang
```

Secondary / utility:

```txt
Search
Live
Instagram
YouTube
Contact
```

---

# 6. Required Pages

## Homepage

Route:

```txt
/
```

Required blocks:

### A. Header

- top info / trending bar
- main logo
- primary nav
- search trigger
- mobile menu

Header becomes compact / sticky on scroll.

---

### B. Main Editorial Hero

Feature:

- one primary article
- one large image
- category
- headline
- dek / summary
- publication date
- author
- optional two to four supporting stories

Do not make this look like a carousel.

---

### C. Latest News

Grid / editorial feed.

Filters:

```txt
Terbaru
PBNU
Tebuireng
Kebangsaan
Opini
Dakwah
```

Include "Lihat Semua".

---

### D. Dawuh Gus Kikin

Visually distinctive quote section.

Each item:

- quote
- source/context
- date
- related topic
- optional portrait / visual card

Provide share button.

---

### E. Safari Dakwah

Upcoming event cards.

Show:

- event title
- location
- city
- date
- time
- event status
- livestream availability

Status pills:

```txt
Mendatang
Hari Ini
Live
Selesai
```

---

### F. Khazanah Pemikiran

Curated scholarly archive cards.

Types:

```txt
Transkrip Pengajian
Khotbah
Esai
Kajian
Sanad
Dokumen
```

---

### G. Video & Audio

Featured video.

Podcast / audio list.

Sticky audio player appears when content starts playing.

---

### H. Tebuireng / Community

Highlight:

- Tebuireng stories
- alumni
- community programs
- NU network

---

### I. Newsletter / Social

Simple premium CTA.

No aggressive popup.

---

# 7. News System

Routes:

```txt
/berita
/berita/[slug]
/kategori/[slug]
/tag/[slug]
/penulis/[slug]
```

Article schema should support:

```txt
title
slug
excerpt
content
featuredImage
featuredImageAlt
category
tags
authors
publishedAt
updatedAt
readingTime
seo
relatedPosts
sources
isFeatured
isBreaking
```

Rich text should support:

- headings
- paragraphs
- blockquote
- numbered list
- bullet list
- images
- captions
- embed
- related content block
- callout
- quote
- table when necessary

Article page must provide:

- breadcrumb
- category
- title
- subtitle/dek
- author
- date
- reading time
- share controls
- hero image
- image caption
- rich article content
- article tags
- author card
- related stories
- latest news sidebar on desktop

---

# 8. Digital Vault / Khazanah Pemikiran

Routes:

```txt
/khazanah
/khazanah/[slug]
```

Content types:

```txt
Dawuh
Transkrip Pengajian
Naskah Khotbah
Esai
Kajian
Dokumen
Sanad Keilmuan
```

Features:

- search
- filter by content type
- topic
- year
- source
- chronological browsing
- related materials

---

# 9. Dawuh Gus Kikin

Routes:

```txt
/dawuh
/dawuh/[slug]
```

Collection fields:

```txt
quote
slug
context
topic
source
event
date
portrait
shareImage
relatedContent
```

Cards should be visually optimized for social sharing.

Generate OG image-ready layout.

---

# 10. Sanad Keilmuan

Provide structured scholarship / lineage visualization.

Route:

```txt
/khazanah/sanad
```

Possible data model:

```ts
Scholar {
  name
  slug
  birthYear
  deathYear
  biography
  portrait
  locations
  teachers[]
  students[]
  references[]
}
```

The frontend can show:

- hierarchical tree
- scholar cards
- relationship lines
- detail drawer / page

On mobile, convert complex tree into readable vertical lineage.

Accessibility and readability are more important than visual complexity.

---

# 11. Safari Dakwah / Event Tracker

Routes:

```txt
/agenda
/agenda/[slug]
```

Fields:

```txt
title
slug
description
startDate
endDate
venue
address
city
province
coordinates
poster
organizer
status
livestreamUrl
youtubeVideoId
relatedArticle
gallery
```

Calendar views:

```txt
Upcoming
Calendar
Past Events
```

Event page:

- hero/title
- date
- venue
- address
- map / location
- event description
- related poster
- YouTube live embed if available
- related articles

---

# 12. Audiovisual Hub

Routes:

```txt
/media
/video
/audio
/podcast
```

Media content fields:

```txt
title
slug
type
thumbnail
audioUrl
videoUrl
youtubeId
duration
publishedAt
description
speaker
series
episode
transcript
tags
```

Sticky player:

- stays at bottom while audio is active
- play / pause
- timeline
- title
- close
- link to full episode

Do not autoplay.

---

# 13. Community & Alumni

Routes:

```txt
/komunitas
/komunitas/[slug]
```

Sections can include:

```txt
Alumni Tebuireng
Jamaah
Kegiatan Sosial
Organisasi
Program Komunitas
```

Do not expose sensitive personal member data.

Directory should focus on public organizations, initiatives, and official activities.

---

# 14. Search

Route:

```txt
/search?q=
```

Global search across:

- News
- Khazanah
- Dawuh
- Events
- Media

Provide search suggestions.

Prioritize server-side search initially.

Can use PostgreSQL full-text search.

Architecture should allow migration to:

```txt
Meilisearch
Typesense
Algolia
```

if needed later.

---

# 15. Payload CMS Collections

Create at minimum:

```txt
Users
Media
Posts
Categories
Tags
Authors
Dawuh
Khazanah
Events
MediaContents
CommunityPosts
Scholars
Pages
Navigation
Redirects
```

---

## Globals

Create:

```txt
SiteSettings
Header
Footer
Homepage
SEOSettings
SocialLinks
```

---

# 16. CMS Editorial Workflow

Implement draft / published state.

Use Payload versions / drafts where applicable.

Editorial fields:

```txt
_status
publishedAt
updatedAt
author
editor
```

Admin experience must be simple enough for non-technical editors.

Use grouped fields and meaningful labels.

Do not expose low-level technical configuration to normal editors.

---

# 17. SEO Requirements

SEO is a critical requirement.

Implement:

- `generateMetadata`
- canonical URLs
- OpenGraph
- Twitter metadata
- schema.org JSON-LD
- sitemap
- robots.txt
- RSS feed
- article structured data
- breadcrumb structured data
- organization/person structured data where appropriate

---

## Article Schema

Use:

```txt
NewsArticle
Article
BlogPosting
```

depending on content type.

Fields should include:

```txt
headline
description
image
datePublished
dateModified
author
publisher
mainEntityOfPage
```

---

## Person Entity

Create a central structured entity for Gus Kikin.

Use consistent:

```txt
Person
```

schema where applicable.

Properties may include:

```txt
name
image
url
sameAs
jobTitle / description
affiliation
```

Only use verified public claims.

---

# 18. News SEO

Provide:

```txt
/news-sitemap.xml
```

if practical.

News URLs should:

- use clean slugs
- avoid unnecessary date folders
- preserve URLs permanently after publication

Example:

```txt
/berita/gus-kikin-judul-berita
```

not:

```txt
/2026/09/04/post?id=123
```

---

# 19. Internal Linking

Automatically surface:

- related article by category
- related tag
- related entity
- related Dawuh
- related event

Breadcrumbs required.

---

# 20. Performance Targets

Target:

```txt
LCP < 2.5s
CLS < 0.1
INP < 200ms
```

Aim for Lighthouse:

```txt
Performance >= 90
Accessibility >= 95
Best Practices >= 95
SEO >= 95
```

for major templates.

---

## Image Optimization

Use:

```txt
next/image
```

Generate responsive image sizes.

Do not send original giant media files when smaller variants suffice.

Featured content must avoid unnecessary layout shift.

---

# 21. Rendering Strategy

Suggested:

### Homepage

```txt
ISR
```

Revalidate when content changes.

### Article detail

```txt
SSG / ISR
```

with on-demand revalidation after CMS publish.

### Category pages

```txt
ISR
```

### Search

```txt
SSR / dynamic
```

### Event status

Use dynamic or short revalidation where necessary.

---

# 22. Payload Hooks / Revalidation

On publish/update:

- revalidate article path
- category paths
- homepage
- relevant tag pages

Use:

```ts
revalidatePath()
```

or tagging strategy with:

```ts
revalidateTag()
```

Prefer tag-based invalidation where architecture benefits from it.

---

# 23. Accessibility

Minimum WCAG AA target.

Requirements:

- semantic headings
- keyboard navigation
- visible focus states
- accessible labels
- alt text
- caption support
- sufficient contrast
- no hover-only critical interactions

---

# 24. Responsive Design

Primary breakpoints:

```txt
Mobile
Tablet
Laptop
Desktop
Wide Desktop
```

Design mobile intentionally.

Do not simply stack every desktop block vertically without hierarchy.

On mobile:

- prioritize latest/featured content
- simplify menus
- use horizontal scroll sparingly
- keep typography readable
- sticky audio player remains usable

---

# 25. Components

Build reusable components.

Suggested structure:

```txt
components/
  layout/
  editorial/
  news/
  khazanah/
  dawuh/
  events/
  media/
  search/
  seo/
  shared/
  ui/
```

Examples:

```txt
SiteHeader
SiteFooter
EditorialHero
ArticleCard
ArticleListItem
CategoryPill
SectionHeader
QuoteCard
DawuhCard
EventCard
StatusPill
MediaCard
AudioPlayer
AuthorCard
Breadcrumbs
ShareButtons
RelatedContent
SearchDialog
```

---

# 26. Suggested Application Structure

```txt
src/
  app/
    (frontend)/
      page.tsx
      berita/
      kategori/
      tag/
      khazanah/
      dawuh/
      agenda/
      media/
      komunitas/
      tentang/
      search/
    (payload)/
      admin/
      api/
  collections/
  globals/
  components/
  blocks/
  lib/
  hooks/
  providers/
  styles/
  utilities/
```

Follow Payload v3 official embedded structure where appropriate.

---

# 27. Homepage Data Strategy

Homepage should be configurable from Payload.

Allow editors to control:

```txt
hero story
supporting stories
featured Dawuh
featured Khazanah
featured video
selected upcoming events
section order where practical
```

Do not hardcode editorial IDs.

---

# 28. Rich Content Blocks

Create reusable Payload blocks:

```txt
RichText
Image
Gallery
Quote
VideoEmbed
AudioEmbed
RelatedContent
Callout
Newsletter
ArticleGrid
DawuhFeature
EventFeature
```

Do not over-engineer block system.

---

# 29. Social Sharing

Support share actions:

```txt
WhatsApp
Facebook
X
Copy Link
```

Optional:

```txt
LinkedIn
Telegram
```

Create high-quality dynamic OG cards for:

- article
- Dawuh
- event
- Khazanah

---

# 30. YouTube

Use YouTube embeds carefully.

Prefer privacy-conscious lazy loading.

Safari Dakwah can support:

```txt
youtubeVideoId
livestreamUrl
```

If live:

Show:

```txt
LIVE
```

status visually.

---

# 31. Analytics

Architecture should be ready for:

```txt
Google Analytics 4
Google Search Console
Microsoft Clarity
```

Analytics code must be environment-configurable.

Do not hardcode tracking IDs.

---

# 32. Security

Implement:

- secure CMS authentication
- role-based authorization
- secure environment variables
- upload validation
- MIME restrictions
- rate limiting for public write endpoints if any
- sanitize rich content output
- secure headers

No public registration unless explicitly required later.

---

# 33. Environment Variables

Example:

```env
DATABASE_URI=
PAYLOAD_SECRET=

NEXT_PUBLIC_SITE_URL=

S3_BUCKET=
S3_ENDPOINT=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=

NEXT_PUBLIC_GA_ID=
```

Never commit secrets.

Provide `.env.example`.

---

# 34. Development Experience

Required:

```txt
TypeScript strict mode
ESLint
Prettier
```

Recommended:

```txt
pnpm
```

Scripts:

```json
{
  "dev": "...",
  "build": "...",
  "start": "...",
  "lint": "...",
  "typecheck": "..."
}
```

---

# 35. Seed Data

Create development seed content for:

- 8–12 news articles
- categories
- tags
- 8–12 Dawuh items
- 6 Khazanah items
- 5 events
- 6 media items
- scholars for sample sanad tree

Use realistic Indonesian placeholder editorial copy.

Do not use Lorem Ipsum for primary UI previews.

---

# 36. Content Categories

Initial suggested categories:

```txt
PBNU
Tebuireng
Kebangsaan
Opini
Dakwah
Pendidikan
Pesantren
Sosial
```

---

# 37. Design Requirements Per Template

## Homepage

Magazine-style editorial hierarchy.

Do not use uniform card grids everywhere.

Mix:

- large lead story
- compact headline lists
- image cards
- editorial text cards
- quote feature
- event row

---

## Article

Reading experience comes first.

Ideal article content width:

```txt
680–760px
```

Headline may be wider.

Use generous line height.

Avoid excessive floating UI.

---

## Dawuh

More visual and emotionally memorable.

Use quotation typography.

Allow visual social-card treatment.

---

## Khazanah

Feels like an intellectual library.

Use metadata elegantly:

```txt
Type
Theme
Year
Source
```

---

## Events

Clear, practical, actionable.

Dates must be visually dominant.

---

# 38. Empty / Loading / Error States

Implement high quality states for:

- empty search
- no upcoming events
- missing related posts
- 404
- CMS errors
- media unavailable

Create custom:

```txt
not-found.tsx
error.tsx
loading.tsx
```

where appropriate.

---

# 39. Pagination

Use SEO-friendly pagination.

Preferred:

```txt
?page=2
```

or explicit paginated routes.

Avoid infinite scroll as the only method.

A “Load More” enhancement is allowed, but crawlers and users must have accessible pagination.

---

# 40. URL Policy

Use Bahasa Indonesia slugs.

Examples:

```txt
/berita
/khazanah
/dawuh
/agenda
/video
/audio
/komunitas
/tentang
```

Slug sanitation required.

Avoid changing published URLs.

---

# 41. Footer

Include:

- logo
- short description
- main navigation
- editorial sections
- Khazanah links
- social accounts
- contact
- copyright
- privacy policy
- terms / editorial guideline if needed

Footer should feel editorial, not corporate.

---

# 42. Search Engine Indexing Rules

Index:

- articles
- Dawuh
- Khazanah
- major category pages
- event detail
- media pages

Noindex:

- admin
- internal API
- previews
- internal filtered query states where duplicate content becomes problematic

---

# 43. Editorial Trust Signals

Include where appropriate:

- author bio
- publication date
- modified date
- source / references
- editorial contact
- about page
- clear institutional identity
- correction policy placeholder

This is important for credibility and SEO.

---

# 44. About Gus Kikin Page

Route:

```txt
/tentang
```

Sections:

- profile introduction
- biography / journey
- education
- Tebuireng role
- organizational activity
- scholarly focus
- timeline
- selected media / writings

Build this as an editorial profile, not a CV table.

Only publish verified facts.

---

# 45. Future-Ready Architecture

Prepare architecture for future additions:

```txt
Multilingual ID / EN / AR
Push notifications
Newsletter platform
Mobile app
Member login
Donation
Book archive
Digital publication
API consumers
```

Do not implement these unless required now.

Avoid architectural decisions that make them difficult later.

---

# 46. Scope Priorities

## Phase 1 — MUST HAVE

```txt
Payload CMS
Homepage
News
Categories / tags
Article detail
Dawuh
Khazanah
Safari Dakwah
Video / audio
Search
SEO
Responsive design
Admin roles
R2/S3 media
```

## Phase 2 — SHOULD HAVE

```txt
Sanad visualization
Advanced community directory
Dynamic OG images
Advanced related-content engine
Podcast series
```

## Phase 3 — FUTURE

```txt
Member system
Newsletter automation
Mobile app
Multilingual
Advanced personalization
```

---

# 47. Non-Goals

Do NOT:

- build a generic admin dashboard on the public website
- make the public design look like a SaaS product
- use excessive gradients
- add unnecessary 3D effects
- use carousels for every section
- autoplay videos/audio
- sacrifice SEO for client-side interactivity
- create huge JS bundles
- put every component behind `"use client"`
- store secrets in code
- rely on WordPress
- use fake engagement metrics
- create unverified biographical claims

---

# 48. Implementation Order

Follow this order:

### Step 1

Initialize:

```txt
Next.js 15
Payload CMS v3
PostgreSQL
Tailwind v4
shadcn/ui
```

### Step 2

Create:

```txt
collections
globals
auth
media storage
```

### Step 3

Use **Stitch MCP** to create:

```txt
Homepage concept
Article page concept
Khazanah concept
Dawuh concept
Safari Dakwah concept
```

### Step 4

Extract reusable visual system:

```txt
colors
typography
spacing
buttons
cards
navigation
section patterns
```

### Step 5

Implement design system in Tailwind / shadcn.

### Step 6

Build core frontend pages.

### Step 7

Connect Payload queries.

### Step 8

Implement SEO metadata and structured data.

### Step 9

Add ISR / cache invalidation.

### Step 10

Optimize images and performance.

### Step 11

Accessibility review.

### Step 12

Responsive QA.

### Step 13

Production build validation.

---

# 49. Required Quality Checks

Before considering implementation complete, run:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Resolve:

- TypeScript errors
- hydration errors
- invalid server/client boundaries
- missing metadata
- image optimization issues
- accessibility warnings where practical

---

# 50. Definition of Done

The project is considered complete when:

- public site renders correctly on desktop/tablet/mobile
- Payload admin works
- editors can create and publish content without code changes
- homepage automatically consumes CMS content
- article publishing triggers appropriate revalidation
- article/category/tag pages are crawlable
- metadata is generated correctly
- sitemap and robots are valid
- media uses R2/S3-compatible storage
- search works
- event statuses work
- YouTube integration works
- audio player works
- all critical routes have polished UI
- there are no build/type errors
- design is consistent with Stitch-selected visual direction
- major pages reach strong Core Web Vitals / Lighthouse targets

---

# 51. Agent Behaviour

Antigravity must behave as a senior product engineer and product designer.

Rules:

1. Do not ask unnecessary questions when a strong default exists.
2. Make pragmatic production-grade decisions.
3. Keep architecture simple enough to maintain.
4. Reuse components.
5. Prefer server components.
6. Use client components only for actual interactivity.
7. Write clean TypeScript.
8. Follow Payload v3 best practices.
9. Preserve excellent editorial SEO.
10. Use Stitch MCP for major UI design exploration before committing to final visual implementation.
11. Do not downgrade the visual quality into generic shadcn defaults.
12. After Stitch generation, interpret and recreate the design as a coherent product system.
13. Keep accessibility and responsive behavior first-class.
14. Use realistic seed content for implementation testing.
15. Document important architectural decisions in the README.

---

# 52. Final Deliverables

Deliver:

```txt
1. Working Next.js 15 + Payload v3 project
2. PostgreSQL setup
3. R2 / S3 storage setup
4. Payload collections and globals
5. Stitch-informed design system
6. Responsive frontend
7. Homepage
8. News portal
9. Khazanah archive
10. Dawuh archive
11. Safari Dakwah
12. Audiovisual hub
13. Community section
14. Search
15. SEO + structured data
16. Sitemap + robots + RSS
17. Seed script
18. .env.example
19. README setup/deployment documentation
20. Successful production build
```

---

# Final Product Principle

The site should make a first-time visitor immediately understand that this is an **authoritative digital home for Gus Kikin's news, ideas, scholarship, dakwah activities, and community ecosystem**.

The experience should feel more like a carefully designed editorial institution than a conventional personal profile site.

**Editorial clarity > decorative UI.**

**Authority > visual gimmicks.**

**Reading experience > excessive interaction.**

**Server-first SEO > unnecessary client-side rendering.**

**Stitch MCP design exploration > blindly coding generic UI.**
