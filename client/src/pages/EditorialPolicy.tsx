import { InfoCard, InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { absoluteUrl } from "@/lib/site";

export default function EditorialPolicy() {
  usePageMetadata({
    title: "Editorial Standards and Corrections",
    path: "/editorial-policy",
    description:
      "Review the editorial standards Shank Strategy Ops uses for originality, disclosures, corrections, authorship, and publishing quality.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Editorial Policy",
      url: absoluteUrl("/editorial-policy"),
      description:
        "Editorial policy for Shank Strategy Ops covering originality, disclosures, and correction practices.",
    },
  });

  return (
    <InfoPageLayout
      eyebrow="EDITORIAL STANDARDS"
      title="This site publishes original, reviewable work with named accountability."
      lede="The point of an editorial policy is to make the standards legible before anyone has to ask. If a page does not add clear value to a reader, it should not be published."
    >
      <InfoCard
        title="Originality"
        body={[
          "Pages on this site should be substantially original in framing, argument, or practical interpretation. Republishing public ideas without adding perspective, evidence, or clearer models is not enough.",
          "Short external posts may point to a related idea, but the website edition should stand on its own as the more complete and more useful version.",
        ]}
      />

      <InfoCard
        title="Authorship and accountability"
        body={[
          "Content is published under Shank Strategy Ops and is accountable to the business behind the site. That means readers can identify the publisher, contact the site directly, and evaluate whether the work aligns with the practice and tools being described.",
          "Anonymous filler and page-template sprawl are explicitly out of bounds.",
        ]}
      />

      <InfoCard
        title="Quality threshold"
        body={[
          "A page should answer a real question, explain a real method, or document a real tool. Pages created only to target keywords, support ad inventory, or mimic search demand without adding substance should not ship.",
          "The minimum quality bar is usefulness, not word count. Some pages will be short. None should be empty.",
        ]}
        bullets={[
          "No scraped pages",
          "No stitched summaries from third-party sources",
          "No mass-produced near-duplicates with trivial wording changes",
        ]}
      />

      <InfoCard
        title="Disclosures and promotions"
        body={[
          "If a page discusses a tool, product, or service offered by Shank Strategy Ops, that relationship should be obvious from context. Promotional intent should not be disguised as neutral reporting.",
          "If advertising is enabled on the site, ads should remain secondary to the content and should not interfere with readability or mislead users about what is editorial versus sponsored.",
        ]}
      />

      <InfoCard
        title="Corrections and removals"
        body={[
          "Pages that become misleading, outdated, or materially incomplete should be corrected, consolidated, or removed. A smaller trustworthy archive is better than a larger decaying one.",
          "If a reader spots an issue, editorial questions can be sent through the public contact channel listed in the footer.",
        ]}
      />
    </InfoPageLayout>
  );
}
