/*
 * DESIGN: Swiss Brutalist Precision
 * - Raw, honest typography with stark contrasts
 * - Geometric precision with intentional asymmetry
 * - Colors: Pure black, warm off-white, burnt orange accent
 * - Hard edges, no soft shadows, mechanical interactions
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/ContactForm";
import { Link } from "wouter";

// Navigation Component
function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-brand-black/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-orange flex items-center justify-center">
              <span className="font-display font-bold text-brand-black text-xl">S</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
              SHANK STRATEGY OPS
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("principles")}
              className="font-mono text-sm text-brand-offwhite/70 hover:text-brand-orange transition-colors"
            >
              PRINCIPLES
            </button>
            <button
              onClick={() => scrollToSection("engagement")}
              className="font-mono text-sm text-brand-offwhite/70 hover:text-brand-orange transition-colors"
            >
              ENGAGEMENT
            </button>
            <button
              onClick={() => scrollToSection("models")}
              className="font-mono text-sm text-brand-offwhite/70 hover:text-brand-orange transition-colors"
            >
              MODELS
            </button>
            <Link
              href="/tools"
              className="font-mono text-sm text-brand-offwhite/70 hover:text-brand-orange transition-colors"
            >
              TOOLS
            </Link>
            <Link
              href="/blog"
              className="font-mono text-sm text-brand-offwhite/70 hover:text-brand-orange transition-colors"
            >
              BLOG
            </Link>
            <button
              onClick={() => scrollToSection("contact")}
              className="font-mono text-sm bg-brand-orange text-brand-black px-6 py-2 hover:bg-brand-offwhite transition-colors"
            >
              START CONVERSATION
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-0.5 bg-brand-offwhite transition-transform ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 bg-brand-offwhite transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-brand-offwhite transition-transform ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden py-6 border-t border-border"
          >
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("principles")}
                className="font-mono text-sm text-brand-offwhite/70 hover:text-brand-orange transition-colors text-left"
              >
                PRINCIPLES
              </button>
              <button
                onClick={() => scrollToSection("engagement")}
                className="font-mono text-sm text-brand-offwhite/70 hover:text-brand-orange transition-colors text-left"
              >
                ENGAGEMENT
              </button>
              <button
                onClick={() => scrollToSection("models")}
                className="font-mono text-sm text-brand-offwhite/70 hover:text-brand-orange transition-colors text-left"
              >
                MODELS
              </button>
              <Link
                href="/tools"
                className="font-mono text-sm text-brand-offwhite/70 hover:text-brand-orange transition-colors text-left"
              >
                TOOLS
              </Link>
              <Link
                href="/blog"
                className="font-mono text-sm text-brand-offwhite/70 hover:text-brand-orange transition-colors text-left"
              >
                BLOG
              </Link>
              <button
                onClick={() => scrollToSection("contact")}

                className="font-mono text-sm bg-brand-orange text-brand-black px-6 py-3 hover:bg-brand-offwhite transition-colors text-left"
              >
                START CONVERSATION
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-bg.png')" }}
      >
        <div className="absolute inset-0 bg-brand-black/70" />
      </div>

      {/* Content */}
      <div className="container relative z-10 pt-32 pb-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-brand-orange text-sm tracking-widest">
              STRATEGY EXECUTION & OPERATIONAL EXCELLENCE
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mt-6 leading-[0.9] tracking-tight"
          >
            WE FIX
            <br />
            <span className="text-brand-orange">WHAT'S BROKEN.</span>
            <br />
            THEN WE LEAVE.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-xl md:text-2xl text-brand-offwhite/70 mt-8 max-w-2xl leading-relaxed"
          >
            We enter clean, execute with authority, and exit without dependency.
            The goal is to leave things stronger than we found them.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex flex-col sm:flex-row gap-4"
          >
            <Button
              onClick={() => scrollToSection("engagement")}
              className="bg-brand-orange text-brand-black hover:bg-brand-offwhite font-mono text-sm px-8 py-6 rounded-none"
            >
              VIEW ENGAGEMENT MODEL
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={() => scrollToSection("principles")}
              variant="outline"
              className="border-brand-offwhite text-brand-offwhite hover:bg-brand-offwhite hover:text-brand-black font-mono text-sm px-8 py-6 rounded-none"
            >
              OUR PRINCIPLES
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <button
          onClick={() => scrollToSection("principles")}
          className="flex flex-col items-center gap-2 text-brand-offwhite/50 hover:text-brand-orange transition-colors"
        >
          <span className="font-mono text-xs">SCROLL</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </button>
      </motion.div>
    </section>
  );
}

