import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { PageFallback } from './ui';

export function Layout() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const node = document.getElementById(location.hash.slice(1));
      if (node) {
        node.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-950 opacity-0 shadow-lift focus:translate-y-0 focus:opacity-100 dark:bg-slate-900 dark:text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <ErrorBoundary key={location.pathname}>
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
