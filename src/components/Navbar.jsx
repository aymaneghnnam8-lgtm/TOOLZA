import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Icon, LogoMark } from './Icons';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/tools', label: 'All Tools' },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5" aria-label="TOOLZA home">
          <LogoMark />
          <span className="text-[15px] font-semibold tracking-[0.16em] text-slate-950 dark:text-white">TOOLZA</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'text-slate-950 dark:text-white'
                    : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden dark:border-slate-700 dark:text-slate-200"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-slate-200 px-4 py-3 lg:hidden dark:border-slate-800">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-3 text-base font-medium ${
                  isActive ? 'bg-slate-100 text-slate-950 dark:bg-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
