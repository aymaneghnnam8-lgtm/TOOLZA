import { Link } from 'react-router-dom';
import { Icon } from './Icons';

const tones = {
  Image: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-200',
  Document: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-200',
  Text: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200',
  Generators: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200',
};

export function ToolCard({ tool }) {
  return (
    <Link
      to={`/tools/${tool.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lift dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
    >
      <span className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${tones[tool.category] || tones.Image}`}>
        <Icon name={tool.icon} />
      </span>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{tool.category}</p>
      <h3 className="mt-1 text-[15px] font-semibold text-slate-950 dark:text-white">{tool.name}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-6 text-slate-500">{tool.short}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-700 dark:text-violet-300">
        Open tool
        <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
