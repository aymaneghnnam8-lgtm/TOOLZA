import { useEffect, useRef, useState } from 'react';
import { FileDropzone, usePreventFileNavigation } from '../../components/FileDropzone';
import { ToolShell } from '../../components/ToolShell';
import { Alert, Button, Notice, Status } from '../../components/ui';
import { getTool } from '../../data/tools';
import { MAX_IMAGE_BYTES, detectImageKind, downloadBlob, formatBytes, stripExt, uid } from '../../utils/files';
import { canvasToBlob, clampBox, drawToCanvas, loadImage } from '../../utils/images';

const tool = getTool('jpg-to-png');

export default function JpgToPng() {
  usePreventFileNavigation();
  const aliveRef = useRef(true);
  const itemsRef = useRef([]);
  const [items, setItems] = useState([]);
  const [working, setWorking] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      itemsRef.current.forEach((item) => {
        if (item.url) URL.revokeObjectURL(item.url);
      });
    };
  }, []);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  function updateItem(id, patch) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  async function handleFiles(files) {
    if (!files.length) return;
    setError('');
    const jobs = files.map((file) => ({
      id: uid(),
      file,
      name: file.name,
      status: 'queued',
      error: '',
      url: '',
      blob: null,
      width: 0,
      height: 0,
      capped: false,
    }));
    setItems((current) => [...current, ...jobs]);
    setWorking(true);
    for (const job of jobs) {
      if (!aliveRef.current) return;
      updateItem(job.id, { status: 'working' });
      try {
        const converted = await convertJpeg(job.file);
        if (!aliveRef.current) {
          URL.revokeObjectURL(converted.url);
          return;
        }
        setItems((current) => {
          if (!current.some((item) => item.id === job.id)) {
            URL.revokeObjectURL(converted.url);
            return current;
          }
          return current.map((item) => (item.id === job.id ? { ...item, status: 'done', ...converted } : item));
        });
      } catch (convertError) {
        if (!aliveRef.current) return;
        updateItem(job.id, { status: 'error', error: convertError.message || 'This image could not be converted.' });
      }
    }
    if (aliveRef.current) setWorking(false);
  }

  function removeItem(id) {
    setItems((current) => {
      const target = current.find((item) => item.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);
      return current.filter((item) => item.id !== id);
    });
  }

  function clearAll() {
    itemsRef.current.forEach((item) => {
      if (item.url) URL.revokeObjectURL(item.url);
    });
    setItems([]);
    setError('');
  }

  const ready = items.filter((item) => item.status === 'done' && item.blob);
  const failed = items.filter((item) => item.status === 'error').length;

  async function downloadZip() {
    if (!ready.length) return;
    setZipping(true);
    setError('');
    try {
      const module = await import('jszip');
      const JSZip = module.default || module;
      const zip = new JSZip();
      const used = new Map();
      ready.forEach((item) => {
        const base = `${stripExt(item.name)}.png`;
        const count = used.get(base) || 0;
        used.set(base, count + 1);
        const filename = count ? `${stripExt(item.name)}-${count + 1}.png` : base;
        zip.file(filename, item.blob);
      });
      const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/zip' });
      downloadBlob(blob, 'toolza-png-images.zip');
    } catch {
      setError('The ZIP file could not be created. You can still download images one by one.');
    } finally {
      setZipping(false);
    }
  }

  return (
    <ToolShell tool={tool} note="Conversion runs in your browser. JPG files are not uploaded.">
      <div className="space-y-5">
        {error ? <Alert>{error}</Alert> : null}
        <FileDropzone
          accept="image/jpeg,.jpg,.jpeg"
          multiple
          title="Drop JPG images here"
          detail="One image or a batch, up to 40 MB each. PNG and WebP files are skipped with an error."
          onFiles={handleFiles}
          disabled={working}
        />
        {items.length ? (
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={downloadZip} disabled={!ready.length || zipping || working}>
              {zipping ? 'Preparing ZIP…' : `Download ZIP${ready.length ? ` (${ready.length})` : ''}`}
            </Button>
            <Button variant="secondary" onClick={clearAll} disabled={working}>Clear</Button>
            {working ? <Status>Converting…</Status> : null}
          </div>
        ) : null}
        {failed ? <Notice>{failed} {failed === 1 ? 'file' : 'files'} could not be converted. The ZIP includes the successful ones.</Notice> : null}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="checker flex h-44 items-center justify-center">
                {item.url ? (
                  <img src={item.url} alt="" className="max-h-44 max-w-full object-contain" />
                ) : (
                  <span className="text-sm text-slate-500">{item.status === 'error' ? 'Not converted' : 'Working…'}</span>
                )}
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <h2 className="truncate text-sm font-semibold text-slate-950 dark:text-white">{item.name}</h2>
                  {item.status === 'done' ? (
                    <p className="text-xs text-slate-500">
                      {item.width} × {item.height} · {formatBytes(item.blob.size)}
                      {item.capped ? ' · scaled to fit the browser' : ''}
                    </p>
                  ) : null}
                  {item.status === 'error' ? <p className="text-xs text-rose-700 dark:text-rose-300">{item.error}</p> : null}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    disabled={item.status !== 'done'}
                    onClick={() => downloadBlob(item.blob, `${stripExt(item.name)}.png`)}
                  >
                    Download PNG
                  </Button>
                  <Button variant="ghost" onClick={() => removeItem(item.id)} disabled={working && item.status !== 'done' && item.status !== 'error'}>
                    Remove
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}

async function convertJpeg(file) {
  if (!file.size) throw new Error('This file is empty.');
  if (file.size > MAX_IMAGE_BYTES) throw new Error('This image is larger than 40 MB.');
  const kind = await detectImageKind(file);
  if (kind !== 'jpeg') throw new Error('This file is not a JPG image.');
  const loaded = await loadImage(file);
  try {
    const fitted = clampBox(loaded.image.naturalWidth, loaded.image.naturalHeight);
    const { canvas } = drawToCanvas(loaded.image, fitted.width, fitted.height);
    const blob = await canvasToBlob(canvas, 'image/png');
    return {
      blob,
      url: URL.createObjectURL(blob),
      width: fitted.width,
      height: fitted.height,
      capped: fitted.capped,
    };
  } finally {
    URL.revokeObjectURL(loaded.url);
  }
}
