import { useState } from 'react';
import { ToolShell } from '../../components/ToolShell';
import { Alert, Button, Panel, inputClass, useCopy } from '../../components/ui';
import { getTool } from '../../data/tools';
import {
  removeEmptyLines,
  removeExtraSpaces,
  reverseText,
  toLowerCase,
  toTitleCase,
  toUpperCase,
} from '../../utils/text';

const tool = getTool('text-formatter');

const actions = [
  { id: 'upper', label: 'Uppercase', run: toUpperCase, done: 'Converted to uppercase.' },
  { id: 'lower', label: 'Lowercase', run: toLowerCase, done: 'Converted to lowercase.' },
  { id: 'title', label: 'Title case', run: toTitleCase, done: 'Converted to title case.' },
  { id: 'spaces', label: 'Remove extra spaces', run: removeExtraSpaces, done: 'Removed extra spaces.' },
  { id: 'lines', label: 'Remove empty lines', run: removeEmptyLines, done: 'Removed empty lines.' },
  { id: 'reverse', label: 'Reverse text', run: reverseText, done: 'Reversed the text.' },
];

export default function TextFormatter() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const { copied, copyError, copy } = useCopy();
  const empty = text.length === 0;

  function apply(action) {
    if (!text) {
      setStatus('Add some text first.');
      return;
    }
    setText(action.run(text));
    setStatus(action.done);
  }

  return (
    <ToolShell tool={tool} note="Formatting stays in this browser tab. The text is not uploaded.">
      <Panel>
        <label htmlFor="format-editor" className="mb-2 block text-sm font-medium">Text</label>
        <textarea
          id="format-editor"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setStatus('');
          }}
          placeholder="Paste or type the text you want to format."
          className={`${inputClass} min-h-[280px] resize-y leading-7`}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {actions.map((action) => (
            <Button key={action.id} variant="secondary" disabled={empty} onClick={() => apply(action)}>
              {action.label}
            </Button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button disabled={empty} onClick={() => copy(text)}>{copied ? 'Copied' : 'Copy'}</Button>
          <Button variant="ghost" disabled={empty} onClick={() => { setText(''); setStatus('Cleared the editor.'); }}>
            Clear
          </Button>
          <p role="status" className="text-sm text-slate-500">{copied ? 'Copied to clipboard.' : status}</p>
        </div>
        {copyError ? <div className="mt-4"><Alert>{copyError}</Alert></div> : null}
      </Panel>
    </ToolShell>
  );
}
