import { ReactNode } from "react";
import BlogNavigation from "@/components/blog/BlogNavigation";
import SiteFooter from "@/components/layout/SiteFooter";

interface InfoPageLayoutProps {
  eyebrow: string;
  title: string;
  lede: string;
  children: ReactNode;
}

export function InfoPageLayout({
  eyebrow,
  title,
  lede,
  children,
}: InfoPageLayoutProps) {
  return (
    <div className="min-h-screen bg-brand-black text-brand-offwhite">
      <BlogNavigation />

      <main
        id="main-content"
        tabIndex={-1}
      >
        <section className="border-b border-brand-offwhite/10 bg-brand-black pt-32 pb-14">
          <div className="container">
            <div className="max-w-4xl">
              <p className="font-mono text-sm tracking-[0.28em] text-brand-offwhite/78">{eyebrow}</p>
              <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[0.92] tracking-tight md:text-7xl">
                {title}
              </h1>
              <p className="mt-8 max-w-3xl font-body text-xl leading-relaxed text-brand-offwhite/72">
                {lede}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-brand-black py-16">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-12">{children}</div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

interface InfoCardProps {
  title: string;
  body: string[];
  bullets?: string[];
  note?: string;
}

export function InfoCard({ title, body, bullets, note }: InfoCardProps) {
  return (
    <section className="md:col-span-6 bg-brand-charcoal border border-brand-offwhite/10 p-8">
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <div className="mt-5 space-y-4">
        {body.map((paragraph) => (
          <p key={paragraph} className="font-body text-base leading-relaxed text-brand-offwhite/80">
            {paragraph}
          </p>
        ))}
      </div>

      {bullets && bullets.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3 font-body text-sm leading-relaxed text-brand-offwhite/80">
              <span className="mt-1 h-2 w-2 flex-shrink-0 bg-brand-orange" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {note ? (
        <div className="mt-6 border-l-2 border-brand-orange pl-4">
          <p className="font-body text-sm leading-relaxed text-brand-offwhite/75">{note}</p>
        </div>
      ) : null}
    </section>
  );
}
