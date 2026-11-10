import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ToolShell } from '../../components/ToolShell';
import { Alert, Button, Notice, Panel, inputClass } from '../../components/ui';
import { getTool } from '../../data/tools';
import { downloadDataUrl, downloadTextFile } from '../../utils/files';
import { buildVCard, colorsAreClose, normalizeHex, normalizeUrl } from '../../utils/qr';
import { cx } from '../../utils/files';

const tool = getTool('qr-code-generator');
const modes = [
  { id: 'url', label: 'URL' },
  { id: 'text', label: 'Text' },
  { id: 'contact', label: 'Contact' },
];

const emptyContact = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  organization: '',
  website: '',
};

export default function QrGenerator() {
  const [mode, setMode] = useState('url');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [contact, setContact] = useState(emptyContact);
  const [foreground, setForeground] = useState('#12182B');
  const [background, setBackground] = useState('#FFFFFF');
  const [foregroundDraft, setForegroundDraft] = useState('#12182B');
  const [backgroundDraft, setBackgroundDraft] = useState('#FFFFFF');
  const [size, setSize] = useState(320);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  const payload = buildPayload(mode, url, text, contact);

  useEffect(() => {
    let cancelled = false;
    if (!payload) {
      setPreview(null);
      setError('');
      setWarning('');
      return undefined;
    }
    if (colorsAreClose(foreground, background)) {
      setWarning('These colors are very close. A scanner may not be able to read the code.');
    } else {
      setWarning('');
    }
    const timer = window.setTimeout(async () => {
      try {
        const options = {
          width: size,
          margin: 1,
          errorCorrectionLevel: 'M',
          color: { dark: foreground, light: background },
        };
        const [dataUrl, svg] = await Promise.all([
          QRCode.toDataURL(payload, options),
          QRCode.toString(payload, { ...options, type: 'svg' }),
        ]);
        if (cancelled) return;
        setPreview({ dataUrl, svg, text: payload });
        setError('');
      } catch {
        if (cancelled) return;
        setPreview(null);
        setError('That content is too long to encode as a QR code. Shorten it and try again.');
      }
    }, 80);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [payload, foreground, background, size]);

  function commitColor(which, value) {
    const next = normalizeHex(value);
    if (!next) {
      if (which === 'foreground') setForegroundDraft(foreground);
      else setBackgroundDraft(background);
      setError('Use a hex color such as #12182B.');
      return;
    }
    setError('');
    if (which === 'foreground') {
      setForeground(next);
      setForegroundDraft(next);
    } else {
      setBackground(next);
      setBackgroundDraft(next);
    }
  }

  return (
    <ToolShell tool={tool} note="The code is created in your browser. The content is not uploaded.">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel>
          <div role="group" aria-label="QR content type" className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {modes.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={mode === item.id}
                onClick={() => setMode(item.id)}
                className={cx(
                  'rounded-lg px-3 py-1.5 text-sm font-semibold',
                  mode === item.id ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-slate-600 dark:text-slate-300',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          {mode === 'url' ? (
            <div className="mt-4">
              <label htmlFor="qr-url" className="mb-1.5 block text-sm font-medium">URL</label>
              <input id="qr-url" inputMode="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com" className={inputClass} />
              <p className="mt-1.5 text-xs text-slate-500">A value without a scheme is saved as https.</p>
            </div>
          ) : null}

          {mode === 'text' ? (
            <div className="mt-4">
              <label htmlFor="qr-text" className="mb-1.5 block text-sm font-medium">Text</label>
              <textarea id="qr-text" value={text} onChange={(event) => setText(event.target.value)} rows={5} className={`${inputClass} resize-y`} placeholder="Type the text to encode" />
            </div>
          ) : null}

          {mode === 'contact' ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ['firstName', 'First name'],
                ['lastName', 'Last name'],
                ['phone', 'Phone'],
                ['email', 'Email'],
                ['organization', 'Organization'],
                ['website', 'Website'],
              ].map(([key, label]) => (
                <div key={key} className={key === 'organization' || key === 'website' ? 'sm:col-span-2' : ''}>
                  <label htmlFor={`qr-${key}`} className="mb-1.5 block text-sm font-medium">{label}</label>
                  <input
                    id={`qr-${key}`}
                    value={contact[key]}
                    onChange={(event) => setContact((current) => ({ ...current, [key]: event.target.value }))}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <ColorField
              id="qr-foreground"
              label="Foreground"
              color={foreground}
              draft={foregroundDraft}
              onDraft={setForegroundDraft}
              onPicker={(value) => {
                const next = normalizeHex(value) || value;
                setForeground(next);
                setForegroundDraft(next);
              }}
              onBlur={() => commitColor('foreground', foregroundDraft)}
            />
            <ColorField
              id="qr-background"
              label="Background"
              color={background}
              draft={backgroundDraft}
              onDraft={setBackgroundDraft}
              onPicker={(value) => {
                const next = normalizeHex(value) || value;
                setBackground(next);
                setBackgroundDraft(next);
              }}
              onBlur={() => commitColor('background', backgroundDraft)}
            />
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between">
              <label htmlFor="qr-size" className="text-sm font-medium">Size</label>
              <span className="tabular-nums text-sm font-semibold">{size} px</span>
            </div>
            <input
              id="qr-size"
              type="range"
              min="128"
              max="1024"
              step="32"
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
              className="mt-3 w-full"
            />
          </div>
        </Panel>

        <Panel className="flex flex-col">
          <h2 className="text-sm font-semibold text-slate-950 dark:text-white">Preview</h2>
          <div className="mt-4 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-200 p-6 dark:border-slate-700">
            {preview ? (
              <div style={{ width: size }} className="max-w-full">
                <img src={preview.dataUrl} alt="QR code preview" className="h-auto w-full" />
              </div>
            ) : (
              <p className="text-center text-sm text-slate-500">Enter a URL, some text, or contact details.</p>
            )}
          </div>
          {warning ? <div className="mt-4"><Notice>{warning}</Notice></div> : null}
          {error ? <div className="mt-4"><Alert>{error}</Alert></div> : null}
          {preview ? (
            <pre className="mt-4 max-h-28 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-950">{preview.text}</pre>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-3">
            <Button disabled={!preview} onClick={() => downloadDataUrl(preview.dataUrl, 'toolza-qr.png')}>Download PNG</Button>
            <Button variant="secondary" disabled={!preview} onClick={() => downloadTextFile(preview.svg, 'toolza-qr.svg', 'image/svg+xml')}>
              Download SVG
            </Button>
          </div>
        </Panel>
      </div>
    </ToolShell>
  );
}

function buildPayload(mode, url, text, contact) {
  if (mode === 'url') return url.trim() ? normalizeUrl(url) : '';
  if (mode === 'text') return text.trim() ? text.trim() : '';
  return buildVCard(contact);
}

function ColorField({ id, label, color, draft, onDraft, onPicker, onBlur }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <input type="color" value={color} onChange={(event) => onPicker(event.target.value)} aria-label={`${label} picker`} className="h-11 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700" />
        <input id={id} value={draft} onChange={(event) => onDraft(event.target.value)} onBlur={onBlur} className={inputClass} spellCheck="false" />
      </div>
    </div>
  );
}
