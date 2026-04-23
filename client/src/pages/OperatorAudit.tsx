/*
 * OPERATOR AUDIT — $500 service page.
 * Design: matches Swiss Brutalist pattern from Home/Products/Methodology.
 */

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import BlogNavigation from "@/components/blog/BlogNavigation";
import SiteFooter from "@/components/layout/SiteFooter";
import { OperatorAuditIntakeForm } from "@/components/OperatorAuditIntakeForm";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { getStaticPageMetadata } from "@/lib/pageMetadata";

const whatYouGet = [
  "a close read of your current operating reality",
  "a written diagnosis of the main sources of drag, ambiguity, or breakdown",
  "a clear statement of the structural issues underneath the symptoms",
  "practical next-step recommendations",
];

const whoItsFor = [
  "owners, operators, and managers carrying too much coordination load",
  "teams that are functioning, but with more friction than they should have",
  "leaders who can feel the drag but have not yet named the pattern clearly",
  "businesses where handoff, follow-through, prioritization, or review quality are slipping",
];

const auditLooksAt = [
  "handoffs",
  "task flow",
  "meeting and review structure",
  "role clarity",
  "communication loops",
  "escalation paths",
  "accountability drift",
  "recurring operational friction",
  "where work gets stuck between discussion and completion",
];

const deliverable = [
  "the core diagnosis",
  "the main points of drag or failure",
  "what is likely costing the most attention, clarity, or trust",
  "a prioritized set of next moves",
];

