import { Link } from "wouter";
import { InfoCard, InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { getStaticPageMetadata } from "@/lib/pageMetadata";

export default function About() {
  usePageMetadata(getStaticPageMetadata("/about"));

  return (
    <InfoPageLayout
      eyebrow="ABOUT"
      title="The founder title is the umbrella. Forward-deployed engineer is the work."
      lede="What the practice does, what this site is for, and how to check whether the standard behind it is real."
    >
      <section className="md:col-span-12 bg-brand-charcoal border border-brand-orange p-8">
        <p className="font-mono text-xs tracking-[0.24em] text-brand-offwhite/70">
          WHO RUNS THIS
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold leading-tight">
          Justin Shank
        </h2>
        <p className="mt-2 font-display text-xl font-bold text-brand-orange">
          Founder, Shank Strategy Ops
        </p>
        <p className="mt-1 font-mono text-sm tracking-wide text-brand-offwhite/80">
          Forward-Deployed AI Systems Engineer
        </p>
        <p className="mt-5 max-w-3xl font-body text-base leading-relaxed text-brand-offwhite/80">
          I show up inside a business that already runs, find the place where
          work stalls, and build the thing that removes it.
        </p>
      </section>

      <section className="md:col-span-6 bg-brand-charcoal border border-brand-offwhite/10 p-8">
        <h2 className="font-display text-2xl font-bold">What the practice does</h2>
        <div className="mt-5 space-y-4">
          <p className="font-body text-base leading-relaxed text-brand-offwhite/80">
            Most operational problems are not effort problems. They are
            ownership problems in an effort costume: a decision waiting on
            someone who does not know they are the blocker, a handoff where
            "done" means two different things to the two people involved, an AI
            process nobody owns that has been quietly wrong for a month.
          </p>
          <p className="font-body text-base leading-relaxed text-brand-offwhite/80">
            I diagnose that, then build what fixes it. Local-first where the
            constraints allow. Auditable either way.
          </p>
        </div>
        <div className="mt-6 border-l-2 border-brand-orange pl-4">
          <p className="font-body text-sm leading-relaxed text-brand-offwhite/75">
            The entry point is the{" "}
            <Link
              href="/operator-audit"
              className="text-brand-orange underline-offset-4 hover:underline"
            >
              $500 Operator Audit
            </Link>
            . Bounded scope, fixed price, no retainer conversation bolted onto
            the end of it.
          </p>
        </div>
      </section>

      <InfoCard
        title="What this site is"
        body={[
          "Two jobs. It explains how I work, so you can decide whether the approach fits before you talk to me.",
          "And it is where the writing lives: essays, field notes, tool writeups. This is not a content strategy. The essays exist because I keep hitting problems that need thinking through, and writing is how I find out what I actually believe about them.",
        ]}
        note="The archive is small on purpose."
      />

      <InfoCard
        title="Who it's for"
        body={[
          "Leaders and operators dealing with messy execution. People who care whether a system earns its keep, and who would rather see the tradeoffs than be reassured.",
          "If you want frameworks that sound good in a deck, this is not that.",
        ]}
      />

      <section className="md:col-span-6 bg-brand-offwhite text-brand-black p-8 border border-brand-orange">
        <p className="font-mono text-xs tracking-[0.24em] text-brand-black/72">
          HOW TO CHECK ME
        </p>
        <h2 className="mt-4 font-display text-2xl font-bold">
          Not "we're careful." Here's the receipt.
        </h2>
        <div className="mt-5 space-y-4 font-body text-base leading-relaxed text-brand-black/78">
          <p>
            The{" "}
            <Link
              href="/methodology"
              className="text-brand-orange underline-offset-4 hover:underline"
            >
              methodology
            </Link>{" "}
            and{" "}
            <Link
              href="/editorial-policy"
              className="text-brand-orange underline-offset-4 hover:underline"
            >
              editorial policy
            </Link>{" "}
            pages document how work here gets made and corrected. They are not
            boilerplate. They name the specific case where I got something
            wrong.
          </p>
          <p>
            The fastest way to judge the standard is to read{" "}
            <a
              href="https://theedgeexplored.com/p/the-number-that-was-never-measured"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-orange underline-offset-4 hover:underline"
            >
              The Number That Was Never Measured
            </a>
            , where I trace a confident-looking constant in my own research
            notes back to the line where it was invented, then document the
            error I made while auditing it.
          </p>
        </div>
      </section>
    </InfoPageLayout>
  );
}
