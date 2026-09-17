# Accomoty (Nocturne)

Indonesian-language learning platform. Independent experts run branded
**academies**; learners subscribe per academy and work through
progress-tracked courses across six categories (trading, business,
programming, design, AI, marketing) plus a seventh catch-all.

This is the definitive codebase — no other copy should be edited.

## Run it

```bash
npm install
npm run dev
```

Runs without `.env` — Supabase and video both fall back to demo mode, so the
whole UI is browsable before anything is wired up. Sign in with any email to
explore in that mode.

## Two rules that must never be broken

**Colors come from tokens, never a hex value in a component.** The six
category colors (`--c-trading` … `--c-marketing`) plus the neutral
`--c-others` live in `src/index.css` under `:root`. Components read them via
`categoryBySlug()` in `src/lib/data.js`. Changing the palette is a one-file
edit — keep it that way.

**Video goes through `src/lib/video.js` and nothing else.** Exactly five
functions: `uploadVideo`, `getPlaybackUrl`, `getDuration`, `deleteVideo`,
`getThumbnail`. Currently backed by a Cloudflare Stream adapter with a
placeholder fallback when `VITE_CF_STREAM_CUSTOMER_CODE` is unset. Moving to
Bunny, Mux, or self-hosted means writing one new adapter in that file — no
page or component ever imports a video provider directly.

## Categories: the `isPrimary` split

`CATEGORIES` in `src/lib/data.js` has seven entries, but only six are real
fields (`isPrimary: true`). The seventh, **Lainnya** (`isPrimary: false`), is
a deliberately neutral-grey catch-all — a staging area, not a seventh peer
field. Academies inside it carry a `theme` (e.g. Gaming, Kuliner, Fotografi).

`PROMOTION_THRESHOLD` (currently 3) is the rule that keeps Lainnya from
rotting: once that many academies share a theme, it earns its own category
and color. `promotionCandidates()` reports when that has happened. In
Postgres this becomes a boolean column, so promoting a theme is an UPDATE,
not a code change — don't hardcode category lists elsewhere.

## Data layer

`src/lib/data.js` is mock data deliberately shaped like the eventual
Postgres schema (categories / academies / courses / lessons / subscriptions
/ lesson_progress). Pages never import it directly — they call the getters
at the bottom of the file — so the Phase 1 swap to real Supabase queries
touches only this one file.

## Motion

No animation library. Three native mechanisms only:
- **View Transitions** via React Router's `viewTransition` prop — route
  cross-fades, and a shared course-title element morphs between list and
  detail (`useSharedElement` in `src/components/ui.jsx`).
- **CSS keyframes** in `src/index.css` — one orchestrated hero entrance on
  Home, slow aurora drift, animated progress fills, pulsing live dot.
- **`.pressable`** — scale-down on touch/click, nothing hover-driven.

Rules: motion answers an action or a state change, never decorates arrival.
No scroll-triggered fade-ups. Everything degrades to nothing under
`prefers-reduced-motion`.

### Performance constraints for the Nocturne look

The atmospheric glow uses **radial gradients, never `filter: blur()`** —
blurring a large element forces full rasterization on every change; a
gradient is nearly free. Same reasoning rules out `backdrop-filter`. Aurora
drift animates **opacity only** (compositor-only), never `transform`, on
elements that large.

## Avatars

`<Avatar>` in `src/components/ui.jsx` takes `src`, `initials`, `color`. With
no `src` — true for every instructor today — it renders initials on that
academy's category color as a designed empty state, not a placeholder, and
the same path covers a broken image URL via `onError`. Every surface
(academy cards, mentor blocks, community rows) reads this one component, so
adding real photos later (via `instructor.avatarUrl`) lights up everywhere
at once.

## Access control

`ProtectedRoute` only prevents a confusing empty screen client-side. It is
not real security. Real access control is Postgres row-level security plus
server-signed video URLs, landing in later phases — never add a permission
check that only lives in React.

## Where this sits in the plan

- [x] Phase 0 — consolidate, tokens, routing, auth
- [ ] Phase 1 — Supabase tables + row-level security
- [ ] Phase 2 — pages read from the database, not `data.js`
- [ ] Phase 3 — real video via Cloudflare Stream, signed URLs from an Edge Function
- [ ] Phase 4 — resume position and completion persist
- [ ] Phase 5 — subscriptions and payment (Midtrans or Xendit, undecided)
- [ ] Phase 6 — instructor upload path
- [ ] Phase 7 — deploy, invite ten learners

Not yet built, deliberately: chat, notifications, ratings, instructor
applications, admin moderation, payouts, live streaming — deferred until the
core loop is proven.

## Structure

```
src/
  index.css              Design tokens — every color in the product, defined once
  lib/data.js            Mock data shaped like the Postgres schema
  lib/video.js           The five-function video interface
  lib/supabase.js        Client, null when env vars are absent
  lib/search.js          Client-side search index + scoring
  context/AuthContext    Session, sign in/up/out, demo fallback
  components/            Nav, Footer, ProtectedRoute, SearchOverlay, ui.jsx primitives
  pages/                 Home, Academy, CourseDetail, Player, Dashboard, Events, Community, Login
```
