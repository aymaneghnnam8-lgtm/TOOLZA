import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Button, inputClass } from '../components/ui';

export default function NotFound() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/tools?q=${encodeURIComponent(value)}` : '/tools');
  }

  return (
    <>
      <Seo title="Page not found" description="That page is not on TOOLZA. Search the tools or return home." />
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-700 dark:text-violet-300">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          That address does not match a page on TOOLZA. Search the tool directory, or go back home.
        </p>
        <form role="search" onSubmit={onSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
          <label htmlFor="not-found-search" className="sr-only">Search tools</label>
          <input
            id="not-found-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools"
            className={inputClass}
          />
          <Button type="submit">Search</Button>
        </form>
        <div className="mt-6 flex items-center justify-center gap-4 text-sm font-semibold">
          <Link to="/" className="text-violet-700 dark:text-violet-300">Home</Link>
          <Link to="/tools" className="text-violet-700 dark:text-violet-300">All tools</Link>
        </div>
      </div>
    </>
  );
}