function scrollToIntake() {
  trackEvent(analyticsEvents.operatorAuditCtaClicked, { target: "intake" });
  const el = document.getElementById("intake");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function Hero() {
  return (
    <section className="pt-32 pb-20 bg-brand-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 border border-brand-orange/10 rotate-45 translate-x-32 -translate-y-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 border border-brand-offwhite/5 rotate-12 -translate-x-48 translate-y-48 pointer-events-none" />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-brand-offwhite/80 text-sm tracking-widest">
            SERVICE — $500
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mt-6 leading-[0.9] tracking-tight max-w-5xl"
        >
          THE $500 <span className="text-brand-orange">OPERATOR AUDIT</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-body text-xl md:text-2xl text-brand-offwhite/75 mt-8 max-w-3xl leading-relaxed"
        >
          A focused outside read on where your operation is losing clarity,
          time, and trust.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 max-w-3xl space-y-5 font-body text-brand-offwhite/80 leading-relaxed"
        >
          <p>Most operational problems do not start with effort.</p>
          <p>They start with drift.</p>
          <p>
            Handoffs become unclear. Ownership gets fuzzy. Reviews turn into
            recaps. Important work stays in motion without really moving.
          </p>
          <p>
            The Operator Audit is a focused diagnostic of how your operation is
            actually functioning.
          </p>
          <p>
            It is a close read of where work is getting blurred, delayed, or
            absorbed by the system around it — and a written set of
            recommendations for what to simplify, clarify, or change next.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <button
            type="button"
            onClick={scrollToIntake}
            className="inline-flex items-center gap-3 font-mono text-sm bg-brand-orange text-brand-black px-8 py-4 hover:bg-brand-offwhite transition-colors"
          >
            START THE AUDIT
            <ArrowRight className="h-4 w-4" />
          </button>
          <a
            href="#what-you-get"
            className="inline-flex items-center gap-3 font-mono text-sm border border-brand-offwhite/30 text-brand-offwhite px-8 py-4 hover:border-brand-orange transition-colors"
          >
            SEE WHAT&apos;S INCLUDED
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-14 h-px bg-brand-orange origin-left"
        />
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-10">
      <p className="font-mono text-xs tracking-[0.28em] text-brand-offwhite/70">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-3xl md:text-5xl font-bold leading-tight">
        {title}
      </h2>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-4 font-body text-base md:text-lg leading-relaxed text-brand-offwhite/85"
        >
          <span className="mt-2 h-2 w-2 flex-shrink-0 bg-brand-orange" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function OperatorAudit() {
  usePageMetadata(getStaticPageMetadata("/operator-audit"));

  return (
    <div className="min-h-screen bg-brand-black text-brand-offwhite">
      <BlogNavigation />

      <main id="main-content" tabIndex={-1}>
        <Hero />

        {/* What you get */}
        <section id="what-you-get" className="scroll-mt-28 py-20 border-b border-border">
          <div className="container max-w-4xl">
            <SectionHeading eyebrow="01 / WHAT YOU GET" title="What you get" />
            <p className="font-body text-lg text-brand-offwhite/80 leading-relaxed mb-8">
              For <strong className="text-brand-offwhite">$500</strong>, you get:
            </p>
            <BulletList items={whatYouGet} />
            <div className="mt-10 border-l-4 border-brand-orange pl-6 space-y-2">
              <p className="font-body text-lg text-brand-offwhite/85">
                The point is not volume.
              </p>
              <p className="font-body text-lg text-brand-offwhite">
                The point is clarity you can act on.
              </p>
            </div>
          </div>
        </section>

        {/* Who this is for */}
        <section className="py-20 border-b border-border">
          <div className="container max-w-4xl">
            <SectionHeading eyebrow="02 / AUDIENCE" title="Who this is for" />
            <BulletList items={whoItsFor} />
            <div className="mt-10 space-y-4 font-body text-brand-offwhite/80 leading-relaxed">
              <p>
                If you already know exactly what is wrong and only need
                implementation, this may not be the first step.
              </p>
              <p>
                If you know something is off but do not yet have a clean
                diagnosis, this is the right kind of starting point.
              </p>
            </div>
          </div>
        </section>

        {/* What the audit looks at */}
        <section className="py-20 border-b border-border bg-brand-charcoal">
          <div className="container max-w-4xl">
            <SectionHeading
              eyebrow="03 / SCOPE"
              title="What the audit looks at"
            />
            <p className="font-body text-lg text-brand-offwhite/80 leading-relaxed mb-8">
              Depending on the situation, the audit may look at:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {auditLooksAt.map((item) => (
                <div
                  key={item}
                  className="border border-brand-offwhite/15 bg-brand-black px-5 py-4 font-body text-brand-offwhite/85"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-10 space-y-2 font-body text-brand-offwhite/85 leading-relaxed">
              <p>This is not about blame.</p>
              <p>
                It is about identifying where the system is making good work
                harder than it needs to be.
              </p>
            </div>
          </div>
        </section>

        {/* What makes this different */}
        <section className="py-20 border-b border-border">
          <div className="container max-w-4xl">
            <SectionHeading
              eyebrow="04 / APPROACH"
              title="What makes this different"
            />
            <div className="space-y-5 font-body text-lg text-brand-offwhite/85 leading-relaxed">
              <p>Most operational advice arrives too early at solutions.</p>
              <p>This starts with structure.</p>
              <p>
                The Operator Audit begins with what is actually happening in
                your environment and works toward the pattern underneath it.
                The recommendations come out of the real shape of the problem,
                not from a borrowed framework.
              </p>
            </div>
          </div>
        </section>

        {/* Deliverable */}
        <section className="py-20 border-b border-border bg-brand-charcoal">
          <div className="container max-w-4xl">
            <SectionHeading
              eyebrow="05 / DELIVERABLE"
              title="What you receive"
            />
            <p className="font-body text-lg text-brand-offwhite/80 leading-relaxed mb-8">
              You receive a written audit with:
            </p>
            <BulletList items={deliverable} />
            <p className="mt-10 font-body text-brand-offwhite/80 leading-relaxed">
              If useful, the audit can also point toward what should be
              simplified, clarified, removed, delegated differently, or turned
              into a better operating rhythm.
            </p>
          </div>
        </section>

        {/* Turnaround */}
        <section className="py-20 border-b border-border">
          <div className="container max-w-4xl">
            <SectionHeading
              eyebrow="06 / TURNAROUND"
              title="Within 5 business days"
            />
            <div className="space-y-4 font-body text-lg text-brand-offwhite/85 leading-relaxed">
              <p>
                Standard turnaround:{" "}
                <strong className="text-brand-offwhite">
                  within 5 business days
                </strong>{" "}
                of receiving what is needed.
              </p>
              <p>
                If a faster turnaround is needed, that can be discussed before
                purchase.
              </p>
            </div>
          </div>
        </section>

        {/* What I need from you */}
        <section className="py-20 border-b border-border bg-brand-charcoal">
          <div className="container max-w-4xl">
            <SectionHeading
              eyebrow="07 / INPUTS"
              title="What I need from you"
            />
            <div className="space-y-4 font-body text-brand-offwhite/85 leading-relaxed">
              <p>You do not need a perfectly documented operation.</p>
              <p>
                You do need enough real material for me to see how work
                actually moves.
              </p>
              <p>That may include:</p>
            </div>
            <ul className="mt-6 space-y-3">
              {[
                "a short description of the operation",
                "what feels off right now",
                "examples of recurring friction",
                "current SOPs, checklists, task boards, handoff notes, or review docs",
                "anything else that shows how work really flows",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-4 font-body text-brand-offwhite/85"
                >
                  <span className="mt-2 h-2 w-2 flex-shrink-0 bg-brand-orange" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 font-body text-brand-offwhite/75">
              Messy but real is better than polished but unrepresentative. If
              you are unsure what to send, the intake below will guide that.
            </p>
          </div>
        </section>

        {/* Intake / CTA */}
        <section
          id="intake"
          className="scroll-mt-28 py-20 bg-brand-black border-b border-border"
        >
          <div className="container max-w-3xl">
            <div className="mb-10">
              <p className="font-mono text-xs tracking-[0.28em] text-brand-offwhite/70">
                08 / READY TO START
              </p>
              <h2 className="mt-4 font-display text-3xl md:text-5xl font-bold leading-tight">
                Start the audit.
              </h2>
              <div className="mt-6 space-y-3 font-body text-brand-offwhite/80 leading-relaxed">
                <p>
                  If your operation feels heavier than it should, the issue is
                  often structural before it is personal.
                </p>
                <p>
                  Fill out the intake below. You&apos;ll get a reply within 1–2
                  business days confirming scope, payment, and how to send
                  supporting materials.
                </p>
                <p className="font-mono text-sm tracking-widest text-brand-orange mt-6">
                  PRICE: $500
                </p>
              </div>
            </div>

            <OperatorAuditIntakeForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
