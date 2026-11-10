import { useEffect, useRef, useState } from 'react';
import { FileDropzone, usePreventFileNavigation } from '../../components/FileDropzone';
import { Icon } from '../../components/Icons';
import { ToolShell } from '../../components/ToolShell';
import { Alert, Button, ImageFrame, Notice, Panel, inputClass } from '../../components/ui';
import { getTool } from '../../data/tools';
import {
  MAX_IMAGE_BYTES,
  detectImageKind,
  downloadBlob,
  formatBytes,
  mimeForKind,
  stripExt,
} from '../../utils/files';
import { fitInside, loadImage, renderResized, resizePresets } from '../../utils/images';

const tool = getTool('image-resizer');

export default function ImageResizer() {
  usePreventFileNavigation();
  const aliveRef = useRef(true);
  const requestRef = useRef(0);
  const imageRef = useRef(null);
  const ratioRef = useRef(1);
  const sourceUrlRef = useRef('');
  const resultUrlRef = useRef('');
  const [file, setFile] = useState(null);
  const [kind, setKind] = useState('');
  const [natural, setNatural] = useState(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const [lock, setLock] = useState(true);
  const [format, setFormat] = useState('original');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  function rememberSource(url) {
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    sourceUrlRef.current = url || '';
    setSourceUrl(url || '');
  }

  function rememberResult(next) {
    if (resultUrlRef.current && resultUrlRef.current !== next?.url) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = next?.url || '';
    setResult(next);
  }

  async function handleFiles(files) {
    const candidate = files[0];
    setError('');
    setNotice('');
    if (!candidate) return;
    if (!candidate.size) {
      setError('This file is empty.');
      return;
    }
    if (candidate.size > MAX_IMAGE_BYTES) {
      setError('This image is larger than 40 MB. Choose a smaller file.');
      return;
    }
    const detected = await detectImageKind(candidate);
    if (!detected) {
      setError('Use a JPG, PNG, or WebP image.');
      return;
    }
    try {
      const loaded = await loadImage(candidate);
      imageRef.current = loaded.image;
      ratioRef.current = loaded.image.naturalWidth / loaded.image.naturalHeight;
      rememberSource(loaded.url);
      setFile(candidate);
      setKind(detected);
      setNatural({ width: loaded.image.naturalWidth, height: loaded.image.naturalHeight });
      setWidth(loaded.image.naturalWidth);
      setHeight(loaded.image.naturalHeight);
      setFormat('original');
      rememberResult(null);
    } catch (loadError) {
      setError(loadError.message);
    }
  }

  useEffect(() => {
    if (!file || !imageRef.current || width < 1 || height < 1) return undefined;
    const image = imageRef.current;
    const requestId = ++requestRef.current;
    const mime = format === 'original' ? mimeForKind(kind) : format;
    const timer = window.setTimeout(async () => {
      setBusy(true);
      try {
        const rendered = await renderResized(image, width, height, mime);
        const url = URL.createObjectURL(rendered.blob);
        if (!aliveRef.current || requestId !== requestRef.current) {
          URL.revokeObjectURL(url);
          return;
        }
        rememberResult({ ...rendered, url });
        const notes = [];
        if (rendered.capped) notes.push(`Output was capped at ${rendered.width} × ${rendered.height} so the browser could export it.`);
        if (rendered.fallback) notes.push('This browser exported the image as JPG.');
        setNotice(notes.join(' '));
        setError('');
      } catch (renderError) {
        if (!aliveRef.current || requestId !== requestRef.current) return;
        setError(renderError.message || 'The image could not be resized.');
      } finally {
        if (aliveRef.current && requestId === requestRef.current) setBusy(false);
      }
    }, 150);
    return () => window.clearTimeout(timer);
  }, [file, kind, width, height, format]);

  function onWidth(value) {
    const next = clampDimension(value);
    setWidth(next);
    if (lock && ratioRef.current) setHeight(Math.max(1, Math.round(next / ratioRef.current)));
  }

  function onHeight(value) {
    const next = clampDimension(value);
    setHeight(next);
    if (lock && ratioRef.current) setWidth(Math.max(1, Math.round(next * ratioRef.current)));
  }

  function toggleLock() {
    if (!lock && ratioRef.current) {
      setHeight(Math.max(1, Math.round(width / ratioRef.current)));
    }
    setLock((current) => !current);
  }

  function applyPreset(preset) {
    if (!natural) return;
    if (preset.id === 'original') {
      setWidth(natural.width);
      setHeight(natural.height);
      return;
    }
    if (lock) {
      const fitted = fitInside(preset.width, preset.height, ratioRef.current || 1);
      setWidth(fitted.width);
      setHeight(fitted.height);
      return;
    }
    setWidth(preset.width);
    setHeight(preset.height);
  }

  function reset() {
    requestRef.current += 1;
    imageRef.current = null;
    setFile(null);
    setKind('');
    setNatural(null);
    rememberSource('');
    rememberResult(null);
    setError('');
    setNotice('');
    setBusy(false);
  }

  return (
    <ToolShell tool={tool} note="Resizing happens in your browser. The original file on your device is left unchanged.">
      <div className="space-y-5">
        {error ? <Alert>{error}</Alert> : null}
        {!file ? (
          <FileDropzone
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            title="Drop an image here"
            detail="JPG, PNG, or WebP up to 40 MB."
            onFiles={handleFiles}
          />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="min-w-0 truncate text-sm text-slate-500">
                <span className="font-semibold text-slate-950 dark:text-white">{file.name}</span>
                {natural ? ` · original ${natural.width} × ${natural.height}` : ''}
              </p>
              <Button variant="secondary" onClick={reset}>Choose another image</Button>
            </div>
            <Panel>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Presets</p>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {resizePresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="mt-5 grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
                <DimensionField id="resize-width" label="Width (px)" value={width} onChange={onWidth} />
                <button
                  type="button"
                  onClick={toggleLock}
                  aria-pressed={lock}
                  aria-label={lock ? 'Aspect ratio locked. Unlock to stretch.' : 'Aspect ratio unlocked. Lock to keep proportions.'}
                  className="mb-0.5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  <Icon name={lock ? 'lock' : 'unlock'} />
                </button>
                <DimensionField id="resize-height" label="Height (px)" value={height} onChange={onHeight} />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {lock
                  ? 'Aspect ratio is locked, so the image keeps its proportions. Presets fit inside the chosen frame.'
                  : 'Aspect ratio is unlocked, so the image can be stretched to the exact width and height.'}
              </p>
              <div className="mt-4">
                <label htmlFor="resize-format" className="mb-1.5 block text-sm font-medium">Download format</label>
                <select id="resize-format" value={format} onChange={(event) => setFormat(event.target.value)} className={inputClass}>
                  <option value="original">Original format</option>
                  <option value="image/jpeg">JPG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WebP</option>
                </select>
              </div>
              {notice ? <div className="mt-4"><Notice>{notice}</Notice></div> : null}
              <div className="mt-5">
                <Button
                  disabled={!result || busy}
                  onClick={() => downloadBlob(result.blob, `${stripExt(file.name)}-${result.width}x${result.height}.${result.extension}`)}
                >
                  {busy ? 'Resizing…' : 'Download'}
                </Button>
              </div>
            </Panel>
            <ImageFrame
              title={result ? `Resized ${result.width} × ${result.height}` : 'Resized preview'}
              meta={result ? formatBytes(result.blob.size) : 'Working…'}
              url={result?.url || sourceUrl}
              alt="Resized image preview"
            />
          </>
        )}
      </div>
    </ToolShell>
  );
}

function clampDimension(value) {
  const number = Math.round(Number(value));
  if (!Number.isFinite(number)) return 1;
  return Math.min(20000, Math.max(1, number));
}

function DimensionField({ id, label, value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <input
        id={id}
        type="number"
        min="1"
        max="20000"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </div>
  );
}
