import { InfoCard, InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { absoluteUrl, siteConfig } from "@/lib/site";

export default function Privacy() {
  usePageMetadata({
    title: "Privacy Policy for Contact and Site Data",
    path: "/privacy",
    description:
      "Understand how Shank Strategy Ops handles contact form submissions, bot protection, hosting logs, and advertising-related disclosures.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "PrivacyPolicy",
      name: "Privacy Policy",
      url: absoluteUrl("/privacy"),
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
  });

  return (
    <InfoPageLayout
      eyebrow="PRIVACY"
      title="The site should collect as little as possible and make the rest obvious."
      lede="This page explains what information Shank Strategy Ops may receive through the site, why it is used, and what third parties are involved in delivering core functionality."
    >
      <InfoCard
        title="Information you provide directly"
        body={[
          "If you use the contact form, the site receives the information you submit, including your email address, any optional name you provide, and the message itself. That information is used only to review and respond to your inquiry.",
          "Contact submissions are not sold, rented, or repackaged as a mailing list product.",
        ]}
      />

      <InfoCard
        title="Services used to run the site"
        body={[
          "The contact workflow uses Resend for email delivery and Cloudflare Turnstile for bot protection. Those services may process technical information needed to complete their role, such as request metadata or bot-check results.",
          "The site host may also generate standard server logs used for reliability, debugging, and abuse prevention.",
        ]}
      />

      <InfoCard
        title="Cookies and advertising"
        body={[
          "The site is designed to function without requiring user accounts. If advertising is enabled through Google AdSense, Google may use cookies or similar technologies to serve and measure ads according to its own policies and user controls.",
          "Readers can learn more about how Google uses information from sites or apps in its services through Google's published privacy materials and ad settings.",
        ]}
      />

      <InfoCard
        title="How information is used"
        body={[
          "Information received through this site may be used to respond to inquiries, operate the contact workflow, prevent abuse, maintain security, and understand whether the site is functioning correctly.",
          "The site does not offer user accounts, private dashboards, or paid subscriber areas at this time, so there is no account-profile tracking model behind the scenes.",
        ]}
      />

      <InfoCard
        title="Questions or requests"
        body={[
          `Privacy questions can be sent to ${siteConfig.email}. If this policy changes materially, the page should be updated so the current version remains the public source of truth.`,
        ]}
      />
    </InfoPageLayout>
  );
}
