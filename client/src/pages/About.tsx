import { Link } from "wouter";
import { InfoCard, InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { getStaticPageMetadata } from "@/lib/pageMetadata";

export default function About() {
  usePageMetadata({
    title: "About the Practice",
    path: "/about",
    description:
      "Learn how Shank Strategy Ops combines strategic operations consulting, original essays, and working tools to help leaders repair execution drift.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About Shank Strategy Ops",
      url: absoluteUrl("/about"),
      description:
        "About page for Shank Strategy Ops covering editorial focus, service model, and audience.",
      isPartOf: absoluteUrl("/"),
    },
  });

  return (
    <InfoPageLayout
      eyebrow="WHO WE ARE"
      title="Strategic operations consulting for leaders repairing execution drift."
      lede="Shank Strategy Ops combines diagnostic consulting, operator notes, and working tools to help leadership teams clarify ownership, rebuild operating cadences, and leave the system stronger than they found it."
    >
      <InfoCard
        title="What this site is for"
        body={[
          "This website has two jobs. First, it explains how Shank Strategy Ops approaches strategy execution and operational excellence. Second, it serves as the primary home for original essays, field notes, and product writeups that grow out of real operating problems.",
          "The goal is not volume. The goal is usefulness. Every page here is meant to help a reader understand a method, pressure-test an idea, or evaluate whether a tool or engagement model is actually fit for use.",
        ]}
        bullets={[
          "Long-form essays on strategy, operations, and AI systems",
          "Detailed writeups for open-source tools built around real constraints",
          "Practical operating principles for leaders who need accountable execution",
        ]}
      />

      <InfoCard
        title="Who this is for"
        body={[
          "The intended audience is leaders, operators, and technical teams dealing with messy execution: organizations that need clearer decision rights, more predictable systems, and less dependence on dashboards that look busy but do not move outcomes.",
          "If you care about auditability, operational leverage, and whether a system earns its keep, this site is for you. If you are looking for listicles, content farms, or generic advice optimized for pageviews, it is not.",
        ]}
      />

      <InfoCard
        title="How the work fits together"
        body={[
          "The consulting practice, the essays, and the tools are connected. The essays explain the underlying operating philosophy. The tools show how those ideas are implemented in code. The consulting work applies both inside real organizations with bounded scopes and explicit accountability.",
          "That matters because this is not a publisher built on scraped summaries or filler pages. The content exists because there is an actual practice behind it.",
        ]}
        note="Readers should expect the site to favor depth over frequency and explicit tradeoffs over vague inspiration."
      />

      <section className="md:col-span-6 bg-brand-offwhite text-brand-black p-8 border border-brand-orange">
        <p className="font-mono text-xs tracking-[0.24em] text-brand-black/72">TRANSPARENCY</p>
        <h2 className="mt-4 font-display text-2xl font-bold">How we keep the bar high</h2>
        <div className="mt-5 space-y-4 font-body text-base leading-relaxed text-brand-black/78">
          <p>
            The editorial standards for the site are documented publicly. That is deliberate.
            Reviewers, readers, and potential clients should be able to see how content is
            produced, what gets cited, how corrections work, and how privacy is handled.
          </p>
          <p>
            If you want the operating details, start with the{" "}
            <Link href="/methodology" className="text-brand-orange underline-offset-4 hover:underline">
              methodology page
            </Link>{" "}
            and the{" "}
            <Link
              href="/editorial-policy"
              className="text-brand-orange underline-offset-4 hover:underline"
            >
              editorial policy
            </Link>
            .
          </p>
        </div>
      </section>
    </InfoPageLayout>
  );
}
