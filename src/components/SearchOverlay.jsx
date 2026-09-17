import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { search, suggestions, getRecent, addRecent, clearRecent, KIND_LABEL } from '../lib/search';
import { Led } from './ui';

/** Wraps matching text in <mark> so people can see why a result matched. */
function Highlight({ text, query }) {
  if (!query || query.length < 2) return text;
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const i = norm(text).indexOf(norm(query));
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-transparent font-semibold text-white">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

const SearchIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState([]);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  const results = useMemo(() => search(query), [query]);
  const fallback = useMemo(() => suggestions(), []);
  const showing = query.length >= 2 ? results : fallback;

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      setRecent(getRecent());
      // Delay so the element exists before focus, and iOS opens the keyboard.
      const id = setTimeout(() => inputRef.current?.focus(), 40);
      document.body.style.overflow = 'hidden';
      return () => {
        clearTimeout(id);
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const go = useCallback(
    (item) => {
      if (!item) return;
      addRecent(query);
      onClose();
      navigate(item.to);
    },
    [navigate, onClose, query]
  );

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, showing.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(showing[active]);
    }
  };

  // Keep the highlighted row in view when navigating by keyboard.
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-0 sm:p-6 sm:pt-[12vh]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex h-full w-full flex-col border-rule bg-[#0b0b14] sm:h-auto sm:max-h-[70vh] sm:max-w-[620px] sm:rounded-card sm:border sm:shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Cari di Accomoty"
      >
        {/* Input */}
        <div className="flex shrink-0 items-center gap-3 border-b border-rule px-4 py-4">
          <span className="text-ink-dim">
            <SearchIcon size={18} />
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Cari akademi, kursus, atau pelajaran…"
            className="w-full bg-transparent text-base text-ink outline-none placeholder:text-ink-dim"
            autoComplete="off"
            aria-label="Kata kunci pencarian"
          />
          <button
            onClick={onClose}
            className="shrink-0 rounded-md border border-rule px-2 py-1 text-[11px] text-ink-dim"
            aria-label="Tutup pencarian"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div ref={listRef} className="min-h-0 flex-grow overflow-y-auto overscroll-contain">
          {query.length >= 2 && results.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-ink-soft">Tidak ada hasil untuk "{query}".</p>
              <p className="mt-2 text-meta text-ink-dim">Coba kata kunci lain, atau jelajahi semua akademi.</p>
            </div>
          ) : (
            <>
              {query.length < 2 && (
                <>
                  {recent.length > 0 && (
                    <div className="px-4 pt-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-micro uppercase text-ink-dim">Terakhir dicari</span>
                        <button
                          onClick={() => { clearRecent(); setRecent([]); }}
                          className="text-[11px] text-ink-dim underline-offset-2 hover:underline"
                        >
                          Hapus
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 pb-2">
                        {recent.map((t) => (
                          <button
                            key={t}
                            onClick={() => setQuery(t)}
                            className="rounded-pill border border-rule bg-white/5 px-3 py-1.5 text-xs text-ink-soft"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="px-4 pt-3">
                    <span className="text-micro uppercase text-ink-dim">Akademi populer</span>
                  </div>
                </>
              )}

              <ul className="p-2">
                {showing.map((item, i) => (
                  <li key={`${item.kind}-${item.id}`}>
                    <button
                      data-active={i === active}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(item)}
                      className={`flex w-full items-center gap-3 rounded-[10px] px-3 py-3 text-left ${
                        i === active ? 'bg-white/[0.08]' : ''
                      }`}
                    >
                      <Led color={item.color} />
                      <span className="min-w-0 flex-grow">
                        <span className="block truncate text-sm font-medium text-ink">
                          <Highlight text={item.title} query={query} />
                        </span>
                        <span className="mt-0.5 block truncate text-[11.5px] text-ink-dim">
                          {item.subtitle}
                        </span>
                      </span>
                      <span className="shrink-0 rounded border border-rule px-1.5 py-0.5 text-[10px] text-ink-dim">
                        {KIND_LABEL[item.kind]}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Keyboard hints — desktop only, where they're actionable */}
        <div className="hidden shrink-0 items-center gap-4 border-t border-rule px-4 py-2.5 text-[11px] text-ink-dim sm:flex">
          <span><kbd className="rounded border border-rule px-1">↑</kbd> <kbd className="rounded border border-rule px-1">↓</kbd> pilih</span>
          <span><kbd className="rounded border border-rule px-1">↵</kbd> buka</span>
          <span><kbd className="rounded border border-rule px-1">esc</kbd> tutup</span>
        </div>
      </div>
    </div>
  );
}

export { SearchIcon };
