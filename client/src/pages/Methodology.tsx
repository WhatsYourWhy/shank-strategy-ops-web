import { InfoCard, InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { getStaticPageMetadata } from "@/lib/pageMetadata";

export default function Methodology() {
  usePageMetadata(getStaticPageMetadata("/methodology"));

  return (
    <InfoPageLayout
      eyebrow="METHODOLOGY"
      title="Every claim here either keeps its support attached or it gets cut."
      lede="This site is small enough to review by hand. That constraint drives everything else."
    >
      <InfoCard
        title="How essays get built"
        body={[
          "An essay starts because something broke, or a claim did not survive contact, or an experiment surprised me. Never from a keyword list.",
          "Draft, then attack the draft. The test: does a reader leave with a sharper model than they walked in with, or just a more comfortable one?",
        ]}
      />

      <InfoCard
        title="Evidence"
        body={[
          "Source quality over source count. When a number is approximate, it says so. When I don't know, it says that too.",
        ]}
        bullets={[
          "Direct observation",
          "Primary documents",
          "First-party data",
          "Secondary commentary, last and labeled as such",
        ]}
      />

      <section className="md:col-span-12 bg-brand-charcoal border border-brand-orange p-8">
        <p className="font-mono text-xs tracking-[0.24em] text-brand-offwhite/70">
          THE WORKED EXAMPLE
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold leading-tight">
          A constant that was never measured
        </h2>
        <div className="mt-5 max-w-3xl space-y-4 font-body text-base leading-relaxed text-brand-offwhite/80">
          <p>
            A file in my research vault stated a magnetization constant of 0.76
            at specific parameters, formatted like a measurement. It was never
            measured.
          </p>
          <p>
            It originated as a hypothetical target on line 290 of a working
            session. It failed to appear across the entire rest of that session.
            It got compressed into a reference document as a finding anyway. The
            result actually recorded at those parameters was 0.000390625.
          </p>
          <p>
            I published{" "}
            <a
              href="https://theedgeexplored.com/p/the-number-that-was-never-measured"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-orange underline-offset-4 hover:underline"
            >
              the full trace
            </a>
            , including the part where my own audit of it overreached,
            characterized the wrong model, and had to be corrected by a
            reviewer.
          </p>
        </div>
        <div className="mt-6 border-l-2 border-brand-orange pl-4">
          <p className="max-w-3xl font-body text-sm leading-relaxed text-brand-offwhite/75">
            That is what the evidence standard means here. Not a promise to be
            careful. A documented case of catching myself, and of being caught.
          </p>
        </div>
      </section>

      <InfoCard
        title="AI usage"
        body={[
          "I use AI heavily: drafting, comparison, editing, code. I don't publish unattended output.",
          "The failure mode I actually worry about isn't fabrication. It's compression. A long, messy exploration gets summarized. The summary keeps what's short and confident and drops what's long and equivocal. A tentative number arrives downstream as a finding with no trace of how tentative it was. Nobody lies at any step.",
          "That happened to me. It is the case documented above.",
        ]}
        note="So review here is specifically about that: checking whether a claim in a finished piece still has its support attached, or whether the support got summarized away."
      />

      <InfoCard
        title="Corrections"
        body={[
          "Errors get fixed on the page, with the correction visible rather than quietly patched over.",
          "Outdated pages get updated, redirected, or removed. Nothing sits with a stale date on it pretending to be current.",
        ]}
      />
    </InfoPageLayout>
  );
}
