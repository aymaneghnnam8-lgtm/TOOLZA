import { useState } from 'react';
import { Icon } from './Icons';

export function FaqList({ items }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;
        return (
          <div key={item.q}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-slate-950 dark:text-white"
              >
                {item.q}
                <Icon name="chevron" className={`h-4 w-4 shrink-0 text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`} />
              </button>
            </h3>
            {isOpen ? (
              <div id={panelId} role="region" aria-labelledby={buttonId} className="px-5 pb-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {item.a}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
