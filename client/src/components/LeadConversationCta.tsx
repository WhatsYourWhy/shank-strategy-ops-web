import { ArrowRight } from "lucide-react";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

interface LeadConversationCtaProps {
  eyebrow: string;
  title: string;
  body: string;
  source: string;
  className?: string;
}

export default function LeadConversationCta({
  eyebrow,
  title,
  body,
  source,
  className = "",
}: LeadConversationCtaProps) {
  return (
    <section className={`border border-brand-offwhite/10 bg-brand-charcoal ${className}`}>
      <div className="p-8 md:p-10">
        <p className="font-mono text-xs tracking-[0.28em] text-brand-orange">{eyebrow}</p>
        <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight md:text-4xl">
          {title}
        </h2>
        <p className="mt-5 max-w-2xl font-body text-lg leading-relaxed text-brand-offwhite/76">
          {body}
        </p>

        <a
          href="/#contact"
          onClick={() => trackEvent(analyticsEvents.blogCtaClicked, { source })}
          className="mt-8 inline-flex items-center gap-3 bg-brand-orange px-6 py-3 font-mono text-sm text-brand-black transition-colors hover:bg-brand-offwhite"
        >
          START A CONVERSATION
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
