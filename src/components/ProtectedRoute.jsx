import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Gate for learner-only screens. Real access control is row-level
 *  security in the database — this only prevents a confusing empty UI. */
export default function ProtectedRoute({ children }) {
  const { user, loading, demoMode } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-ink-dim">Memuat…</div>
    );
  }

  if (!user && !demoMode) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
