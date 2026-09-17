# Accomoty

Indonesian-language learning platform. Independent experts run branded
**academies**; learners subscribe per academy (monthly, IDR) and work through
progress-tracked courses. Platform takes 15%, instructor keeps 85%.

Audience: Indonesians roughly 18–30, mostly on mid-range Android phones over
mobile data. **Mobile-first is not a nice-to-have here.**

The positioning is **trust over reach**: mentors are selected for a verifiable
track record, not follower count. Anything that undercuts that — fake social
proof, inflated numbers, profit claims — is off-brand, not just off-spec.

## Stack

React 19 · Vite · Tailwind · React Router 7 (data router) · Supabase (auth + DB)
· Cloudflare Stream (video, not yet wired)

Run: `npm install && npm run dev`. Works with no `.env` — auth and video both
fall back to demo mode so the whole UI stays browsable.

---

## Rules that matter

### 1. Colours come from tokens. Never hardcode a hex in a component.

Every colour lives in `src/index.css` as a CSS custom property and is mapped
into Tailwind. The six category colours (`--c-trading` … `--c-marketing`) plus
`--c-others` are load-bearing: they appear on chips, cards, progress bars,
avatars, LEDs, and each academy page's whole aurora. Components read them via
`categoryBySlug()`.

If you need a colour that isn't a token, add the token — don't inline it.

### 2. All video goes through `src/lib/video.js`.

Five functions: `uploadVideo`, `getPlaybackUrl`, `getDuration`, `deleteVideo`,
`getThumbnail`. No component ever knows where a file physically lives. This is
what keeps the hosting decision reversible — switching from Cloudflare Stream to
Bunny, Mux, or self-hosting means one new adapter, not touching the player.

Never call a video provider's API directly from a component.

### 3. Secrets never go in `VITE_` variables.

Vite inlines anything prefixed `VITE_` into the browser bundle. The Cloudflare
customer code is fine there (it's public, it appears in playback URLs). An API
token is not — it belongs in a Supabase Edge Function. That's why `uploadVideo`
currently throws instead of being implemented client-side.

### 4. Access control lives in the database, not in React.

`ProtectedRoute` only prevents a confusing empty screen. Real enforcement is
Postgres row-level security plus server-signed video URLs. A check in React is
bypassed by anyone with devtools.

The access rule, in one line: *a learner may read a lesson if it is
`isPreview`, or if they hold an active subscription to the academy that owns its
course.*

### 5. Payment state comes from the provider's webhook. Never from the client.

The browser's "success" screen is cosmetic. Access is granted because the
payment provider told our server, signature verified, that money moved.

### 6. Categories: six real fields plus one catch-all.

`CATEGORIES` in `data.js` has seven entries but only six have
`isPrimary: true`. **Lainnya** is a staging area with a deliberately neutral
grey — not a seventh peer field. Academies in it carry a `theme`.

`PROMOTION_THRESHOLD = 3`: once three academies in Lainnya share a theme, that
theme graduates into its own category with its own colour. Without a rule like
this, catch-all buckets grow until they mean nothing.

### 7. Avatars: real photo → generated portrait → initials.

`<Avatar>` handles the chain. `instructor.portrait` sets the illustration style
deliberately, as **data, not a hash** — deriving it from the name put a beard on
Tia and a hijab on Bagas. Colours may be hashed; presentation of a named person
may not.

Generated portraits are a fallback. A real photograph is part of the
verifiable-track-record promise, so prefer one wherever it exists.

### 8. Motion answers actions. It does not decorate arrival.

No animation library — View Transitions via React Router's `viewTransition`
prop, plus CSS keyframes. There is exactly one orchestrated entrance (the home
hero) and one shared element (a course title morphing into the detail heading).

**Do not add fade-up-on-scroll to sections or hover transitions to every card.**
Those are the clearest tells of generated design, and on mobile hover never
fires anyway. Everything degrades under `prefers-reduced-motion`.

### 9. Performance: no `filter: blur()`, no `backdrop-filter`.

The atmospheric glow is **radial gradients**. A 700px element blurred at 110px
must be rasterized at full size and re-rasterized on any change — it dropped
frames on real hardware. Gradients cost almost nothing. Aurora drift animates
**opacity only**; transforms on elements that large force repaints.

This was tested and reverted once. Don't reintroduce it.

### 10. `data.js` is the seam to Supabase.

Mock data is shaped exactly like the planned Postgres tables. Pages never import
the arrays — they call the getters at the bottom of the file. Phase 1 replaces
those getter bodies with Supabase queries and touches nothing else.

---

## Where things live

```
src/
  index.css              All design tokens + motion + aurora primitives
  lib/data.js            Mock data + getters (the Supabase seam)
  lib/video.js           The five-function video interface
  lib/search.js          Client-side search; header documents the
                         move to Postgres full-text search
  lib/avatar.js          Generated portrait fallback
  lib/supabase.js        Client; null when env vars absent
  context/AuthContext    Session, sign in/up/out, demo fallback
  components/            Nav, Footer, SearchOverlay, ProtectedRoute,
                         ui.jsx (Avatar, AvatarStack, Card, TintCard,
                         Cta, Ghost, Chip, ProgressBar, Page, Shell)
  pages/                 Home, Academy, CourseDetail, Player, Dashboard,
                         Events, Community, Login
```

Language: UI copy is Bahasa Indonesia. Code, comments, and commits are English.

---

## Build order

- [x] **Phase 0** — consolidate, tokens, routing, auth
- [ ] **Phase 1** — Supabase tables + row-level security
- [ ] **Phase 2** — pages read from the database, not `data.js`
- [ ] **Phase 3** — real video, signed URLs from an Edge Function
- [ ] **Phase 4** — resume position and completion persist
- [ ] **Phase 5** — subscriptions and payment (Midtrans vs Xendit undecided)
- [ ] **Phase 6** — instructor upload path
- [ ] **Phase 7** — deploy, invite ten learners

**MVP goal: one instructor teaches one real course to ten paying learners.**

Deliberately not built yet: chat, notifications, ratings, instructor
applications, admin moderation, payouts, live streaming, certificates.
If a feature doesn't stand between a learner and finishing a lesson, or between
the business and getting paid, it waits.

---

## Conventions

- Mobile-first: build the small screen, then widen. Test at 380px.
- Keyboard focus is never removed. `:focus-visible` is styled globally.
- Indonesian copy in sentence case, plain verbs, no filler.
- Trading content carries a risk disclaimer (site footer). No profit claims,
  no signals presented as recommendations. This is a legal exposure.
- Commit before large changes, not after.
