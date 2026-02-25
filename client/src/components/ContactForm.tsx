/*
 * Contact form: POSTs to /api/contact (Resend). Swiss Brutalist styling.
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

const schema = z.object({
  name: z.string().max(120).optional(),
  email: z.string().email("Valid email required"),
  message: z.string().min(10, "At least 10 characters").max(5000),
});

type Values = z.infer<typeof schema>;

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", message: "" },
  });

  async function onSubmit(values: Values) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong. Try emailing directly.");
        return;
      }
      toast.success("Message sent. We'll respond within 48 hours.");
      form.reset();
    } catch {
      toast.error("Failed to send. Try emailing directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto mt-12 max-w-xl text-left"
      >
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-xs text-brand-black/70 tracking-widest">
                  NAME (OPTIONAL)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-none border-2 border-brand-black bg-white font-body text-brand-black placeholder:text-brand-black/40"
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
                <FormLabel className="font-mono text-xs text-brand-black/70 tracking-widest">
                  EMAIL
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className="rounded-none border-2 border-brand-black bg-white font-body text-brand-black placeholder:text-brand-black/40"
                    placeholder="you@example.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-xs text-brand-black/70 tracking-widest">
                  MESSAGE
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={5}
                    className="rounded-none border-2 border-brand-black bg-white font-body text-brand-black placeholder:text-brand-black/40 resize-none"
                    placeholder="What can we help with?"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="mt-8 w-full rounded-none bg-brand-black py-6 font-mono text-sm text-brand-offwhite hover:bg-brand-orange hover:text-brand-black sm:w-auto sm:px-12"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              SEND MESSAGE
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
