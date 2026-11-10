import { useEffect, useRef, useState } from 'react';
import { FileDropzone, usePreventFileNavigation } from '../../components/FileDropzone';
import { ToolShell } from '../../components/ToolShell';
import { Alert, Button, ImageFrame, Notice, Panel, Stat, Status } from '../../components/ui';
import { getTool } from '../../data/tools';
import {
  MAX_IMAGE_BYTES,
  detectImageKind,
  downloadBlob,
  formatBytes,
  mimeForKind,
  savedPercent,
  stripExt,
} from '../../utils/files';
import { compressImage, loadImage } from '../../utils/images';

const tool = getTool('image-compressor');

export default function ImageCompressor() {
  usePreventFileNavigation();
  const requestRef = useRef(0);
  const aliveRef = useRef(true);
  const imageRef = useRef(null);
  const originalUrlRef = useRef('');
  const resultUrlRef = useRef('');
  const [file, setFile] = useState(null);
  const [kind, setKind] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [natural, setNatural] = useState(null);
  const [quality, setQuality] = useState(80);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  function rememberOriginal(url) {
    if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
    originalUrlRef.current = url || '';
    setOriginalUrl(url || '');
  }

  function rememberResult(next) {
    if (resultUrlRef.current && resultUrlRef.current !== next?.url) {
      URL.revokeObjectURL(resultUrlRef.current);
    }
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
      rememberOriginal(loaded.url);
      setFile(candidate);
      setKind(detected);
      setNatural({ width: loaded.image.naturalWidth, height: loaded.image.naturalHeight });
      rememberResult(null);
    } catch (loadError) {
      setError(loadError.message);
    }
  }

  useEffect(() => {
    if (!file || !imageRef.current || !kind) return undefined;
    const image = imageRef.current;
    const requestId = ++requestRef.current;
    const timer = window.setTimeout(async () => {
      setBusy(true);
      try {
        const compressed = await compressImage(image, {
          mime: mimeForKind(kind),
          quality: quality / 100,
        });
        const url = URL.createObjectURL(compressed.blob);
        if (!aliveRef.current || requestId !== requestRef.current) {
          URL.revokeObjectURL(url);
          return;
        }
        rememberResult({ ...compressed, url });
        const notes = [];
        if (compressed.capped) notes.push('The image was scaled down so this browser could process it.');
        if (compressed.fallback) notes.push('This browser exported the image as JPG.');
        setNotice(notes.join(' '));
        setError('');
      } catch (compressError) {
        if (!aliveRef.current || requestId !== requestRef.current) return;
        setError(compressError.message || 'The image could not be compressed.');
      } finally {
        if (aliveRef.current && requestId === requestRef.current) setBusy(false);
      }
    }, 120);
    return () => window.clearTimeout(timer);
  }, [file, kind, quality]);

  function reset() {
    requestRef.current += 1;
    imageRef.current = null;
    setFile(null);
    setKind('');
    setNatural(null);
    rememberOriginal('');
    rememberResult(null);
    setError('');
    setNotice('');
    setBusy(false);
  }

  const saved = file && result ? savedPercent(file.size, result.blob.size) : null;

  return (
    <ToolShell tool={tool} note="Processed locally in your browser. The image is not uploaded.">
      <div className="space-y-5">
        {error ? <Alert>{error}</Alert> : null}
        {!file ? (
          <FileDropzone
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            title="Drop an image here"
            detail="JPG, PNG, or WebP up to 40 MB. Drag a file in, or browse from this device."
            onFiles={handleFiles}
          />
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{file.name}</p>
                <p className="text-sm text-slate-500">
                  {natural ? `${natural.width} × ${natural.height}` : ''} · {kind.toUpperCase()}
                </p>
              </div>
              <Button variant="secondary" onClick={reset}>Choose another image</Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="Original" value={formatBytes(file.size)} />
              <Stat label="Compressed" value={result ? formatBytes(result.blob.size) : busy ? 'Working…' : '—'} />
              <Stat
                label={saved != null && saved < 0 ? 'Change' : 'Saved'}
                value={saved == null ? '—' : saved >= 0 ? `${saved}%` : `${Math.abs(saved)}% larger`}
              />
            </div>
            <Panel>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="quality" className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  Quality
                </label>
                <span className="tabular-nums text-sm font-semibold text-slate-950 dark:text-white">{quality}</span>
              </div>
              <input
                id="quality"
                type="range"
                min="10"
                max="100"
                step="1"
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
                className="mt-3 w-full"
                aria-valuemin={10}
                aria-valuemax={100}
                aria-valuenow={quality}
              />
              {kind === 'png' ? (
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  PNG is lossless. Lower quality simplifies colors so the file can shrink. JPG and WebP follow the slider directly.
                </p>
              ) : null}
              {notice ? <div className="mt-4"><Notice>{notice}</Notice></div> : null}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button onClick={() => downloadBlob(result.blob, `${stripExt(file.name)}-compressed.${result.extension}`)} disabled={!result || busy}>
                  Download
                </Button>
                {busy ? <Status>Compressing…</Status> : null}
              </div>
            </Panel>
            <div className="grid gap-4 md:grid-cols-2">
              <ImageFrame title="Original" meta={formatBytes(file.size)} url={originalUrl} alt="Original image preview" />
              <ImageFrame
                title="Compressed"
                meta={result ? formatBytes(result.blob.size) : 'Working…'}
                url={result?.url || ''}
                alt="Compressed image preview"
              />
            </div>
          </>
        )}
      </div>
    </ToolShell>
  );
}
