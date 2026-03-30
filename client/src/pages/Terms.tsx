import { InfoCard, InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { getStaticPageMetadata } from "@/lib/pageMetadata";
import { siteConfig } from "@/lib/site";

export default function Terms() {
  usePageMetadata(getStaticPageMetadata("/terms"));

  return (
    <InfoPageLayout
      eyebrow="TERMS"
      title="Useful information should also be explicit about its boundaries."
      lede="These terms describe the basic conditions for using the website, reading its content, and contacting Shank Strategy Ops through the public site."
    >
      <InfoCard
        title="Informational use"
        body={[
          "Content on this site is provided for general informational purposes. Reading an article, downloading a tool, or submitting a contact form does not by itself create a client, fiduciary, or advisory relationship.",
          "Strategy, operational, and technical content should be evaluated in the context of your own organization before being treated as a final recommendation.",
        ]}
      />

      <InfoCard
        title="Intellectual property"
        body={[
          "Unless stated otherwise, the text, design, and original materials on this site belong to Shank Strategy Ops. Open-source tools linked from the site may be governed by their own repository licenses, which should be reviewed directly before use.",
          "Quoting short portions with attribution is generally acceptable. Republishing full pages or presenting the site's work as your own is not.",
        ]}
      />

      <InfoCard
        title="External links and third parties"
        body={[
          "This site may link to external platforms, repositories, and public references for context. Those third-party sites operate under their own terms and privacy practices.",
          "A link is provided for reader convenience, not as a blanket endorsement of every claim or policy on the destination site.",
        ]}
      />

      <InfoCard
        title="Site availability"
        body={[
          "The site may change, be updated, or remove pages over time. Broken links, outdated pages, or product changes should be corrected when discovered, but uninterrupted availability is not guaranteed.",
          "If you notice a material issue, the best route is to report it through the published contact address.",
        ]}
      />

      <InfoCard
        title="Contact"
        body={[
          `Questions about these terms can be sent to ${siteConfig.email}. Continued use of the site means you accept the current published version of these terms.`,
        ]}
      />
    </InfoPageLayout>
  );
}
