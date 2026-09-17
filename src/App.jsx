import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Academy from './pages/Academy';
import CourseDetail from './pages/CourseDetail';
import Player from './pages/Player';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Community from './pages/Community';
import Login from './pages/Login';

/**
 * Root layout. AuthProvider sits inside the router so its children can
 * use router hooks (Nav calls useNavigate on sign-out).
 *
 * The player and login screens carry their own chrome, so the marketing
 * nav and footer are suppressed there.
 */
function Layout() {
  const { pathname } = useLocation();
  const bare = pathname.includes('/lesson/') || pathname === '/login';

  return (
    <AuthProvider>
      {!bare && <Nav />}
      <Outlet />
      {!bare && <Footer />}
    </AuthProvider>
  );
}

function ErrorScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-h2 font-bold">Ada yang salah.</h1>
      <p className="text-body text-ink-soft">Coba muat ulang halaman.</p>
      <a href="/" className="text-meta font-semibold text-[#C4B5FD]">Kembali ke beranda</a>
    </div>
  );
}

/**
 * createBrowserRouter (a "data router") is required for view transitions:
 * the viewTransition prop and useViewTransitionState both read from the
 * data router context, which BrowserRouter does not provide.
 */
const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorScreen />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/academy', element: <Academy /> },
      { path: '/academy/:id', element: <Academy /> },
      { path: '/course/:courseId', element: <CourseDetail /> },
      {
        path: '/course/:courseId/lesson/:lessonId',
        element: (
          <ProtectedRoute>
            <Player />
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      { path: '/events', element: <Events /> },
      { path: '/community', element: <Community /> },
      { path: '/login', element: <Login /> },
      { path: '*', element: <Home /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
