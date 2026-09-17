import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  CATEGORIES,
  categoryBySlug,
  getAcademies,
  getAcademy,
  getAcademiesByCategory,
  countByCategory,
  getCoursesByAcademy,
  formatIdr,
} from '../lib/data';
import { Page, Shell, Eyebrow, Led, Card, TintCard, Avatar, Cta, Ghost, Chip, SectionHead } from '../components/ui';

/** Build an aurora field from a category color so each academy page
 *  takes on its own mood while staying inside the Nocturne system. */
const blobsFor = (color) => [
  { width: 980, height: 840, right: -200, top: -60, background: `color-mix(in srgb, ${color} 34%, transparent)` },
  { width: 870, height: 730, left: -180, top: 120, background: 'rgba(139,92,246,0.32)' },
];

/** One academy tile: portrait left, identity and stats right.
 *  Separating creator from academy matters — people follow a person,
 *  but subscribe to an academy, and those are not always the same name. */
function AcademyCard({ academy, category }) {
  return (
    <TintCard
      color={category.color}
      as={Link}
      to={`/academy/${academy.id}`}
      viewTransition
      className="flex gap-5 p-5"
    >
      <Avatar
        src={academy.instructor.avatarUrl}
        initials={academy.instructor.initials}
        color={category.color}
        size={104}
        className="hidden sm:block"
      />

      <div className="flex min-w-0 flex-col gap-3">
        {/* Mobile: small avatar inline with the label row */}
        <div className="flex items-center gap-3">
          <Avatar
            src={academy.instructor.avatarUrl}
            initials={academy.instructor.initials}
            color={category.color}
            size={40}
            rounded="rounded-[10px]"
            className="sm:hidden"
          />
          <div className="flex items-center gap-2">
            <Led color={category.color} />
            <Eyebrow color={category.color}>{academy.theme ?? category.label}</Eyebrow>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="min-w-0">
            <p className="text-[10.5px] uppercase tracking-[0.12em] text-ink-dim">Mentor</p>
            <p className="mt-1 truncate font-display text-[15px] font-semibold">
              {academy.instructor.name}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[10.5px] uppercase tracking-[0.12em] text-ink-dim">Akademi</p>
            <p className="mt-1 truncate font-display text-[15px] font-semibold">{academy.name}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-ink-dim">
          <span>★ {academy.rating}</span>
          <span>{(academy.memberCount / 1000).toFixed(1)}K anggota</span>
          <span>{academy.courseCount} kursus</span>
        </div>

        <p className="text-meta leading-relaxed text-ink-soft">{academy.tagline}</p>
      </div>
    </TintCard>
  );
}

