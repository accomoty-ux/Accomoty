/**
 * SEARCH
 *
 * Runs entirely in the browser. At MVP scale — six academies, a few dozen
 * courses, a few hundred lessons — that is the correct choice: results are
 * instant, there is no network round trip, and there is no infrastructure
 * to run. A search service at this size would be cost with no benefit.
 *
 * WHEN TO MOVE THIS SERVER-SIDE
 * Once the catalog passes roughly a thousand lessons, shipping the whole
 * index to every visitor stops being free. At that point `search()` becomes
 * a Supabase call using Postgres full-text search:
 *
 *   -- migration
 *   alter table lessons add column fts tsvector
 *     generated always as (to_tsvector('indonesian', title || ' ' || coalesce(description,''))) stored;
 *   create index lessons_fts on lessons using gin(fts);
 *
 *   -- query
 *   supabase.from('lessons').select().textSearch('fts', term, { type: 'websearch' })
 *
 * Postgres ships an Indonesian text search configuration, so stemming works
 * without a third-party service. Only reach for Algolia or Typesense if you
 * need typo tolerance and sub-50ms results across a very large catalog.
 */

import { getAcademies, getCourses, getLessons, categoryBySlug } from './data';

/** Strip case and accents so "Analisa" matches "analisa" and "Désain" matches "desain". */
const normalize = (s) =>
  (s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

/**
 * Scores one field against the query.
 * Exact > starts-with > word-boundary > contains. Ranking by match quality
 * matters more than clever algorithms at this scale.
 */
function scoreField(field, q) {
  const f = normalize(field);
  if (!f) return 0;
  if (f === q) return 100;
  if (f.startsWith(q)) return 70;
  if (new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(f)) return 50;
  if (f.includes(q)) return 25;
  return 0;
}

/**
 * Builds the searchable index once per call. Cheap at this size; when this
 * moves to Postgres the index lives in the database instead.
 */
function buildIndex() {
  const academies = getAcademies();
  const courses = getCourses();
  const items = [];

  for (const a of academies) {
    const cat = categoryBySlug(a.category);
    items.push({
      kind: 'academy',
      id: a.id,
      title: a.name,
      subtitle: `${cat.label} · ${a.courseCount} kursus`,
      context: a.tagline,
      extra: a.instructor.name,
      color: cat.color,
      to: `/academy/${a.id}`,
    });
  }

  for (const c of courses) {
    const academy = academies.find((a) => a.id === c.academyId);
    const cat = categoryBySlug(academy?.category);
    items.push({
      kind: 'course',
      id: c.id,
      title: c.title,
      subtitle: academy?.name ?? '',
      context: c.summary,
      extra: `${cat.label} ${c.level}`,
      color: cat.color,
      to: `/course/${c.id}`,
    });

    for (const l of getLessons(c.id)) {
      items.push({
        kind: 'lesson',
        id: l.id,
        title: l.title,
        subtitle: `${c.title} · ${l.duration}`,
        context: '',
        extra: academy?.name ?? '',
        color: cat.color,
        to: `/course/${c.id}/lesson/${l.id}`,
      });
    }
  }

  return items;
}

/** Weighting: a title hit beats a hit buried in a description. */
const WEIGHTS = { title: 1, subtitle: 0.5, context: 0.35, extra: 0.4 };

/** Academies rank above courses, courses above lessons, all else equal. */
const KIND_BOOST = { academy: 6, course: 3, lesson: 0 };

export function search(query, { limit = 12 } = {}) {
  const q = normalize(query);
  if (q.length < 2) return [];

  const results = [];
  for (const item of buildIndex()) {
    const score =
      scoreField(item.title, q) * WEIGHTS.title +
      scoreField(item.subtitle, q) * WEIGHTS.subtitle +
      scoreField(item.context, q) * WEIGHTS.context +
      scoreField(item.extra, q) * WEIGHTS.extra;

    if (score > 0) results.push({ ...item, score: score + KIND_BOOST[item.kind] });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

/** Shown before anything is typed — the fastest route to the good stuff. */
export function suggestions() {
  return getAcademies()
    .slice(0, 4)
    .map((a) => {
      const cat = categoryBySlug(a.category);
      return {
        kind: 'academy',
        id: a.id,
        title: a.name,
        subtitle: `${cat.label} · ${a.courseCount} kursus`,
        color: cat.color,
        to: `/academy/${a.id}`,
      };
    });
}

export const KIND_LABEL = { academy: 'Akademi', course: 'Kursus', lesson: 'Pelajaran' };

/* ---- Recent searches, per browser ---- */
const RECENT_KEY = 'accomoty:recent-searches';

export function getRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]').slice(0, 5);
  } catch {
    return [];
  }
}

export function addRecent(term) {
  if (!term || term.trim().length < 2) return;
  try {
    const next = [term.trim(), ...getRecent().filter((t) => t !== term.trim())].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* private browsing — recents are a convenience, never load-bearing */
  }
}

export function clearRecent() {
  try {
    localStorage.removeItem(RECENT_KEY);
  } catch {
    /* no-op */
  }
}
