import { useEffect, useState } from 'react';
import { ToolShell } from '../../components/ToolShell';
import { Alert, Button, Panel, inputClass, useCopy } from '../../components/ui';
import { getTool } from '../../data/tools';
import { charsetSize, generatePassword, measureStrength } from '../../utils/password';
import { cx } from '../../utils/files';

const tool = getTool('password-generator');

const types = [
  { key: 'upper', label: 'Uppercase', hint: 'A–Z' },
  { key: 'lower', label: 'Lowercase', hint: 'a–z' },
  { key: 'numbers', label: 'Numbers', hint: '0–9' },
  { key: 'symbols', label: 'Symbols', hint: '!@#…' },
];

const strengthColor = {
  1: 'bg-rose-500',
  2: 'bg-amber-500',
  3: 'bg-emerald-500',
  4: 'bg-violet-600',
};

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    upper: true,
    lower: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const [seed, setSeed] = useState(0);
  const { copied, copyError, copy } = useCopy();

  useEffect(() => {
    try {
      setPassword(generatePassword(length, options));
      setError('');
    } catch (generationError) {
      setPassword('');
      setError(generationError.message);
    }
  }, [length, options, seed]);

  const size = charsetSize(options);
  const strength = size ? measureStrength(length, size) : null;

  return (
    <ToolShell tool={tool} note="Randomness comes from crypto.getRandomValues in your browser. The password is not sent anywhere.">
      <Panel className="mx-auto max-w-2xl">
        <label htmlFor="password-output" className="mb-1.5 block text-sm font-medium">Password</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="password-output"
            readOnly
            value={password}
            type={visible ? 'text' : 'password'}
            spellCheck="false"
            autoComplete="off"
            aria-label="Generated password"
            className={`${inputClass} font-mono tracking-wide`}
          />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setVisible((current) => !current)} aria-pressed={visible}>
              {visible ? 'Hide' : 'Show'}
            </Button>
            <Button variant="secondary" disabled={!password} onClick={() => copy(password)}>
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>
        <span className="sr-only" role="status">{copied ? 'Copied to clipboard' : ''}</span>
        {copyError ? <div className="mt-3"><Alert>{copyError}</Alert></div> : null}
        {error ? <div className="mt-3"><Alert>{error}</Alert></div> : null}

        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="password-length" className="text-sm font-medium">Length</label>
            <input
              id="password-length-number"
              type="number"
              min="8"
              max="64"
              value={length}
              onChange={(event) => {
                if (event.target.value === '') return;
                const next = Number(event.target.value);
                if (Number.isFinite(next)) setLength(Math.min(64, Math.max(8, Math.round(next))));
              }}
              className="w-20 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm tabular-nums dark:border-slate-700 dark:bg-slate-950"
              aria-label="Password length"
            />
          </div>
          <input
            id="password-length"
            type="range"
            min="8"
            max="64"
            step="1"
            value={length}
            onChange={(event) => setLength(Number(event.target.value))}
            className="mt-3 w-full"
          />
        </div>

        <fieldset className="mt-6">
          <legend className="text-sm font-medium">Character types</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {types.map((type) => (
              <label key={type.key} className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-violet-600"
                  checked={options[type.key]}
                  onChange={() => setOptions((current) => ({ ...current, [type.key]: !current[type.key] }))}
                />
                <span className="font-medium text-slate-800 dark:text-slate-100">{type.label}</span>
                <span className="text-slate-500">{type.hint}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {strength && password ? (
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm">
              <p>
                Strength: <span className="font-semibold">{strength.label}</span>
              </p>
              <p className="tabular-nums text-slate-500">About {strength.bits} bits</p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" aria-hidden="true">
              <div className={cx('h-full rounded-full', strengthColor[strength.score])} style={{ width: `${(strength.score / 4) * 100}%` }} />
            </div>
          </div>
        ) : null}

        <div className="mt-6">
          <Button onClick={() => setSeed((current) => current + 1)} disabled={!size}>
            Generate new password
          </Button>
        </div>
      </Panel>
    </ToolShell>
  );
}
