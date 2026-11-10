import { LegalHeading, LegalLayout } from './About';
import { TextLink } from '../components/ui';

export default function Disclaimer() {
  return (
    <LegalLayout
      title="Disclaimer"
      description="TOOLZA disclaimer. Tool results vary by browser and file, and the site does not provide professional advice."
    >
      <p>
        TOOLZA is a utility website. Read this page together with the <TextLink to="/terms">Terms of Service</TextLink> and <TextLink to="/privacy">Privacy Policy</TextLink>.
      </p>
      <section>
        <LegalHeading>Results vary</LegalHeading>
        <p className="mt-3">
          Output depends on your browser, the file you provide, and the settings you choose. A compressed image can look different from the original. A PDF page exported as JPG is a picture of that page, not an editable document. Text counts follow the rules described on the word counter page and can differ from another editor.
        </p>
      </section>
      <section>
        <LegalHeading>Not professional advice</LegalHeading>
        <p className="mt-3">
          Nothing on this site is legal, financial, security, medical, or other professional advice. The password generator is a convenience tool. You decide whether a password is appropriate for the account you want to protect, and you are responsible for storing it safely.
        </p>
      </section>
      <section>
        <LegalHeading>Advertising</LegalHeading>
        <p className="mt-3">
          Reserved ad areas are not advertisements. If third-party ads are added later, their content comes from the ad provider. TOOLZA does not promise that an ad network will approve the site, and it does not ask you to click ads.
        </p>
      </section>
      <section>
        <LegalHeading>Your files</LegalHeading>
        <p className="mt-3">
          Keep a copy of anything important before you compress, resize, or convert it. The original file on your device is not changed by these tools. The download is a new file.
        </p>
      </section>
    </LegalLayout>
  );
}
