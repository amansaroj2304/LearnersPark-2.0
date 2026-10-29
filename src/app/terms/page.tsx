import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service | Learners Park",
  description:
    "The terms and conditions that govern your use of Learners Park and its SSB preparation services.",
};

const CONTACT_EMAIL = "ssblearnerspark@gmail.com";

export default function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service" updated="October 29, 2026">
      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and
          use of the Learners Park website and services (the
          &quot;Service&quot;). By creating an account or using the Service, you
          agree to be bound by these Terms. If you do not agree, please do not
          use the Service.
        </p>
      </section>

      <section>
        <h2>2. Eligibility</h2>
        <p>
          You must be at least 13 years old (or the minimum age required in your
          country) to use the Service. If you are a minor, you may use the
          Service only with the involvement of a parent or guardian who agrees
          to these Terms on your behalf.
        </p>
      </section>

      <section>
        <h2>3. Accounts and Sign-In</h2>
        <p>
          We use Google Sign-In to create and access your account. You are
          responsible for maintaining the security of your Google account and
          for all activity that occurs under your account. Please contact us
          immediately if you believe your account has been used without your
          permission.
        </p>
      </section>

      <section>
        <h2>4. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any unlawful or fraudulent purpose.</li>
          <li>Attempt to gain unauthorised access to the Service or other users&apos; accounts or data.</li>
          <li>Copy, scrape, resell, or redistribute test questions, content, or data without our permission.</li>
          <li>Interfere with or disrupt the Service or its infrastructure.</li>
          <li>Misrepresent your identity or impersonate any person or organisation.</li>
        </ul>
      </section>

      <section>
        <h2>5. Intellectual Property</h2>
        <p>
          The Service, including its test content, design, text, graphics, and
          software, is owned by Learners Park or its licensors and is protected
          by applicable intellectual property laws. We grant you a limited,
          personal, non-transferable licence to use the Service for your own
          preparation purposes only.
        </p>
      </section>

      <section>
        <h2>6. Test Content and Educational Disclaimer</h2>
        <p>
          The tests, questions, and study materials are provided for practice
          and educational purposes only. While we aim for accuracy and realism,
          they are not official SSB, NDA, CDS, AFCAT, or other defence
          selection materials. Your results do not guarantee or predict your
          performance in any actual selection process or examination.
        </p>
      </section>

      <section>
        <h2>7. Third-Party Services</h2>
        <p>
          The Service relies on third-party providers such as Google
          (sign-in), Supabase (authentication and storage), and Vercel
          (hosting and analytics). Your use of those services may also be
          subject to their own terms and policies, and we are not responsible
          for their acts or omissions.
        </p>
      </section>

      <section>
        <h2>8. No Warranty</h2>
        <p>
          The Service is provided &quot;as is&quot; and &quot;as
          available&quot;, without warranties of any kind, whether express or
          implied, including fitness for a particular purpose, accuracy, or
          uninterrupted availability. We do not warrant that the Service will be
          error-free or always available.
        </p>
      </section>

      <section>
        <h2>9. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Learners Park and its team
          will not be liable for any indirect, incidental, special,
          consequential, or punitive damages, or for any loss of data, results,
          or opportunities arising out of or related to your use of the Service.
        </p>
      </section>

      <section>
        <h2>10. Termination</h2>
        <p>
          We may suspend or terminate your access to the Service, at any time
          and without notice, if we believe you have violated these Terms or to
          protect the Service or other users. You may stop using the Service and
          request deletion of your account at any time.
        </p>
      </section>

      <section>
        <h2>11. Governing Law</h2>
        <p>
          These Terms are governed by the laws of India, without regard to its
          conflict of law rules. Any disputes will be subject to the exclusive
          jurisdiction of the courts of India.
        </p>
      </section>

      <section>
        <h2>12. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. When we do, we will
          revise the &quot;Last updated&quot; date above. Your continued use of
          the Service after an update means you accept the revised Terms.
        </p>
      </section>

      <section>
        <h2>13. Contact Us</h2>
        <p>
          If you have questions about these Terms, contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </LegalPage>
  );
}
