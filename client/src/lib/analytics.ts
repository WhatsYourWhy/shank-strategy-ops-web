import { track } from "@vercel/analytics/react";

type TrackProperties = Record<string, string | number | boolean | null | undefined>;

export const analyticsEvents = {
  heroCtaClicked: "Hero CTA Clicked",
  blogCtaClicked: "Blog CTA Clicked",
  toolOutboundClicked: "Tool Outbound Clicked",
  contactSubmitSucceeded: "Contact Submit Succeeded",
  contactSubmitFailed: "Contact Submit Failed",
} as const;

export function trackEvent(name: string, properties?: TrackProperties) {
  try {
    track(name, properties);
  } catch {
    // Tracking should never block the user path.
  }
}
