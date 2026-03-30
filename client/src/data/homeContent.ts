export const homeProofStrip = [
  {
    label: "WHO WE HELP",
    value: "Founder-led firms, operators, and executives who can actually change the system.",
  },
  {
    label: "WHAT WE FIX",
    value: "Execution drift, unclear ownership, noisy reporting, and operating models that no longer hold.",
  },
  {
    label: "HOW WE ENGAGE",
    value: "Bounded diagnostic and execution work with explicit entry, exit, and success criteria.",
  },
  {
    label: "RESPONSE TIME",
    value: "Direct response within 48 hours, with fit decided before any commitment.",
  },
] as const;

export const homeHiringReasons = [
  {
    title: "Operator-level diagnosis",
    description:
      "We do not begin with theater. We map the actual decision flow, where the work stalls, and what is creating avoidable entropy.",
  },
  {
    title: "Bounded execution",
    description:
      "Engagements are designed to end. The work is scoped around outcomes, authority, and transfer, not open-ended dependency.",
  },
  {
    title: "Deliverables that hold up",
    description:
      "The output is concrete: decision rights, execution cadences, operating maps, risk controls, and documents a team can actually run.",
  },
] as const;

export const homeDeliverables = [
  "Operational diagnostic with pressure points and decision bottlenecks",
  "Ownership map with escalation paths and handoff rules",
  "Execution cadence that makes progress visible without dashboard theater",
  "Transition package so the team can keep moving without us",
] as const;

export const homePrinciples = [
  {
    number: "01",
    title: "Outcomes before activity",
    description: "The work is judged by movement in the system, not hours, decks, or visible busyness.",
  },
  {
    number: "02",
    title: "Boundaries are part of the service",
    description: "Every engagement has clear entry conditions, decision rights, and an exit standard.",
  },
  {
    number: "03",
    title: "Authority must match ambition",
    description: "If no one can make the decision, no one can own the result. We surface that early.",
  },
  {
    number: "04",
    title: "Leverage over ceremony",
    description: "Governance should improve execution quality, not become a tax on movement.",
  },
  {
    number: "05",
    title: "Shared accountability",
    description: "Client responsibilities are explicit because outcomes depend on both sides carrying the load.",
  },
  {
    number: "06",
    title: "Exit is part of success",
    description: "If the same problem still needs us after transfer, the engagement was not finished properly.",
  },
] as const;

export const homeEngagementPhases = [
  {
    phase: "01",
    title: "Fit and readiness",
    purpose: "Decide whether the work should happen at all.",
    detail: "We confirm sponsorship, decision authority, access, and whether the problem is real enough to justify intervention.",
  },
  {
    phase: "02",
    title: "Operational reality diagnostic",
    purpose: "Establish the unsanitized view of how the system is actually working.",
    detail: "We map ownership, reporting noise, constraints, and failure modes before proposing any fix.",
  },
  {
    phase: "03",
    title: "Design and commitment",
    purpose: "Convert insight into a bounded operating plan.",
    detail: "Target state, execution rhythm, risk controls, and escalation paths are made explicit before work begins.",
  },
  {
    phase: "04",
    title: "Execution and stabilization",
    purpose: "Drive the intervention until it holds under live conditions.",
    detail: "We lead, co-lead, or advise depending on the authority granted, but the score is always the same: durable movement.",
  },
  {
    phase: "05",
    title: "Transfer and exit",
    purpose: "Leave the team with more control than it had when we arrived.",
    detail: "Knowledge transfer, operating documents, and final outcome review happen before we step out.",
  },
] as const;

export const homeModels = [
  {
    title: "Fixed-scope intervention",
    useWhen: "The problem is legible, urgency is real, and a defined reset is more useful than an indefinite retainer.",
    typicalUses: ["Operational diagnostics", "Decision-rights reset", "Execution system repair"],
  },
  {
    title: "Strategic advisory retainer",
    useWhen: "Leadership needs a senior operating counterpart for ongoing judgment, escalation, and execution pressure.",
    typicalUses: ["Executive operating support", "Cross-functional decision hygiene", "Program oversight"],
  },
  {
    title: "Embedded build-out",
    useWhen: "A new operating motion, reporting structure, or toolchain has to be installed before internal ownership can fully absorb it.",
    typicalUses: ["New cadence design", "Control layers", "Tool-backed operating workflows"],
  },
] as const;

export const homePublishingStandards = [
  {
    title: "Original operator notes",
    description:
      "The blog and tools exist because there is a real operating practice behind them, not a content engine filling space.",
  },
  {
    title: "Transparent standards",
    description:
      "Methodology, editorial policy, privacy, and terms are public because trust should be inspectable, not inferred.",
  },
  {
    title: "Evidence over volume",
    description:
      "The archive is intentionally selective. Each page is expected to help a serious reader or a serious buyer make a better decision.",
  },
] as const;
