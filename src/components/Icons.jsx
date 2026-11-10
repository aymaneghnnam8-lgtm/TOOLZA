export function Icon({ name, className = 'h-5 w-5' }) {
  const paths = icons[name];
  if (!paths) return null;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths}
    </svg>
  );
}

function P({ d }) {
  return <path d={d} />;
}

const icons = {
  compress: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M9 12h6M10 10l-2 2 2 2M14 10l2 2-2 2" />
    </>
  ),
  pdf: (
    <>
      <path d="M7 3.5h7l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5z" />
      <path d="M14 3.5V8h4.5" />
      <path d="M8.5 16.5v-4h1.4a1.4 1.4 0 0 1 0 2.8H8.5M13 12.5h1.6a1.6 1.6 0 0 1 0 3.2H13v-3.2zM16.2 12.5H19M17.6 12.5v4" />
    </>
  ),
  counter: (
    <>
      <path d="M5 7h14M5 12h14M5 17h9" />
    </>
  ),
  qr: (
    <>
      <path d="M5 5h5v5H5zM14 5h5v5h-5zM5 14h5v5H5z" />
      <path d="M14 14h2v2h-2zM18 14h1v1M14 18h1v1M18 18h1v1M17 16h2" />
    </>
  ),
  resize: (
    <>
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    </>
  ),
  convert: (
    <>
      <rect x="3.5" y="5" width="10" height="8" rx="1.5" />
      <path d="M13 15h7.5M17.5 12.5l3 2.5-3 2.5" />
      <rect x="10.5" y="11" width="10" height="8" rx="1.5" />
    </>
  ),
  format: (
    <>
      <path d="M5 7h14M5 12h10M5 17h7" />
      <path d="M16.5 15.5l2 2 3-4" />
    </>
  ),
  password: (
    <>
      <circle cx="8" cy="12" r="3.25" />
      <path d="M11 12h9M17 12v2.5M20 12v2" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="3.25" />
      <path d="M12 3.5v1.8M12 18.7v1.8M3.5 12h1.8M18.7 12h1.8M5.8 5.8l1.3 1.3M16.9 16.9l1.3 1.3M18.2 5.8l-1.3 1.3M7.1 16.9l-1.3 1.3" />
    </>
  ),
  moon: <P d="M16.5 14.2A6.2 6.2 0 0 1 9.8 4.8 6.4 6.4 0 1 0 16.5 14.2z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M15.8 15.8 20 20" />
    </>
  ),
  menu: <P d="M4 7h16M4 12h16M4 17h16" />,
  close: <P d="M6 6l12 12M18 6 6 18" />,
  download: (
    <>
      <path d="M12 4v10" />
      <path d="M8 10.5 12 14.5l4-4" />
      <path d="M5 19h14" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="11" height="12" rx="1.5" />
      <path d="M6 16H5.5A1.5 1.5 0 0 1 4 14.5v-9A1.5 1.5 0 0 1 5.5 4H14a1.5 1.5 0 0 1 1.5 1.5V6" />
    </>
  ),
  check: <P d="M5 12.5 9.2 17 19 7" />,
  chevron: <P d="M6 9l6 6 6-6" />,
  image: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.2" />
      <path d="M7 16.5 11 12l3 2.5 2-1.5 2 3" />
    </>
  ),
  arrow: <P d="M5 12h14M13 6l6 6-6 6" />,
  lock: (
    <>
      <rect x="6" y="11" width="12" height="8" rx="1.5" />
      <path d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11" />
    </>
  ),
  unlock: (
    <>
      <rect x="6" y="11" width="12" height="8" rx="1.5" />
      <path d="M8.5 11V8.5a3.5 3.5 0 0 1 6.2-2.2" />
    </>
  ),
};

export function LogoMark({ className = 'h-8 w-8' }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 text-sm font-bold text-white ${className}`} aria-hidden="true">
      T
    </span>
  );
}
