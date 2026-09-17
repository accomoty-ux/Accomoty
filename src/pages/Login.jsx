import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Aurora, Grain, Card, Cta } from '../components/ui';

export default function Login() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);

  const { signIn, signUp, signInWithGoogle, demoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from ?? '/dashboard';

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);

    const fn = mode === 'signin' ? signIn : signUp;
    const { error: err } = await fn(email, password);
    setBusy(false);

    if (err) {
      setError(err.message);
      return;
    }
    if (mode === 'signup') {
      setNotice('Cek email kamu untuk tautan konfirmasi.');
      return;
    }
    navigate(destination, { replace: true });
  };

  const field =
    'w-full rounded-[10px] border border-rule bg-white/5 px-4 py-3 text-sm text-ink placeholder:text-ink-dim focus:border-violet';

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <Aurora
        beam
        grid={false}
        blobs={[
          { width: 980, height: 840, left: -180, top: -80, background: 'rgba(139,92,246,0.42)' },
          { width: 870, height: 730, right: -160, top: 40, background: 'rgba(34,211,238,0.26)' },
        ]}
      />

      <div className="relative z-10 w-full max-w-[400px]">
        <Link to="/" className="block text-center font-display text-xl font-extrabold">
          Accomoty
        </Link>

        <Card className="mt-8 p-7">
          <h1 className="font-display text-h3 font-bold">
            {mode === 'signin' ? 'Masuk ke akun kamu' : 'Buat akun baru'}
          </h1>
          <p className="mt-2 text-meta text-ink-dim">
            {mode === 'signin'
              ? 'Lanjutkan belajar dari tempat kamu berhenti.'
              : 'Mulai belajar dari mentor dengan rekam jejak nyata.'}
          </p>

          <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              className={field}
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kata sandi"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              className={field}
            />

            {error && <p className="text-meta text-[#FCA5A5]">{error}</p>}
            {notice && <p className="text-meta text-[#6EE7B7]">{notice}</p>}

            <button
              type="submit"
              disabled={busy}
              className="mt-1 w-full rounded-pill bg-gradient-to-br from-[#a78bfa] to-[#6366f1] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_44px_rgba(139,92,246,0.55),inset_0_1px_0_rgba(255,255,255,0.28)] disabled:opacity-60"
            >
              {busy ? 'Memproses…' : mode === 'signin' ? 'Masuk' : 'Daftar'}
            </button>
          </form>

          <button
            onClick={signInWithGoogle}
            className="mt-3 w-full rounded-pill border border-rule bg-white/5 px-6 py-3 text-sm font-medium"
          >
            Lanjutkan dengan Google
          </button>

          <p className="mt-6 text-center text-meta text-ink-dim">
            {mode === 'signin' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
            <button
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setNotice(null); }}
              className="font-semibold text-ink underline-offset-4 hover:underline"
            >
              {mode === 'signin' ? 'Daftar' : 'Masuk'}
            </button>
          </p>

          {demoMode && (
            <p className="mt-5 rounded-[10px] border border-rule bg-white/[0.03] p-3 text-[11.5px] leading-relaxed text-ink-dim">
              Mode demo: Supabase belum dikonfigurasi, jadi masuk dengan email apa pun akan berhasil.
              Isi .env untuk mengaktifkan autentikasi sungguhan.
            </p>
          )}
        </Card>
      </div>

      <Grain />
    </div>
  );
}
