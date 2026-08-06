import { InfoCard, InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { getStaticPageMetadata } from "@/lib/pageMetadata";

export default function EditorialPolicy() {
  usePageMetadata(getStaticPageMetadata("/editorial-policy"));

  return (
    <InfoPageLayout
      eyebrow="EDITORIAL POLICY"
      title="Original work, one name on it, corrected in public."
      lede="The standards should be legible before anyone has to ask. If a page doesn't give a reader something they can use, it shouldn't ship."
    >
      <InfoCard
        title="Originality"
        body={[
          "Pages here should be original in framing, argument, or interpretation.",
          "Reposting a public idea without adding evidence or a clearer model doesn't clear the bar.",
        ]}
      />

      <section className="md:col-span-6 bg-brand-charcoal border border-brand-offwhite/10 p-8">
        <h2 className="font-display text-2xl font-bold">
          Where things get published
        </h2>
        <div className="mt-5 space-y-4">
          <p className="font-body text-base leading-relaxed text-brand-offwhite/80">
            I run two properties and they do different jobs.
          </p>
          <p className="font-body text-base leading-relaxed text-brand-offwhite/80">
            <span className="font-bold text-brand-offwhite">This site</span>{" "}
            carries operations, engineering, and AI-implementation work: the
            writing that comes out of client problems and tool building.
          </p>
          <p className="font-body text-base leading-relaxed text-brand-offwhite/80">
            <a
              href="https://theedgeexplored.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-orange underline-offset-4 hover:underline"
            >
              The Edge Explored
            </a>{" "}
            carries the wider questions: epistemics, what systems claim versus
            what they do, the human side of building any of this.
          </p>
        </div>
        <div className="mt-6 border-l-2 border-brand-orange pl-4">
          <p className="font-body text-sm leading-relaxed text-brand-offwhite/75">
            Some pieces belong to both. When that happens the site edition is
            the canonical one and links are pointed here.
          </p>
        </div>
      </section>

      <InfoCard
        title="Accountability"
        body={[
          "Published under Shank Strategy Ops, written by me, Justin Shank.",
          "One name, reachable, correctable.",
        ]}
      />

      <InfoCard
        title="Quality bar"
        body={[
          "A page should answer a real question, document a real method, or explain a real tool.",
          "Some pages will be short. None should be filler.",
        ]}
        bullets={[
          "No scraped content",
          "No stitched summaries",
          "No near-duplicate pages built to catch search traffic",
        ]}
      />

      <InfoCard
        title="Disclosure"
        body={[
          "If a page discusses a tool or service I offer, that's obvious from context.",
          "I'm not dressing up a pitch as neutral analysis.",
        ]}
      />

      <InfoCard
        title="Corrections"
        body={[
          "Spot something wrong: the contact link is in the footer.",
          "Corrections get made on the page, not buried in a changelog nobody reads.",
        ]}
      />
    </InfoPageLayout>
  );
}
