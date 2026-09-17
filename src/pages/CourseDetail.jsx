import { Link, useParams } from 'react-router-dom';
import {
  categoryBySlug,
  getAcademy,
  getCourse,
  getLessons,
  getProgress,
  getCourseProgress,
  getResumeLesson,
  formatIdr,
} from '../lib/data';
import { Page, Shell, Eyebrow, Led, Card, Avatar, Cta, Ghost, ProgressBar } from '../components/ui';

function LessonRow({ lesson, course, color, locked, isCurrent, last }) {
  const progress = getProgress(lesson.id);
  const state = progress.completed ? 'done' : isCurrent ? 'current' : locked ? 'locked' : 'open';

  const marker = {
    done: (
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px]"
        style={{
          background: `color-mix(in srgb, ${color} 18%, transparent)`,
          border: `1px solid color-mix(in srgb, ${color} 45%, transparent)`,
          color,
        }}
      >
        ✓
      </span>
    ),
    current: (
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] text-[#0b0b14]"
        style={{ background: color, boxShadow: `0 0 16px ${color}` }}
      >
        ▶
      </span>
    ),
    locked: <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-rule text-[10px] text-ink-dim">🔒</span>,
    open: <span className="h-6 w-6 shrink-0 rounded-full border border-rule" />,
  }[state];

  const body = (
    <>
      {marker}
      <span className="w-5 shrink-0 text-meta text-ink-dim">{String(lesson.position).padStart(2, '0')}</span>
      <span
        className={`min-w-0 flex-grow text-sm font-medium ${
          state === 'done' ? 'text-ink-soft' : state === 'locked' ? 'text-ink-dim' : 'text-ink'
        }`}
      >
        {lesson.title}
      </span>
      <span className="shrink-0 text-meta text-ink-dim">{lesson.duration}</span>
      {lesson.isPreview && (
        <span className="hidden shrink-0 rounded-pill border border-rule px-2 py-0.5 text-[10px] text-ink-soft sm:block">
          Gratis
        </span>
      )}
    </>
  );

  const cls = `flex items-center gap-3 px-4 py-3.5 ${last ? '' : 'border-b border-rule'} ${
    isCurrent ? 'bg-white/[0.06]' : ''
  }`;

  if (locked && !lesson.isPreview) {
    return <div className={`${cls} cursor-not-allowed`}>{body}</div>;
  }
  return (
    <Link to={`/course/${course.id}/lesson/${lesson.id}`} className={`${cls} pressable hover:bg-white/[0.04]`}>
      {body}
    </Link>
  );
}

