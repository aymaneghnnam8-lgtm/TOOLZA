import { AdSlot } from './AdSlot';
import { Icon } from './Icons';
import { ToolCard } from './ToolCard';
import { Seo } from './Seo';
import { Breadcrumb } from './ui';
import { relatedTools } from '../data/tools';

const tones = {
  Image: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-200',
  Document: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-200',
  Text: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200',
  Generators: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200',
};

export function ToolShell({ tool, note, children }) {
  const related = relatedTools(tool.slug);
  return (
    <>
      <Seo title={tool.name} description={tool.description} />
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-page px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Home', to: '/' },
              { label: 'All Tools', to: '/tools' },
              { label: tool.name },
            ]}
          />
          <div className="mt-5 flex items-start gap-4">
            <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tones[tool.category]}`}>
              <Icon name={tool.icon} />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{tool.category}</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{tool.name}</h1>
              <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">{tool.description}</p>
              {note ? <p className="mt-3 text-sm text-slate-500">{note}</p> : null}
            </div>
          </div>
        </div>
      </div>
      <AdSlot id={`${tool.slug}-top`} />
      <div className="mx-auto max-w-page px-4 py-8 sm:px-6 lg:px-8">
        {children}
        <section className="mt-12" aria-labelledby="related-tools">
          <h2 id="related-tools" className="text-lg font-semibold text-slate-950 dark:text-white">Related tools</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ToolCard key={item.slug} tool={item} />
            ))}
          </div>
        </section>
      </div>
      <AdSlot id={`${tool.slug}-bottom`} />
    </>
  );
}
