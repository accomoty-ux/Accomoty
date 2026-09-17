import { categoryBySlug, getAcademy, CHAT_ACTIVITY, ANNOUNCEMENT } from '../lib/data';
import { Page, Shell, Eyebrow, Led, Card, Avatar } from '../components/ui';

const BLOBS = [
  { width: 950, height: 780, left: -180, top: -40, background: 'rgba(34,211,238,0.30)' },
  { width: 870, height: 730, right: -160, top: 60, background: 'rgba(139,92,246,0.40)' },
];

export default function Community() {
  const annAcademy = getAcademy(ANNOUNCEMENT.academyId);
  const annCat = categoryBySlug(annAcademy?.category);

  return (
    <Page blobs={BLOBS}>
      <Shell className="pt-10">
        <Eyebrow>Komunitas</Eyebrow>
        <h1 className="mt-3 max-w-[740px] font-display text-h1 font-bold sm:text-[44px]">
          Diskusi per akademi, <span className="gradient-text">bukan satu grup ramai.</span>
        </h1>
        <p className="mt-4 max-w-prose text-body text-ink-soft">
          Setiap akademi punya ruang diskusinya sendiri — pertanyaan kursus tetap relevan, bukan tenggelam.
        </p>

        <Card className="mt-8 p-6">
          <div className="flex items-center gap-2">
            <Led color={annCat.color} />
            <Eyebrow color={annCat.color}>Pengumuman · {annAcademy?.name}</Eyebrow>
          </div>
          <p className="mt-3 font-display text-base font-semibold sm:text-lg">{ANNOUNCEMENT.body}</p>
        </Card>

        <div className="mt-12">
          <Eyebrow>Aktivitas Terbaru</Eyebrow>
          <div className="mt-4">
            {CHAT_ACTIVITY.map((c, i) => {
              const academy = getAcademy(c.academyId);
              const cat = categoryBySlug(academy?.category);
              return (
                <div
                  key={c.id}
                  className={`flex items-center gap-4 border-b border-rule py-4 ${i === 0 ? 'border-t' : ''}`}
                >
                  <Avatar
                    src={academy?.instructor.avatarUrl}
                    initials={academy?.instructor.initials}
                    color={cat.color}
                    size={44}
                    rounded="rounded-[12px]"
                  />
                  <div className="min-w-0 flex-grow">
                    <div className="text-sm font-semibold">{academy?.name}</div>
                    <div className="mt-0.5 truncate text-meta text-ink-soft">{c.message}</div>
                  </div>
                  <span className="shrink-0 text-[11.5px] text-ink-dim">{c.at}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Shell>
    </Page>
  );
}
