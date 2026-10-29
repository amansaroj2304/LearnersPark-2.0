import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Learners Park",
  description:
    "How Learners Park collects, uses, and protects your information, including data received through Google Sign-In.",
};

const CONTACT_EMAIL = "ssblearnerspark@gmail.com";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 29, 2026">
      <section>
        <h2>1. Introduction</h2>
        <p>
          Learners Park (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
          operates this website and the related services that help aspirants
          prepare for the SSB and other defence selection procedures (the
          &quot;Service&quot;). This Privacy Policy explains what information we
          collect, how we use it, and the choices you have.
        </p>
        <p>
          By creating an account or otherwise using the Service, you agree to
          this Privacy Policy. If you do not agree, please do not use the
          Service.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>

        <h3>Information from Google Sign-In</h3>
        <p>
          We use Google Sign-In to authenticate you. When you sign in with
          Google, we receive your basic profile information, which typically
          includes your name, email address, profile picture, and a unique
          Google account identifier. We do not receive or store your Google
          password.
        </p>

        <h3>Information you generate while using the Service</h3>
        <ul>
          <li>Your answers, scores, and time taken on practice and mock tests.</li>
          <li>Your test history, progress, and ranking information.</li>
          <li>Any information you send to us, for example a support request.</li>
        </ul>

        <h3>Information collected automatically</h3>
        <p>
          We and our service providers may collect limited technical
          information such as your browser and device type, general location
          derived from your IP address, and the pages you visit. We use
          privacy-friendly, aggregate analytics to understand how the Service
          is used.
        </p>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>To create and manage your account and authenticate you.</li>
          <li>To deliver tests, save your attempts, and show your results and progress.</li>
          <li>To calculate rankings and compare your performance over time.</li>
          <li>To maintain, improve, and secure the Service.</li>
          <li>To respond to your questions and send important service notices.</li>
        </ul>
      </section>

      <section>
        <h2>4. Google User Data and Limited Use</h2>
        <p>
          Our use of information received from Google APIs adheres to the{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noreferrer"
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements. We use Google user data only
          to authenticate you and to operate and improve the Service. We do not
          sell Google user data, we do not use it for advertising, and we do
          not transfer it to others except as necessary to provide the Service,
          to comply with the law, or as part of a merger or acquisition.
        </p>
        <p>
          You can revoke our access to your Google account at any time at{" "}
          <a
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noreferrer"
          >
            myaccount.google.com/permissions
          </a>
          .
        </p>
      </section>

      <section>
        <h2>5. How We Share Information</h2>
        <p>
          We do not sell your personal information. We share information only
          with service providers that help us run the Service, and only as
          needed for them to perform their function:
        </p>
        <ul>
          <li>
            <strong>Supabase</strong> — authentication and database storage.
          </li>
          <li>
            <strong>Vercel</strong> — website hosting and aggregate analytics.
          </li>
          <li>
            <strong>Google</strong> — sign-in authentication.
          </li>
        </ul>
        <p>
          We may also disclose information if required by law or to protect the
          rights, safety, and security of our users and the Service.
        </p>
      </section>

      <section>
        <h2>6. Data Retention</h2>
        <p>
          We keep your account information and test data for as long as your
          account is active or as needed to provide the Service. You may ask us
          to delete your account and associated data at any time, and we will
          remove it unless we are required to keep it by law.
        </p>
      </section>

      <section>
        <h2>7. Data Security</h2>
        <p>
          We use reasonable technical and organisational measures to protect
          your information, including encryption in transit and access
          controls. However, no method of transmission or storage is completely
          secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2>8. Your Rights and Choices</h2>
        <ul>
          <li>You can access and update your basic profile through your Google account.</li>
          <li>You can withdraw consent by disconnecting Google and deleting your account.</li>
          <li>
            Depending on where you live, you may have additional rights to
            access, correct, delete, or restrict the use of your personal
            information (for example under the GDPR, India&apos;s DPDP Act, or
            the CCPA).
          </li>
          <li>To exercise any of these rights, contact us using the details below.</li>
        </ul>
      </section>

      <section>
        <h2>9. Children&apos;s Privacy</h2>
        <p>
          The Service is not intended for children under the age of 13 (or the
          minimum age required in your country). We do not knowingly collect
          personal information from such children. If you believe a child has
          provided us with personal information, please contact us and we will
          delete it.
        </p>
      </section>

      <section>
        <h2>10. International Data Transfers</h2>
        <p>
          Your information may be processed and stored in countries other than
          your own, including where our service providers operate. We take steps
          to ensure it is protected in line with this policy.
        </p>
      </section>

      <section>
        <h2>11. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. When we do, we
          will revise the &quot;Last updated&quot; date above. Your continued
          use of the Service after an update means you accept the revised
          policy.
        </p>
      </section>

      <section>
        <h2>12. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or your personal
          information, contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </LegalPage>
  );
}
