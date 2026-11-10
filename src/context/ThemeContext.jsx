import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

function readTheme() {
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
    return 'dark';
  }
  try {
    const stored = localStorage.getItem('toolza-theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // Storage can be blocked. The page still works.
  }
  return 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b1020' : '#ffffff');
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('toolza-theme', next);
      } catch {
        // Ignore storage failures.
      }
      return next;
    });
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used within ThemeProvider');
  return value;
}
