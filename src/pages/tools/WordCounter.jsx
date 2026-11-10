import { useState } from 'react';
import { ToolShell } from '../../components/ToolShell';
import { Alert, Button, Panel, useCopy } from '../../components/ui';
import { getTool } from '../../data/tools';
import { analyzeText } from '../../utils/text';
import { inputClass } from '../../components/ui';

const tool = getTool('word-counter');

const labels = [
  ['words', 'Words'],
  ['characters', 'Characters'],
  ['charactersNoSpaces', 'Characters without spaces'],
  ['sentences', 'Sentences'],
  ['paragraphs', 'Paragraphs'],
  ['readingTime', 'Reading time'],
];

export default function WordCounter() {
  const [text, setText] = useState('');
  const stats = analyzeText(text);
  const { copied, copyError, copy } = useCopy();
  const empty = text.length === 0;

  return (
    <ToolShell tool={tool} note="Your text stays in this browser tab and is not uploaded.">
      <div className="space-y-5">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {labels.map(([key, label]) => (
            <div key={key} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-card dark:border-slate-800 dark:bg-slate-900">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-slate-950 dark:text-white">{stats[key]}</dd>
            </div>
          ))}
        </dl>
        <Panel>
          <label htmlFor="word-editor" className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-100">
            Text
          </label>
          <textarea
            id="word-editor"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste or type your text here."
            className={`${inputClass} min-h-[280px] resize-y leading-7`}
          />
          <p className="mt-2 text-xs text-slate-500">Reading time uses 200 words per minute and updates as you type.</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button variant="secondary" disabled={empty} onClick={() => copy(text)}>
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="ghost" disabled={empty} onClick={() => setText('')}>
              Clear
            </Button>
            <span className="sr-only" role="status">{copied ? 'Copied to clipboard' : ''}</span>
          </div>
          {copyError ? <div className="mt-4"><Alert>{copyError}</Alert></div> : null}
        </Panel>
      </div>
    </ToolShell>
  );
}
