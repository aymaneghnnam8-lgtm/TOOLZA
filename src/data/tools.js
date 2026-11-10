export const categories = [
  {
    id: 'Image',
    title: 'Image',
    description: 'Compress, resize, and convert pictures on this device.',
  },
  {
    id: 'Document',
    title: 'Document',
    description: 'Turn PDF pages into JPG images you can preview and save.',
  },
  {
    id: 'Text',
    title: 'Text',
    description: 'Count words and clean up formatting as you type.',
  },
  {
    id: 'Generators',
    title: 'Generators',
    description: 'Create QR codes and random passwords in the browser.',
  },
];

export const tools = [
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    short: 'Shrink JPG, PNG, and WebP files before you send them.',
    description:
      'Compress JPG, PNG, and WebP images in your browser. Adjust quality, compare the original and compressed sizes, preview the result, and download it.',
    category: 'Image',
    popular: true,
    icon: 'compress',
  },
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    short: 'Export PDF pages as JPG images, one page or a whole set.',
    description:
      'Convert PDF pages to JPG images locally. Choose which pages to keep, preview them, download individual files, or save a ZIP.',
    category: 'Document',
    popular: true,
    icon: 'pdf',
  },
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    short: 'Make a scannable code for a link, a note, or a contact card.',
    description:
      'Create QR codes for a URL, plain text, or contact details. Set the colors and size, preview the code, and download PNG or SVG.',
    category: 'Generators',
    popular: true,
    icon: 'qr',
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    short: 'Set exact pixel dimensions without leaving the page.',
    description:
      'Resize JPG, PNG, and WebP images to custom dimensions or common presets. Lock the aspect ratio, preview the export, and download it.',
    category: 'Image',
    popular: true,
    icon: 'resize',
  },
  {
    slug: 'word-counter',
    name: 'Word Counter',
    short: 'See length, structure, and reading time while you write.',
    description:
      'Count words, characters, characters without spaces, sentences, and paragraphs as you type. Check reading time, then copy or clear the text.',
    category: 'Text',
    popular: true,
    icon: 'counter',
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    short: 'Build a random password with the characters you choose.',
    description:
      'Generate secure random passwords with crypto.getRandomValues. Choose the length and character types, check the strength, and copy the result.',
    category: 'Generators',
    popular: true,
    icon: 'password',
  },
  {
    slug: 'jpg-to-png',
    name: 'JPG to PNG',
    short: 'Convert JPEG photos to PNG, including batches.',
    description:
      'Convert one or more JPG images to PNG in the browser. Preview each result and download files individually or together in a ZIP.',
    category: 'Image',
    popular: false,
    icon: 'convert',
  },
  {
    slug: 'text-formatter',
    name: 'Text Formatter',
    short: 'Fix case, spacing, and line breaks in a single editor.',
    description:
      'Format text with uppercase, lowercase, title case, extra-space removal, empty-line removal, and reverse. Copy the result when it looks right.',
    category: 'Text',
    popular: false,
    icon: 'format',
  },
];

export function getTool(slug) {
  return tools.find((tool) => tool.slug === slug);
}

export function relatedTools(slug, limit = 3) {
  const current = getTool(slug);
  if (!current) return tools.slice(0, limit);
  const others = tools.filter((tool) => tool.slug !== slug);
  const same = others.filter((tool) => tool.category === current.category);
  const rest = others.filter((tool) => tool.category !== current.category);
  return [...same, ...rest].slice(0, limit);
}

export function toolsInCategory(categoryId) {
  return tools.filter((tool) => tool.category === categoryId);
}