/** One category shelf. The catch-all gets a divider and an explanation. */
function CategorySection({ category, academies }) {
  const isOthers = !category.isPrimary;

  return (
    <section
      id={category.slug}
      className={`mt-12 ${isOthers ? 'mt-16 border-t border-dashed border-rule pt-12' : ''}`}
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-center gap-3">
          <Led color={category.color} />
          <h2 className="font-display text-h2 font-bold">{category.label}</h2>
          <span className="text-meta text-ink-dim">{academies.length} akademi</span>
        </div>
      </div>

      {isOthers && (
        <p className="mb-6 max-w-prose text-meta leading-relaxed text-ink-dim">
          Akademi yang belum masuk enam bidang utama. Ketika sebuah tema di sini sudah punya
          beberapa akademi, tema itu dinaikkan jadi kategori tersendiri.
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {academies.map((a) => (
          <AcademyCard key={a.id} academy={a} category={category} />
        ))}
      </div>
    </section>
  );
}

function AcademyList() {
  const [params] = useSearchParams();
  const active = params.get('cat');
  const groups = getAcademiesByCategory();
  const shown = active ? groups.filter((g) => g.category.slug === active) : groups;
  const total = getAcademies().length;

  return (
    <Page blobs={blobsFor('var(--violet)')}>
      <Shell className="pt-10">
        <Eyebrow>Akademi</Eyebrow>
        <h1 className="mt-3 max-w-[760px] font-display text-h1 font-bold sm:text-[42px]">
          Jelajahi per bidang.
        </h1>
        <p className="mt-4 max-w-prose text-body text-ink-soft">
          Enam bidang utama, plus akademi lain yang layak diikuti. Bandingkan pendekatan
          mentornya sebelum memilih.
        </p>

        {/* Filter rail — scrolls sideways on phones */}
        <div className="no-scrollbar mt-7 -mx-5 flex gap-2.5 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          <Link to="/academy">
            <Chip active={!active}>Semua {total}</Chip>
          </Link>
          {CATEGORIES.map((c) => {
            const n = countByCategory(c.slug);
            if (n === 0) return null;
            return (
              <Link key={c.slug} to={`/academy?cat=${c.slug}`}>
                <Chip color={c.color} active={active === c.slug}>
                  {c.label} <span className="text-ink-dim">{n}</span>
                </Chip>
              </Link>
            );
          })}
        </div>

        {shown.map(({ category, academies }) => (
          <CategorySection key={category.slug} category={category} academies={academies} />
        ))}
      </Shell>
    </Page>
  );
}

function AcademyDetail({ id }) {
  const academy = getAcademy(id);
  if (!academy) {
    return (
      <Page blobs={[]}>
        <Shell className="pt-16">
          <h1 className="font-display text-h2 font-bold">Akademi tidak ditemukan.</h1>
          <Ghost to="/academy" className="mt-6">Kembali ke daftar akademi</Ghost>
        </Shell>
      </Page>
    );
  }

  const cat = categoryBySlug(academy.category);
  const courses = getCoursesByAcademy(academy.id);

  return (
    <Page blobs={blobsFor(cat.color)}>
      <Shell className="pt-10">
        <div className="flex items-center gap-2">
          <Led color={cat.color} />
          <Eyebrow color={cat.color}>Akademi · {cat.label}</Eyebrow>
        </div>

        <h1 className="mt-4 font-display text-[38px] font-bold sm:text-[52px]">{academy.name}</h1>
        <p className="mt-4 max-w-prose text-lead text-ink-soft">{academy.tagline}</p>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-meta text-ink-dim">
          <span>{academy.courseCount} kursus</span>
          <span>{(academy.memberCount / 1000).toFixed(1)}K anggota</span>
          <span>★ {academy.rating}</span>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Cta href="#" color={cat.color} className="w-full sm:w-auto">
            Gabung — {formatIdr(academy.priceIdr)}/bln
          </Cta>
          <Ghost to="#kurikulum" className="w-full sm:w-auto">Lihat kurikulum</Ghost>
        </div>

        {/* Mentor */}
        <Card className="mt-10 p-6">
          <Eyebrow>Mentor</Eyebrow>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start">
            <Avatar
              src={academy.instructor.avatarUrl}
              initials={academy.instructor.initials}
              color={cat.color}
              size={112}
            />
            <div className="min-w-0">
              <div className="font-display text-h3 font-bold">{academy.instructor.name}</div>
              <div className="mt-1 text-meta text-ink-dim">{academy.instructor.title}</div>
              <p className="mt-4 max-w-prose text-meta leading-relaxed text-ink-soft">
                {academy.instructorBio}
              </p>
            </div>
          </div>
        </Card>

        {/* Curriculum */}
        <div id="kurikulum" className="mt-12">
          <SectionHead eyebrow="Kurikulum" title="Kursus di akademi ini." />
          <div>
            {courses.map((c, i) => (
              <Link
                key={c.id}
                to={`/course/${c.id}`}
                viewTransition
                className={`pressable flex items-center gap-4 border-b border-rule py-4 hover:bg-white/[0.03] ${
                  i === 0 ? 'border-t' : ''
                }`}
              >
                <span className="w-6 shrink-0 text-meta text-ink-dim">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-grow font-display text-base font-semibold">{c.title}</span>
                <span className="shrink-0 text-meta" style={{ color: cat.color }}>
                  Lihat
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Shell>
    </Page>
  );
}

export default function Academy() {
  const { id } = useParams();
  return id ? <AcademyDetail id={id} /> : <AcademyList />;
}
