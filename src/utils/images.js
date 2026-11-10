import { extensionForMime } from './files';

export const MAX_EDGE = 8192;
export const MAX_PIXELS = 32_000_000;

export function clampBox(width, height) {
  let nextWidth = Math.max(1, Math.round(Number(width) || 1));
  let nextHeight = Math.max(1, Math.round(Number(height) || 1));
  const pixelScale = Math.sqrt(MAX_PIXELS / (nextWidth * nextHeight));
  const edgeScale = MAX_EDGE / Math.max(nextWidth, nextHeight);
  const scale = Math.min(1, pixelScale, edgeScale);
  if (scale < 1) {
    nextWidth = Math.max(1, Math.round(nextWidth * scale));
    nextHeight = Math.max(1, Math.round(nextHeight * scale));
  }
  return { width: nextWidth, height: nextHeight, capped: scale < 1 };
}

export function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      if (!image.naturalWidth || !image.naturalHeight) {
        URL.revokeObjectURL(url);
        reject(new Error('This image could not be opened. Try a different file.'));
        return;
      }
      resolve({ image, url });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('This image could not be opened. Try a different file.'));
    };
    image.src = url;
  });
}

export function drawToCanvas(image, width, height, { fill } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('This browser cannot process images.');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  if (fill) {
    context.fillStyle = fill;
    context.fillRect(0, 0, width, height);
  }
  context.drawImage(image, 0, 0, width, height);
  return { canvas, context };
}

export function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('The browser could not export this image.'));
      },
      type,
      quality,
    );
  });
}

function quantizeChannel(value, step) {
  const next = Math.round(Math.round(value / step) * step);
  return Math.max(0, Math.min(255, next));
}

function posterize(imageData, quality) {
  const levels = Math.max(2, Math.round(2 + quality * 46));
  const step = 255 / (levels - 1);
  const { data } = imageData;
  for (let index = 0; index < data.length; index += 4) {
    data[index] = quantizeChannel(data[index], step);
    data[index + 1] = quantizeChannel(data[index + 1], step);
    data[index + 2] = quantizeChannel(data[index + 2], step);
  }
}

export async function compressImage(image, { mime, quality }) {
  const fitted = clampBox(image.naturalWidth, image.naturalHeight);
  const { canvas, context } = drawToCanvas(image, fitted.width, fitted.height, {
    fill: mime === 'image/jpeg' ? '#ffffff' : null,
  });

  if (mime === 'image/png' && quality < 0.995) {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    posterize(imageData, quality);
    context.putImageData(imageData, 0, 0);
  }

  let outputMime = mime;
  let fallback = false;
  let blob;
  try {
    blob = await canvasToBlob(canvas, outputMime, quality);
  } catch (error) {
    if (outputMime !== 'image/webp') throw error;
    const redraw = drawToCanvas(image, fitted.width, fitted.height, { fill: '#ffffff' });
    blob = await canvasToBlob(redraw.canvas, 'image/jpeg', quality);
    outputMime = 'image/jpeg';
    fallback = true;
  }

  return {
    blob,
    mime: outputMime,
    extension: extensionForMime(outputMime),
    width: fitted.width,
    height: fitted.height,
    capped: fitted.capped,
    fallback,
  };
}

export async function renderResized(image, width, height, mime) {
  const fitted = clampBox(width, height);
  const needsWhite = mime === 'image/jpeg';
  let { canvas } = drawToCanvas(image, fitted.width, fitted.height, {
    fill: needsWhite ? '#ffffff' : null,
  });
  let outputMime = mime;
  let fallback = false;
  let blob;
  try {
    blob = await canvasToBlob(canvas, outputMime, outputMime === 'image/png' ? undefined : 0.92);
  } catch (error) {
    if (outputMime !== 'image/webp') throw error;
    const redraw = drawToCanvas(image, fitted.width, fitted.height, { fill: '#ffffff' });
    canvas = redraw.canvas;
    blob = await canvasToBlob(canvas, 'image/jpeg', 0.92);
    outputMime = 'image/jpeg';
    fallback = true;
  }
  return {
    blob,
    mime: outputMime,
    extension: extensionForMime(outputMime),
    width: fitted.width,
    height: fitted.height,
    capped: fitted.capped || fitted.width !== Math.round(width) || fitted.height !== Math.round(height),
    fallback,
  };
}

export const resizePresets = [
  { id: 'original', label: 'Original' },
  { id: 'hd', label: 'HD 1920×1080', width: 1920, height: 1080 },
  { id: 'square', label: 'Square 1080', width: 1080, height: 1080 },
  { id: 'story', label: 'Story 1080×1920', width: 1080, height: 1920 },
  { id: 'thumb', label: 'Thumbnail 1280×720', width: 1280, height: 720 },
  { id: 'icon', label: 'Icon 512', width: 512, height: 512 },
];

export function fitInside(boxWidth, boxHeight, ratio) {
  let width = boxWidth;
  let height = Math.max(1, Math.round(boxWidth / ratio));
  if (height > boxHeight) {
    height = boxHeight;
    width = Math.max(1, Math.round(boxHeight * ratio));
  }
  return { width, height };
}
