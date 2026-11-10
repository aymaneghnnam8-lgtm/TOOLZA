export const site = {
  name: 'TOOLZA',
  email: 'hello@toolza.app',
  heroTitle: 'All Your Online Tools in One Place',
  heroSubtitle: 'Free, fast and easy tools to simplify your everyday tasks',
  description:
    'Free online tools to compress images, convert PDFs, count words, generate QR codes, resize pictures, and create passwords. Processing stays in your browser.',
};

export const reasons = [
  {
    title: 'Private by default',
    body: 'Images, PDFs, text, and passwords are handled in the browser tab you already have open. The file never needs to leave the device for the tool to finish.',
  },
  {
    title: 'No account',
    body: 'Open a tool and use it. There is no sign-up wall, and finished downloads are not watermarked.',
  },
  {
    title: 'A result you can check',
    body: 'Compressors show the new size before you save. Converters preview every page or image. Password strength is calculated from the options you picked.',
  },
  {
    title: 'Controls that match the label',
    body: 'Quality, dimensions, character sets, and page selection change the actual output. If a file cannot be read, the page says so.',
  },
  {
    title: 'Comfortable on a phone',
    body: 'The layout collapses cleanly, buttons stay large enough to tap, and the system file picker is used for uploads.',
  },
  {
    title: 'One job per page',
    body: 'Each tool is a separate page with a plain description, so you can bookmark the one you need and ignore the rest.',
  },
];

export const faqs = [
  {
    q: 'Do my files get uploaded?',
    a: 'No. Image, PDF, and text tools run locally in your browser. TOOLZA does not receive those files, and they are not sent to a conversion server.',
  },
  {
    q: 'Do I need an account?',
    a: 'No. The tools are available as soon as the page loads. Theme choice is the only preference stored on your device.',
  },
  {
    q: 'Which browsers can run the tools?',
    a: 'Current versions of Chrome, Edge, Firefox, and Safari. Image and PDF export uses the browser’s canvas. Password generation uses the Web Crypto API.',
  },
  {
    q: 'Are the tools free?',
    a: 'Yes. You can use every tool without paying. The site reserves quiet placement areas for advertising. If ads are added later, you are not asked to click them, and ad approval is never guaranteed.',
  },
  {
    q: 'Why can a compressed PNG end up larger?',
    a: 'PNG is a lossless format. Re-encoding a file that is already optimized can add a few kilobytes. Lowering the quality simplifies colors, which usually helps. JPG and WebP respond directly to the quality slider.',
  },
  {
    q: 'Can I use TOOLZA on a phone?',
    a: 'Yes. Pages adapt to small screens. Exports use your browser’s normal download flow, which on mobile may save to the Files app or the downloads folder.',
  },
];
