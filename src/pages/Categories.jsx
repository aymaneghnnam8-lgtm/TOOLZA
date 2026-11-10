import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { categories, toolsInCategory } from '../data/tools';

export default function Categories() {
  return (
    <>
      <Seo
        title="Categories"
        description="Browse TOOLZA tools by category: image, document, text, and generators."
      />
      <div className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-slate-500">Directory</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Categories</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
          Tools are grouped by the kind of file or task. Open a category to filter the full list, or jump straight to a tool.
        </p>
        <div className="mt-8 space-y-6">
          {categories.map((category) => {
            const items = toolsInCategory(category.id);
            return (
              <section key={category.id} id={category.id.toLowerCase()} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 sm:p-6" style={{ scrollMarginTop: '5.5rem' }}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{category.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{category.description}</p>
                  </div>
                  <Link
                    to={`/tools?category=${encodeURIComponent(category.id)}`}
                    className="text-sm font-semibold text-violet-700 dark:text-violet-300"
                  >
                    Filter this category
                  </Link>
                </div>
                <ul className="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
                  {items.map((tool) => (
                    <li key={tool.slug} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <Link to={`/tools/${tool.slug}`} className="font-medium text-slate-950 hover:text-violet-700 dark:text-white dark:hover:text-violet-300">
                          {tool.name}
                        </Link>
                        <p className="text-sm text-slate-500">{tool.short}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
