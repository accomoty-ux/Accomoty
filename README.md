# Accomoty

> **This is the definitive codebase.** Earlier builds — the light-theme
> Supabase build and the Figma Make export — are retired. Work from here.

Indonesian-language learning platform. Independent experts run branded **academies**;
learners subscribe per academy and work through progress-tracked courses across six
categories: trading, business, programming, design, AI, and marketing.

Built in the **Nocturne** design language — dark canvas, atmospheric glow, and a
per-category color system that runs through every screen.

## Run it

```bash
npm install
cp .env.example .env    # fill in your Supabase values
npm run dev
```

It runs **without** `.env`. Supabase and video both fall back to demo mode, so the
whole UI is browsable before anything is wired up. Sign in with any email to explore.

## Structure

```
src/
  index.css              Design tokens — every color in the product, defined once
  lib/data.js            Mock data shaped like the Postgres schema. Phase 1 swaps
                         the getters at the bottom for Supabase queries.
  lib/video.js           The five-function video interface. Nothing else knows
                         where video physically lives.
  lib/supabase.js        Client, null when env vars are absent
  context/AuthContext    Session, sign in/up/out, demo fallback
  components/            Nav, Footer, ProtectedRoute, ui.jsx primitives
  lib/search.js          Client-side search index + scoring. Header comment
                         documents the swap to Postgres full-text search.
  components/SearchOverlay  Cmd+K on desktop, tap icon on mobile
  pages/                 Home, Academy, CourseDetail, Player, Dashboard,
                         Events, Community, Login
```

## Motion

No animation library. Three mechanisms, all native:

- **View Transitions** — route changes cross-fade via React Router's `viewTransition`
  prop on `Link`/`NavLink`. A course title morphs into the detail page heading
  (`useSharedElement` in `ui.jsx`).
- **CSS keyframes** in `index.css` — one orchestrated hero entrance on Home,
  a very slow aurora drift, animated progress fills, a pulsing live dot.
- **`.pressable`** — surfaces respond to touch with a small scale-down.

### Performance rules for the Nocturne look

The atmospheric glow is built from **radial gradients, never `filter: blur()`**.
A 700px element blurred at 110px must be rasterized at full size and re-rasterized
on any change, which drops frames badly on mid-range hardware. Gradients cost
almost nothing. Same applies to `backdrop-filter` — not used anywhere.

Aurora drift animates **opacity only**. Opacity runs on the compositor; transforms
on an element that large force a repaint.

The rule: motion answers an action or shows a state change. There are deliberately
no fade-up-on-scroll entrances on every section — that reads as templated. Everything
is disabled under `prefers-reduced-motion`.

## Avatars

`<Avatar>` in `ui.jsx` takes `src`, `initials` and `color`. When `src` is null —
which it is for every instructor right now — it renders initials on that
academy's category colour. Not a placeholder: a designed empty state, because
instructors will not all have photos on day one, and it also covers a broken
image URL via `onError`.

To add a real photo, set `instructor.avatarUrl` in `data.js`. Phase 1 moves this
to a Supabase Storage URL on the profiles table. Every surface — academy cards,
mentor blocks, community rows — reads the same component, so photos appear
everywhere at once.

## Categories

Seven entries in `CATEGORIES`, but only six are real fields. The seventh,
**Lainnya**, is a catch-all with `isPrimary: false` and a deliberately neutral
grey — it reads as a staging area, not a seventh peer field. Academies in it
carry a `theme` (Gaming, Kuliner, Fotografi).

`PROMOTION_THRESHOLD` is the rule that keeps it from rotting: once three
academies in Lainnya share a theme, that theme graduates into its own category
with its own colour. `promotionCandidates()` tells you when that has happened.
Without a rule like this, catch-all buckets grow until they mean nothing.

In Postgres this is a boolean column, so promoting a theme is an UPDATE rather
than a code change.

## Two rules worth keeping

**Colors come from tokens.** Never write a hex value in a component. The six category
colors are `--c-trading` … `--c-marketing` in `index.css`; components read them via
`categoryBySlug()`. Changing the palette is a one-file edit.

**Video goes through `lib/video.js`.** Five functions: `uploadVideo`,
`getPlaybackUrl`, `getDuration`, `deleteVideo`, `getThumbnail`. Starting on
Cloudflare Stream, but moving to Bunny, Mux, or your own servers means writing one
new adapter — no page changes.

## Where this sits in the plan

- [x] **Phase 0** — consolidate, tokens, routing, auth
- [ ] **Phase 1** — Supabase tables + row-level security
- [ ] **Phase 2** — pages read from the database, not `data.js`
- [ ] **Phase 3** — real video via Cloudflare Stream, signed URLs from an Edge Function
- [ ] **Phase 4** — resume position and completion persist
- [ ] **Phase 5** — subscriptions and payment (Midtrans or Xendit, undecided)
- [ ] **Phase 6** — instructor upload path
- [ ] **Phase 7** — deploy, invite ten learners

## Not yet built, deliberately

Chat, notifications, ratings, instructor applications, admin moderation, payouts,
live streaming. All deferred until the core loop is proven. See the Requirements doc.

## Note on access control

`ProtectedRoute` only prevents a confusing empty screen. Real access control is
row-level security in Postgres plus server-signed video URLs — never a check in
React, which anyone can bypass.
