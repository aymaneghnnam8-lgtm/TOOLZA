import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categories, tools } from '../data/tools';
import { cx } from '../utils/files';
import { Icon } from './Icons';
import { ToolCard } from './ToolCard';
import { inputClass } from './ui';

export function ToolCatalog({ heading = 'All tools', intro, headingLevel = 'h2' }) {
  const [params, setParams] = useSearchParams();
  const search = params.toString();
  const categoryParam = params.get('category') || 'All';
  const category = categories.some((item) => item.id === categoryParam) ? categoryParam : 'All';
  const [query, setQuery] = useState(() => params.get('q') || '');

  useEffect(() => {
    setQuery(new URLSearchParams(search).get('q') || '');
  }, [search]);

  function updateQuery(value) {
    setQuery(value);
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value) next.set('q', value);
      else next.delete('q');
      return next;
    }, { replace: true });
  }

  function updateCategory(id) {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      if (!id || id === 'All') next.delete('category');
      else next.set('category', id);
      return next;
    }, { replace: true });
  }

  const HeadingTag = headingLevel;
  const normalized = query.trim().toLowerCase();
  const filtered = tools.filter((tool) => {
    const matchesCategory = category === 'All' || tool.category === category;
    const haystack = `${tool.name} ${tool.short} ${tool.description} ${tool.category}`.toLowerCase();
    return matchesCategory && (!normalized || haystack.includes(normalized));
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <HeadingTag className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">{heading}</HeadingTag>
          {intro ? <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{intro}</p> : null}
        </div>
        <p className="text-sm text-slate-500" aria-live="polite">
          Showing {filtered.length} of {tools.length}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon name="search" className="h-4 w-4" />
          </span>
          <input
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Search tools"
            aria-label="Search tools"
            className={`${inputClass} pl-10 ${query ? 'pr-16' : ''}`}
          />
          {query ? (
            <button
              type="button"
              onClick={() => updateQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              aria-label="Clear search"
            >
              Clear
            </button>
          ) : null}
        </div>
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {['All', ...categories.map((item) => item.id)].map((id) => {
            const active = category === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => updateCategory(id)}
                className={cx(
                  'rounded-full px-3 py-1.5 text-sm font-medium transition',
                  active
                    ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200',
                )}
              >
                {id}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 px-6 py-14 text-center dark:border-slate-700">
          <p className="font-semibold text-slate-950 dark:text-white">No tools match that search.</p>
          <p className="mt-2 text-sm text-slate-500">Try a different word, or clear the filters.</p>
          <button
            type="button"
            onClick={() => {
              updateQuery('');
              updateCategory('All');
            }}
            className="mt-4 text-sm font-semibold text-violet-700 dark:text-violet-300"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
