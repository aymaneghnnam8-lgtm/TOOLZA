import { LegalHeading, LegalLayout } from './About';
import { TextLink } from '../components/ui';
import { site } from '../data/site';

export default function Terms() {
  return (
    <LegalLayout
      title="Terms of Service"
      description="Terms of Service for TOOLZA. The tools are provided as-is for personal and everyday use."
    >
      <p>
        By using {site.name}, you agree to these terms. If you do not agree, do not use the site.
      </p>
      <section>
        <LegalHeading>The service</LegalHeading>
        <p className="mt-3">
          {site.name} provides free browser-based utilities. Features can change, break, or be removed. Access is offered as-is, without a service-level promise.
        </p>
      </section>
      <section>
        <LegalHeading>Acceptable use</LegalHeading>
        <p className="mt-3">
          Use the tools for lawful purposes. You are responsible for the files and text you process, and for having the right to use that material. Do not misuse the site to interfere with other people’s devices or data.
        </p>
      </section>
      <section>
        <LegalHeading>Your results</LegalHeading>
        <p className="mt-3">
          Check outputs before you rely on them. Compression changes file size and can change appearance. PDF rendering can differ from a desktop viewer. Password strength is an estimate based on length and character set, not a guarantee that a password is suitable for a particular account.
        </p>
      </section>
      <section>
        <LegalHeading>Intellectual property</LegalHeading>
        <p className="mt-3">
          The {site.name} name, page design, and original copy belong to the site operator. You keep the rights to the files and text you bring to the tools. Third-party libraries remain under their own licenses.
        </p>
      </section>
      <section>
        <LegalHeading>Disclaimer of warranties</LegalHeading>
        <p className="mt-3">
          The site and tools are provided without warranties of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement. Some jurisdictions do not allow certain warranty disclaimers, so parts of this section may not apply to you.
        </p>
      </section>
      <section>
        <LegalHeading>Limitation of liability</LegalHeading>
        <p className="mt-3">
          To the fullest extent permitted by law, {site.name} and its operator are not liable for indirect, incidental, special, consequential, or punitive damages, or for loss of data, profits, or goodwill, arising from your use of the site. Because processing happens on your device, keep your own copies of important files.
        </p>
      </section>
      <section>
        <LegalHeading>Contact</LegalHeading>
        <p className="mt-3">
          Questions about these terms can be sent through the <TextLink to="/contact">contact page</TextLink>.
        </p>
      </section>
    </LegalLayout>
  );
}