export default function CourseDetail() {
  const { courseId } = useParams();
  const course = getCourse(courseId);

  if (!course) {
    return (
      <Page blobs={[]}>
        <Shell className="pt-16">
          <h1 className="font-display text-h2 font-bold">Kursus tidak ditemukan.</h1>
          <Ghost to="/academy" className="mt-6">Kembali ke akademi</Ghost>
        </Shell>
      </Page>
    );
  }

  const academy = getAcademy(course.academyId);
  const cat = categoryBySlug(academy?.category);
  const lessons = getLessons(course.id);
  const progress = getCourseProgress(course.id);
  const resume = getResumeLesson(course.id);

  // Decision 6: free navigation unless the creator locked the sequence.
  const isLocked = (lesson) => {
    if (!course.isOrdered) return false;
    if (lesson.isPreview) return false;
    const prior = lessons.filter((l) => l.position < lesson.position);
    return !prior.every((l) => getProgress(l.id).completed);
  };

  const blobs = [
    { width: 980, height: 840, right: -200, top: -80, background: `color-mix(in srgb, ${cat.color} 34%, transparent)` },
    { width: 870, height: 730, left: -180, top: 60, background: 'rgba(139,92,246,0.32)' },
  ];

  return (
    <Page blobs={blobs}>
      <Shell className="pt-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-meta text-ink-dim">
          <Link to="/academy">Academy</Link>
          <span>/</span>
          <Link to={`/academy/${academy?.id}`} viewTransition style={{ color: cat.color }}>{academy?.name}</Link>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
          {/* Main column */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Led color={cat.color} />
              <Eyebrow color={cat.color}>{cat.label} · {course.level}</Eyebrow>
            </div>

            <h1
              className="mt-4 font-display text-[30px] font-bold leading-tight sm:text-[42px]"
              style={{ viewTransitionName: 'course-title' }}
            >
              {course.title}
            </h1>
            <p className="mt-4 max-w-prose text-body text-ink-soft">{course.summary}</p>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-meta text-ink-dim">
              <span>{lessons.length} pelajaran</span>
              <span>★ {academy?.rating} ({course.ratingCount.toLocaleString('id-ID')})</span>
              <span>Diperbarui {course.updatedAt}</span>
              {!course.isOrdered && <span>Bebas urutan</span>}
            </div>

            {/* Preview / resume */}
            <Link
              to={`/course/${course.id}/lesson/${resume?.id}`}
              className="mt-8 block overflow-hidden rounded-[16px] border"
              style={{
                borderColor: `color-mix(in srgb, ${cat.color} 28%, transparent)`,
                boxShadow: `0 30px 90px color-mix(in srgb, ${cat.color} 20%, transparent)`,
              }}
            >
              <div
                className="relative flex aspect-video items-center justify-center"
                style={{
                  background: `linear-gradient(140deg, color-mix(in srgb, ${cat.color} 30%, transparent), rgba(139,92,246,0.24) 45%, rgba(34,211,238,0.16))`,
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,transparent,rgba(5,5,9,0.55))]" />
                <div className="relative text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/[0.14] shadow-[0_0_50px_rgba(255,255,255,0.28)] sm:h-[76px] sm:w-[76px]">
                    <span className="ml-1 text-xl">▶</span>
                  </div>
                  <div className="mt-4 text-meta font-medium text-white/85">
                    {progress.done > 0 ? 'Lanjutkan' : 'Mulai'} · Pelajaran {resume?.position}
                  </div>
                </div>
              </div>
            </Link>

            {course.outcomes.length > 0 && (
              <div className="mt-11">
                <Eyebrow>Yang Akan Kamu Kuasai</Eyebrow>
                <div className="mt-4 flex max-w-prose flex-col gap-3.5">
                  {course.outcomes.map((o) => (
                    <div key={o} className="flex gap-3">
                      <span className="shrink-0 text-sm" style={{ color: cat.color }}>✓</span>
                      <span className="text-body text-ink-soft">{o}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-11">
              <Eyebrow>Isi Kursus</Eyebrow>
              <Card className="mt-4 overflow-hidden">
                {lessons.map((l, i) => (
                  <LessonRow
                    key={l.id}
                    lesson={l}
                    course={course}
                    color={cat.color}
                    locked={isLocked(l)}
                    isCurrent={resume?.id === l.id}
                    last={i === lessons.length - 1}
                  />
                ))}
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-5 lg:sticky lg:top-6">
            <Card className="p-6">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[30px] font-extrabold">{formatIdr(academy?.priceIdr ?? 0)}</span>
                <span className="text-meta text-ink-dim">/bulan</span>
              </div>
              <p className="mt-2 text-meta text-ink-dim">
                Termasuk seluruh {academy?.courseCount} kursus di {academy?.name}.
              </p>

              <Cta to={`/course/${course.id}/lesson/${resume?.id}`} color={cat.color} className="mt-5 w-full">
                {progress.done > 0 ? 'Lanjutkan Belajar' : 'Mulai Belajar'}
              </Cta>
              <Ghost to={`/course/${course.id}/lesson/${lessons[0]?.id}`} className="mt-2.5 w-full">
                Pratinjau Gratis
              </Ghost>

              <div className="mt-6 border-t border-rule pt-5">
                <div className="mb-2.5 flex justify-between text-meta">
                  <span className="text-ink-soft">Progres kamu</span>
                  <span className="font-semibold" style={{ color: cat.color }}>
                    {progress.done} / {progress.total}
                  </span>
                </div>
                <ProgressBar pct={progress.pct} color={cat.color} label="Progres kursus" />
              </div>
            </Card>

            {/* Mentor — people decide partly on who is teaching. */}
            <Card className="p-6">
              <Eyebrow>Mentor</Eyebrow>
              <div className="mt-4 flex items-center gap-4">
                <Avatar
                  src={academy?.instructor.avatarUrl}
                  initials={academy?.instructor.initials}
                  color={cat.color}
                  size={52}
                  rounded="rounded-[12px]"
                />
                <div className="min-w-0">
                  <div className="truncate font-display text-[15px] font-semibold">
                    {academy?.instructor.name}
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-ink-dim">
                    {academy?.instructor.title} · {(academy?.memberCount / 1000).toFixed(1)}K anggota
                  </div>
                </div>
              </div>
              <p className="mt-4 text-meta leading-relaxed text-ink-soft">{academy?.instructorBio}</p>
              <Link
                to={`/academy/${academy?.id}`}
                viewTransition
                className="mt-4 inline-block text-meta font-semibold"
                style={{ color: cat.color }}
              >
                Lihat akademi
              </Link>
            </Card>

            {course.resources.length > 0 && (
              <Card className="p-6">
                <Eyebrow>Materi</Eyebrow>
                <div className="mt-3">
                  {course.resources.map((r, i) => (
                    <div
                      key={r.name}
                      className={`flex items-center gap-3 py-3 ${
                        i === course.resources.length - 1 ? '' : 'border-b border-rule'
                      }`}
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs"
                        style={{
                          background: `color-mix(in srgb, ${cat.color} 14%, transparent)`,
                          border: `1px solid color-mix(in srgb, ${cat.color} 30%, transparent)`,
                          color: cat.color,
                        }}
                      >
                        ⬇
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-meta font-medium">{r.name}</div>
                        <div className="text-[11px] text-ink-dim">{r.meta}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </aside>
        </div>
      </Shell>
    </Page>
  );
}
