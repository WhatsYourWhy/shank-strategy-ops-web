import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/ContactForm";
import type { BlogPost } from "@/data/blogPosts";
import {
  homeDeliverables,
  homeEngagementPhases,
  homeHiringReasons,
  homeModels,
  homePrinciples,
  homeProofStrip,
  homePublishingStandards,
} from "@/data/homeContent";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";

interface ScrollProps {
  scrollToSection: (id: string) => void;
}

export function HomeHeroSection({ scrollToSection }: ScrollProps) {
  return (
    <section className="relative overflow-hidden bg-brand-black pt-32">
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg.webp"
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          className="h-full w-full object-cover opacity-28"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,98,43,0.35),transparent_38%),linear-gradient(180deg,rgba(10,10,10,0.2),rgba(10,10,10,0.9))]" />
      </div>

      <div className="container relative z-10 pb-16">
        <div className="grid gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="max-w-4xl">
            <motion.p
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="font-mono text-sm tracking-[0.28em] text-brand-orange"
            >
              STRATEGY EXECUTION AND OPERATIONAL REPAIR
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mt-6 font-display text-5xl font-bold leading-[0.88] tracking-tight md:text-7xl xl:text-8xl"
            >
              WHEN EXECUTION
              <br />
              <span className="text-brand-orange">STARTS TO DRIFT,</span>
              <br />
              WE REBUILD THE SYSTEM.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mt-8 max-w-2xl font-body text-xl leading-relaxed text-brand-offwhite/76 md:text-2xl"
            >
              Shank Strategy Ops steps into messy, high-stakes work, clarifies ownership,
              stabilizes the operating rhythm, and leaves the team stronger than it was
              when we arrived.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Button
                onClick={() => {
                  trackEvent(analyticsEvents.heroCtaClicked, { source: "home-hero-primary" });
                  scrollToSection("contact");
                }}
                className="rounded-none bg-brand-orange px-8 py-6 font-mono text-sm text-brand-black hover:bg-brand-offwhite"
              >
                START A CONVERSATION
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                onClick={() => scrollToSection("engagement")}
                variant="outline"
                className="rounded-none border-brand-offwhite text-brand-offwhite hover:bg-brand-offwhite hover:text-brand-black"
              >
                SEE THE ENGAGEMENT MODEL
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="border border-brand-offwhite/10 bg-brand-black/65 p-6 backdrop-blur-sm"
          >
            <p className="font-mono text-xs tracking-[0.28em] text-brand-orange">WHY CLIENTS CALL</p>
            <div className="mt-5 space-y-5">
              {[
                "A strategy exists, but no one can make the work move cleanly.",
                "Teams are busy, but the system is producing noise instead of leverage.",
                "Leadership needs a bounded operator, not another permanent dependency.",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <div className="mt-1.5 h-2 w-2 flex-shrink-0 bg-brand-orange" />
                  <p className="font-body text-base leading-relaxed text-brand-offwhite/74">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function HomeProofStrip() {
  return (
    <section className="bg-brand-black pb-16">
      <div className="container">
        <div className="grid gap-px overflow-hidden border border-brand-offwhite/10 bg-brand-offwhite/10 md:grid-cols-2 xl:grid-cols-4">
          {homeProofStrip.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="bg-brand-charcoal p-6"
            >
              <p className="font-mono text-xs tracking-[0.24em] text-brand-orange">{item.label}</p>
              <p className="mt-4 font-body text-base leading-relaxed text-brand-offwhite/78">
                {item.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeOutcomesSection() {
  return (
    <section className="bg-brand-offwhite py-24 text-brand-black">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="font-mono text-sm tracking-[0.28em] text-brand-orange">WHY CLIENTS HIRE US</p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-tight md:text-6xl">
              CLEARER OPERATING
              <br />
              CONTROL, NOT MORE
              <br />
              MANAGEMENT THEATER.
            </h2>
            <p className="mt-6 max-w-xl font-body text-xl leading-relaxed text-brand-black/74">
              This practice is designed for organizations that need a senior operator to diagnose
              the real constraint, install a workable system, and leave behind something the team
              can actually keep running.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-3">
              {homeHiringReasons.map((reason) => (
                <article key={reason.title} className="border-4 border-brand-black bg-white p-6">
                  <h3 className="font-display text-2xl font-bold">{reason.title}</h3>
                  <p className="mt-4 font-body text-base leading-relaxed text-brand-black/72">
                    {reason.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="border border-brand-black/10 bg-brand-black p-8 text-brand-offwhite">
              <p className="font-mono text-xs tracking-[0.28em] text-brand-orange">
                SAMPLE OUTPUTS
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {homeDeliverables.map((deliverable) => (
                  <div key={deliverable} className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" />
                    <p className="font-body text-sm leading-relaxed text-brand-offwhite/76">
                      {deliverable}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePrinciplesSection() {
  return (
    <section id="principles" className="bg-brand-charcoal py-24">
      <div className="container">
        <div className="max-w-3xl">
          <p className="font-mono text-sm tracking-[0.28em] text-brand-orange">ENGAGEMENT PRINCIPLES</p>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-6xl">
            THE RULES THAT KEEP THE
            <br />
            WORK HONEST.
          </h2>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden border border-brand-offwhite/10 bg-brand-offwhite/10 md:grid-cols-2 xl:grid-cols-3">
          {homePrinciples.map((principle, index) => (
            <motion.article
              key={principle.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="bg-brand-black p-8"
            >
              <p className="font-mono text-4xl font-bold text-brand-orange">{principle.number}</p>
              <h3 className="mt-5 font-display text-2xl font-bold">{principle.title}</h3>
              <p className="mt-4 font-body text-base leading-relaxed text-brand-offwhite/72">
                {principle.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeEngagementSection() {
  return (
    <section id="engagement" className="relative overflow-hidden bg-brand-black py-24">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(212,98,43,0.08),transparent_35%),linear-gradient(0deg,rgba(245,242,235,0.02),rgba(245,242,235,0.02))]" />
      <div className="container relative">
        <div className="max-w-3xl">
          <p className="font-mono text-sm tracking-[0.28em] text-brand-orange">STANDARD ENGAGEMENT FLOW</p>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-6xl">
            DIAGNOSE. COMMIT.
            <br />
            STABILIZE. EXIT.
          </h2>
          <p className="mt-6 font-body text-xl leading-relaxed text-brand-offwhite/72">
            The engagement model is meant to be legible to both sides. Clarity about readiness,
            authority, and exit conditions is part of the service, not paperwork around it.
          </p>
        </div>

        <div className="mt-12 grid gap-5">
          {homeEngagementPhases.map((phase, index) => (
            <motion.article
              key={phase.phase}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="grid gap-5 border border-brand-offwhite/10 bg-brand-charcoal p-6 md:grid-cols-[120px_1fr_1.2fr]"
            >
              <p className="font-mono text-4xl font-bold text-brand-orange">{phase.phase}</p>
              <div>
                <h3 className="font-display text-2xl font-bold">{phase.title}</h3>
                <p className="mt-3 font-body text-base leading-relaxed text-brand-offwhite/76">
                  {phase.purpose}
                </p>
              </div>
              <p className="font-body text-base leading-relaxed text-brand-offwhite/68">
                {phase.detail}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeModelsSection() {
  return (
    <section id="models" className="bg-brand-black py-24">
      <div className="container">
        <div className="max-w-3xl">
          <p className="font-mono text-sm tracking-[0.28em] text-brand-orange">ENGAGEMENT MODELS</p>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-6xl">
            STRUCTURE SHOULD MATCH
            <br />
            THE PROBLEM.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {homeModels.map((model, index) => (
            <motion.article
              key={model.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="border border-brand-offwhite/10 bg-brand-charcoal p-8"
            >
              <h3 className="font-display text-3xl font-bold text-brand-offwhite">{model.title}</h3>
              <p className="mt-4 font-body text-base leading-relaxed text-brand-offwhite/74">
                <span className="text-brand-orange">Use when:</span> {model.useWhen}
              </p>
              <div className="mt-6 space-y-3">
                {model.typicalUses.map((item) => (
                  <div key={item} className="flex gap-3">
                    <div className="mt-1.5 h-2 w-2 flex-shrink-0 bg-brand-orange" />
                    <p className="font-body text-sm leading-relaxed text-brand-offwhite/70">{item}</p>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomePublishingSection() {
  return (
    <section className="border-y border-brand-offwhite/10 bg-brand-charcoal py-24">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="font-mono text-sm tracking-[0.28em] text-brand-orange">PUBLIC EVIDENCE LAYER</p>
            <h2 className="mt-4 font-display text-4xl font-bold md:text-6xl">
              THE BLOG AND TOOLS ARE
              <br />
              HERE TO SHOW THE WORK.
            </h2>
            <p className="mt-6 max-w-2xl font-body text-xl leading-relaxed text-brand-offwhite/72">
              This site is part consulting practice, part publisher-owned archive. Essays and
              tools are not side projects. They are the public record of how the operating model
              thinks, tests, and builds.
            </p>
          </div>

          <div className="grid gap-4">
            {homePublishingStandards.map((item) => (
              <article key={item.title} className="border border-brand-offwhite/10 bg-brand-black p-6">
                <h3 className="font-display text-2xl font-bold">{item.title}</h3>
                <p className="mt-4 font-body text-base leading-relaxed text-brand-offwhite/72">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeInsightsSection({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="bg-brand-black py-24">
      <div className="container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-sm tracking-[0.28em] text-brand-orange">RECENT WRITING</p>
            <h2 className="mt-4 font-display text-4xl font-bold md:text-6xl">
              FIELD NOTES, ESSAYS,
              <br />
              AND TOOL BREAKDOWNS.
            </h2>
            <p className="mt-6 font-body text-xl leading-relaxed text-brand-offwhite/70">
              These pages are meant to help a reader judge how we think before they ever get on
              a call with us.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-sm text-brand-orange transition-colors hover:text-brand-offwhite"
          >
            VIEW ALL POSTS
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="group flex h-full flex-col border border-brand-offwhite/10 bg-brand-charcoal p-6 transition-colors hover:border-brand-orange">
                <p className="font-mono text-xs tracking-widest text-brand-orange">
                  {new Date(post.publishedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h3 className="mt-4 font-display text-2xl font-bold leading-tight transition-colors group-hover:text-brand-orange">
                  {post.title}
                </h3>
                <p className="mt-4 flex-1 font-body leading-relaxed text-brand-offwhite/72">
                  {post.tldr}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-brand-offwhite/64 transition-colors group-hover:text-brand-orange">
                  READ ARTICLE
                  <ArrowRight className="h-4 w-4" />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeStandardsSection() {
  const items = [
    {
      href: "/about",
      title: "About the publisher",
      description: "Who this site serves and how the consulting, essays, and tools fit together.",
    },
    {
      href: "/methodology",
      title: "Methodology",
      description: "How pages are sourced, reviewed, updated, and kept worth reading.",
    },
    {
      href: "/editorial-policy",
      title: "Editorial policy",
      description: "Originality, disclosure, correction standards, and how trust is maintained.",
    },
  ];

  return (
    <section className="bg-brand-offwhite py-24 text-brand-black">
      <div className="container">
        <div className="max-w-3xl">
          <p className="font-mono text-sm tracking-[0.28em] text-brand-orange">TRUST SIGNALS</p>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-6xl">
            IF TRUST MATTERS,
            <br />
            IT SHOULD BE EASY
            <br />
            TO VERIFY.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={item.href} href={item.href}>
              <article className="h-full border-4 border-brand-black bg-white p-6 transition-colors hover:border-brand-orange">
                <h3 className="font-display text-2xl font-bold">{item.title}</h3>
                <p className="mt-4 font-body text-base leading-relaxed text-brand-black/72">
                  {item.description}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-brand-orange">
                  READ PAGE
                  <ArrowRight className="h-4 w-4" />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeContactSection() {
  return (
    <section id="contact" className="bg-brand-offwhite py-24 text-brand-black">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-mono text-sm tracking-[0.28em] text-brand-orange">READY TO TALK</p>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-6xl">
            START A CONVERSATION.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-body text-xl leading-relaxed text-brand-black/72">
            If the problem is real, the stakes are live, and there is authority to act, we can
            decide fit quickly and move from there.
          </p>

          <ContactForm />

          <p className="mt-8 font-body text-base text-brand-black/56">
            Or email{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-brand-orange hover:underline">
              {siteConfig.email}
            </a>
            . We respond {siteConfig.responseWindow}.
          </p>
        </div>
      </div>
    </section>
  );
}
