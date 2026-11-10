import { LegalHeading, LegalLayout } from './About';
import { TextLink } from '../components/ui';
import { site } from '../data/site';

export default function Privacy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="TOOLZA privacy policy. Tools run in your browser, theme preference is stored locally, and the contact form uses your email app."
    >
      <p>
        This policy describes how the {site.name} website handles information. It is written to match how the site actually works.
      </p>
      <section>
        <LegalHeading>Tools and files</LegalHeading>
        <p className="mt-3">
          Image, PDF, text, QR, and password tools run in your browser. The files and text you provide for those tools are processed on your device. {site.name} does not receive them, does not store them on a server, and does not ask you to upload them in order for the tool to finish.
        </p>
      </section>
      <section>
        <LegalHeading>Information stored on your device</LegalHeading>
        <p className="mt-3">
          If you use the light and dark control, the choice is saved in local storage under the key <code className="rounded bg-slate-100 px-1 py-0.5 text-sm dark:bg-slate-800">toolza-theme</code>. You can clear it from your browser settings. The site does not create an account and does not set a tracking cookie of its own.
        </p>
      </section>
      <section>
        <LegalHeading>Contact</LegalHeading>
        <p className="mt-3">
          The contact form validates what you typed and then opens your email application with a message addressed to <TextLink href={`mailto:${site.email}`}>{site.email}</TextLink>. The website does not transmit that form to a {site.name} database. What happens after your email app opens is between you and your email provider.
        </p>
      </section>
      <section>
        <LegalHeading>Advertising</LegalHeading>
        <p className="mt-3">
          Pages include reserved placement areas for advertising, such as a future Google AdSense unit. Those areas are empty unless an ad unit is actually inserted. If advertising is enabled later, the ad provider may use cookies or similar technologies under its own policy. Adding placement markup does not mean an application has been approved, and this site does not ask visitors to click advertisements.
        </p>
      </section>
      <section>
        <LegalHeading>Children</LegalHeading>
        <p className="mt-3">
          {site.name} is a general-purpose utility site. It is not directed at children, and it does not knowingly collect personal information from them.
        </p>
      </section>
      <section>
        <LegalHeading>Changes</LegalHeading>
        <p className="mt-3">
          If this policy changes, the updated date at the top of the page will change with it. Continued use of the site after an update means you are using the site under the revised policy.
        </p>
      </section>
      <section>
        <LegalHeading>Contact</LegalHeading>
        <p className="mt-3">
          Privacy questions can be sent to <TextLink href={`mailto:${site.email}`}>{site.email}</TextLink>.
        </p>
      </section>
    </LegalLayout>
  );
}
