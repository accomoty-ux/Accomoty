import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // No env vars yet — run in demo mode so the UI is still browsable.
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    if (!isSupabaseConfigured()) return { error: { message: 'Supabase belum dikonfigurasi.' } };
    return supabase.auth.signUp({ email, password });
  };

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured()) {
      setUser({ email, user_metadata: { full_name: email.split('@')[0] } });
      return { error: null };
    }
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured()) return { error: { message: 'Supabase belum dikonfigurasi.' } };
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/dashboard' },
    });
  };

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
  };

  /** First name, capitalised — used in the dashboard greeting. */
  const displayName = (() => {
    const raw = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
    return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : 'Creator';
  })();

  return (
    <AuthContext.Provider
      value={{ user, loading, displayName, signUp, signIn, signInWithGoogle, signOut, demoMode: !isSupabaseConfigured() }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
