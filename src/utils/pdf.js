import { MAX_PDF_BYTES } from './files';

let workerReady = null;

async function loadPdfjs() {
  const pdfjs = await import('pdfjs-dist');
  if (!workerReady) {
    workerReady = import('pdfjs-dist/build/pdf.worker.min.mjs?url').then((mod) => {
      const workerSrc = typeof mod === 'string' ? mod : mod.default;
      pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
      return workerSrc;
    });
  }
  await workerReady;
  return pdfjs;
}

export async function isPdfFile(file) {
  const buffer = await file.slice(0, 5).arrayBuffer();
  const header = String.fromCharCode(...new Uint8Array(buffer));
  return header === '%PDF-';
}

function pdfErrorMessage(error) {
  const name = error?.name || '';
  const message = error?.message || '';
  if (name === 'PasswordException' || /password/i.test(message)) {
    return 'This PDF is password-protected, so it can’t be converted here.';
  }
  if (/worker/i.test(message)) {
    return 'The converter could not start in this browser. Refresh the page and try again.';
  }
  return 'This PDF could not be read. It may be damaged or use a feature this converter does not support.';
}

export async function convertPdfToJpegs(file, { onProgress } = {}) {
  if (!file || file.size === 0) throw new Error('This file is empty.');
  if (file.size > MAX_PDF_BYTES) {
    throw new Error('This PDF is larger than 80 MB. Choose a smaller file.');
  }
  if (!(await isPdfFile(file))) {
    throw new Error('Choose a PDF file.');
  }

  const pdfjs = await loadPdfjs();
  const data = new Uint8Array(await file.arrayBuffer());
  let pdf;
  try {
    const task = pdfjs.getDocument({ data, verbosity: 0, useSystemFonts: true });
    pdf = await task.promise;
  } catch (error) {
    throw new Error(pdfErrorMessage(error));
  }

  if (!pdf.numPages) throw new Error('This PDF has no pages.');

  const pages = [];
  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      onProgress?.(pageNumber, pdf.numPages);
      const page = await pdf.getPage(pageNumber);
      const base = page.getViewport({ scale: 1 });
      const scale = Math.min(2, 1400 / base.width);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('This browser cannot render PDF pages.');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: context, viewport }).promise;
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (value) => (value ? resolve(value) : reject(new Error('A page could not be exported.'))),
          'image/jpeg',
          0.92,
        );
      });
      pages.push({
        pageNumber,
        blob,
        url: URL.createObjectURL(blob),
        width: canvas.width,
        height: canvas.height,
      });
      page.cleanup();
    }
  } catch (error) {
    pages.forEach((page) => URL.revokeObjectURL(page.url));
    throw new Error(pdfErrorMessage(error));
  } finally {
    pdf.destroy();
  }

  return pages;
}
