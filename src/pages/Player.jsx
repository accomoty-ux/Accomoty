import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  categoryBySlug,
  getAcademy,
  getCourse,
  getLessons,
  getLesson,
  getProgress,
  getCourseProgress,
} from '../lib/data';
import { video, isVideoConfigured } from '../lib/video';
import { Aurora, Grain, Eyebrow, Led, Card, Cta, Ghost, ProgressBar } from '../components/ui';

/** Seconds → m:ss, for the transport readout. */
const clock = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export default function Player() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const course = getCourse(courseId);
  const lesson = getLesson(lessonId);
  const lessons = getLessons(courseId);
  const academy = getAcademy(course?.academyId);
  const cat = categoryBySlug(academy?.category);

  const [src, setSrc] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(getProgress(lessonId)?.seconds ?? 0);

  // Ask the video interface for a playback URL. It never tells us where
  // the file lives — swapping providers changes nothing in this file.
  useEffect(() => {
    let cancelled = false;
    setSrc(null);
    if (lesson?.videoId) {
      video.getPlaybackUrl(lesson.videoId).then((url) => {
        if (!cancelled) setSrc(url);
      });
    }
    setPosition(getProgress(lessonId)?.seconds ?? 0);
    return () => { cancelled = true; };
  }, [lesson?.videoId, lessonId]);

  if (!course || !lesson) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
        <p className="font-display text-h3 font-bold">Pelajaran tidak ditemukan.</p>
        <Ghost to="/dashboard">Kembali ke dashboard</Ghost>
      </div>
    );
  }

  const index = lessons.findIndex((l) => l.id === lesson.id);
  const next = lessons[index + 1];
  const prev = lessons[index - 1];
  const progress = getCourseProgress(course.id);
  const pct = lesson.seconds ? (position / lesson.seconds) * 100 : 0;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Aurora
        grid={false}
        blobs={[
          { width: 1060, height: 870, left: -220, top: -100, background: 'rgba(139,92,246,0.30)' },
          { width: 980, height: 780, right: -200, top: -60, background: `color-mix(in srgb, ${cat.color} 26%, transparent)` },
        ]}
      />

      {/* Slim player chrome — replaces the marketing nav on purpose. */}
      <header className="relative z-20 border-b border-rule bg-[#08080d]">
        <div className="flex h-[60px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <Link to={`/course/${course.id}`} className="flex shrink-0 items-center gap-2 text-meta text-ink-soft">
              <span className="text-base">←</span>
              <span className="hidden sm:inline">Kembali</span>
            </Link>
            <span className="hidden h-5 w-px bg-rule sm:block" />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{lesson.title}</div>
              <div className="truncate text-[11px] text-ink-dim">
                {course.title} · {academy?.name}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <div className="hidden items-center gap-2.5 sm:flex">
              <span className="text-[11.5px] text-ink-dim">
                Pelajaran {index + 1} dari {lessons.length}
              </span>
              <div className="w-[90px]">
                <ProgressBar pct={progress.pct} color={cat.color} label="Progres kursus" />
              </div>
            </div>
            <Ghost className="!px-4 !py-1.5 !text-xs">Tandai Selesai</Ghost>
          </div>
        </div>
      </header>

      <div className="relative z-10 grid lg:grid-cols-[1fr_340px]">
        {/* Stage */}
        <div className="min-w-0 p-4 sm:p-6">
          <div className="overflow-hidden rounded-[16px] border border-white/15 shadow-[0_40px_120px_rgba(139,92,246,0.28)]">
            {src ? (
              <video
                ref={videoRef}
                src={src}
                controls
                className="aspect-video w-full bg-black"
                onTimeUpdate={(e) => setPosition(e.currentTarget.currentTime)}
              />
            ) : (
              /* No provider configured yet — the real player UI, no video. */
              <div
                className="relative flex aspect-video items-center justify-center"
                style={{
                  background: `linear-gradient(140deg, rgba(139,92,246,0.26), color-mix(in srgb, ${cat.color} 20%, transparent) 48%, rgba(34,211,238,0.14))`,
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_65%_at_50%_45%,transparent,rgba(5,5,9,0.62))]" />
                <button
                  onClick={() => setPlaying((v) => !v)}
                  aria-label={playing ? 'Jeda' : 'Putar'}
                  className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full border border-white/30 bg-white/[0.13] shadow-[0_0_60px_rgba(255,255,255,0.26)] sm:h-[84px] sm:w-[84px]"
                >
                  <span className="ml-1 text-2xl">{playing ? '⏸' : '▶'}</span>
                </button>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg/90 to-transparent p-4 sm:p-5">
                  <div className="relative mb-3.5 h-1 rounded-pill bg-white/15">
                    <div
                      className="absolute left-0 top-0 h-1 rounded-pill"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, var(--violet), ${cat.color})`,
                        boxShadow: `0 0 14px ${cat.color}`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11.5px] text-white/80">
                    <div className="flex items-center gap-4">
                      <button onClick={() => prev && navigate(`/course/${course.id}/lesson/${prev.id}`)} disabled={!prev} aria-label="Sebelumnya" className="disabled:opacity-30">⏮</button>
                      <button onClick={() => setPlaying((v) => !v)} aria-label={playing ? 'Jeda' : 'Putar'} className="text-base">{playing ? '⏸' : '▶'}</button>
                      <button onClick={() => next && navigate(`/course/${course.id}/lesson/${next.id}`)} disabled={!next} aria-label="Berikutnya" className="disabled:opacity-30">⏭</button>
                      <span className="tabular-nums">{clock(position)} / {lesson.duration}</span>
                    </div>
                    <span className="hidden rounded border border-white/20 px-2 py-0.5 sm:block">HD</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!isVideoConfigured() && (
            <p className="mt-3 text-[11.5px] text-ink-dim">
              Video belum terhubung. Tambahkan VITE_CF_STREAM_CUSTOMER_CODE di .env untuk mengaktifkan pemutaran.
            </p>
          )}

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-h3 font-bold sm:text-[26px]">{lesson.title}</h1>
              <p className="mt-2 text-meta text-ink-dim">
                Pelajaran {String(lesson.position).padStart(2, '0')} · {lesson.duration} · {academy?.instructor.name}
              </p>
            </div>
            {next && (
              <Cta to={`/course/${course.id}/lesson/${next.id}`} color={cat.color} className="w-full sm:w-auto">
                Pelajaran Berikutnya
              </Cta>
            )}
          </div>
        </div>

        {/* Lesson rail */}
        <aside className="border-t border-rule bg-panel/60 p-5 lg:border-l lg:border-t-0">
          <Eyebrow>Isi Kursus · {progress.done}/{progress.total}</Eyebrow>
          <Card className="mt-3 overflow-hidden">
            {lessons.map((l, i) => {
              const done = getProgress(l.id).completed;
              const current = l.id === lesson.id;
              return (
                <Link
                  key={l.id}
                  to={`/course/${course.id}/lesson/${l.id}`}
                  viewTransition
                  className={`flex items-center gap-3 px-4 py-3 ${
                    i === lessons.length - 1 ? '' : 'border-b border-rule'
                  } ${current ? 'bg-white/[0.08]' : 'hover:bg-white/[0.03]'}`}
                  style={current ? { borderLeft: `2px solid ${cat.color}` } : undefined}
                >
                  {done ? (
                    <span
                      className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[10px]"
                      style={{
                        background: `color-mix(in srgb, ${cat.color} 18%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${cat.color} 45%, transparent)`,
                        color: cat.color,
                      }}
                    >
                      ✓
                    </span>
                  ) : current ? (
                    <Led color={cat.color} size={10} />
                  ) : (
                    <span className="h-[22px] w-[22px] shrink-0 rounded-full border border-rule" />
                  )}
                  <div className="min-w-0 flex-grow">
                    <div className={`text-[13px] font-medium leading-snug ${current ? 'text-ink' : done ? 'text-ink-dim' : 'text-ink-soft'}`}>
                      {l.position}. {l.title}
                    </div>
                    <div className="mt-0.5 text-[11px] text-ink-dim">{l.duration}</div>
                  </div>
                </Link>
              );
            })}
          </Card>
        </aside>
      </div>

      <Grain />
    </div>
  );
}
