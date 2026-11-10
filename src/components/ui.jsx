import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { copyText, cx } from '../utils/files';

export const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100';

const buttonStyles = {
  primary:
    'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-sm shadow-violet-600/15 hover:from-violet-500 hover:to-blue-500',
  secondary:
    'border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
  ghost: 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
};

export function Button({
  type = 'button',
  variant = 'primary',
  className = '',
  disabled,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
        buttonStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Alert({ children }) {
  return (
    <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/70 dark:bg-rose-950/50 dark:text-rose-100">
      {children}
    </div>
  );
}

export function Notice({ children }) {
  return (
    <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-100">
      {children}
    </p>
  );
}

export function Status({ children }) {
  return (
    <p role="status" className="text-sm text-slate-500 dark:text-slate-400">
      {children}
    </p>
  );
}

export function Spinner({ className = 'h-4 w-4' }) {
  return (
    <span
      className={cx('inline-block animate-spin rounded-full border-2 border-current border-r-transparent', className)}
      aria-hidden="true"
    />
  );
}

export function Panel({ children, className = '' }) {
  return (
    <div className={cx('rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 sm:p-6', className)}>
      {children}
    </div>
  );
}

export function Stat({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-slate-950 dark:text-white">{value}</p>
      {hint ? <p className="mt-0.5 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {last || !item.to ? (
                <span className={last ? 'text-slate-800 dark:text-slate-200' : undefined} aria-current={last ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className="hover:text-slate-800 dark:hover:text-slate-200">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function TextLink({ to, href, children, className = '' }) {
  const classes = cx(
    'font-medium text-violet-700 underline decoration-violet-200 underline-offset-4 hover:text-violet-900 dark:text-violet-300 dark:hover:text-violet-200',
    className,
  );
  if (href) {
    return (
      <a className={classes} href={href}>
        {children}
      </a>
    );
  }
  return (
    <Link className={classes} to={to}>
      {children}
    </Link>
  );
}

export function useCopy(timeout = 1600) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');
  const timer = useRef(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy(text) {
    try {
      await copyText(text);
      setCopyError('');
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), timeout);
    } catch (error) {
      setCopied(false);
      setCopyError(error.message || 'Could not copy.');
    }
  }

  return { copied, copyError, copy };
}

export function ImageFrame({ title, meta, url, alt }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <figcaption className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-2 text-sm dark:border-slate-800">
        <span className="font-medium text-slate-900 dark:text-white">{title}</span>
        <span className="truncate tabular-nums text-slate-500">{meta}</span>
      </figcaption>
      <div className="checker flex h-64 items-center justify-center">
        {url ? (
          <img src={url} alt={alt} className="max-h-64 max-w-full object-contain" />
        ) : (
          <span className="text-sm text-slate-500">Preparing preview…</span>
        )}
      </div>
    </figure>
  );
}

export function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center gap-3 text-sm text-slate-500" role="status">
      <Spinner />
      Loading
    </div>
  );
}
