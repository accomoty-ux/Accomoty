import { categoryBySlug, getAcademy, EVENTS } from '../lib/data';
import { Page, Shell, Eyebrow, Led, Cta } from '../components/ui';

const BLOBS = [
  { width: 980, height: 810, right: -200, top: -60, background: 'rgba(79,70,229,0.42)' },
  { width: 840, height: 700, left: -160, top: 100, background: 'rgba(236,72,153,0.24)' },
];

export default function Events() {
  return (
    <Page blobs={BLOBS}>
      <Shell className="pt-10">
        <Eyebrow>Event &amp; Live Session</Eyebrow>
        <h1 className="mt-3 max-w-[700px] font-display text-h1 font-bold sm:text-[44px]">
          Belajar langsung, <span className="gradient-text">bukan rekaman.</span>
        </h1>
        <p className="mt-4 max-w-prose text-body text-ink-soft">
          Sesi live dan workshop dari akademi yang kamu ikuti, ditambah sesi terbuka untuk semua.
        </p>

        {/* Live now */}
        <div
          className="mt-8 rounded-card border p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.14), rgba(139,92,246,0.10))',
            borderColor: 'rgba(239,68,68,0.32)',
            boxShadow: '0 0 40px rgba(239,68,68,0.18), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="is-live"><Led color="#EF4444" size={9} /></span>
              <div>
                <Eyebrow color="#FCA5A5">Live Sekarang</Eyebrow>
                <div className="mt-1.5 font-display text-h3 font-bold">Belajar Trading Order Flow</div>
                <div className="mt-1 text-meta text-ink-soft">Farrel Academy · 8.2K menonton</div>
              </div>
            </div>
            <Cta href="#" className="w-full sm:w-auto">Gabung</Cta>
          </div>
        </div>

        {/* Upcoming */}
        <div className="mt-12">
          <Eyebrow>Akan Datang</Eyebrow>
          <div className="mt-4">
            {EVENTS.map((e, i) => {
              const academy = getAcademy(e.academyId);
              const cat = categoryBySlug(academy?.category);
              return (
                <div
                  key={e.id}
                  className={`flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-rule py-5 ${i === 0 ? 'border-t' : ''}`}
                >
                  <div className="w-[84px] shrink-0">
                    <div className="text-sm font-semibold">{e.date}</div>
                    <div className="mt-0.5 text-[11.5px] text-ink-dim">{e.time}</div>
                  </div>
                  <Led color={cat.color} />
                  <div className="min-w-0 flex-grow">
                    <div className="font-display text-base font-semibold">{e.title}</div>
                    <div className="mt-1 text-meta text-ink-dim">{academy?.name}</div>
                  </div>
                  <span className="text-meta text-ink-soft">{e.price}</span>
                  <a href="#" className="text-meta font-semibold" style={{ color: cat.color }}>Daftar</a>
                </div>
              );
            })}
          </div>
        </div>
      </Shell>
    </Page>
  );
}
