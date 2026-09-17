import { Link } from 'react-router-dom';
import {
  categoryBySlug,
  getAcademy,
  getEnrolledCourses,
  getCourseProgress,
  getResumeLesson,
  EVENTS,
} from '../lib/data';
import { useAuth } from '../context/AuthContext';
import { Page, Shell, Eyebrow, Led, Card, TintCard, ProgressBar, SectionHead } from '../components/ui';

const BLOBS = [
  { width: 950, height: 780, left: -200, top: -40, background: 'rgba(139,92,246,0.40)' },
  { width: 840, height: 700, right: -160, top: 80, background: 'rgba(34,211,238,0.26)' },
];

export default function Dashboard() {
  const { displayName } = useAuth();
  const courses = getEnrolledCourses();

  const totals = courses.reduce(
    (acc, c) => {
      const p = getCourseProgress(c.id);
      return { done: acc.done + p.done, total: acc.total + p.total };
    },
    { done: 0, total: 0 }
  );
  const overall = totals.total ? Math.round((totals.done / totals.total) * 100) : 0;

  return (
    <Page blobs={BLOBS}>
      <Shell className="pt-10">
        <Eyebrow>Dashboard</Eyebrow>
        <h1 className="mt-3 font-display text-h1 font-bold sm:text-[40px]">
          Selamat datang kembali, <span className="gradient-text">{displayName}</span>.
        </h1>
        <p className="mt-3 text-body text-ink-soft">Progres belajar dan jadwal kamu minggu ini.</p>

        {/* Overall progress */}
        <Card className="mt-8 p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-center">
            <div>
              <div className="gradient-text font-display text-[56px] font-extrabold leading-none sm:text-[66px]">
                {overall}%
              </div>
              <div className="mt-3 text-sm font-semibold">Progres Belajar</div>
              <div className="mt-1 text-meta text-ink-dim">
                {totals.done} dari {totals.total} pelajaran selesai
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {courses.map((c) => {
                const p = getCourseProgress(c.id);
                const cat = categoryBySlug(getAcademy(c.academyId)?.category);
                return (
                  <div key={c.id}>
                    <div className="mb-2 flex justify-between gap-4 text-meta">
                      <span className="truncate">{c.title}</span>
                      <span className="shrink-0 text-ink-dim">{p.done}/{p.total}</span>
                    </div>
                    <ProgressBar pct={p.pct} color={cat.color} label={c.title} />
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Enrolled courses */}
        <div className="mt-14">
          <SectionHead eyebrow="Kursus Anda" title="Lanjutkan dari terakhir kali." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((c) => {
              const academy = getAcademy(c.academyId);
              const cat = categoryBySlug(academy?.category);
              const resume = getResumeLesson(c.id);
              return (
                <TintCard
                  key={c.id}
                  color={cat.color}
                  as={Link}
                  to={resume ? `/course/${c.id}/lesson/${resume.id}` : `/course/${c.id}`}
                  viewTransition
                  className="flex min-h-[168px] flex-col justify-between p-5"
                >
                  <div className="flex items-center justify-between">
                    <Led color={cat.color} />
                    <span className="text-[11px] text-ink-dim">{resume?.duration}</span>
                  </div>
                  <div>
                    <div className="font-display text-base font-semibold leading-snug">{c.title}</div>
                    <div className="mt-1.5 text-[11.5px] text-ink-dim">{academy?.name}</div>
                  </div>
                </TintCard>
              );
            })}
          </div>
        </div>

        {/* Upcoming */}
        <div className="mt-14">
          <SectionHead eyebrow="Kalender Event" title="Yang akan datang." />
          <div>
            {EVENTS.slice(0, 3).map((e, i) => {
              const academy = getAcademy(e.academyId);
              const cat = categoryBySlug(academy?.category);
              return (
                <div
                  key={e.id}
                  className={`flex items-center gap-4 border-b border-rule py-4 ${i === 0 ? 'border-t' : ''}`}
                >
                  <span className="w-[68px] shrink-0 text-meta text-ink-soft">{e.date}</span>
                  <Led color={cat.color} />
                  <span className="min-w-0 flex-grow text-sm">{e.title}</span>
                  <span className="hidden shrink-0 text-[11.5px] text-ink-dim sm:block">{academy?.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Shell>
    </Page>
  );
}
