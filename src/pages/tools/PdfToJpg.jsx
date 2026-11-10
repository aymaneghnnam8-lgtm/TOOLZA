import { useEffect, useRef, useState } from 'react';
import { FileDropzone, usePreventFileNavigation } from '../../components/FileDropzone';
import { ToolShell } from '../../components/ToolShell';
import { Alert, Button, Notice, Panel, Status } from '../../components/ui';
import { getTool } from '../../data/tools';
import { downloadBlob, formatBytes, stripExt } from '../../utils/files';
import { convertPdfToJpegs } from '../../utils/pdf';

const tool = getTool('pdf-to-jpg');

export default function PdfToJpg() {
  usePreventFileNavigation();
  const aliveRef = useRef(true);
  const runRef = useRef(0);
  const pagesRef = useRef([]);
  const selectAllRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [pages, setPages] = useState([]);
  const [selected, setSelected] = useState([]);
  const [progress, setProgress] = useState(null);
  const [busy, setBusy] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      pagesRef.current.forEach((page) => URL.revokeObjectURL(page.url));
    };
  }, []);

  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  useEffect(() => {
    if (!selectAllRef.current) return;
    selectAllRef.current.indeterminate = selected.length > 0 && selected.length < pages.length;
  }, [selected, pages.length]);

  function clearPages() {
    pagesRef.current.forEach((page) => URL.revokeObjectURL(page.url));
    pagesRef.current = [];
    setPages([]);
    setSelected([]);
  }

  async function handleFiles(files) {
    const candidate = files[0];
    if (!candidate) return;
    const runId = ++runRef.current;
    clearPages();
    setError('');
    setFileName(candidate.name);
    setBusy(true);
    setProgress({ current: 0, total: 0 });
    try {
      const rendered = await convertPdfToJpegs(candidate, {
        onProgress: (current, total) => {
          if (aliveRef.current && runId === runRef.current) setProgress({ current, total });
        },
      });
      if (!aliveRef.current || runId !== runRef.current) {
        rendered.forEach((page) => URL.revokeObjectURL(page.url));
        return;
      }
      setPages(rendered);
      setSelected(rendered.map((page) => page.pageNumber));
    } catch (convertError) {
      if (aliveRef.current && runId === runRef.current) {
        setError(convertError.message || 'The PDF could not be converted.');
        setFileName('');
      }
    } finally {
      if (aliveRef.current && runId === runRef.current) {
        setBusy(false);
        setProgress(null);
      }
    }
  }

  function toggle(pageNumber) {
    setSelected((current) => (
      current.includes(pageNumber)
        ? current.filter((value) => value !== pageNumber)
        : [...current, pageNumber].sort((a, b) => a - b)
    ));
  }

  const chosen = pages.filter((page) => selected.includes(page.pageNumber));
  const base = stripExt(fileName || 'document');

  async function downloadZip() {
    if (!chosen.length) return;
    setZipping(true);
    setError('');
    try {
      const module = await import('jszip');
      const JSZip = module.default || module;
      const zip = new JSZip();
      chosen.forEach((page) => {
        zip.file(`${base}-page-${page.pageNumber}.jpg`, page.blob);
      });
      const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/zip' });
      downloadBlob(blob, `${base}-pages.zip`);
    } catch {
      setError('The ZIP file could not be created. You can still download pages one by one.');
    } finally {
      setZipping(false);
    }
  }

  return (
    <ToolShell tool={tool} note="Pages are rendered on this device with PDF.js. The PDF is not uploaded.">
      <div className="space-y-5">
        {error ? <Alert>{error}</Alert> : null}
        {!pages.length && !busy ? (
          <FileDropzone
            accept="application/pdf,.pdf"
            title="Drop a PDF here"
            detail="Up to 80 MB. Each page is exported as a JPG you can preview and download."
            onFiles={handleFiles}
            disabled={busy}
          />
        ) : null}
        {busy ? (
          <Panel>
            <div className="flex items-center gap-3" aria-busy="true">
              <Status>
                {progress?.total
                  ? `Rendering page ${progress.current} of ${progress.total}`
                  : 'Opening the PDF…'}
              </Status>
            </div>
          </Panel>
        ) : null}
        {pages.length ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-950 dark:text-white">{fileName}</p>
                <p className="text-sm text-slate-500">{pages.length} {pages.length === 1 ? 'page' : 'pages'}</p>
              </div>
              <Button variant="secondary" onClick={() => { runRef.current += 1; clearPages(); setFileName(''); setError(''); }}>
                Convert another PDF
              </Button>
            </div>
            <Panel>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    className="h-4 w-4 accent-violet-600"
                    checked={selected.length === pages.length}
                    onChange={(event) => setSelected(event.target.checked ? pages.map((page) => page.pageNumber) : [])}
                  />
                  Select all pages
                </label>
                <p className="text-sm text-slate-500">{chosen.length} selected</p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button onClick={downloadZip} disabled={!chosen.length || zipping}>
                  {zipping ? 'Preparing ZIP…' : 'Download ZIP'}
                </Button>
                {!chosen.length ? <Notice>Select at least one page for the ZIP. Individual downloads stay available on each page.</Notice> : null}
              </div>
            </Panel>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <article key={page.pageNumber} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                  <div className="checker flex h-52 items-center justify-center">
                    <img src={page.url} alt={`Preview of page ${page.pageNumber}`} className="max-h-52 max-w-full object-contain" />
                  </div>
                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-sm font-semibold text-slate-950 dark:text-white">Page {page.pageNumber}</h2>
                        <p className="text-xs text-slate-500">{page.width} × {page.height} · {formatBytes(page.blob.size)}</p>
                      </div>
                      <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-violet-600"
                          checked={selected.includes(page.pageNumber)}
                          onChange={() => toggle(page.pageNumber)}
                          aria-label={`Select page ${page.pageNumber}`}
                        />
                        Select
                      </label>
                    </div>
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => downloadBlob(page.blob, `${base}-page-${page.pageNumber}.jpg`)}
                    >
                      Download JPG
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </ToolShell>
  );
}
