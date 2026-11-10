export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

export function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  const bytes = new Uint32Array(2);
  crypto.getRandomValues(bytes);
  return `${bytes[0].toString(16)}-${bytes[1].toString(16)}`;
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const digits = value >= 10 || unit === 0 ? 1 : 2;
  return `${value.toFixed(digits)} ${units[unit]}`;
}

export function savedPercent(original, next) {
  if (!original) return 0;
  return Math.round(((original - next) / original) * 100);
}

export function stripExt(name) {
  const cleaned = String(name || '').replace(/\.[^.]+$/, '');
  return cleaned || 'file';
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function downloadTextFile(text, filename, mime = 'text/plain') {
  downloadBlob(new Blob([text], { type: mime }), filename);
}

export async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall back for browsers that block clipboard without a gesture chain.
    }
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.top = '0';
  area.style.left = '0';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.focus();
  area.select();
  const ok = document.execCommand('copy');
  area.remove();
  if (!ok) {
    throw new Error('Copy failed. Select the text and copy it manually.');
  }
}

export async function detectImageKind(file) {
  const buffer = await file.slice(0, 16).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'jpeg';
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return 'png';
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'webp';
  }
  return null;
}

export function mimeForKind(kind) {
  if (kind === 'png') return 'image/png';
  if (kind === 'webp') return 'image/webp';
  return 'image/jpeg';
}

export function extensionForMime(mime) {
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  return 'jpg';
}

export const MAX_IMAGE_BYTES = 40 * 1024 * 1024;
export const MAX_PDF_BYTES = 80 * 1024 * 1024;
