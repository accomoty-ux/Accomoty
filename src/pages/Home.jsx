import { Link } from 'react-router-dom';
import { CATEGORIES, categoryBySlug, getAcademies, getAcademiesByCategory, getCourses } from '../lib/data';
import { Page, Shell, Eyebrow, Led, TintCard, AvatarStack, Cta, Ghost, Chip, SectionHead, useSharedElement } from '../components/ui';

const BLOBS = [
  { width: 980, height: 840, left: -200, top: 60, background: 'rgba(34,211,238,0.30)' },
  { width: 950, height: 840, right: -180, top: -40, background: 'rgba(139,92,246,0.48)' },
  { width: 840, height: 620, left: 380, top: 420, background: 'rgba(236,72,153,0.22)' },
];

/** A course row whose title morphs into the detail page heading. */
function CourseRow({ course, color, academyName, first }) {
  const to = `/course/${course.id}`;
  const shared = useSharedElement(to, 'course-title');

  return (
    <Link
      to={to}
      viewTransition
      className={`pressable flex items-center gap-4 border-b border-rule py-4 hover:bg-white/[0.03] ${
        first ? 'border-t' : ''
      }`}
    >
      <Led color={color} />
      <span className="min-w-0 flex-grow font-display text-base font-semibold leading-snug" style={shared}>
        {course.title}
      </span>
      <span className="hidden shrink-0 text-meta text-ink-soft sm:block sm:w-[150px]">{academyName}</span>
    </Link>
  );
}

export default function Home() {
  const academies = getAcademies();
  // Home is a shop window, not the catalogue. These are CATEGORY cards —
  // they link to a filtered field, so they lead with the field name and show
  // who teaches in it, rather than masquerading as a single academy.
  const groups = getAcademiesByCategory().map(({ category, academies: list }) => ({
    category,
    academies: [...list].sort((a, b) => b.memberCount - a.memberCount),
  }));
  const courses = getCourses();

  return (
    <Page blobs={BLOBS} beam>
      <Shell className="hero-rise pt-10 text-center sm:pt-14">
        <Link
          to="/academy/aimaster"
          className="inline-flex items-center gap-2.5 rounded-pill border border-violet/45 bg-violet/10 py-1.5 pl-2 pr-4 text-xs text-[#DDD6FE] shadow-[0_0_28px_rgba(139,92,246,0.35)]"
        >
          <span className="rounded-pill bg-gradient-to-br from-violet to-indigo px-2 py-0.5 text-[10.5px] font-bold tracking-wide text-white">
            BARU
          </span>
          AI Masterclass sudah dibuka
        </Link>

        <h1 className="mx-auto mt-7 max-w-[880px] font-display text-[34px] font-medium leading-[1.06] tracking-tight sm:text-[48px] lg:text-hero">
          Belajar dari orang yang{' '}
          <span className="gradient-text font-extrabold">benar-benar menjalani bidangnya.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-[540px] text-body text-ink-soft">
          Kelas terstruktur dari mentor dengan rekam jejak yang bisa diverifikasi — trading, bisnis,
          programming, desain, AI, marketing, dan bidang lainnya.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Cta to="/academy" className="w-full sm:w-auto">Mulai Belajar</Cta>
          <Ghost to="/academy" className="w-full sm:w-auto">Lihat Akademi</Ghost>
        </div>

        <p className="mt-5 text-meta text-ink-dim">
          Gabung <span className="font-semibold text-ink">12.400+</span> pelajar aktif · {academies.length} akademi terverifikasi
        </p>

        {/* Category rail — scrolls sideways on phones rather than wrapping. */}
        <div className="no-scrollbar mt-8 -mx-5 flex gap-2.5 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/academy?cat=${c.slug}`}>
              <Chip color={c.color}>{c.label}</Chip>
            </Link>
          ))}
        </div>
      </Shell>

      {/* Academies */}
      <Shell className="pt-20">
        <SectionHead
          eyebrow="Kategori"
          title="Enam bidang utama, plus yang tak terduga."
          action={
            <Link to="/academy" className="shrink-0 text-meta font-semibold text-ink-soft">
              Lihat semua
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map(({ category, academies: list }) => {
            const isOthers = !category.isPrimary;
            return (
              <TintCard
                key={category.slug}
                color={category.color}
                as={Link}
                to={`/academy?cat=${category.slug}`}
                viewTransition
                className={`flex flex-col gap-4 p-6 ${isOthers ? 'lg:col-span-3' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Led color={category.color} />
                      <Eyebrow color={category.color}>{category.label}</Eyebrow>
                    </div>
                    <h3 className="mt-3 font-display text-h3 font-bold">
                      {list.length} akademi
                    </h3>
                  </div>
                  <AvatarStack
                    people={list.map((a) => a.instructor)}
                    color={category.color}
                  />
                </div>

                <p className="text-meta leading-relaxed text-ink-soft">
                  {isOthers
                    ? 'Akademi di luar enam bidang utama — dari esports sampai kuliner.'
                    : list[0].tagline}
                </p>

                <p className="mt-auto truncate text-[11.5px] text-ink-dim">
                  {list.map((a) => a.name).join(' · ')}
                </p>
              </TintCard>
            );
          })}
        </div>
      </Shell>

      {/* Course index */}
      <Shell className="pt-16">
        <SectionHead eyebrow="Kursus Pilihan" title="Yang paling banyak diambil minggu ini." />
        <div>
          {courses.map((c, i) => {
            const cat = categoryBySlug(
              getAcademies().find((a) => a.id === c.academyId)?.category
            );
            const academy = getAcademies().find((a) => a.id === c.academyId);
            return (
              <CourseRow key={c.id} course={c} color={cat.color} academyName={academy?.name} first={i === 0} />
            );
          })}
        </div>
      </Shell>
    </Page>
  );
}