// Principles Section
function PrinciplesSection() {
  const principles = [
    {
      number: "01",
      title: "Outcomes Before Activity",
      description: "Work is defined by results, not hours, decks, or visibility.",
    },
    {
      number: "02",
      title: "Bounded By Design",
      description: "Every engagement has explicit entry, exit, and success criteria.",
    },
    {
      number: "03",
      title: "Authority Precedes Execution",
      description: "If authority is unclear, outcomes will be unclear.",
    },
    {
      number: "04",
      title: "Leverage Matters",
      description: "We do not accept work that permanently trades leverage for busyness.",
    },
    {
      number: "05",
      title: "Shared Accountability",
      description: "Client and firm responsibilities are explicit and enforced.",
    },
    {
      number: "06",
      title: "Simplicity Over Ceremony",
      description: "Governance exists to enable speed, not slow it down.",
    },
  ];

  return (
    <section id="principles" className="py-32 bg-brand-charcoal relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="font-mono text-brand-orange text-sm tracking-widest">
            NON-NEGOTIABLE
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mt-4">
            ENGAGEMENT PRINCIPLES
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-brand-black p-8 border-l-4 border-brand-orange hover:border-brand-offwhite transition-colors group"
            >
              <span className="font-mono text-brand-orange text-4xl font-bold">
                {principle.number}
              </span>
              <h3 className="font-display text-xl font-bold mt-4 group-hover:text-brand-orange transition-colors">
                {principle.title}
              </h3>
              <p className="font-body text-brand-offwhite/70 mt-3 leading-relaxed">
                {principle.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Engagement Phases Section
function EngagementSection() {
  const phases = [
    {
      phase: "0",
      title: "Fit & Readiness Check",
      purpose: "Decide whether this work should happen at all.",
      activities: [
        "Problem framing discussion",
        "Executive sponsorship confirmation",
        "Decision authority validation",
        "Access and data readiness check",
      ],
      rule: "If authority, intent, or readiness is missing, the engagement does not proceed.",
    },
    {
      phase: "1",
      title: "Operational Reality Diagnostic",
      purpose: "Establish a shared, unsanitized view of reality.",
      activities: [
        "Operational and system diagnostics",
        "KPI and reporting noise analysis",
        "Decision flow and ownership mapping",
        "Constraint and entropy identification",
      ],
      rule: "No solutioning before reality is agreed.",
    },
    {
      phase: "2",
      title: "Design & Commitment",
      purpose: "Convert insight into executable commitment.",
      activities: [
        "Target-state operating design",
        "Execution roadmap definition",
        "Ownership, cadence, and escalation setup",
        "Risk and dependency mapping",
      ],
      rule: "No execution begins without ownership and commitment.",
    },
    {
      phase: "3",
      title: "Execution & Stabilization",
      purpose: "Deliver change that holds under real operating conditions.",
      activities: [
        "Hands-on execution support",
        "Decision facilitation and escalation",
        "Issue resolution",
        "Performance tracking against defined metrics",
      ],
      rule: "Shank Strategy Ops may lead, co-lead, or advise — depending on authority granted.",
    },
    {
      phase: "4",
      title: "Transition & Exit",
      purpose: "Ensure durability without dependency.",
      activities: [
        "Knowledge and capability transfer",
        "Process and decision documentation",
        "Final outcome review",
        "Optional next-phase recommendations",
      ],
      rule: "If the client still needs us for the same problem, the engagement failed.",
    },
  ];

  return (
    <section id="engagement" className="py-32 bg-brand-black relative">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: "url('/images/pattern-grid.png')" }}
      />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="font-mono text-brand-orange text-sm tracking-widest">
            HOW WE WORK
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mt-4">
            STANDARD ENGAGEMENT PHASES
          </h2>
          <p className="font-body text-xl text-brand-offwhite/70 mt-6 max-w-3xl">
            Every engagement follows a disciplined process. We enter clean, stay bounded,
            deliver real outcomes, and exit without dependency.
          </p>
        </motion.div>

        {/* Phases Visual */}
        <div className="mb-16">
          <img
            src="/images/engagement-phases.png"
            alt="Engagement Phases Flow"
            className="w-full max-w-4xl mx-auto"
          />
        </div>

        {/* Phase Details */}
        <div className="space-y-4">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-brand-charcoal border-l-4 border-brand-orange"
            >
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Phase Number */}
                  <div className="flex-shrink-0">
                    <span className="font-mono text-6xl font-bold text-brand-orange">
                      {phase.phase}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-bold">
                      {phase.title}
                    </h3>
                    <p className="font-body text-brand-offwhite/70 mt-2">
                      <span className="text-brand-orange font-medium">Purpose:</span>{" "}
                      {phase.purpose}
                    </p>

                    {/* Activities */}
                    <div className="mt-6 grid sm:grid-cols-2 gap-3">
                      {phase.activities.map((activity, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-brand-orange mt-1 flex-shrink-0" />
                          <span className="font-body text-sm text-brand-offwhite/80">
                            {activity}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Rule */}
                    <div className="mt-6 p-4 bg-brand-black border-l-2 border-brand-orange">
                      <span className="font-mono text-xs text-brand-orange tracking-widest">
                        RULE
                      </span>
                      <p className="font-body text-sm text-brand-offwhite/90 mt-1">
                        {phase.rule}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Engagement Models Section
function ModelsSection() {
  const models = [
    {
      title: "Fixed-Scope Projects",
      useWhen: "Scope is clear, outcomes are defined, duration must be controlled.",
      typicalUses: ["Diagnostics", "Operational resets", "Targeted execution interventions"],
      icon: "📐",
    },
    {
      title: "Retainer-Based Advisory",
      useWhen: "Authority exists but priorities evolve. Leadership needs continuity, not capacity.",
      typicalUses: ["Ongoing strategic guidance", "Decision support", "Priority evolution"],
      guardrail: "Retainers are reviewed regularly for leverage vs. load.",
      icon: "🔄",
    },
    {
      title: "Fractional Executive Leadership",
      useWhen: "Temporary authority is required. Outcomes demand decision ownership.",
      typicalUses: ["Interim leadership", "Transformation leadership", "Crisis management"],
      guardrail: "Fractional roles must increase control and optionality — not recreate past grind.",
      icon: "⚡",
    },
  ];

  return (
    <section id="models" className="py-32 bg-brand-offwhite text-brand-black relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="font-mono text-brand-orange text-sm tracking-widest">
            ENGAGEMENT OPTIONS
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mt-4 text-brand-black">
            MODELS OFFERED
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {models.map((model, index) => (
            <motion.div
              key={model.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 border-4 border-brand-black hover:border-brand-orange transition-colors"
            >
              <span className="text-4xl">{model.icon}</span>
              <h3 className="font-display text-2xl font-bold mt-4 text-brand-black">
                {model.title}
              </h3>
              <p className="font-body text-brand-black/70 mt-4">
                <span className="font-medium text-brand-black">Use when:</span>{" "}
                {model.useWhen}
              </p>

              <div className="mt-6">
                <span className="font-mono text-xs text-brand-orange tracking-widest">
                  TYPICAL USES
                </span>
                <ul className="mt-2 space-y-2">
                  {model.typicalUses.map((use, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-brand-orange" />
                      <span className="font-body text-sm text-brand-black/80">{use}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {model.guardrail && (
                <div className="mt-6 p-4 bg-brand-black/5 border-l-2 border-brand-orange">
                  <span className="font-mono text-xs text-brand-orange tracking-widest">
                    GUARDRAIL
                  </span>
                  <p className="font-body text-sm text-brand-black/80 mt-1">
                    {model.guardrail}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// What We Are Not Section
function NotSection() {
  const notItems = [
    "Staff augmentation",
    "Open-ended advisory",
    "Execution without authority",
    "Strategy without ownership",
  ];

  return (
    <section className="py-32 bg-brand-black relative overflow-hidden">
      {/* Diagonal Stripe Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/images/section-diagonal.png')" }}
      />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-brand-orange text-sm tracking-widest">
              CLARITY
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold mt-4">
              WHAT WE ARE <span className="text-brand-orange">NOT</span>
            </h2>
          </motion.div>

          <div className="mt-12 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {notItems.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-brand-charcoal border-l-4 border-destructive"
              >
                <X className="h-6 w-6 text-destructive flex-shrink-0" />
                <span className="font-display text-lg font-medium">{item}</span>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-body text-xl text-brand-offwhite/70 mt-12"
          >
            If a client needs bodies without accountability, the engagement is declined.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

// Client Requirements Section
function RequirementsSection() {
  const requirements = [
    {
      title: "Executive Sponsorship",
      description: "A senior leader who owns the outcome and can remove blockers.",
    },
    {
      title: "Timely Access",
      description: "Access to people and data when needed, not gated or delayed.",
    },
    {
      title: "Clear Decision Rights",
      description: "Explicit authority to make and enforce decisions.",
    },
    {
      title: "Willingness to Act",
      description: "Commitment to act on findings, not just receive reports.",
    },
  ];

  return (
    <section className="py-32 bg-brand-charcoal">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-brand-orange text-sm tracking-widest">
              NON-NEGOTIABLE
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-4">
              CLIENT RESPONSIBILITIES
            </h2>
            <p className="font-body text-xl text-brand-offwhite/70 mt-6">
              Without these, outcomes are not possible. We are explicit about what
              clients must provide for engagements to succeed.
            </p>
          </motion.div>

          <div className="space-y-4">
            {requirements.map((req, index) => (
              <motion.div
                key={req.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-brand-black border-l-4 border-brand-orange"
              >
                <h3 className="font-display text-xl font-bold">{req.title}</h3>
                <p className="font-body text-brand-offwhite/70 mt-2">
                  {req.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Exit Philosophy Section
function ExitSection() {
  const successMetrics = [
    "Reduced chaos",
    "Increased client control",
    "Durable systems and decisions",
    "Clean exits without dependency",
  ];

  return (
    <section className="py-32 bg-brand-black relative">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="font-mono text-brand-orange text-sm tracking-widest">
              THE ANCHOR
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold mt-4">
              EXIT PHILOSOPHY
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 p-8 md:p-12 bg-brand-charcoal border-4 border-brand-orange"
          >
            <p className="font-body text-xl md:text-2xl text-brand-offwhite/90 leading-relaxed">
              Shank Strategy Ops measures success by:
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {successMetrics.map((metric, index) => (
                <div key={metric} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-orange flex items-center justify-center flex-shrink-0">
                    <Check className="h-5 w-5 text-brand-black" />
                  </div>
                  <span className="font-display text-lg font-medium">{metric}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-brand-offwhite/20">
              <p className="font-display text-2xl md:text-3xl font-bold text-brand-orange">
                The goal is not to be needed forever.
              </p>
              <p className="font-body text-xl text-brand-offwhite/80 mt-4">
                The goal is to leave things stronger than we found them — and move on deliberately.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  return (
    <section id="contact" className="py-32 bg-brand-offwhite text-brand-black">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-brand-orange text-sm tracking-widest">
              READY TO START?
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold mt-4 text-brand-black">
              START A CONVERSATION
            </h2>
            <p className="font-body text-xl text-brand-black/70 mt-6 max-w-2xl mx-auto">
              If you have a problem worth solving and the authority to act,
              let's talk. We'll determine fit before any commitment.
            </p>
          </motion.div>

          <ContactForm />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-body text-brand-black/50 mt-8"
          >
            Or email{" "}
            <a
              href="mailto:contact@shankstrategy.com"
              className="text-brand-orange hover:underline"
            >
              contact@shankstrategy.com
            </a>
            . We respond within 48 hours.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-12 bg-brand-black border-t border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-orange flex items-center justify-center">
              <span className="font-display font-bold text-brand-black">S</span>
            </div>
            <span className="font-display font-bold tracking-tight">
              SHANK STRATEGY OPS
            </span>
          </div>

          <p className="font-mono text-sm text-brand-offwhite/50">
            © {new Date().getFullYear()} Shank Strategy Ops. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Main Home Component
export default function Home() {
  return (
    <div className="min-h-screen bg-brand-black text-brand-offwhite">
      <Navigation />
      <HeroSection />
      <PrinciplesSection />
      <EngagementSection />
      <ModelsSection />
      <NotSection />
      <RequirementsSection />
      <ExitSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
