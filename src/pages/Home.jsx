import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AdSlot } from '../components/AdSlot';
import { FaqList } from '../components/FaqList';
import { HeroArt } from '../components/HeroArt';
import { Icon } from '../components/Icons';
import { Seo } from '../components/Seo';
import { ToolCard } from '../components/ToolCard';
import { ToolCatalog } from '../components/ToolCatalog';
import { inputClass } from '../components/ui';
import { faqs, reasons, site } from '../data/site';
import { categories, tools, toolsInCategory } from '../data/tools';

export default function Home() {
  return (
    <>
      <Seo title="" description={site.description} />
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(ellipse_at_top_right,rgba(91,75,255,0.16),transparent_52%),radial-gradient(ellipse_at_left,rgba(47,107,255,0.12),transparent_46%)]" />
        <div className="mx-auto grid max-w-page items-center gap-10 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-20 lg:pt-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-700 dark:text-violet-300">
              Browser tools
            </p>
            <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl sm:leading-[1.08]">
              {site.heroTitle}
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-8 text-slate-600 dark:text-slate-300">{site.heroSubtitle}</p>
            <HeroSearch />
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
              {tools.filter((tool) => tool.popular).slice(0, 4).map((tool) => (
                <li key={tool.slug}>
                  <Link to={`/tools/${tool.slug}`} className="font-medium text-slate-700 hover:text-violet-700 dark:text-slate-200 dark:hover:text-violet-300">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <HeroArt />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950" aria-label="Product facts">
        <ul className="mx-auto grid max-w-page gap-4 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            ['On your device', 'Images and PDFs are processed locally.'],
            ['No account', 'Open a tool and use it immediately.'],
            ['Eight tools', 'File, text, and generator utilities.'],
            ['Phone or desktop', 'The same pages adapt to the screen.'],
          ].map(([title, body]) => (
            <li key={title}>
              <p className="text-sm font-semibold text-slate-950 dark:text-white">{title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="popular" className="mx-auto max-w-page px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">Popular tools</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">The utilities people open most often.</p>
          </div>
          <Link to="/tools" className="hidden text-sm font-semibold text-violet-700 sm:inline dark:text-violet-300">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.filter((tool) => tool.popular).map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section id="categories" className="bg-slate-50 py-16 dark:bg-slate-900/40">
        <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">Categories</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Grouped by the kind of work you are doing.</p>
            </div>
            <Link to="/categories" className="hidden text-sm font-semibold text-violet-700 sm:inline dark:text-violet-300">
              All categories
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {categories.map((category) => {
              const count = toolsInCategory(category.id).length;
              return (
                <Link
                  key={category.id}
                  to={`/tools?category=${encodeURIComponent(category.id)}`}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                    <Icon name={category.id === 'Document' ? 'pdf' : category.id === 'Text' ? 'counter' : category.id === 'Generators' ? 'qr' : 'image'} />
                  </span>
                  <span>
                    <span className="block text-base font-semibold text-slate-950 dark:text-white">{category.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-slate-500">{category.description}</span>
                    <span className="mt-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {count} {count === 1 ? 'tool' : 'tools'}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="all-tools" className="mx-auto max-w-page px-4 py-16 sm:px-6 lg:px-8">
        <ToolCatalog
          heading="All tools"
          intro="Search by name or filter by category. Every tool opens on its own page."
        />
      </section>

      <AdSlot id="home-inline" />

      <section className="mx-auto max-w-page px-4 py-4 sm:px-6 lg:px-8" aria-labelledby="why-toolza">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <h2 id="why-toolza" className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              Why choose Toolza
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              A short list of finished utilities. Each one does a specific job and shows the result before you download or copy it.
            </p>
          </div>
          <ul className="border-t border-slate-200 dark:border-slate-800">
            {reasons.map((reason) => (
              <li key={reason.title} className="border-b border-slate-200 py-4 dark:border-slate-800">
                <h3 className="text-[15px] font-semibold text-slate-950 dark:text-white">{reason.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{reason.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-page px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="faq-heading">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              FAQ
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Straight answers about privacy, browsers, and what the tools can and cannot do.
            </p>
          </div>
          <FaqList items={faqs} />
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-page overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-white sm:px-10">
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-violet-400 to-blue-400" />
          <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">Pick a tool and finish the task.</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            No account. The file stays in your browser until you download the result.
          </p>
          <Link
            to="/tools"
            className="mt-6 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-slate-100"
          >
            Browse all tools
          </Link>
        </div>
      </section>
    </>
  );
}

function HeroSearch() {
  const [params] = useSearchParams();
  const [value, setValue] = useState(params.get('q') || '');
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();
    const query = value.trim();
    navigate(query ? `/?q=${encodeURIComponent(query)}#all-tools` : '/#all-tools');
  }

  return (
    <form role="search" onSubmit={onSubmit} className="mt-8 max-w-xl">
      <label htmlFor="hero-search" className="sr-only">
        Search tools
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon name="search" className="h-4 w-4" />
          </span>
          <input
            id="hero-search"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Search tools"
            className={`${inputClass} pl-10`}
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-violet-500 hover:to-blue-500"
        >
          Search
        </button>
      </div>
    </form>
  );
}
