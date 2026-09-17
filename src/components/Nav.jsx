import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchOverlay, { SearchIcon } from './SearchOverlay';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/academy', label: 'Academy' },
  { to: '/events', label: 'Events' },
  { to: '/community', label: 'Community' },
  { to: '/dashboard', label: 'Dashboard' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Cmd/Ctrl+K opens search. Guarded so it never fires while the person
  // is typing into a field, and only bound on devices with a keyboard.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="relative z-20">
      <nav className="mx-auto flex h-[68px] w-full max-w-shell items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link to="/" className="font-display text-[17px] font-extrabold tracking-tight">
          Accomoty
        </Link>

        {/* Desktop: the pill */}
        <div className="hidden items-center gap-0.5 rounded-pill border border-rule bg-white/5 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_8px_32px_rgba(0,0,0,0.5)] md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              viewTransition
              className={({ isActive }) =>
                `rounded-pill px-4 py-2 text-[13.5px] font-medium transition-colors ${
                  isActive
                    ? 'bg-gradient-to-b from-white/[0.16] to-white/[0.07] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]'
                    : 'text-ink-soft hover:text-ink'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop: a real affordance showing the shortcut */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden items-center gap-2 rounded-pill border border-rule bg-white/5 py-2 pl-3 pr-2 text-[13px] text-ink-dim transition-colors hover:text-ink-soft md:flex"
            aria-label="Cari"
          >
            <SearchIcon size={15} />
            <span>Cari</span>
            <kbd className="rounded border border-rule px-1.5 py-0.5 text-[10px]">⌘K</kbd>
          </button>

          {/* Mobile: icon only */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-pill border border-rule bg-white/5 text-ink-soft md:hidden"
            aria-label="Cari"
          >
            <SearchIcon size={17} />
          </button>

          {user ? (
            <button
              onClick={handleSignOut}
              className="hidden rounded-pill border border-rule bg-white/5 px-5 py-2 text-[13.5px] font-medium md:block"
            >
              Keluar
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-pill border border-rule bg-white/5 px-5 py-2 text-[13.5px] font-medium md:block"
            >
              Masuk
            </Link>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-pill border border-rule bg-white/5 md:hidden"
          >
            <div className="flex flex-col gap-[5px]">
              <span className={`block h-[1.5px] w-4 bg-white transition-transform ${open ? 'translate-y-[6.5px] rotate-45' : ''}`} />
              <span className={`block h-[1.5px] w-4 bg-white transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-[1.5px] w-4 bg-white transition-transform ${open ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      {open && (
        <div className="mx-5 mb-2 rounded-card border border-rule bg-[#0d0d16] p-2 md:hidden">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-[10px] px-4 py-3 text-sm font-medium ${isActive ? 'bg-white/10 text-white' : 'text-ink-soft'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <div className="mt-1 border-t border-rule pt-1">
            {user ? (
              <button onClick={handleSignOut} className="block w-full rounded-[10px] px-4 py-3 text-left text-sm font-medium text-ink-soft">
                Keluar
              </button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="block rounded-[10px] px-4 py-3 text-sm font-medium text-ink-soft">
                Masuk
              </Link>
            )}
          </div>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
