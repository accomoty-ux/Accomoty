import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-rule">
      <div className="mx-auto w-full max-w-shell px-5 py-10 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="font-display text-base font-extrabold">Accomoty</div>
            <p className="mt-1.5 text-meta text-ink-dim">Tempat skill tumbuh, apa pun bidangnya.</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-meta text-ink-dim">
            <Link to="/">Tentang</Link>
            <Link to="/">Bantuan</Link>
            <Link to="/">Privasi</Link>
            <span>&copy; 2026 Accomoty</span>
          </nav>
        </div>

        {/* Requirement 29 — risk disclaimer on trading content. */}
        <p className="mt-8 max-w-prose border-t border-rule pt-6 text-[11.5px] leading-relaxed text-ink-dim">
          Seluruh materi di Accomoty bersifat edukatif dan bukan nasihat keuangan. Trading dan investasi
          mengandung risiko kerugian. Tidak ada jaminan hasil atau keuntungan. Keputusan finansial
          sepenuhnya menjadi tanggung jawab masing-masing pengguna.
        </p>
      </div>
    </footer>
  );
}
