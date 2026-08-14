import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import BlogNavigation from "@/components/blog/BlogNavigation";
import SiteFooter from "@/components/layout/SiteFooter";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { getNotFoundPageMetadata } from "@/lib/pageMetadata";

/**
 * Prerendered to `dist/public/404.html` and served by Vercel for any unmatched
 * path, so this is a real page a visitor or crawler can land on — not just a
 * client-side fallback. It offers the actual destinations rather than a single
 * "go home", because arriving here means the link that got you here was wrong.
 */
const destinations = [
  {
    href: "/operator-audit",
    label: "The $500 Operator Audit",
    description:
      "The front door. A fixed-price, fixed-scope read on where your operation is losing clarity, time, and trust.",
  },
  {
    href: "/",
    label: "Home",
    description:
      "Positioning, the offer ladder, engagement principles, and how to get in touch.",
  },
  {
    href: "/blog",
    label: "Blog",
    description:
      "Operator notes and essays on strategy execution, deterministic systems, and AI in real workflows.",
  },
  {
    href: "/tools",
    label: "Tools",
    description:
      "The instruments built and used inside engagements, labeled honestly by maturity.",
  },
  {
    href: "/about",
    label: "About",
    description:
      "Who runs the practice, what it does, and how to check whether the standard is real.",
  },
];

export default function NotFound() {
  usePageMetadata(getNotFoundPageMetadata());

  return (
    <div className="min-h-screen bg-brand-black text-brand-offwhite">
      <BlogNavigation />

      <main id="main-content" tabIndex={-1}>
        <section className="border-b border-brand-offwhite/10 bg-brand-black pt-32 pb-14">
          <div className="container">
            <div className="max-w-4xl">
              <p className="font-mono text-sm tracking-[0.28em] text-brand-offwhite/78">
                404 — PAGE NOT FOUND
              </p>
              <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[0.92] tracking-tight md:text-7xl">
                That page isn&apos;t here.
              </h1>
              <p className="mt-8 max-w-3xl font-body text-xl leading-relaxed text-brand-offwhite/72">
                The link may be out of date, or the address may have a typo.
                Nothing was removed to hide it — everything this site publishes
                is still below.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-brand-black py-16">
          <div className="container">
            <p className="font-mono text-xs tracking-[0.24em] text-brand-offwhite/70">
              WHERE TO GO INSTEAD
            </p>

            <div className="mt-6 grid gap-px overflow-hidden border border-brand-offwhite/10 bg-brand-offwhite/10">
              {destinations.map(destination => (
                <Link
                  key={destination.href}
                  href={destination.href}
                  className="group flex flex-col gap-2 bg-brand-charcoal p-6 transition-colors hover:bg-brand-black sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <span className="flex items-center gap-2 font-display text-xl font-bold transition-colors group-hover:text-brand-orange sm:w-64 sm:flex-shrink-0">
                    {destination.label}
                    <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                  <span className="font-body text-base leading-relaxed text-brand-offwhite/74">
                    {destination.description}
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-10 border-l-2 border-brand-orange pl-4">
              <p className="font-body text-sm leading-relaxed text-brand-offwhite/75">
                If you followed a link from somewhere on this site, that is a
                broken link and worth telling me about:{" "}
                <a
                  href="mailto:contact@shankstrategy.com"
                  className="text-brand-orange underline-offset-4 hover:underline"
                >
                  contact@shankstrategy.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
