/*
 * Operator Audit intake form. Posts to /api/contact by packaging the
 * structured intake answers into the message body so no new endpoint is
 * needed.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(120),
  email: z.string().trim().email("Valid email required").max(254),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  operation: z.string().trim().min(10, "A sentence or two helps").max(2000),
  reason: z.string().trim().min(10, "A sentence or two helps").max(2000),
  drag: z.string().trim().min(5).max(2000),
  repeating: z.string().trim().max(2000).optional().or(z.literal("")),
  stuck: z.string().trim().max(2000).optional().or(z.literal("")),
  materials: z.string().trim().max(2000).optional().or(z.literal("")),
  outcome: z.string().trim().max(2000).optional().or(z.literal("")),
  notThis: z.string().trim().max(2000).optional().or(z.literal("")),
});

type Values = z.infer<typeof schema>;

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as
  | string
  | undefined;
const turnstileEnabled = Boolean(turnstileSiteKey);

function buildMessageBody(values: Values): string {
  const lines: string[] = [];
  lines.push("OPERATOR AUDIT INTAKE");
  lines.push("");
  lines.push(`Name: ${values.name}`);
  lines.push(`Email: ${values.email}`);
  if (values.company) lines.push(`Company: ${values.company}`);
  lines.push("");
  const section = (label: string, value?: string) => {
    if (!value) return;
    lines.push(`--- ${label} ---`);
    lines.push(value);
    lines.push("");
  };
  section("What does your operation do?", values.operation);
  section("Why are you seeking an audit right now?", values.reason);
  section("Where is the biggest recurring drag?", values.drag);
  section("What problems keep repeating?", values.repeating);
  section("Where does work get stuck?", values.stuck);
  section("What materials can you share?", values.materials);
  section("What outcome would make this audit feel useful?", values.outcome);
  section("What should this audit not become?", values.notThis);
  return lines.join("\n").trim();
}

export function OperatorAuditIntakeForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      operation: "",
      reason: "",
      drag: "",
      repeating: "",
      stuck: "",
      materials: "",
      outcome: "",
      notThis: "",
    },
  });

  async function onSubmit(values: Values) {
    if (turnstileEnabled && !turnstileToken) {
      trackEvent(analyticsEvents.operatorAuditSubmitFailed, {
        reason: "missing-turnstile-token",
      });
      toast.error("Please complete the bot check before sending.");
      return;
    }

    setSubmitting(true);
    try {
      const message = buildMessageBody(values);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${values.name} — OPERATOR AUDIT`,
          email: values.email,
          message,
          ...(turnstileEnabled && turnstileToken ? { turnstileToken } : {}),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        trackEvent(analyticsEvents.operatorAuditSubmitFailed, {
          reason:
            typeof data.error === "string" ? data.error : `http-${res.status}`,
        });
        toast.error(
          data.error ?? "Something went wrong. Try emailing directly."
        );
        return;
      }

      trackEvent(analyticsEvents.operatorAuditSubmitSucceeded, {
        source: "operator-audit-intake",
      });
      toast.success("Intake received. Expect a reply within 1–2 business days.");
      form.reset();
      setTurnstileToken(null);
      setTurnstileResetKey((current) => current + 1);
      setSubmitted(true);
    } catch {
      trackEvent(analyticsEvents.operatorAuditSubmitFailed, {
        reason: "network-error",
      });
      toast.error("Failed to send. Try emailing directly.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="border border-brand-offwhite/15 bg-brand-charcoal p-8">
        <p className="font-mono text-xs tracking-widest text-brand-orange">
          INTAKE RECEIVED
        </p>
        <h3 className="mt-3 font-display text-2xl font-bold">
          Thanks — the intake is in.
        </h3>
        <p className="mt-4 font-body text-brand-offwhite/80 leading-relaxed">
          You&apos;ll get a reply within 1–2 business days confirming next steps
          and how to send any supporting materials (SOPs, task boards, handoff
          notes, meeting notes). Messy but real is better than polished but
          unrepresentative.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-xs tracking-widest text-brand-offwhite/70">
                  NAME
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-none border-2 border-brand-offwhite/30 bg-brand-black font-body text-brand-offwhite placeholder:text-brand-offwhite/30"
                    placeholder="Your name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-xs tracking-widest text-brand-offwhite/70">
                  EMAIL
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className="rounded-none border-2 border-brand-offwhite/30 bg-brand-black font-body text-brand-offwhite placeholder:text-brand-offwhite/30"
                    placeholder="you@example.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-xs tracking-widest text-brand-offwhite/70">
                COMPANY / ORGANIZATION (OPTIONAL)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="rounded-none border-2 border-brand-offwhite/30 bg-brand-black font-body text-brand-offwhite placeholder:text-brand-offwhite/30"
                  placeholder="Company name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="operation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-xs tracking-widest text-brand-offwhite/70">
                WHAT DOES YOUR OPERATION DO?
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  className="rounded-none border-2 border-brand-offwhite/30 bg-brand-black font-body text-brand-offwhite placeholder:text-brand-offwhite/30 resize-none"
                  placeholder="Brief description of the business, team, or function."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-xs tracking-widest text-brand-offwhite/70">
                WHY ARE YOU SEEKING AN AUDIT RIGHT NOW?
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  className="rounded-none border-2 border-brand-offwhite/30 bg-brand-black font-body text-brand-offwhite placeholder:text-brand-offwhite/30 resize-none"
                  placeholder="What feels off, heavy, unclear, slow, or fragile?"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="drag"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-xs tracking-widest text-brand-offwhite/70">
                WHERE IS THE BIGGEST RECURRING DRAG?
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  className="rounded-none border-2 border-brand-offwhite/30 bg-brand-black font-body text-brand-offwhite placeholder:text-brand-offwhite/30 resize-none"
                  placeholder="Handoffs, meetings, prioritization, review cycles, follow-through..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repeating"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-xs tracking-widest text-brand-offwhite/70">
                WHAT PROBLEMS KEEP REPEATING? (OPTIONAL)
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  className="rounded-none border-2 border-brand-offwhite/30 bg-brand-black font-body text-brand-offwhite placeholder:text-brand-offwhite/30 resize-none"
                  placeholder="Problems that keep repeating even after people talk about them."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stuck"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-xs tracking-widest text-brand-offwhite/70">
                WHERE DOES WORK GET STUCK? (OPTIONAL)
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  className="rounded-none border-2 border-brand-offwhite/30 bg-brand-black font-body text-brand-offwhite placeholder:text-brand-offwhite/30 resize-none"
                  placeholder="Between idea and assignment, execution and review, review and closure..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="materials"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-xs tracking-widest text-brand-offwhite/70">
                MATERIALS YOU CAN SHARE (OPTIONAL)
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  className="rounded-none border-2 border-brand-offwhite/30 bg-brand-black font-body text-brand-offwhite placeholder:text-brand-offwhite/30 resize-none"
                  placeholder="SOPs, checklists, task boards, handoff notes, meeting notes, dashboards, role docs. You can send these by email after I reply."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="outcome"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-xs tracking-widest text-brand-offwhite/70">
                WHAT OUTCOME WOULD MAKE THIS AUDIT FEEL USEFUL? (OPTIONAL)
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  className="rounded-none border-2 border-brand-offwhite/30 bg-brand-black font-body text-brand-offwhite placeholder:text-brand-offwhite/30 resize-none"
                  placeholder="Clearer diagnosis, prioritization, simplification, accountability structure, process cleanup, decision support."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notThis"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-xs tracking-widest text-brand-offwhite/70">
                WHAT SHOULD THIS AUDIT NOT BECOME? (OPTIONAL)
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={2}
                  className="rounded-none border-2 border-brand-offwhite/30 bg-brand-black font-body text-brand-offwhite placeholder:text-brand-offwhite/30 resize-none"
                  placeholder="Culture critique, software recommendation spree, management theater, giant rewrite..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {turnstileEnabled && turnstileSiteKey ? (
          <div>
            <p className="mb-2 font-mono text-xs tracking-widest text-brand-offwhite/70">
              BOT CHECK
            </p>
            <TurnstileWidget
              siteKey={turnstileSiteKey}
              onTokenChange={setTurnstileToken}
              resetKey={turnstileResetKey}
            />
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={submitting}
          className="w-full rounded-none bg-brand-orange py-6 font-mono text-sm text-brand-black hover:bg-brand-offwhite sm:w-auto sm:px-12"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              SEND INTAKE
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <p className="font-body text-sm text-brand-offwhite/60">
          You&apos;ll get a reply within 1–2 business days. Payment and final
          confirmation happen after the intake review.
        </p>
      </form>
    </Form>
  );
}
