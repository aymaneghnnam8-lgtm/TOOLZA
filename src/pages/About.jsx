import { Seo } from '../components/Seo';
import { TextLink } from '../components/ui';
import { site } from '../data/site';

export function LegalLayout({ title, description, children }) {
  return (
    <>
      <Seo title={title} description={description} />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-sm text-slate-500">Last updated November 10, 2026</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h1>
        <div className="mt-8 space-y-8 text-[15px] leading-7 text-slate-600 dark:text-slate-300">{children}</div>
      </article>
    </>
  );
}

export function LegalHeading({ children }) {
  return <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{children}</h2>;
}

export default function About() {
  return (
    <LegalLayout
      title="About"
      description="TOOLZA is a set of free browser tools for images, PDFs, text, QR codes, and passwords. Files are processed on your device."
    >
      <section>
        <LegalHeading>What TOOLZA is</LegalHeading>
        <p className="mt-3">
          {site.name} is a small collection of online utilities for ordinary tasks: compressing an image, turning PDF pages into JPGs, counting words, resizing a picture, converting JPG to PNG, formatting text, making a QR code, and generating a password.
        </p>
      </section>
      <section>
        <LegalHeading>How the tools work</LegalHeading>
        <p className="mt-3">
          The work happens in your browser. Images are drawn with the canvas API. PDF pages are rendered with PDF.js. ZIP downloads are built with JSZip. QR codes are drawn with the qrcode library. Passwords use <code className="rounded bg-slate-100 px-1 py-0.5 text-sm dark:bg-slate-800">crypto.getRandomValues</code>. None of those steps send your file or your password to a TOOLZA server.
        </p>
      </section>
      <section>
        <LegalHeading>What this site does not do</LegalHeading>
        <p className="mt-3">
          There is no account system and no file hosting. Advertising space is reserved in the page markup, and it stays empty until a real ad unit is added. Publishing that space does not mean an advertising network has approved the site.
        </p>
      </section>
      <section>
        <LegalHeading>Contact</LegalHeading>
        <p className="mt-3">
          Questions about the site can be sent to <TextLink href={`mailto:${site.email}`}>{site.email}</TextLink> or through the <TextLink to="/contact">contact page</TextLink>. The form opens your email app. It does not store the message on this website.
        </p>
      </section>
    </LegalLayout>
  );
}
